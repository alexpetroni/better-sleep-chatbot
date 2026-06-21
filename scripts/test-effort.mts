// Compare assessor reasoning effort levels on a fixed case (deepseek-v4-pro).
//   npx tsx scripts/test-effort.mts
import { writeFileSync } from "node:fs";
import { config } from "dotenv";

config({ path: ".env.local" });

const { seedIntakeState, applyExtractor } = await import("@/lib/intake/state");
const { assessorSystemPrompt } = await import("@/lib/ai/prompts");
const { fireworksReasoning } = await import("@/lib/ai/models");
const { getModelPricing } = await import("@/lib/intake/cost");
const { getLanguageModel } = await import("@/lib/ai/providers");
const { streamText } = await import("ai");

const MODEL = "accounts/fireworks/models/deepseek-v4-pro";
const noHints = { latitude: undefined, longitude: undefined, city: undefined, country: undefined };

const state = seedIntakeState();
applyExtractor(state, {
  profile: { sex: "female", age: "48", mainComplaint: "adormire grea + trezire la 4 cu mintea alertă, bufeuri, palpitații" },
  updates: [
    { id: "A", status: "complete", answer: "Săptămână culcare târziu/trezire devreme; weekend doarme până la 10 — jet lag social." },
    { id: "B", status: "partial", answer: "Telefon în pat seara; fără lumină naturală dimineața menționată." },
    { id: "C", status: "complete", answer: "Telefon în pat până târziu, fără ritual de relaxare, clock-watching." },
    { id: "D", status: "complete", answer: "3-4 cafele/zi, ultima 17-18; 1-2 pahare vin seara." },
    { id: "O", status: "partial", answer: "Inima bate tare la trezirea de la 4." },
    { id: "P", status: "complete", answer: "Perimenopauză: ciclu neregulat de un an, bufeuri, transpirații nocturne (se trezește leoarcă)." },
    { id: "Q", status: "partial", answer: "Trezire matinală în alertă — posibil hiperactivare HPA." },
    { id: "R", status: "partial", answer: "Trezire 4 AM cu inimă accelerată; fără foame/tremur descrise." },
    { id: "U", status: "complete", answer: "Epuizată ziua dar in priza seara/noaptea; trezire cu mintea accelerata." },
    { id: "V", status: "complete", answer: "Gânduri care aleargă despre sarcini, nu poate închide ziua." },
    { id: "X", status: "complete", answer: "Stres 8/10, job de manager, doi adolescenți." },
    { id: "J", status: "complete", answer: "Nu sforăie — risc scăzut de apnee." },
    { id: "K", status: "complete", answer: "Fără picioare neliniștite." },
  ],
  redFlags: ["Trezire cu inimă accelerată la 4 AM; perimenopauză cu impact major."],
  userWantsConclusion: true,
});

const messages = [{ role: "user" as const, content: "Cam ăsta e tabloul. Ce părere ai, ce vezi?" }];
const efforts = ["none", "low", "medium", "high"] as const;
const pricing = getModelPricing();
const price = pricing[MODEL] ?? { input: 0, output: 0 };

for (const effort of efforts) {
  let text = "";
  let reasoning = "";
  let err = "";
  try {
    const res = streamText({
      model: getLanguageModel(MODEL),
      system: assessorSystemPrompt({ requestHints: noHints, state }),
      messages,
      maxOutputTokens: 6000,
      providerOptions: fireworksReasoning(effort),
    });
    for await (const part of res.fullStream) {
      const p = part as { type: string; text?: string; delta?: string };
      if (p.type === "text-delta") text += p.text ?? p.delta ?? "";
      else if (p.type === "reasoning-delta" || p.type === "reasoning") reasoning += p.text ?? p.delta ?? "";
    }
    const u = await res.usage;
    const sections = ["Unde ești acum", "Ce hrănește bucla", "Ce aș sugera", "Versiunea sinceră"]
      .filter((h) => text.includes(h)).length;
    const glitch = /\b(the user|we need|analyze the request|changes)\b/i.test(text);
    const cost = (u?.inputTokens ?? 0) * price.input + (u?.outputTokens ?? 0) * price.output;
    writeFileSync(`/tmp/effort-${effort}.md`, text || "(GOL)");
    console.log(
      `effort=${effort.padEnd(6)} | text=${text.length}ch | reasoning=${reasoning.length}ch | out_tok=${u?.outputTokens} | sectiuni=${sections}/4 | glitch=${glitch} | cost=$${cost.toFixed(5)}`
    );
  } catch (e) {
    err = (e as Error).message?.slice(0, 160) ?? "?";
    console.log(`effort=${effort.padEnd(6)} | ERROR: ${err}`);
  }
}
console.log("\nFull outputs in /tmp/effort-<level>.md");
