import { createClient } from "@/lib/supabase/server";

export class ResearchErrorsRepository {
  async recordError(runId: string, stage: string, message: string): Promise<boolean> {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("research_errors").insert({
        research_run_id: runId,
        stage,
        error_type: "PIPELINE_ERROR",
        message,
        timestamp: new Date().toISOString(),
      });

      if (error) {
        console.warn("Supabase recordError query warning:", error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn("Supabase database connection unavailable:", e);
      return false;
    }
  }
}
