// Live scenario: woman, 48, two teenagers, high-stress manager job. Profile
// leans stress / perimenopause / early-morning cortisol waking / racing mind.
// Runs the REAL pipeline (extractor + interviewer + assessor) on Fireworks and
// writes a clean Markdown transcript to docs/sample-runs/woman-48-<assessor>.md.
//
//   npx tsx scripts/test-woman48.mts                          # glm-5p2 (default)
//   ASSESSOR_MODEL=accounts/fireworks/models/deepseek-v4-pro npx tsx scripts/test-woman48.mts
//
import { mkdirSync, writeFileSync } from "node:fs";
import { config } from "dotenv";

config({ path: ".env.local" });

const { runExtractor } = await import("@/lib/intake/extractor");
const {
  seedIntakeState,
  applyExtractor,
  pickNextTarget,
  isIntakeComplete,
  accumulateUsage,
  renderDigest,
  coverage,
  userRequestedConclusion,
} = await import("@/lib/intake/state");
const { interviewerSystemPrompt, assessorSystemPrompt } = await import(
  "@/lib/ai/prompts"
);
const {
  interviewModelId,
  extractorModelId,
  assessorModelId,
  assessorMaxTokens,
  assessorReasoningEffort,
  fireworksReasoning,
  fireworksReasoningOff,
} = await import("@/lib/ai/models");
const { getModelPricing } = await import("@/lib/intake/cost");
const { getLanguageModel } = await import("@/lib/ai/providers");
const { streamText } = await import("ai");

type Msg = { role: "user" | "assistant"; content: string };
const noHints = {
  latitude: undefined,
  longitude: undefined,
  city: undefined,
  country: undefined,
};

async function streamCollect(res: { fullStream: AsyncIterable<unknown> }) {
  let text = "";
  let reasoning = "";
  for await (const part of res.fullStream) {
    const p = part as { type: string; text?: string; delta?: string };
    if (p.type === "text-delta") {
      const t = p.text ?? p.delta ?? "";
      text += t;
      process.stdout.write(t);
    } else if (p.type === "reasoning-delta" || p.type === "reasoning") {
      reasoning += p.text ?? p.delta ?? "";
    }
  }
  return { text, reasoning };
}

const userTurns: string[] = [
  "Bună. De vreo jumătate de an nu mai pot să adorm seara — stau cu ochii în tavan ore întregi — și apoi mă trezesc pe la 4 dimineața cu mintea care merge cu o sută la oră.",
  "Am 48 de ani, am doi adolescenți și un job de manager, mereu e ceva. Seara, când se liniștește casa, încep să mă gândesc la tot ce am de făcut a doua zi și nu mă pot opri.",
  "Beau cam 3-4 cafele pe zi, ultima pe la 17-18 ca să rezist. Seara un pahar-două de vin mă mai relaxează. Și recunosc, stau pe telefon în pat până târziu.",
  "Da, am bufeuri și transpir noaptea, ciclul e dat peste cap de vreun an. Mă trezesc uneori leoarcă. Și inima îmi bate tare când mă trezesc la 4.",
  "Nu sforăi, din câte știu. Nu am picioare neliniștite. Ziua sunt epuizată, dar în pat parcă sunt în priză. Stresul e clar 8 din 10. Weekendul recuperez, dorm până la 10.",
  "Cam ăsta e tabloul. Ce părere ai, ce vezi?",
];

const state = seedIntakeState();
const messages: Msg[] = [];
const transcript: string[] = []; // markdown lines for the conversation
const trace: string[] = []; // markdown lines for the internal extraction trace
let conclusion = "";
let conclusionReasoning = "";

