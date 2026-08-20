import { createClient } from "@/lib/supabase/server";

export interface ScenarioEntity {
  id: string;
  workspace_id: string;
  title: string;
  scenario_type: "BASELINE" | "UPSIDE" | "DOWNSIDE" | "DISRUPTION" | "TRANSFORMATION";
  probability: number;
  drivers: string[];
  strategic_implications: string;
  created_at?: string;
}

export class ScenariosRepository {
  async getScenarios(workspaceId: string): Promise<ScenarioEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("scenarios").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "scen-1",
        workspace_id: workspaceId,
        title: "Baseline: Hybrid Cloud Inference & Edge Micro-models",
        scenario_type: "BASELINE",
        probability: 85.0,
        drivers: ["Cost constraints", "Latency targets", "Local privacy regulation"],
        strategic_implications: "Requires dual routing between cloud models and edge SLMs.",
        created_at: new Date().toISOString(),
      },
      {
        id: "scen-2",
        workspace_id: workspaceId,
        title: "Downside: API Token Price Inflation (+40%)",
        scenario_type: "DOWNSIDE",
        probability: 30.0,
        drivers: ["Provider compute shortage", "Geopolitical silicon supply constraint"],
        strategic_implications: "Mandates aggressive token optimization and caching.",
        created_at: new Date().toISOString(),
      },
    ];
  }
}
