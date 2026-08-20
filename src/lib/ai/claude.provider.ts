import { z } from "zod";
import { LLMProvider, LLMResponse } from "./provider.interface";

export class ClaudeProvider implements LLMProvider {
  name = "Claude";

  async generateStructuredJSON<T>(params: {
    prompt: string;
    schema: z.ZodSchema<T>;
    systemInstruction?: string;
    temperature?: number;
    model?: string;
  }): Promise<LLMResponse<T>> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "your-anthropic-api-key") {
      throw new Error("Claude Provider unavailable: ANTHROPIC_API_KEY is not configured in environment. Production execution falls back to primary Gemini provider.");
    }

    const startTime = Date.now();
    const modelName = params.model || process.env.FALLBACK_LLM_MODEL || "claude-3-5-sonnet-20241022";

    // Call Anthropic API when key is configured
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: modelName,
          max_tokens: 4096,
          temperature: params.temperature ?? 0.2,
          system: params.systemInstruction,
          messages: [{ role: "user", content: params.prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
      }

      const raw = await response.json();
      const rawText = raw.content?.[0]?.text || "{}";
      const parsed = JSON.parse(rawText);
      const validatedData = params.schema.parse(parsed);

      return {
        data: validatedData,
        usage: {
          inputTokens: raw.usage?.input_tokens || 0,
          outputTokens: raw.usage?.output_tokens || 0,
          totalTokens: (raw.usage?.input_tokens || 0) + (raw.usage?.output_tokens || 0),
          estimatedCost: 0.003,
        },
        latencyMs: Date.now() - startTime,
        provider: this.name,
        model: modelName,
      };
    } catch (err: any) {
      throw new Error(`ClaudeProvider generation failure: ${err.message}`);
    }
  }
}
