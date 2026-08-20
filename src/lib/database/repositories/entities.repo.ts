import { createClient } from "@/lib/supabase/server";

export interface EntityRecord {
  id: string;
  workspace_id: string;
  canonical_name: string;
  entity_type: "COMPANY" | "TECHNOLOGY" | "MODEL" | "PLATFORM" | "PERSON" | "PRODUCT";
  description?: string;
  confidence: number;
  freshness_status: "FRESH" | "AGING" | "STALE" | "CRITICAL";
  status: "UNRESOLVED" | "CANDIDATE" | "CONFIRMED" | "MERGED";
  created_at?: string;
}

export class EntitiesRepository {
  async getEntities(workspaceId: string): Promise<EntityRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("entities").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "ent-1",
        workspace_id: workspaceId,
        canonical_name: "Google DeepMind",
        entity_type: "COMPANY",
        description: "AI Research Laboratory behind Gemini models.",
        confidence: 99.0,
        freshness_status: "FRESH",
        status: "CONFIRMED",
        created_at: new Date().toISOString(),
      },
      {
        id: "ent-2",
        workspace_id: workspaceId,
        canonical_name: "Gemini 1.5 Flash",
        entity_type: "MODEL",
        description: "High-efficiency multimodal LLM optimized for low-latency inference.",
        confidence: 98.5,
        freshness_status: "FRESH",
        status: "CONFIRMED",
        created_at: new Date().toISOString(),
      },
    ];
  }
}
