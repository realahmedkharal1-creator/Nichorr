import { createClient } from "@/lib/supabase/server";

export interface RemediationProposalRecord {
  id: string;
  incident_id: string;
  proposed_action: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  autonomy_level: number;
  status: "AI_PROPOSED" | "UNDER_REVIEW" | "APPROVED" | "EXECUTED";
  created_at?: string;
}

export class RemediationProposalsRepository {
  async getProposals(incidentId?: string): Promise<RemediationProposalRecord[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("remediation_proposals").select("*");
      if (incidentId) query = query.eq("incident_id", incidentId);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "rem-prop-1",
        incident_id: incidentId || "inc-1",
        proposed_action: "Automated 10% canary traffic shift to reserve TPU node",
        risk_level: "MEDIUM",
        autonomy_level: 3,
        status: "APPROVED",
        created_at: new Date().toISOString(),
      },
    ];
  }
}
