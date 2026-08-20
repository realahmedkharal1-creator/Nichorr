import { createClient } from "@/lib/supabase/server";

export interface AIModelEntity {
  id: string;
  provider: string;
  model_id: string;
  capabilities: string[];
  status: "AVAILABLE" | "LIMITED" | "DEPRECATED" | "DISABLED";
  cost_per_1k_tokens: number;
  created_at?: string;
}

export class AIModelsRepository {
  async getModels(): Promise<AIModelEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("ai_models").select("*");
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      { id: "mod-1", provider: "google", model_id: "gemini-1.5-pro", capabilities: ["RESEARCH", "REASONING"], status: "AVAILABLE", cost_per_1k_tokens: 0.0015 },
      { id: "mod-2", provider: "google", model_id: "gemini-1.5-flash", capabilities: ["SPEED", "EXTRACTION"], status: "AVAILABLE", cost_per_1k_tokens: 0.0005 },
    ];
  }
}
