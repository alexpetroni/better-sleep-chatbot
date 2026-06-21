import { geolocation, ipAddress } from "@vercel/functions";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  stepCountIs,
  streamText,
} from "ai";
import { after } from "next/server";
import { createResumableStreamContext } from "resumable-stream";
import { auth, type UserType } from "@/app/(auth)/auth";
import { entitlementsByUserType } from "@/lib/ai/entitlements";
import {
  assessorMaxTokens,
  assessorModelId,
  assessorReasoningEffort,
  extractorModelId,
  fireworksReasoning,
  fireworksReasoningOff,
  interviewModelId,
} from "@/lib/ai/models";
import {
  assessorSystemPrompt,
  interviewerSystemPrompt,
  type RequestHints,
} from "@/lib/ai/prompts";
import { getLanguageModel } from "@/lib/ai/providers";
import { logQuestionnaireCost } from "@/lib/intake/cost";
import { runExtractor } from "@/lib/intake/extractor";
import {
  accumulateUsage,
  applyExtractor,
  coerceIntakeState,
  isIntakeComplete,
  pickNextTarget,
  seedIntakeState,
  userRequestedConclusion,
} from "@/lib/intake/state";
import { isProductionEnvironment } from "@/lib/constants";
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getIntakeStateByChatId,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
  updateChatTitleById,
  updateMessage,
  upsertIntakeState,
} from "@/lib/db/queries";
import type { DBMessage } from "@/lib/db/schema";
import { ChatbotError } from "@/lib/errors";
import { checkIpRateLimit } from "@/lib/ratelimit";
import type { ChatMessage } from "@/lib/types";
import { convertToUIMessages, generateUUID } from "@/lib/utils";
import { generateTitleFromUserMessage } from "../../actions";
import { type PostRequestBody, postRequestBodySchema } from "./schema";

export const maxDuration = 60;

function getStreamContext() {
  try {
    return createResumableStreamContext({ waitUntil: after });
  } catch (_) {
    return null;
  }
}

