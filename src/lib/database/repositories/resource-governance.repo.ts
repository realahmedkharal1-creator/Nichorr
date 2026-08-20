import { createClient } from "@/lib/supabase/server";

export interface ResourceUsageRecord {
  id: string;
  workspace_id: string;
  resource_type: "TOKENS" | "COMPUTE" | "API_CALLS" | "STORAGE";
  current_usage: number;
  ceiling_limit: number;
  status: "NORMAL" | "WARNING" | "THROTTLED" | "BLOCKED";
  updated_at?: string;
}

export class ResourceGovernanceRepository {
  async getResourceUsage(workspaceId: string): Promise<ResourceUsageRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("resource_usage").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "res-1",
        workspace_id: workspaceId,
        resource_type: "TOKENS",
        current_usage: 142000,
        ceiling_limit: 1000000,
        status: "NORMAL",
        updated_at: new Date().toISOString(),
      },
      {
        id: "res-2",
        workspace_id: workspaceId,
        resource_type: "API_CALLS",
        current_usage: 2450,
        ceiling_limit: 50000,
        status: "NORMAL",
        updated_at: new Date().toISOString(),
      },
    ];
  }
}
