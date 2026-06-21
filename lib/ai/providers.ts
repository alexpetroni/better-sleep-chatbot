import { createFireworks } from "@ai-sdk/fireworks";
import { customProvider } from "ai";
import { isTestEnvironment } from "../constants";
import { titleModelId } from "./models";

// Inference runs on Fireworks.ai (the Vercel AI Gateway free tier rate-limited
// every model account-wide). The API key is read from FIREWORKS_API_KEY.
const fireworks = createFireworks({
  apiKey: process.env.FIREWORKS_API_KEY ?? "",
});

export const myProvider = isTestEnvironment
  ? (() => {
      const { chatModel, titleModel } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "title-model": titleModel,
        },
      });
    })()
  : null;

export function getLanguageModel(modelId: string) {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel(modelId);
  }

  return fireworks(modelId);
}

export function getTitleModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("title-model");
  }
  return fireworks(titleModelId);
}