export { getStreamContext };

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatbotError("bad_request:api").toResponse();
  }

  try {
    const { id, message, messages, selectedVisibilityType } = requestBody;

    const session = await auth();

    if (!session?.user) {
      return new ChatbotError("unauthorized:chat").toResponse();
    }

    await checkIpRateLimit(ipAddress(request));

    const userType: UserType = session.user.type;

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 1,
    });

    if (messageCount > entitlementsByUserType[userType].maxMessagesPerHour) {
      return new ChatbotError("rate_limit:chat").toResponse();
    }

    const isToolApprovalFlow = Boolean(messages);

    const chat = await getChatById({ id });
    let messagesFromDb: DBMessage[] = [];
    let titlePromise: Promise<string> | null = null;

    if (chat) {
      if (chat.userId !== session.user.id) {
        return new ChatbotError("forbidden:chat").toResponse();
      }
      messagesFromDb = await getMessagesByChatId({ id });
    } else if (message?.role === "user") {
      await saveChat({
        id,
        userId: session.user.id,
        title: "New chat",
        visibility: selectedVisibilityType,
      });
      titlePromise = generateTitleFromUserMessage({ message });
    }

    let uiMessages: ChatMessage[];

    if (isToolApprovalFlow && messages) {
      const dbMessages = convertToUIMessages(messagesFromDb);
      const approvalStates = new Map(
        messages.flatMap(
          (m) =>
            m.parts
              ?.filter(
                (p: Record<string, unknown>) =>
                  p.state === "approval-responded" ||
                  p.state === "output-denied"
              )
              .map((p: Record<string, unknown>) => [
                String(p.toolCallId ?? ""),
                p,
              ]) ?? []
        )
      );
      uiMessages = dbMessages.map((msg) => ({
        ...msg,
        parts: msg.parts.map((part) => {
          if (
            "toolCallId" in part &&
            approvalStates.has(String(part.toolCallId))
          ) {
            return { ...part, ...approvalStates.get(String(part.toolCallId)) };
          }
          return part;
        }),
      })) as ChatMessage[];
    } else {
      uiMessages = [
        ...convertToUIMessages(messagesFromDb),
        message as ChatMessage,
      ];
    }

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    if (message?.role === "user") {
      await saveMessages({
        messages: [
          {
            chatId: id,
            id: message.id,
            role: "user",
            parts: message.parts,
            attachments: [],
            createdAt: new Date(),
          },
        ],
      });
    }

    const modelMessages = await convertToModelMessages(uiMessages);

    // Load or seed the per-conversation intake checklist (26 cause categories).
    const rawIntake = await getIntakeStateByChatId({ chatId: id });
    const intake = rawIntake ? coerceIntakeState(rawIntake) : seedIntakeState();

    const stream = createUIMessageStream({
      originalMessages: isToolApprovalFlow ? uiMessages : undefined,
      execute: async ({ writer: dataStream }) => {
        // 1. Silent extraction pass (cheap model): map this turn onto the
        //    checklist, update the profile, and apply retry/exhaustion logic.
        const {
          result: extracted,
          usage: extractUsage,
          ok: extractOk,
        } = await runExtractor(modelMessages);
        accumulateUsage(intake, extractorModelId, extractUsage);
        applyExtractor(intake, extracted, { penalizeTarget: extractOk });

        // 2. Decide: keep interviewing, or hand off to the assessor. Handoff
        //    happens when every applicable subject is settled (red flags probed),
        //    or the user explicitly asks for the verdict now.
        const lastUserText =
          (Array.isArray(message?.parts) ? message.parts : [])
            .filter(
              (p): p is { type: "text"; text: string } =>
                (p as { type?: string }).type === "text"
            )
            .map((p) => p.text)
            .join(" ") || "";
        const nextTarget = pickNextTarget(intake);
        const handoff =
          extracted.userWantsConclusion ||
          userRequestedConclusion(lastUserText) ||
          nextTarget === null ||
          isIntakeComplete(intake);

        let activeModelId: string;
        if (handoff) {
          intake.phase = "assessed";
          activeModelId = assessorModelId;
        } else {
          intake.phase = "intake";
          intake.targetId = nextTarget;
          activeModelId = interviewModelId;
        }

        const result = handoff
          ? streamText({
              model: getLanguageModel(assessorModelId),
              system: assessorSystemPrompt({ requestHints, state: intake }),
              messages: modelMessages,
              maxOutputTokens: assessorMaxTokens,
              providerOptions: fireworksReasoning(assessorReasoningEffort),
              stopWhen: stepCountIs(2),
              experimental_telemetry: {
                isEnabled: isProductionEnvironment,
                functionId: "assess",
              },
            })
          : streamText({
              model: getLanguageModel(interviewModelId),
              system: interviewerSystemPrompt({
                requestHints,
                state: intake,
                targetId: nextTarget,
              }),
              messages: modelMessages,
              maxOutputTokens: 800,
              providerOptions: fireworksReasoningOff,
              stopWhen: stepCountIs(2),
              experimental_telemetry: {
                isEnabled: isProductionEnvironment,
                functionId: "interview",
              },
            });

        dataStream.merge(result.toUIMessageStream({ sendReasoning: false }));

        if (titlePromise) {
          try {
            const title = await titlePromise;
            dataStream.write({ type: "data-chat-title", data: title });
            updateChatTitleById({ chatId: id, title });
          } catch (_) {
            /* non-fatal */
          }
        }

        // 3. After generation: record token usage, persist checklist state,
        //    and (when SHOW_COST=true) log the per-model cost breakdown.
        try {
          const finalUsage = await result.usage;
          accumulateUsage(intake, activeModelId, {
            inputTokens: finalUsage?.inputTokens,
            outputTokens: finalUsage?.outputTokens,
          });
        } catch (_) {
          /* usage not critical */
        }
        await upsertIntakeState({
          chatId: id,
          state: intake,
          phase: intake.phase,
        });
        await logQuestionnaireCost(
          intake,
          {
            interview: interviewModelId,
            extractor: extractorModelId,
            assessor: assessorModelId,
          },
          { final: intake.phase === "assessed" }
        );
      },
      generateId: generateUUID,
      onFinish: async ({ messages: finishedMessages }) => {
        if (isToolApprovalFlow) {
          for (const finishedMsg of finishedMessages) {
            const existingMsg = uiMessages.find((m) => m.id === finishedMsg.id);
            if (existingMsg) {
              await updateMessage({
                id: finishedMsg.id,
                parts: finishedMsg.parts,
              });
            } else {
              await saveMessages({
                messages: [
                  {
                    id: finishedMsg.id,
                    role: finishedMsg.role,
                    parts: finishedMsg.parts,
                    createdAt: new Date(),
                    attachments: [],
                    chatId: id,
                  },
                ],
              });
            }
          }
        } else if (finishedMessages.length > 0) {
          await saveMessages({
            messages: finishedMessages.map((currentMessage) => ({
              id: currentMessage.id,
              role: currentMessage.role,
              parts: currentMessage.parts,
              createdAt: new Date(),
              attachments: [],
              chatId: id,
            })),
          });
        }
      },
      onError: (error) => {
        if (
          error instanceof Error &&
          error.message?.includes(
            "AI Gateway requires a valid credit card on file to service requests"
          )
        ) {
          return "AI Gateway requires a valid credit card on file to service requests. Please visit https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%3Fmodal%3Dadd-credit-card to add a card and unlock your free credits.";
        }
        return "Oops, an error occurred!";
      },
    });

    return createUIMessageStreamResponse({
      stream,
      async consumeSseStream({ stream: sseStream }) {
        if (!process.env.REDIS_URL) {
          return;
        }
        try {
          const streamContext = getStreamContext();
          if (streamContext) {
            const streamId = generateId();
            // Resumable streams are an optional nicety. If Redis is
            // unreachable/misconfigured, these awaits can hang and stall the
            // whole response until the function times out — so bound them and
            // fall back to plain streaming on timeout.
            await Promise.race([
              (async () => {
                await createStreamId({ streamId, chatId: id });
                await streamContext.createNewResumableStream(
                  streamId,
                  () => sseStream
                );
              })(),
              new Promise((_, reject) => {
                setTimeout(
                  () => reject(new Error("resumable stream setup timed out")),
                  2000
                );
              }),
            ]);
          }
        } catch (_) {
          /* non-critical: chat still streams without resumability */
        }
      },
    });
  } catch (error) {
    const vercelId = request.headers.get("x-vercel-id");

    if (error instanceof ChatbotError) {
      return error.toResponse();
    }

    if (
      error instanceof Error &&
      error.message?.includes(
        "AI Gateway requires a valid credit card on file to service requests"
      )
    ) {
      return new ChatbotError("bad_request:activate_gateway").toResponse();
    }

    console.error("Unhandled error in chat API:", error, { vercelId });
    return new ChatbotError("offline:chat").toResponse();
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatbotError("bad_request:api").toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  const chat = await getChatById({ id });

  if (chat?.userId !== session.user.id) {
    return new ChatbotError("forbidden:chat").toResponse();
  }

  const deletedChat = await deleteChatById({ id });

  return Response.json(deletedChat, { status: 200 });
}
