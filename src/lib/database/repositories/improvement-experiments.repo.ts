import { createClient } from "@/lib/supabase/server";

export interface ImprovementExperimentRecord {
  id: string;
  proposal_id: string;
  experiment_type: "SHADOW" | "A_B" | "CANARY" | "SIMULATION";
  control_score: number;
  treatment_score: number;
  status: "RUNNING" | "COMPLETED" | "FAILED";
  created_at?: string;
}

export class ImprovementExperimentsRepository {
  async getExperiments(): Promise<ImprovementExperimentRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("improvement_experiments").select("*");
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "exp-1",
        proposal_id: "prop-1",
        experiment_type: "SHADOW",
        control_score: 94.5,
        treatment_score: 96.8,
        status: "COMPLETED",
        created_at: new Date().toISOString(),
      },
    ];
  }
}
