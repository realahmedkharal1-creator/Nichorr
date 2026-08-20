import { createClient } from "@/lib/supabase/server";

export interface SimulationScenarioRecord {
  id: string;
  workspace_id: string;
  snapshot_id: string;
  title: string;
  scenario_type: "OPERATIONAL_FAILURE" | "EXECUTION" | "REMEDIATION" | "CONTROL_CHANGE" | "TRAFFIC_CHANGE";
  hypothetical_change: Record<string, any>;
  assumptions: string[];
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "GOVERNANCE_SENSITIVE";
  created_at?: string;
}

export class SimulationScenariosRepository {
  async getScenarios(workspaceId: string): Promise<SimulationScenarioRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("simulation_scenarios").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "scen-1",
        workspace_id: workspaceId,
        snapshot_id: "twin-snap-1",
        title: "Edge TPU Node 4 Failure & Automated Canary Reroute Simulation",
        scenario_type: "OPERATIONAL_FAILURE",
        hypothetical_change: { targetComponent: "Edge TPU Node 4", failureState: "HARD_OUTAGE" },
        assumptions: ["Reserve Edge TPU Node 5 has 80% available capacity"],
        risk_level: "MEDIUM",
        created_at: new Date().toISOString(),
      },
    ];
  }
}
