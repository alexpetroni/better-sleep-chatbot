// Runtime test for the two-phase intake pipeline (extractor + state machine +
// assessor) against the live AI Gateway. Does NOT touch the DB or auth — it
// exercises the pure pipeline so we can see the checklist fill, retries/
// exhaustion, the general→specific progression, handoff, and the cost log.
//
//   npx tsx scripts/test-intake.mts
//
import { config } from "dotenv";

config({ path: ".env.local" });

const { runExtractor } = await import("@/lib/intake/extractor");
const {
  seedIntakeState,
  applyExtractor,
  pickNextTarget,
  isIntakeComplete,
  accumulateUsage,
  renderProgress,
  renderDigest,
  coverage,
  MAX_ATTEMPTS,
} = await import("@/lib/intake/state");
const { assessorSystemPrompt } = await import("@/lib/ai/prompts");
const { interviewModelId, extractorModelId, assessorModelId } = await import(
  "@/lib/ai/models"
);
const { logQuestionnaireCost } = await import("@/lib/intake/cost");
const { getLanguageModel } = await import("@/lib/ai/providers");
const { streamText } = await import("ai");

type Msg = { role: "user" | "assistant"; content: string };

// A realistic woman-42 apnea-leaning case; the last turn forces the conclusion.
const userTurns: string[] = [
  "Nu prea dorm bine în ultima vreme, mă trezesc de câteva ori pe noapte de vreo trei luni.",
  "Am 42 de ani, femeie. Mă culc pe la 23 și sună alarma la 6:30. Soțul zice că sforăi tare și uneori mă trezesc brusc cu senzația că nu pot respira. Gura uscată aproape în fiecare dimineață.",
  "Cafea două-trei pe zi, ultima pe la 16-17. Vin un pahar-două seara, pe la 22. Lumină naturală aproape deloc, plec direct în parcarea subterană. Weekendul mă culc pe la 1 și dorm până la 9.",
  "Ciclul a devenit neregulat de vreun an. Am pus vreo 5 kg pe burtă. Stresul e cam 6 din 10, am doi copii și un job solicitant. Despre relații și partea emoțională chiar nu vreau să vorbesc.",
  "Cred că asta e cam tot, nu mai am ce adăuga. Spune-mi tu ce vezi, te rog.",
];

const state = seedIntakeState();
const messages: Msg[] = [];

for (let i = 0; i < userTurns.length; i++) {
  messages.push({ role: "user", content: userTurns[i] });

  const { result, usage, ok } = await runExtractor(messages as never);
  accumulateUsage(state, extractorModelId, usage);
  applyExtractor(state, result, { penalizeTarget: ok });
  if (!ok) {
    console.log(`\n[turn ${i + 1}] extractor call FAILED (rate limit / model error)`);
  }

  const target = pickNextTarget(state);
  const complete = isIntakeComplete(state) || target === null;
  const handoff = result.userWantsConclusion || complete;
  state.targetId = target;

  const cov = coverage(state);
  const prog = renderProgress(state);
  console.log(`\n===== TURN ${i + 1} =====`);
  console.log(`user: ${userTurns[i]}`);
  console.log(
    `profile: sex=${state.profile.sex} age=${state.profile.age} complaint=${state.profile.mainComplaint}`
  );
  console.log(`coverage: ${cov.covered}/${cov.applicable}`);
  console.log(`updates: ${result.updates.map((u) => `${u.id}:${u.status}`).join(", ") || "(none)"}`);
  if (result.redFlags.length) {
    console.log(`redFlags: ${result.redFlags.join(" | ")}`);
  }
  console.log(`remaining: ${prog.remaining}`);
  console.log(
    `decision: ${handoff ? "HANDOFF → assessor" : `interview next → ${target}`}  (wantsConclusion=${result.userWantsConclusion})`
  );

  // Space calls to stay under free-tier rate limits when TURN_DELAY_MS is set.
  const delay = Number(process.env.TURN_DELAY_MS ?? 0);
  if (delay > 0) {
    await new Promise((r) => setTimeout(r, delay));
  }

  // Simulate the interviewer's turn so the transcript grows for the next pass.
  messages.push({
    role: "assistant",
    content: handoff
      ? "(livrează concluzia)"
      : `(întrebare conversațională despre domeniul ${target})`,
  });

  if (handoff) {
    console.log("\n----- DIGEST sent to assessor -----");
    console.log(renderDigest(state));
    console.log(`\n----- ASSESSOR (${assessorModelId}) output -----`);
    const res = streamText({
      model: getLanguageModel(assessorModelId),
      system: assessorSystemPrompt({
        requestHints: { latitude: undefined, longitude: undefined, city: undefined, country: undefined },
        state,
      }),
      messages: messages as never,
      maxOutputTokens: 3000,
    });
    let out = "";
    for await (const delta of res.textStream) {
      out += delta;
      process.stdout.write(delta);
    }
    const u = await res.usage;
    accumulateUsage(state, assessorModelId, {
      inputTokens: u?.inputTokens,
      outputTokens: u?.outputTokens,
    });
    console.log(`\n[assessor length: ${out.length} chars]`);
    state.phase = "assessed";
    break;
  }
}

// Unit-ish check of the retry/exhaustion rule, independent of the model.
console.log("\n===== exhaustion check =====");
const s2 = seedIntakeState();
s2.targetId = "L"; // pain — pretend we keep asking and get nothing
for (let k = 0; k < MAX_ATTEMPTS; k++) {
  applyExtractor(s2, { profile: {}, updates: [], redFlags: [], userWantsConclusion: false });
}
const pain = s2.subjects.find((x) => x.id === "L");
console.log(`subject L after ${MAX_ATTEMPTS} empty turns: status=${pain?.status} attempts=${pain?.attempts} (expect exhausted/3)`);

console.log("\n===== final cost =====");
process.env.SHOW_COST = "true";
await logQuestionnaireCost(
  state,
  { interview: interviewModelId, extractor: extractorModelId, assessor: assessorModelId },
  { final: true }
);
