import { z } from "zod";

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface LLMResponse<T> {
  data: T;
  usage: TokenUsage;
  latencyMs: number;
  provider: string;
  model: string;
}

export interface LLMProvider {
  name: string;
  generateStructuredJSON<T>(params: {
    prompt: string;
    schema: z.ZodSchema<T>;
    systemInstruction?: string;
    temperature?: number;
    model?: string;
  }): Promise<LLMResponse<T>>;
}
