import { createClient } from "@/lib/supabase/server";

export interface ResidencyPolicyEntity {
  id: string;
  workspace_id: string;
  region: "GLOBAL" | "US" | "EU" | "APAC";
  cross_region_allowed: boolean;
  created_at?: string;
}

export class ResidencyRepository {
  async getPolicy(workspaceId: string): Promise<ResidencyPolicyEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("residency_policies").select("*").eq("workspace_id", workspaceId).single();
      if (!error && data) return data;
    } catch {}

    return {
      id: "res-default",
      workspace_id: workspaceId,
      region: "US",
      cross_region_allowed: false,
    };
  }
}
