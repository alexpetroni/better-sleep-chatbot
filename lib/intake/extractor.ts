// Silent extraction pass. Runs on the cheap model, never streams to the user.
// Maps the latest conversation turn onto the fixed checklist and returns
// structured updates that state.ts applies. Failures degrade to an empty result
// so a model hiccup never blocks the interview.

import { generateObject, type ModelMessage } from "ai";
import { z } from "zod";
import { extractorModelId, fireworksReasoningOff } from "@/lib/ai/models";
import { getLanguageModel } from "@/lib/ai/providers";
import { CHECKLIST, CHECKLIST_BY_ID } from "./checklist";
import type { ExtractorResult } from "./state";

const ExtractorSchema = z.object({
  profile: z.object({
    sex: z.enum(["female", "male", "other"]).nullable(),
    age: z.string().nullable(),
    mainComplaint: z.string().nullable(),
  }),
  updates: z.array(
    z.object({
      id: z.string(),
      status: z.enum(["partial", "complete", "refused"]),
      answer: z.string(),
    })
  ),
  redFlags: z.array(z.string()),
  userWantsConclusion: z.boolean(),
});

const CATEGORY_REF = CHECKLIST.map(
  (s) => `${s.id}: ${s.category} — ${s.hints}`
).join("\n");

const EXTRACTOR_SYSTEM = `You are a silent extraction component inside a Romanian functional-medicine sleep-intake agent. You DO NOT talk to the user. Read the conversation and map what the user has revealed onto the fixed checklist of sleep-cause categories below. Output JSON only.

Categories (id: name — what it covers):
${CATEGORY_REF}

Rules:
- For EVERY category the user gave information about — in any message, even volunteered out of order or covering several categories at once — output one update: { id, status, answer }.
  - status "complete": there is enough concrete information to judge this domain.
  - status "partial": the domain was touched but the answer is vague or insufficient.
  - status "refused": the user explicitly declined to discuss this domain.
- Do NOT output updates for categories with no information yet. Do not invent.
- "answer" is a concise summary in Romanian of what is known for that category.
- profile: set sex ("female" | "male" | "other"), age (a string such as "42" or "40-49"), and mainComplaint (one short Romanian phrase naming the core sleep problem) as soon as the conversation reveals them; otherwise null.
- redFlags: short Romanian notes when classic danger signs appear (apnee: sforăit + pauze observate + somnolență diurnă; parasomnie REM; dispoziție depresivă / idei negre; etc.). Empty array if none.
- userWantsConclusion: true ONLY if the user explicitly asks to stop the questions and receive the analysis/verdict now.`;

export async function runExtractor(
  messages: ModelMessage[]
): Promise<{
  result: ExtractorResult;
  usage: { inputTokens?: number; outputTokens?: number };
  ok: boolean; // false when the model call itself failed (e.g. rate-limited)
}> {
  const empty: ExtractorResult = {
    profile: {},
    updates: [],
    redFlags: [],
    userWantsConclusion: false,
  };
  const recent = messages.slice(-12);
  // The Fireworks provider falls back to prompt-based JSON (no strict schema),
  // which occasionally returns an unparseable object. A single retry makes the
  // extraction reliable in practice; flash is cheap enough that this is free.
  let object: z.infer<typeof ExtractorSchema> | undefined;
  let usage: { inputTokens?: number; outputTokens?: number } = {};
  try {
    let lastErr: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await generateObject({
          model: getLanguageModel(extractorModelId),
          schema: ExtractorSchema,
          system: EXTRACTOR_SYSTEM,
          messages: recent,
          providerOptions: fireworksReasoningOff,
        });
        object = res.object;
        usage = {
          inputTokens: res.usage?.inputTokens,
          outputTokens: res.usage?.outputTokens,
        };
        lastErr = undefined;
        break;
      } catch (err) {
        lastErr = err;
      }
    }
    if (lastErr || !object) {
      throw lastErr ?? new Error("no object");
    }

    const updates = object.updates.filter((u) => CHECKLIST_BY_ID[u.id]);
    const profile: ExtractorResult["profile"] = {};
    if (object.profile.sex) {
      profile.sex = object.profile.sex;
    }
    if (object.profile.age) {
      profile.age = object.profile.age;
    }
    if (object.profile.mainComplaint) {
      profile.mainComplaint = object.profile.mainComplaint;
    }

    return {
      result: {
        profile,
        updates,
        redFlags: object.redFlags ?? [],
        userWantsConclusion: object.userWantsConclusion ?? false,
      },
      usage: {
        inputTokens: usage?.inputTokens,
        outputTokens: usage?.outputTokens,
      },
      ok: true,
    };
  } catch {
    return { result: empty, usage: {}, ok: false };
  }
}
