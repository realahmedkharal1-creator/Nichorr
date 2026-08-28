import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { LLMProvider, LLMResponse, TokenUsage } from "./provider.interface";

export class GeminiProvider implements LLMProvider {
  name = "Gemini";
  private client: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "your-gemini-api-key") {
      this.client = new GoogleGenerativeAI(apiKey);
    }
  }

  async generateStructuredJSON<T>(params: {
    prompt: string;
    schema: z.ZodSchema<T>;
    systemInstruction?: string;
    temperature?: number;
    model?: string;
  }): Promise<LLMResponse<T>> {
    const startTime = Date.now();
    // "gemini-flash-latest" is an alias whose target shifts over time; it was observed returning
    // sustained 503 "high demand" errors while the explicitly-pinned current model below responded
    // in 3-4s for the same production-sized prompts. Pin to the named model to avoid being silently
    // routed to whatever overloaded/preview build the alias currently points to.
    const modelName = params.model || process.env.PRIMARY_LLM_MODEL || "gemini-3.6-flash";

    if (!this.client) {
      throw new Error("Gemini API client is not initialized. Please configure GEMINI_API_KEY to use AI features.");
    }

    let lastError: any = null;
    let attempts = 0;
    // Budgeted against the serverless function's real execution cap (5 min): worst case here is
    // 4 x 45s attempts + (2+4+8)s backoff ~= 3m 14s. A pipeline stage makes at most one of these
    // calls, and the research engine also re-queues transient failures onto the next /execute
    // invocation (fresh budget), so this is the inner, not the only, line of defence.
    // Gemini "high demand" 503s and slow responses under load routinely outlast a 2x25s window.
    const maxRetries = 4;
    const perAttemptTimeoutMs = 45000;

    while (attempts < maxRetries) {
      try {
        const model = this.client.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: params.temperature ?? 0.2,
          },
          systemInstruction: params.systemInstruction,
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Gemini API call timed out after ${perAttemptTimeoutMs / 1000}s`)), perAttemptTimeoutMs)
        );

        const response = await Promise.race([
          model.generateContent(params.prompt),
          timeoutPromise
        ]);
        
        const text = response.response.text();
        const rawJson = JSON.parse(text);
        const validatedData = params.schema.parse(rawJson);

        const latencyMs = Date.now() - startTime;
        const usage: TokenUsage = {
          inputTokens: response.response.usageMetadata?.promptTokenCount || 250,
          outputTokens: response.response.usageMetadata?.candidatesTokenCount || 400,
          totalTokens: response.response.usageMetadata?.totalTokenCount || 650,
          estimatedCost: 0.00015,
        };

        return {
          data: validatedData,
          usage,
          latencyMs,
          provider: this.name,
          model: modelName,
        };
      } catch (error: any) {
        lastError = error;
        attempts++;
        
        // Only retry on 503, 429 errors, fetch failures, or timeouts
        const isRetryable = error.status === 503 || error.status === 429 || error.message?.includes("503") || error.message?.includes("429") || error.message?.includes("fetch failed") || error.message?.includes("timed out");
        
        if (isRetryable && attempts < maxRetries) {
          // Exponential backoff: 2s, 4s, 8s — gives a Gemini demand spike time to clear
          // instead of hammering it on a fixed 2s interval.
          const backoffMs = 2000 * 2 ** (attempts - 1);
          console.warn(`Gemini API call failed (attempt ${attempts}/${maxRetries}), retrying in ${backoffMs / 1000}s:`, error.message);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        } else {
          throw new Error(`Gemini API call failed after ${attempts} attempts: ${error.message || error}`);
        }
      }
    }
    
    throw new Error(`Gemini API call failed after max retries: ${lastError?.message || lastError}`);
  }
}
