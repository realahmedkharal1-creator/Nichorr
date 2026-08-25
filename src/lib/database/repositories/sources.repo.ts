import { createServiceClient } from "@/lib/supabase/server";

export class SourcesRepository {
  async saveSources(runId: string, sources: any[]): Promise<boolean> {
    if (sources.length === 0) return true;
    try {
      const supabase = createServiceClient();
      const records = sources.map((s) => ({
        canonical_url: s.url,
        original_url: s.url,
        title: s.title,
        publisher: s.publisher || "Technical Publication",
        source_type: s.sourceType || "TECH_PUBLICATION",
        quality_score: s.qualityScore || 8.0,
      }));

      const { error } = await supabase.from("sources").upsert(records, { onConflict: "canonical_url" });
      if (error) {
        console.warn("Supabase saveSources query warning:", error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn("Supabase database connection unavailable:", e);
      return false;
    }
  }
}
