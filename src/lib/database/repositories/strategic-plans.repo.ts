import { createClient } from "@/lib/supabase/server";

export interface StrategicPlanRecord {
  id: string;
  workspace_id: string;
  objective_id?: string;
  decision_id?: string;
  selected_option_id?: string;
  title: string;
  rationale?: string;
  assumptions?: any[];
  constraints?: any[];
  expected_outcomes?: Record<string, any>;
  risks?: any[];
  uncertainty: string;
  simulation_ids?: any[];
  resource_allocation?: Record<string, any>;
  timeline?: string;
  milestones?: any[];
  approval_status: "DRAFT" | "VALIDATED" | "SIMULATED" | "GOVERNANCE_REVIEW" | "APPROVED" | "ACTIVE" | "COMPLETED" | "EVALUATED";
  rollback_strategy?: string;
  version: number;
  created_at?: string;
  updated_at?: string;
}

export class StrategicPlansRepository {
  async getPlans(workspaceId: string): Promise<StrategicPlanRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("strategic_plans").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch {}
    return [
      {
        id: "splan-1",
        workspace_id: workspaceId,
        objective_id: "sobj-1",
        decision_id: "sdec-1",
        selected_option_id: "dopt-1",
        title: "Q4 Platform Uptime Optimization Plan v1.0",
        rationale: "Predictive auto-scaling with simulation pre-validation delivers highest risk-adjusted uptime improvement at lowest cost compared to alternatives.",
        assumptions: ["Monitoring coverage remains above 95%", "Digital twin accuracy within 5% of production"],
        constraints: [{ type: "BUDGET", limit: "$150,000" }, { type: "TIMELINE", deadline: "2026-12-31" }],
        expected_outcomes: { uptime_improvement: "99.9%", mttr_reduction: "58%" },
        risks: [{ risk: "Simulation calibration drift", mitigation: "Weekly simulation accuracy audit" }],
        uncertainty: "MODERATE",
        simulation_ids: ["sim-run-1"],
        resource_allocation: { budget: 45000, personnel: "2 FTE" },
        timeline: "12 weeks",
        milestones: [{ week: 2, milestone: "Simulation baseline established" }, { week: 6, milestone: "Auto-scaling deployed to staging" }, { week: 10, milestone: "Production deployment" }],
        approval_status: "APPROVED",
        rollback_strategy: "Revert auto-scaling thresholds to manual configuration within 2 hours",
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }
}
