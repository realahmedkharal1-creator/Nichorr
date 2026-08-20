import { createClient } from "@/lib/supabase/server";

export class ModelRunsRepository {
  async recordModelRun(record: {
    research_run_id: string;
    provider: string;
    model: string;
    stage?: string;
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
    latency_ms: number;
    cost_usd?: number;
    success: boolean;
    error_message?: string;
  }): Promise<boolean> {
    if (!record.research_run_id || record.research_run_id.startsWith("run-")) return false;
    try {
      const supabase = createClient();
      const payload: any = {
        research_run_id: record.research_run_id,
        stage: record.stage || "EXTRACTING",
        provider: record.provider,
        model: record.model,
        prompt_version: "v1.0.0",
        input_tokens: record.input_tokens || 0,
        output_tokens: record.output_tokens || 0,
        latency_ms: record.latency_ms || 0,
        status: record.success ? "SUCCESS" : "FAILED",
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("model_runs").insert(payload);

      if (error) {
        console.warn("Supabase recordModelRun query warning:", error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn("Supabase database connection unavailable:", e);
      return false;
    }
  }
}
