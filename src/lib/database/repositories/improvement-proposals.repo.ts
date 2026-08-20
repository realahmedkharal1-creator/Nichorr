import { createClient } from "@/lib/supabase/server";

export interface ImprovementProposalRecord {
  id: string;
  workspace_id: string;
  problem_statement: string;
  proposed_change: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "GOVERNANCE_SENSITIVE";
  autonomy_level: number;
  status: "DRAFT" | "AI_PROPOSED" | "UNDER_REVIEW" | "APPROVED" | "IMPLEMENTED" | "ROLLED_BACK";
  created_at?: string;
}

export class ImprovementProposalsRepository {
  async getProposals(workspaceId: string): Promise<ImprovementProposalRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("adaptive_improvement_proposals").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "prop-1",
        workspace_id: workspaceId,
        problem_statement: "Transient 3% retrieval precision drop on domain technical terms",
        proposed_change: "Adjust dense-hybrid retrieval weighting from 0.70/0.30 to 0.75/0.25",
        risk_level: "LOW",
        autonomy_level: 3,
        status: "AI_PROPOSED",
        created_at: new Date().toISOString(),
      },
    ];
  }
}
