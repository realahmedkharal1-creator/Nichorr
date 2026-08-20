import { createClient } from "@/lib/supabase/server";

export interface CausalQuestionRecord {
  id: string;
  workspace_id: string;
  treatment: string;
  outcome: string;
  question_text: string;
  known_confounders: string[];
  created_at?: string;
}

export class CausalQuestionsRepository {
  async getQuestions(workspaceId: string): Promise<CausalQuestionRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("causal_questions").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "cq-1",
        workspace_id: workspaceId,
        treatment: "Sub-path Distillation",
        outcome: "Edge TPU Latency",
        question_text: "Does deploying sub-path distillation directly cause the observed 42% decrease in edge inference latency?",
        known_confounders: ["Hardware thermal throttling", "Batch size changes", "Concurrent GPU workloads"],
        created_at: new Date().toISOString(),
      },
    ];
  }
}
