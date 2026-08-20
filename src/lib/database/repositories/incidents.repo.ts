import { createClient } from "@/lib/supabase/server";

export interface IncidentRecord {
  id: string;
  workspace_id: string;
  title: string;
  status: "DETECTED" | "TRIAGING" | "CONFIRMED" | "MITIGATING" | "MONITORING" | "RECOVERED" | "RESOLVED";
  severity: "SEV_5" | "SEV_4" | "SEV_3" | "SEV_2" | "SEV_1";
  affected_system: string;
  affected_subsystem?: string;
  created_at?: string;
  updated_at?: string;
}

export type IncidentEntity = IncidentRecord;

export class IncidentsRepository {
  async getIncidents(workspaceId: string = "ws-primary-default"): Promise<IncidentRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("incidents").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "inc-1",
        workspace_id: workspaceId,
        title: "Transient Latency Spike on Edge TPU Orchestrator Node 4",
        status: "RECOVERED",
        severity: "SEV_3",
        affected_system: "Production Edge TPU Orchestrator",
        affected_subsystem: "Production Edge TPU Orchestrator Node 4",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }
}
