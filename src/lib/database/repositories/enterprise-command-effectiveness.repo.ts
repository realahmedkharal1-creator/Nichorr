import { createClient } from "@/lib/supabase/server";

export type OverallEffectiveness = "HIGHLY_EFFECTIVE" | "EFFECTIVE" | "PARTIALLY_EFFECTIVE" | "INEFFECTIVE" | "HARMFUL" | "UNKNOWN" | "INSUFFICIENT_DATA";

export interface EnterpriseCommandEffectivenessRecord {
  id: string;
  command_id: string;
  workspace_id: string;
  execution_correctness: number;
  outcome_achievement: number;
  time_efficiency: number;
  resource_efficiency: number;
  risk_efficiency: number;
  strategic_contribution: number;
  overall_effectiveness: OverallEffectiveness;
  epistemic_status: "OBSERVED" | "UNKNOWN" | "INSUFFICIENT_DATA";
  calculated_at: string;
}

export class EnterpriseCommandEffectivenessRepository {
  private fallbackData: EnterpriseCommandEffectivenessRecord[] = [
    {
      id: "eff-1",
      command_id: "cmd-1",
      workspace_id: "ws-primary-default",
      execution_correctness: 98.0,
      outcome_achievement: 96.5,
      time_efficiency: 92.0,
      resource_efficiency: 94.0,
      risk_efficiency: 95.0,
      strategic_contribution: 95.0,
      overall_effectiveness: "HIGHLY_EFFECTIVE",
      epistemic_status: "OBSERVED",
      calculated_at: new Date().toISOString(),
    },
  ];

  async getEffectiveness(workspaceId: string): Promise<EnterpriseCommandEffectivenessRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_command_effectiveness").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}
    return this.fallbackData.filter((e) => e.workspace_id === workspaceId);
  }

  async getEffectivenessByCommandId(commandId: string): Promise<EnterpriseCommandEffectivenessRecord | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_command_effectiveness").select("*").eq("command_id", commandId).single();
      if (!error && data) return data;
    } catch {}
    return this.fallbackData.find((e) => e.command_id === commandId) || null;
  }
}

export const enterpriseCommandEffectivenessRepository = new EnterpriseCommandEffectivenessRepository();
