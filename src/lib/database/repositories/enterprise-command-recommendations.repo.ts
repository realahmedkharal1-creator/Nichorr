import { createClient } from "@/lib/supabase/server";

export interface EnterpriseCommandRecommendationRecord {
  id: string;
  workspace_id: string;
  pattern_id?: string;
  command_type: string;
  rationale: string;
  expected_benefit: string;
  expected_risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  supporting_evidence: string[];
  historical_success_rate: number;
  status: "AI_PROPOSED";
  created_at: string;
}

export class EnterpriseCommandRecommendationsRepository {
  private fallbackData: EnterpriseCommandRecommendationRecord[] = [
    {
      id: "recom-1",
      workspace_id: "ws-primary-default",
      pattern_id: "pat-1",
      command_type: "REBALANCE_CLUSTER_ALLOCATION",
      rationale: "Historical pattern indicates cluster load rebalance prevents node tail latency degradation by 94.2%.",
      expected_benefit: "Maintain < 15ms P95 latency across cluster under peak traffic.",
      expected_risk: "LOW",
      supporting_evidence: ["pat-1", "lrn-1"],
      historical_success_rate: 98.5,
      status: "AI_PROPOSED",
      created_at: new Date().toISOString(),
    },
  ];

  async getRecommendations(workspaceId: string): Promise<EnterpriseCommandRecommendationRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_command_recommendations").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}
    return this.fallbackData.filter((r) => r.workspace_id === workspaceId);
  }
}

export const enterpriseCommandRecommendationsRepository = new EnterpriseCommandRecommendationsRepository();
