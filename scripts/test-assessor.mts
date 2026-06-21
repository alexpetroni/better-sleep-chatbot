// A/B the assessor across Fireworks serverless models on a fixed digest, to
// pick the one that returns ONE clean Romanian conclusion (no repetition / no
// leaked reasoning / no token glitches).  npx tsx scripts/test-assessor.mts
import { config } from "dotenv";

config({ path: ".env.local" });

const { seedIntakeState, applyExtractor } = await import("@/lib/intake/state");
const { assessorSystemPrompt } = await import("@/lib/ai/prompts");
const { getLanguageModel } = await import("@/lib/ai/providers");
const { streamText } = await import("ai");

const state = seedIntakeState();
applyExtractor(state, {
  profile: { sex: "female", age: "42", mainComplaint: "treziri nocturne multiple cu senzație de sufocare, de 3 luni" },
  updates: [
    { id: "A", status: "complete", answer: "Culcare 23 / trezire 6:30 în săptămână; weekend culcare 1, trezire 9 — jet lag social." },
    { id: "B", status: "partial", answer: "Fără lumină naturală dimineața (parcare subterană)." },
    { id: "D", status: "complete", answer: "Cafea 2-3/zi, ultima 16-17; vin 1-2 pahare seara la 22." },
    { id: "J", status: "complete", answer: "Sforăit puternic, treziri cu sufocare, gură uscată dimineața — suspiciune apnee." },
    { id: "P", status: "complete", answer: "Ciclu neregulat de un an, +5 kg central — perimenopauză probabilă." },
    { id: "R", status: "partial", answer: "Greutate centrală; fără treziri cu foame descrise." },
    { id: "X", status: "complete", answer: "Stres 6/10, doi copii, job solicitant." },
    { id: "V", status: "refused", answer: "A refuzat să discute relații/emoții." },
    { id: "W", status: "refused", answer: "A refuzat partea emoțională." },
  ],
  redFlags: ["Apnee obstructivă suspectată: sforăit + sufocare + gură uscată"],
  userWantsConclusion: true,
});

const messages = [
  { role: "user" as const, content: "Spune-mi tu ce vezi, te rog." },
];

const candidates = (
  process.env.ASSESSOR_CANDIDATES ??
  "accounts/fireworks/models/glm-5p2,accounts/fireworks/models/deepseek-v4-pro,accounts/fireworks/models/kimi-k2p5"
).split(",");

for (const model of candidates) {
  process.stdout.write(`\n\n########## ${model} ##########\n`);
  try {
    const res = streamText({
      model: getLanguageModel(model),
      system: assessorSystemPrompt({
        requestHints: { latitude: undefined, longitude: undefined, city: undefined, country: undefined },
        state,
      }),
      messages,
      maxOutputTokens: 2200,
    });
    let out = "";
    for await (const d of res.textStream) {
      out += d;
    }
    const repeats = (out.match(/Unde ești acum/g) || []).length;
    const apology = /îmi cer scuze|întrerupt|iată concluzia completă/i.test(out);
    const glitch = /\b(changes|the user|we need|analyze the request)\b/i.test(out);
    console.log(out);
    console.log(
      `\n--- ${model}: ${out.length} chars | "Unde ești acum" x${repeats} | apology=${apology} | en-glitch=${glitch} ---`
    );
  } catch (e) {
    console.log(`ERROR: ${(e as Error).message?.slice(0, 200)}`);
  }
}