for (let i = 0; i < userTurns.length; i++) {
  messages.push({ role: "user", content: userTurns[i] });
  transcript.push(`**👤 Utilizator**\n\n${userTurns[i]}`);

  const { result, usage, ok } = await runExtractor(messages as never);
  accumulateUsage(state, extractorModelId, usage);
  applyExtractor(state, result, { penalizeTarget: ok });

  const target = pickNextTarget(state);
  const handoff =
    result.userWantsConclusion ||
    userRequestedConclusion(userTurns[i]) ||
    isIntakeComplete(state) ||
    target === null;
  state.targetId = target;

  const cov = coverage(state);
  const upd =
    result.updates.map((u) => `${u.id}:${u.status}`).join(", ") || "—";
  trace.push(
    `**Tura ${i + 1}** · profil: sex=${state.profile.sex ?? "?"}, vârstă=${state.profile.age ?? "?"} · acoperire ${cov.covered}/${cov.applicable} · updates: ${upd}${result.redFlags.length ? ` · ⚑ ${result.redFlags.join("; ")}` : ""} · ${handoff ? "→ HANDOFF" : `→ domeniul ${target}`}`
  );
  console.log(`\n===== TURN ${i + 1} (${handoff ? "handoff" : target}) =====`);
  console.log(`👤 ${userTurns[i]}\n`);

  if (handoff) {
    const res = streamText({
      model: getLanguageModel(assessorModelId),
      system: assessorSystemPrompt({ requestHints: noHints, state }),
      messages: messages as never,
      maxOutputTokens: assessorMaxTokens,
      providerOptions: fireworksReasoning(assessorReasoningEffort),
    });
    const c = await streamCollect(res);
    conclusion = c.text;
    conclusionReasoning = c.reasoning;
    const u = await res.usage;
    accumulateUsage(state, assessorModelId, {
      inputTokens: u?.inputTokens,
      outputTokens: u?.outputTokens,
    });
    break;
  }

  // Real interviewer turn so the transcript shows actual agent questions.
  const ires = streamText({
    model: getLanguageModel(interviewModelId),
    system: interviewerSystemPrompt({
      requestHints: noHints,
      state,
      targetId: target,
    }),
    messages: messages as never,
    maxOutputTokens: 800,
    providerOptions: fireworksReasoningOff,
  });
  const iout = await streamCollect(ires);
  const iu = await ires.usage;
  accumulateUsage(state, interviewModelId, {
    inputTokens: iu?.inputTokens,
    outputTokens: iu?.outputTokens,
  });
  const question = iout.text.trim() || "(model fără text — doar reasoning)";
  messages.push({ role: "assistant", content: question });
  transcript.push(`**🩺 Agent**\n\n${question}`);
}

// ---- cost ----
const pricing = getModelPricing();
const costLines: string[] = [];
let total = 0;
for (const [id, u] of Object.entries(state.usage)) {
  const pr = pricing[id] ?? { input: 0, output: 0 };
  const c = u.inputTokens * pr.input + u.outputTokens * pr.output;
  total += c;
  costLines.push(
    `| \`${id.split("/").pop()}\` | ${u.calls} | ${u.inputTokens} | ${u.outputTokens} | $${c.toFixed(5)} |`
  );
}

const cov = coverage(state);
const assessorShort = assessorModelId.split("/").pop() ?? "assessor";
const md = `# Exemplu de consultație — femeie, 48 de ani

Persona: femeie, 48 de ani, doi adolescenți, job de manager, stres ridicat. Tipar de somn: adormire grea + trezire la 4 dimineața cu mintea alertă, bufeuri, palpitații.

| | |
|---|---|
| Model interviu + extracție | \`${interviewModelId.split("/").pop()}\` |
| Model evaluare (concluzie) | \`${assessorShort}\` |
| Acoperire finală | ${cov.covered}/${cov.applicable} domenii aplicabile |
| Cost total | **$${total.toFixed(4)}** |

> Generat live prin pipeline-ul Fireworks (\`scripts/test-woman48.mts\`).

---

## Chestionarul (conversația)

${transcript.join("\n\n")}

---

## Concluzia (model: \`${assessorShort}\`)

${conclusion.trim() || "_(modelul nu a emis text vizibil — vezi nota de mai jos)_"}
${
  conclusion.trim()
    ? ""
    : `\n> ⚠️ Modelul \`${assessorShort}\` a trimis răspunsul pe canalul de *reasoning*, nu ca text vizibil (UI-ul ascunde reasoning-ul → răspuns gol). Fragment din reasoning:\n\n> ${conclusionReasoning.slice(0, 800).replace(/\n/g, "\n> ")}`
}

---

## Anexă A — checklist intern (digest trimis modelului de evaluare)

\`\`\`
${renderDigest(state)}
\`\`\`

## Anexă B — progresul extracției pe ture

${trace.join("\n\n")}

## Anexă C — cost detaliat

| model | apeluri | tokens in | tokens out | cost |
|---|---|---|---|---|
${costLines.join("\n")}
| **TOTAL** | | | | **$${total.toFixed(5)}** |
`;

mkdirSync("docs/sample-runs", { recursive: true });
const outPath = `docs/sample-runs/woman-48-${assessorShort}.md`;
writeFileSync(outPath, md, "utf8");
console.log(`\n\n===== EXPORT scris în ${outPath} (cost $${total.toFixed(5)}) =====`);
