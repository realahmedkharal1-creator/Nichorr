import { createClient } from "@/lib/supabase/server";

export interface ActionRecord {
  id: string;
  workspace_id: string;
  name: string;
  description: string;
  action_type: "NOTIFICATION" | "DATA_UPDATE" | "API_CALL" | "WORKFLOW_TRIGGER" | "EXTERNAL_SYSTEM_ACTION";
  target_system: string;
  reversibility: "REVERSIBLE" | "PARTIALLY_REVERSIBLE" | "IRREVERSIBLE" | "UNKNOWN";
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  autonomy_level: number;
  created_at?: string;
}

export type ActionEntity = ActionRecord;

export class ActionsRepository {
  async getActions(workspaceId: string): Promise<ActionRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("actions").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "act-def-1",
        workspace_id: workspaceId,
        name: "Deploy Sub-path Distillation Canary Package",
        description: "Deploy sub-path distillation model weights to 25% edge TPU cluster nodes.",
        action_type: "EXTERNAL_SYSTEM_ACTION",
        target_system: "Production Edge TPU Orchestrator",
        reversibility: "REVERSIBLE",
        risk_level: "MEDIUM",
        autonomy_level: 3,
        created_at: new Date().toISOString(),
      },
    ];
  }
}
