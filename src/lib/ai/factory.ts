import { LLMProvider } from "./provider.interface";
import { GeminiProvider } from "./gemini.provider";
import { ClaudeProvider } from "./claude.provider";

export function getLLMProvider(providerName?: string): LLMProvider {
  const target = providerName || process.env.PRIMARY_LLM_PROVIDER || "gemini";
  if (target.toLowerCase().includes("claude")) {
    return new ClaudeProvider();
  }
  return new GeminiProvider();
}
