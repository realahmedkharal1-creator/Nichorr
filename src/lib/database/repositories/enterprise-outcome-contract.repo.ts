import { createClient } from "@/lib/supabase/server";

export type EpistemicStatus = "OBSERVED" | "ESTIMATED" | "SIMULATED" | "FORECAST" | "UNKNOWN" | "INSUFFICIENT_DATA";

export interface EnterpriseOutcomeContractRecord {
  id: string;
  command_id: string;
  workspace_id: string;
  expected_state: Record<string, any>;
  expected_metrics: Record<string, any>;
  acceptable_variance: number;
  success_threshold: number;
  failure_threshold: number;
  observation_window: string;
  verification_strategy: string;
  required_evidence: string[];
  epistemic_status: EpistemicStatus;
  created_at: string;
}

export class EnterpriseOutcomeContractRepository {
  private fallbackData: EnterpriseOutcomeContractRecord[] = [
    {
      id: "contract-1",
      command_id: "cmd-1",
      workspace_id: "ws-primary-default",
      expected_state: { node4_status: "DRAINED", cluster_health: "HEALTHY" },
      expected_metrics: { p95_latency_ms: 14.8, error_rate_percent: 0.01 },
      acceptable_variance: 5.0,
      success_threshold: 95.0,
      failure_threshold: 50.0,
      observation_window: "PT10M",
      verification_strategy: "AUTOMATED_METRIC_TELEMETRY_SAMPLE",
      required_evidence: ["ev-node5-telemetry", "ev-loadbalancer-drain-ack"],
      epistemic_status: "FORECAST",
      created_at: new Date().toISOString(),
    },
  ];

  async getContracts(workspaceId: string): Promise<EnterpriseOutcomeContractRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_outcome_contracts").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}
    return this.fallbackData.filter((c) => c.workspace_id === workspaceId);
  }

  async getContractByCommandId(commandId: string): Promise<EnterpriseOutcomeContractRecord | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_outcome_contracts").select("*").eq("command_id", commandId).single();
      if (!error && data) return data;
    } catch {}
    return this.fallbackData.find((c) => c.command_id === commandId) || null;
  }
}

export const enterpriseOutcomeContractRepository = new EnterpriseOutcomeContractRepository();
