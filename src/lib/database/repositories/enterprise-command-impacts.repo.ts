import { createClient } from "@/lib/supabase/server";

export type ImpactClassification = "DIRECTLY_OBSERVED" | "STRONGLY_SUPPORTED" | "POSSIBLY_ASSOCIATED" | "TEMPORALLY_ASSOCIATED" | "INSUFFICIENT_DATA" | "UNKNOWN";

export interface EnterpriseCommandImpactRecord {
  id: string;
  command_id: string;
  workspace_id: string;
  impact_type: string;
  affected_entity: string;
  magnitude: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  evidence_basis: string[];
  classification: ImpactClassification;
  assessed_at: string;
}

export class EnterpriseCommandImpactsRepository {
  private fallbackData: EnterpriseCommandImpactRecord[] = [
    {
      id: "imp-1",
      command_id: "cmd-1",
      workspace_id: "ws-primary-default",
      impact_type: "LATENCY_REDUCTION",
      affected_entity: "service-edge-router",
      magnitude: "MEDIUM",
      evidence_basis: ["ev-edge-telemetry-01"],
      classification: "DIRECTLY_OBSERVED",
      assessed_at: new Date().toISOString(),
    },
  ];

  async getImpacts(workspaceId: string): Promise<EnterpriseCommandImpactRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_command_impacts").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}
    return this.fallbackData.filter((i) => i.workspace_id === workspaceId);
  }

  async getImpactsByCommandId(commandId: string): Promise<EnterpriseCommandImpactRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_command_impacts").select("*").eq("command_id", commandId);
      if (!error && data && data.length > 0) return data;
    } catch {}
    return this.fallbackData.filter((i) => i.command_id === commandId);
  }
}

export const enterpriseCommandImpactsRepository = new EnterpriseCommandImpactsRepository();
