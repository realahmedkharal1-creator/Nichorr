import { createClient } from "@/lib/supabase/server";

export interface EnterpriseOutcomeRecoveryRecord {
  id: string;
  command_id: string;
  workspace_id: string;
  recovery_type: string;
  rationale: string;
  status: "AI_PROPOSED" | "GOVERNANCE_REVIEW" | "APPROVED" | "REJECTED" | "EXECUTED";
  recommended_actions: string[];
  created_at: string;
}

export class EnterpriseOutcomeRecoveriesRepository {
  private fallbackData: EnterpriseOutcomeRecoveryRecord[] = [
    {
      id: "rec-1",
      command_id: "cmd-1",
      workspace_id: "ws-primary-default",
      recovery_type: "REBALANCE_HEADROOM",
      rationale: "Proactively calibrate Node 5 cache limits post-failover to preserve 40% memory headroom.",
      status: "AI_PROPOSED",
      recommended_actions: ["Adjust Node 5 cache allocation to 60%", "Run simulation on Node 4 re-entry"],
      created_at: new Date().toISOString(),
    },
  ];

  async getRecoveries(workspaceId: string): Promise<EnterpriseOutcomeRecoveryRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_outcome_recoveries").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}
    return this.fallbackData.filter((r) => r.workspace_id === workspaceId);
  }
}

export const enterpriseOutcomeRecoveriesRepository = new EnterpriseOutcomeRecoveriesRepository();
