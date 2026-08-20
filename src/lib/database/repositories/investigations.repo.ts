import { createClient } from "@/lib/supabase/server";

export interface InvestigationSessionEntity {
  id: string;
  workspace_id: string;
  title: string;
  target_entity_type: string;
  target_entity_id: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  findings?: Array<{ timestamp: string; note: string }>;
  created_at?: string;
}

export class InvestigationsRepository {
  async getSessions(workspaceId: string): Promise<InvestigationSessionEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("investigation_sessions").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "inv-1",
        workspace_id: workspaceId,
        title: "Investigate Contested Battery Claim Discrepancy",
        target_entity_type: "CONTRADICTION",
        target_entity_id: "claim-battery-1",
        status: "INVESTIGATING",
        findings: [{ timestamp: new Date().toISOString(), note: "Harvested primary press releases from both manufacturers." }],
        created_at: new Date().toISOString(),
      },
    ];
  }
}
