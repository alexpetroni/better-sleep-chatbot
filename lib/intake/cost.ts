// Cost telemetry for the intake pipeline. Reads per-token prices straight from
// the Vercel AI Gateway catalog (so they track reality without a hardcoded
// table) and, when SHOW_COST=true, prints a per-model breakdown to the server
// console at the end of each turn plus a grand total at handoff.

import type { IntakeStateData, ModelUsage } from "./state";

export type ModelPrice = { input: number; output: number }; // USD per token

// Fireworks does not expose per-model pricing over the API, so prices live here
// as USD per 1M tokens (input/output). Edit these or override per-model at
// runtime with MODEL_PRICES_JSON, e.g.
//   MODEL_PRICES_JSON={"accounts/fireworks/models/deepseek-v3":{"input":0.9,"output":0.9}}
// Token counts are always exact; only these rates are estimates — confirm them
// against https://fireworks.ai/pricing for the models you actually use.
const DEFAULT_PRICES_PER_M: Record<string, ModelPrice> = {
  "accounts/fireworks/models/deepseek-v4-flash": { input: 0.15, output: 0.3 },
  "accounts/fireworks/models/deepseek-v4-pro": { input: 0.43, output: 0.87 },
  "accounts/fireworks/models/glm-5p2": { input: 1.5, output: 4.5 },
  "accounts/fireworks/models/kimi-k2p5": { input: 0.6, output: 3.0 },
};

export function costEnabled(): boolean {
  return process.env.SHOW_COST === "true";
}

function parseOverrides(): Record<string, ModelPrice> {
  try {
    const raw = JSON.parse(process.env.MODEL_PRICES_JSON ?? "{}");
    const out: Record<string, ModelPrice> = {};
    for (const [id, p] of Object.entries(raw as Record<string, ModelPrice>)) {
      out[id] = { input: Number(p.input) || 0, output: Number(p.output) || 0 };
    }
    return out;
  } catch {
    return {};
  }
}

export function getModelPricing(): Record<string, ModelPrice> {
  const perM = { ...DEFAULT_PRICES_PER_M, ...parseOverrides() };
  // Convert $/1M tokens → $/token.
  const map: Record<string, ModelPrice> = {};
  for (const [id, p] of Object.entries(perM)) {
    map[id] = { input: p.input / 1_000_000, output: p.output / 1_000_000 };
  }
  return map;
}

function costOf(usage: ModelUsage, price: ModelPrice | undefined): number {
  if (!price) {
    return 0;
  }
  return usage.inputTokens * price.input + usage.outputTokens * price.output;
}

const ROLE_BY_MODEL = (
  modelId: string,
  roles: { interview: string; extractor: string; assessor: string }
): string => {
  if (modelId === roles.assessor) {
    return "assessor";
  }
  if (modelId === roles.extractor || modelId === roles.interview) {
    return "interview/extract";
  }
  return "other";
};

// Logs the current cumulative cost for this conversation, split by model.
// `final` switches the header to the questionnaire-total banner.
export async function logQuestionnaireCost(
  state: IntakeStateData,
  roles: { interview: string; extractor: string; assessor: string },
  opts: { final?: boolean } = {}
): Promise<void> {
  if (!costEnabled()) {
    return;
  }
  const pricing = getModelPricing();
  const rows: string[] = [];
  let total = 0;
  for (const [modelId, usage] of Object.entries(state.usage)) {
    const c = costOf(usage, pricing[modelId]);
    total += c;
    rows.push(
      `  ${modelId.padEnd(30)} ${ROLE_BY_MODEL(modelId, roles).padEnd(18)} ` +
        `in=${usage.inputTokens.toString().padStart(7)}  ` +
        `out=${usage.outputTokens.toString().padStart(7)}  ` +
        `calls=${usage.calls}  $${c.toFixed(6)}`
    );
  }
  const header = opts.final
    ? "═══ COST TOTAL CHESTIONAR ═══"
    : "─── cost intake (cumulativ) ───";
  // biome-ignore lint/suspicious/noConsole: deliberate cost telemetry behind SHOW_COST
  console.log(`\n${header}\n${rows.join("\n")}\n  TOTAL: $${total.toFixed(6)}\n`);
}
