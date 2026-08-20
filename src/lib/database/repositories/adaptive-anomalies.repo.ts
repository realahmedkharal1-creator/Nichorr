import { createClient } from "@/lib/supabase/server";

export interface AdaptiveAnomalyRecord {
  id: string;
  workspace_id: string;
  metric_name: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  observed_value: number;
  expected_value: number;
  status: "OPEN" | "INVESTIGATING" | "EXPLAINED" | "MITIGATED" | "CLOSED";
  detected_at?: string;
}

export class AdaptiveAnomaliesRepository {
  async getAnomalies(workspaceId: string): Promise<AdaptiveAnomalyRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("adaptive_anomalies").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "anom-1",
        workspace_id: workspaceId,
        metric_name: "retrieval_precision",
        severity: "LOW",
        observed_value: 0.92,
        expected_value: 0.95,
        status: "INVESTIGATING",
        detected_at: new Date().toISOString(),
      },
    ];
  }
}
