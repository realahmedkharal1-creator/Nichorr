import { createClient } from "@/lib/supabase/server";

export interface EnterpriseCommandIntentRecord {
  id: string;
  command_id: string;
  workspace_id: string;
  tenant_id?: string;
  originating_domain: string;
  requested_by: string;
  intent_type: string;
  objective_reference?: string;
  expected_state: Record<string, any>;
  expected_metrics: Record<string, any>;
  expected_time_window?: string;
  success_conditions: string[];
  failure_conditions: string[];
  constraints: string[];
  governance_requirements: string[];
  version: number;
  created_at: string;
}

export class EnterpriseCommandIntentRepository {
  private fallbackData: EnterpriseCommandIntentRecord[] = [
    {
      id: "intent-1",
      command_id: "cmd-1",
      workspace_id: "ws-primary-default",
      originating_domain: "OPERATIONS",
      requested_by: "Lead Reliability Engineer",
      intent_type: "REMEDIATE_FAILOVER",
      objective_reference: "sobj-1",
      expected_state: { node4_status: "RECOVERED", traffic_shifted: true },
      expected_metrics: { p95_latency_ms: 14.8, error_rate_percent: 0.01 },
      expected_time_window: "PT5M",
      success_conditions: ["Traffic drained from Node 4", "Cluster P95 latency <= 15ms"],
      failure_conditions: ["Node 5 memory saturation > 90%"],
      constraints: ["Maintain zero data loss guarantee"],
      governance_requirements: ["AUTONOMY_LEVEL_3_PRE_APPROVED"],
      version: 1,
      created_at: new Date().toISOString(),
    },
  ];

  async getIntents(workspaceId: string): Promise<EnterpriseCommandIntentRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_command_intents").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}
    return this.fallbackData.filter((i) => i.workspace_id === workspaceId);
  }

  async getIntentByCommandId(commandId: string): Promise<EnterpriseCommandIntentRecord | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_command_intents").select("*").eq("command_id", commandId).single();
      if (!error && data) return data;
    } catch {}
    return this.fallbackData.find((i) => i.command_id === commandId) || null;
  }

  async createIntent(workspaceId: string, data: Partial<EnterpriseCommandIntentRecord>): Promise<EnterpriseCommandIntentRecord> {
    const record: EnterpriseCommandIntentRecord = {
      id: `intent-${Date.now()}`,
      command_id: data.command_id || `cmd-${Date.now()}`,
      workspace_id: workspaceId,
      originating_domain: data.originating_domain || "STRATEGY",
      requested_by: data.requested_by || "SYSTEM",
      intent_type: data.intent_type || "EXECUTE_INTENT",
      expected_state: data.expected_state || {},
      expected_metrics: data.expected_metrics || {},
      success_conditions: data.success_conditions || [],
      failure_conditions: data.failure_conditions || [],
      constraints: data.constraints || [],
      governance_requirements: data.governance_requirements || [],
      version: 1,
      created_at: new Date().toISOString(),
    };
    try {
      const supabase = createClient();
      const { data: inserted, error } = await supabase.from("enterprise_command_intents").insert(record).select().single();
      if (!error && inserted) return inserted;
    } catch {}
    this.fallbackData.push(record);
    return record;
  }
}

export const enterpriseCommandIntentRepository = new EnterpriseCommandIntentRepository();
