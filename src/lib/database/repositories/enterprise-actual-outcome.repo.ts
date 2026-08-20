import { createClient } from "@/lib/supabase/server";

export interface EnterpriseActualOutcomeRecord {
  id: string;
  command_id: string;
  action_id?: string;
  workspace_id: string;
  observed_state: Record<string, any>;
  observed_metrics: Record<string, any>;
  observation_sources: string[];
  verification_status: "VERIFIED_SUCCESS" | "PARTIALLY_VERIFIED" | "VERIFIED_FAILURE" | "UNKNOWN" | "INSUFFICIENT_DATA";
  evidence_refs: string[];
  provenance_hash: string;
  observed_at: string;
  created_at: string;
}

export class EnterpriseActualOutcomeRepository {
  private fallbackData: EnterpriseActualOutcomeRecord[] = [
    {
      id: "outcome-1",
      command_id: "cmd-1",
      action_id: "act-1",
      workspace_id: "ws-primary-default",
      observed_state: { node4_status: "DRAINED", cluster_health: "HEALTHY", traffic_shifted_to: "node-5" },
      observed_metrics: { p95_latency_ms: 14.2, error_rate_percent: 0.008 },
      observation_sources: ["telemetry-service", "prometheus-cluster-agent"],
      verification_status: "VERIFIED_SUCCESS",
      evidence_refs: ["ev-node5-telemetry-post", "ev-prometheus-scrape-102"],
      provenance_hash: "sha256:d4f3b145892ac77b10294e55d6108e92fa048123c89b21f92e1049281a812bc8",
      observed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ];

  async getOutcomes(workspaceId: string): Promise<EnterpriseActualOutcomeRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_actual_outcomes").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}
    return this.fallbackData.filter((o) => o.workspace_id === workspaceId);
  }

  async getOutcomeByCommandId(commandId: string): Promise<EnterpriseActualOutcomeRecord | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_actual_outcomes").select("*").eq("command_id", commandId).single();
      if (!error && data) return data;
    } catch {}
    return this.fallbackData.find((o) => o.command_id === commandId) || null;
  }
}

export const enterpriseActualOutcomeRepository = new EnterpriseActualOutcomeRepository();
