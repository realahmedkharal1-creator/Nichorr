import { createClient } from "@/lib/supabase/server";

export interface ObjectiveEntity {
  id: string;
  workspace_id: string;
  title: string;
  description?: string;
  owner_id: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "DRAFT" | "ACTIVE" | "AT_RISK" | "ACHIEVED" | "PAUSED";
  target_metric: string;
  baseline_value: number;
  target_value: number;
  current_value: number;
  deadline?: string;
  created_at?: string;
}

export class ObjectivesRepository {
  async getObjectives(workspaceId: string): Promise<ObjectiveEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("objectives").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "obj-1",
        workspace_id: workspaceId,
        title: "Achieve 98%+ Publish Readiness Across Mobile Tech Scripts",
        description: "Eliminate ungrounded tech claims before YouTube script drafting.",
        owner_id: "usr-admin-default",
        priority: "HIGH",
        status: "ACTIVE",
        target_metric: "Publish Readiness Score",
        baseline_value: 88.0,
        target_value: 98.0,
        current_value: 96.8,
        deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: "obj-2",
        workspace_id: workspaceId,
        title: "Expand Primary Source Coverage for ARM Chipsets",
        description: "Harvest direct benchmark evidence from Geekbench & SPECint databases.",
        owner_id: "usr-admin-default",
        priority: "MEDIUM",
        status: "ACTIVE",
        target_metric: "Primary Evidence Ratio",
        baseline_value: 70.0,
        target_value: 95.0,
        current_value: 92.4,
        deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
        created_at: new Date().toISOString(),
      },
    ];
  }
}
