import { createClient } from "@/lib/supabase/server";

export interface DecisionRecord {
  id: string;
  workspace_id: string;
  title: string;
  description: string;
  decision_type: "STRATEGIC" | "TACTICAL" | "OPERATIONAL" | "RESOURCE_ALLOCATION" | "PRODUCT" | "TECHNOLOGY" | "POLICY";
  status: "DRAFT" | "ANALYZING" | "OPTIONS_READY" | "SIMULATING" | "REVIEW_REQUIRED" | "APPROVED" | "EXECUTED";
  decision_owner: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  autonomy_level: number;
  recommended_option_id?: string;
  version: number;
  confidence?: number;
  reversibility?: string;
  cost_estimate?: number;
  created_at?: string;
  updated_at?: string;
}

export type DecisionEntity = DecisionRecord;

export class DecisionsRepository {
  async getDecisions(workspaceId: string): Promise<DecisionRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("decisions").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "dec-1",
        workspace_id: workspaceId,
        title: "Enterprise Edge Sub-path Distillation Rollout Strategy",
        description: "Decide whether to deploy Sub-path Distillation across all production edge TPU clusters based on Phase 23 causal findings.",
        decision_type: "TECHNOLOGY",
        status: "OPTIONS_READY",
        decision_owner: "Lead AI Architect",
        risk_level: "MEDIUM",
        autonomy_level: 3,
        recommended_option_id: "opt-2",
        version: 1,
        confidence: 94.5,
        reversibility: "HIGHLY_REVERSIBLE",
        cost_estimate: 2500,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }
}
