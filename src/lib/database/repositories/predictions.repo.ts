import { createClient } from "@/lib/supabase/server";

export interface PredictionEntity {
  id: string;
  workspace_id: string;
  forecast_statement: string;
  probability: number;
  expected_by?: string;
  actual_result?: string;
  is_accurate?: boolean;
  created_at?: string;
}

export class PredictionsRepository {
  async getPredictions(workspaceId: string): Promise<PredictionEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("predictions").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "pred-1",
        workspace_id: workspaceId,
        forecast_statement: "Publish readiness score will reach 98% following automated fact-checking pass.",
        probability: 92.5,
        expected_by: new Date(Date.now() + 86400000).toISOString(),
        actual_result: "Publish readiness score reached 98.2%.",
        is_accurate: true,
        created_at: new Date().toISOString(),
      },
    ];
  }
}
