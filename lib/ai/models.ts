export const DEFAULT_CHAT_MODEL = "moonshotai/kimi-k2.5";

// Role-based model routing for the two-phase intake pipeline, on Fireworks.ai.
// The interviewer and the silent extractor run on a cheap fast model; the final
// assessment runs on a stronger model. All overridable via env so the exact
// Fireworks model ids (accounts/fireworks/models/<name>) and the cost/quality
// trade-off can be tuned without a code change.
export const interviewModelId =
  process.env.INTERVIEW_MODEL ?? "accounts/fireworks/models/deepseek-v4-flash";
export const extractorModelId =
  process.env.EXTRACTOR_MODEL ?? "accounts/fireworks/models/deepseek-v4-flash";
// glm-5p2 reliably streams user-visible text. The DeepSeek/Kimi "thinking"
// models (deepseek-v4-pro, kimi-k2p5) write cleaner/cheaper Romanian but
// sometimes emit ONLY a reasoning channel and no final text — which the chat UI
// hides (sendReasoning:false), leaving a blank answer. So glm-5p2 is the safe
// default for the user-facing conclusion; override ASSESSOR_MODEL to experiment.
export const assessorModelId =
  process.env.ASSESSOR_MODEL ?? "accounts/fireworks/models/glm-5p2";
// Cheap model for chat-title generation.
export const titleModelId =
  process.env.TITLE_MODEL ?? "accounts/fireworks/models/deepseek-v4-flash";

// The Fireworks serverless models we use are "thinking" models: by default they
// burn the output-token budget on an inline reasoning scratchpad and often never
// emit the final answer (blank reply, since the UI hides reasoning). Controlling
// reasoning effort fixes this — "none" guarantees a direct answer; a higher
// effort can improve quality IF the output cap leaves room for reasoning + text.
// (camelCase key; the AI SDK forwards it to Fireworks as reasoning_effort.)
export type ReasoningEffort = "none" | "low" | "medium" | "high";
export function fireworksReasoning(effort: ReasoningEffort) {
  return { fireworks: { reasoningEffort: effort } } as const;
}
// Interviewer + extractor stay direct (fast, cheap, never blank).
export const fireworksReasoningOff = fireworksReasoning("none");
// Assessor is tunable: more room + some reasoning tends to give a fuller, better
// structured conclusion. Both overridable via env.
export const assessorReasoningEffort = (process.env.ASSESSOR_REASONING_EFFORT ??
  "none") as ReasoningEffort;
export const assessorMaxTokens = Number(
  process.env.ASSESSOR_MAX_TOKENS ?? 3000
);

export const titleModel = {
  id: "moonshotai/kimi-k2.5",
  name: "Kimi K2.5",
  provider: "moonshotai",
  description: "Fast model for title generation",
  gatewayOrder: ["fireworks", "bedrock"],
};

export type ModelCapabilities = {
  tools: boolean;
  vision: boolean;
  reasoning: boolean;
};

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  gatewayOrder?: string[];
  reasoningEffort?: "none" | "minimal" | "low" | "medium" | "high";
};

export const chatModels: ChatModel[] = [
  {
    id: "deepseek/deepseek-v3.2",
    name: "DeepSeek V3.2",
    provider: "deepseek",
    description: "Fast and capable model with tool use",
    gatewayOrder: ["bedrock", "deepinfra"],
  },
  {
    id: "moonshotai/kimi-k2.5",
    name: "Kimi K2.5",
    provider: "moonshotai",
    description: "Moonshot AI flagship model",
    gatewayOrder: ["fireworks", "bedrock"],
  },
  {
    id: "openai/gpt-oss-20b",
    name: "GPT OSS 20B",
    provider: "openai",
    description: "Compact reasoning model",
    gatewayOrder: ["groq", "bedrock"],
    reasoningEffort: "low",
  },
  {
    id: "openai/gpt-oss-120b",
    name: "GPT OSS 120B",
    provider: "openai",
    description: "Open-source 120B parameter model",
    gatewayOrder: ["fireworks", "bedrock"],
    reasoningEffort: "low",
  },
  {
    id: "xai/grok-4.1-fast-non-reasoning",
    name: "Grok 4.1 Fast",
    provider: "xai",
    description: "Fast non-reasoning model with tool use",
    gatewayOrder: ["xai"],
  },
];

export async function getCapabilities(): Promise<
  Record<string, ModelCapabilities>
> {
  const results = await Promise.all(
    chatModels.map(async (model) => {
      try {
        const res = await fetch(
          `https://ai-gateway.vercel.sh/v1/models/${model.id}/endpoints`,
          { next: { revalidate: 86_400 } }
        );
        if (!res.ok) {
          return [model.id, { tools: false, vision: false, reasoning: false }];
        }

        const json = await res.json();
        const endpoints = json.data?.endpoints ?? [];
        const params = new Set(
          endpoints.flatMap(
            (e: { supported_parameters?: string[] }) =>
              e.supported_parameters ?? []
          )
        );
        const inputModalities = new Set(
          json.data?.architecture?.input_modalities ?? []
        );

        return [
          model.id,
          {
            tools: params.has("tools"),
            vision: inputModalities.has("image"),
            reasoning: params.has("reasoning"),
          },
        ];
      } catch {
        return [model.id, { tools: false, vision: false, reasoning: false }];
      }
    })
  );

  return Object.fromEntries(results);
}

export const isDemo = process.env.IS_DEMO === "1";

type GatewayModel = {
  id: string;
  name: string;
  type?: string;
  tags?: string[];
};

export type GatewayModelWithCapabilities = ChatModel & {
  capabilities: ModelCapabilities;
};

export async function getAllGatewayModels(): Promise<
  GatewayModelWithCapabilities[]
> {
  try {
    const res = await fetch("https://ai-gateway.vercel.sh/v1/models", {
      next: { revalidate: 86_400 },
    });
    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    return (json.data ?? [])
      .filter((m: GatewayModel) => m.type === "language")
      .map((m: GatewayModel) => ({
        id: m.id,
        name: m.name,
        provider: m.id.split("/")[0],
        description: "",
        capabilities: {
          tools: m.tags?.includes("tool-use") ?? false,
          vision: m.tags?.includes("vision") ?? false,
          reasoning: m.tags?.includes("reasoning") ?? false,
        },
      }));
  } catch {
    return [];
  }
}

export function getActiveModels(): ChatModel[] {
  return chatModels;
}

export const allowedModelIds = new Set(chatModels.map((m) => m.id));

export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);
