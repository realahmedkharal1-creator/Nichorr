import { createClient } from "@/lib/supabase/server";

export interface StrategicDecisionRecord {
  id: string;
  workspace_id: string;
  objective_id?: string;
  decision_question: string;
  decision_owner?: string;
  decision_deadline?: string;
  status: "DRAFT" | "ANALYZING" | "OPTIONS_READY" | "SIMULATION_REQUIRED" | "SIMULATED" | "GOVERNANCE_REVIEW" | "READY_FOR_DECISION" | "DECIDED" | "EXECUTION_PENDING" | "EXECUTING" | "OUTCOME_PENDING" | "COMPLETED";
  known_constraints?: any[];
  unknowns?: any[];
  assumptions?: any[];
  simulation_required: boolean;
  risk_tolerance: string;
  selected_option_id?: string;
  autonomy_level: number;
  version: number;
  created_at?: string;
  updated_at?: string;
}

export class StrategicDecisionsRepository {
  async getDecisions(workspaceId: string): Promise<StrategicDecisionRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("strategic_decisions").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch {}
    return [
      {
        id: "sdec-1",
        workspace_id: workspaceId,
        objective_id: "sobj-1",
        decision_question: "Which uptime improvement strategy delivers the best risk-adjusted outcome with existing capacity?",
        decision_owner: "Lead Reliability Architect",
        decision_deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
        status: "OPTIONS_READY",
        known_constraints: [{ type: "BUDGET", value: "$150k" }, { type: "TIMELINE", value: "Q4 2026" }],
        unknowns: ["Third-party vendor SLA impact"],
        assumptions: ["Current monitoring coverage > 95%"],
        simulation_required: true,
        risk_tolerance: "MEDIUM",
        autonomy_level: 3,
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  async updateStatus(id: string, status: StrategicDecisionRecord["status"]): Promise<void> {
    try {
      const supabase = createClient();
      await supabase.from("strategic_decisions").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    } catch {}
  }
}
