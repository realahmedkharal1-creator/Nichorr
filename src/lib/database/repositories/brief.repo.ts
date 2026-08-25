import { createClient, createServiceClient } from "@/lib/supabase/server";

export class BriefRepository {
  async saveBrief(runId: string, brief: any): Promise<boolean> {
    if (!brief || !runId || runId.startsWith("run-")) return false;
    try {
      const supabase = createServiceClient();
      const { error } = await supabase.from("research_briefs").upsert({
        research_run_id: runId,
        executive_summary: brief.executive_summary,
        key_findings: brief.key_findings,
        verified_facts: brief.verified_facts,
        measured_results: brief.measured_results,
        conflicts: brief.conflicts,
        community_signals: brief.community_signals,
        audience_questions: brief.audience_questions,
        content_opportunities: brief.content_opportunities,
        caveats: brief.important_caveats,
        generated_at: new Date().toISOString(),
      }, { onConflict: "research_run_id" });

      if (error) {
        console.warn("Supabase saveBrief query warning:", error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn("Supabase database connection unavailable:", e);
      return false;
    }
  }

  async getBriefByRunId(runId: string): Promise<any | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("research_briefs")
        .select("*")
        .eq("research_run_id", runId)
        .single();

      if (error || !data) return null;
      return data;
    } catch {
      return null;
    }
  }
}
