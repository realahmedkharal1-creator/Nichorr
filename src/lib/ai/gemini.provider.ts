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
    const modelName = params.model || process.env.PRIMARY_LLM_MODEL || "gemini-flash-latest";

    if (!this.client) {
      throw new Error("Gemini API client is not initialized. Please configure GEMINI_API_KEY to use AI features.");
    }

    let lastError: any = null;
    let attempts = 0;
    const maxRetries = 3;

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

        const response = await model.generateContent(params.prompt);
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
        
        // Only retry on 503 or 429 errors
        const isRetryable = error.status === 503 || error.status === 429 || error.message?.includes("503") || error.message?.includes("429") || error.message?.includes("fetch failed");
        
        if (isRetryable && attempts < maxRetries) {
          console.warn(`Gemini API call failed (attempt ${attempts}/${maxRetries}), retrying in ${attempts * 2}s:`, error.message);
          await new Promise(resolve => setTimeout(resolve, attempts * 2000));
        } else {
          throw new Error(`Gemini API call failed after ${attempts} attempts: ${error.message || error}`);
        }
      }
    }
    
    throw new Error(`Gemini API call failed after max retries: ${lastError?.message || lastError}`);
  }
}
