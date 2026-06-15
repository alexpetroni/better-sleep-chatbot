// Dev-only harness to drive the sleep agent against the real AI Gateway.
// Reads a conversation (JSON array of {role, content}) from stdin and prints
// the assistant's next message. Uses the real sleepCoachPrompt text and the
// real default model, decoupled from the app's TS build.
//
//   echo '[{"role":"user","content":"..."}]' | node scripts/agent-turn.mjs
import { readFileSync } from "node:fs";
import { config } from "dotenv";
import { gateway, generateText } from "ai";

config({ path: ".env.local" });

// Pull the actual system prompt out of the source (no nested backticks in it).
const promptsSrc = readFileSync("lib/ai/prompts.ts", "utf8");
const system = promptsSrc.match(/sleepCoachPrompt = `([\s\S]*?)`;/)[1];

// Mirror DEFAULT_CHAT_MODEL from lib/ai/models.ts.
const MODEL = "moonshotai/kimi-k2.5";

const raw = await new Promise((resolve) => {
  let data = "";
  process.stdin.on("data", (c) => (data += c));
  process.stdin.on("end", () => resolve(data));
});

const { text } = await generateText({
  model: gateway.languageModel(MODEL),
  system,
  messages: JSON.parse(raw),
});

process.stdout.write(text);
