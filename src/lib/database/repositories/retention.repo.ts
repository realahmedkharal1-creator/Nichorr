import { createClient } from "@/lib/supabase/server";

export interface RetentionPolicyEntity {
  id: string;
  workspace_id: string;
  entity_type: string;
  retention_days: number;
  auto_archive: boolean;
  created_at?: string;
}

export class RetentionRepository {
  async getPolicies(workspaceId: string): Promise<RetentionPolicyEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("retention_policies").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      { id: "ret-1", workspace_id: workspaceId, entity_type: "AUDIT_LOGS", retention_days: 365, auto_archive: true },
      { id: "ret-2", workspace_id: workspaceId, entity_type: "WEBHOOK_DELIVERIES", retention_days: 30, auto_archive: true },
      { id: "ret-3", workspace_id: workspaceId, entity_type: "ANALYTICS_EVENTS", retention_days: 90, auto_archive: true },
    ];
  }
}
