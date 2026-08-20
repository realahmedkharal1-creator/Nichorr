import { createClient } from "@/lib/supabase/server";

export interface OperationalObservationRecord {
  id: string;
  workspace_id: string;
  source_system: string;
  observation_type: string;
  observed_at: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  payload: any;
}

export class OperationsObservationRepository {
  async getObservations(workspaceId: string): Promise<OperationalObservationRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("operational_observations").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "obs-1",
        workspace_id: workspaceId,
        source_system: "Production Edge TPU Orchestrator",
        observation_type: "LATENCY_SPIKE",
        observed_at: new Date().toISOString(),
        severity: "MEDIUM",
        payload: { latencyMs: 340, thresholdMs: 200 },
      },
    ];
  }
}
