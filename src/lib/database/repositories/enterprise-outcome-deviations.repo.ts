import { createClient } from "@/lib/supabase/server";

export type DeviationLevel = "NO_DEVIATION" | "MINOR_DEVIATION" | "MATERIAL_DEVIATION" | "CRITICAL_DEVIATION" | "UNKNOWN" | "INSUFFICIENT_DATA";

export interface EnterpriseOutcomeDeviationRecord {
  id: string;
  command_id: string;
  workspace_id: string;
  deviation_level: DeviationLevel;
  metric_deviation: Record<string, any>;
  timing_deviation: Record<string, any>;
  state_deviation: Record<string, any>;
  resource_deviation: Record<string, any>;
  risk_deviation: Record<string, any>;
  epistemic_status: "OBSERVED" | "UNKNOWN" | "INSUFFICIENT_DATA";
  calculated_at: string;
}

export class EnterpriseOutcomeDeviationsRepository {
  private fallbackData: EnterpriseOutcomeDeviationRecord[] = [
    {
      id: "dev-1",
      command_id: "cmd-1",
      workspace_id: "ws-primary-default",
      deviation_level: "NO_DEVIATION",
      metric_deviation: { p95_latency_delta_ms: -0.6, error_rate_delta: -0.002 },
      timing_deviation: { expected_duration_s: 300, actual_duration_s: 285, variance_s: -15 },
      state_deviation: { unexpected_mutations: [] },
      resource_deviation: { compute_headroom_percent: 62.5 },
      risk_deviation: { residual_risk_level: "LOW" },
      epistemic_status: "OBSERVED",
      calculated_at: new Date().toISOString(),
    },
  ];

  async getDeviations(workspaceId: string): Promise<EnterpriseOutcomeDeviationRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_outcome_deviations").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}
    return this.fallbackData.filter((d) => d.workspace_id === workspaceId);
  }

  async getDeviationByCommandId(commandId: string): Promise<EnterpriseOutcomeDeviationRecord | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_outcome_deviations").select("*").eq("command_id", commandId).single();
      if (!error && data) return data;
    } catch {}
    return this.fallbackData.find((d) => d.command_id === commandId) || null;
  }
}

export const enterpriseOutcomeDeviationsRepository = new EnterpriseOutcomeDeviationsRepository();
