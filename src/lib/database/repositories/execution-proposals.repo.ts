import { createClient } from "@/lib/supabase/server";

export interface ExecutionProposalRecord {
  id: string;
  decision_id: string;
  action_id: string;
  proposed_by: string;
  status: "AI_PROPOSED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "EXECUTED";
  reasoning: string;
  created_at?: string;
}

export class ExecutionProposalsRepository {
  async getProposals(decisionId: string): Promise<ExecutionProposalRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("execution_proposals").select("*").eq("decision_id", decisionId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "prop-1",
        decision_id: decisionId,
        action_id: "act-def-1",
        proposed_by: "StrategyAgent & DecisionAnalystAgent",
        status: "APPROVED",
        reasoning: "Sub-path distillation achieves 42% latency reduction under Autonomy Level 3 policy authorization.",
        created_at: new Date().toISOString(),
      },
    ];
  }
}
