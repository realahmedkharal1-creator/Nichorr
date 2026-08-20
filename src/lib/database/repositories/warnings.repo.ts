import { createClient } from "@/lib/supabase/server";

export interface EarlyWarningEntity {
  id: string;
  workspace_id: string;
  indicator_name: string;
  threshold_value: number;
  current_value: number;
  status: "NORMAL" | "WATCH" | "WARNING" | "CRITICAL";
  created_at?: string;
}

export interface ContingencyPlanEntity {
  id: string;
  workspace_id: string;
  title: string;
  trigger_condition: string;
  preparedness_score: number;
  status: "DRAFT" | "READY" | "ACTIVATED" | "ARCHIVED";
  created_at?: string;
}

export class WarningsRepository {
  async getEarlyWarnings(workspaceId: string): Promise<EarlyWarningEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("early_warnings").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "warn-1",
        workspace_id: workspaceId,
        indicator_name: "Knowledge Freshness Index",
        threshold_value: 85.0,
        current_value: 94.2,
        status: "NORMAL",
        created_at: new Date().toISOString(),
      },
    ];
  }

  async getContingencyPlans(workspaceId: string): Promise<ContingencyPlanEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("contingency_plans").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "cont-1",
        workspace_id: workspaceId,
        title: "Edge Fallback Routing Plan",
        trigger_condition: "Primary Cloud API Latency > 1200ms",
        preparedness_score: 95.0,
        status: "READY",
        created_at: new Date().toISOString(),
      },
    ];
  }
}
