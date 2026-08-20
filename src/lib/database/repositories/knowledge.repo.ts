import { createClient } from "@/lib/supabase/server";

export interface KnowledgeItemEntity {
  id: string;
  project_id: string;
  normalized_claim: string;
  current_value: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  status: "SUPPORTED" | "CONTRADICTED" | "STALE" | "UNVERIFIED" | "REQUIRES_REVIEW";
  supporting_sources_count: number;
  last_verified_at: string;
  freshness_status: "FRESH" | "AGING" | "STALE";
  originating_run_id?: string;
  latest_run_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KnowledgeChangeEntity {
  id: string;
  project_id: string;
  knowledge_item_id: string;
  change_type: "NEW_INFO" | "VALUE_CHANGED" | "CONTRADICTION" | "CONFIDENCE_SHIFT" | "SOURCE_REPLACED";
  previous_value?: string;
  new_value: string;
  explanation: string;
  detecting_run_id?: string;
  detected_at?: string;
}

// In-Memory store for development / offline session fallbacks
const globalKnowledge = globalThis as unknown as {
  knowledgeStore: Map<string, KnowledgeItemEntity[]> | undefined;
  changesStore: Map<string, KnowledgeChangeEntity[]> | undefined;
};
const knowledgeStore = globalKnowledge.knowledgeStore ?? new Map<string, KnowledgeItemEntity[]>();
const changesStore = globalKnowledge.changesStore ?? new Map<string, KnowledgeChangeEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalKnowledge.knowledgeStore = knowledgeStore;
  globalKnowledge.changesStore = changesStore;
}

export class KnowledgeRepository {
  async getKnowledgeByProjectId(projectId: string): Promise<KnowledgeItemEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("knowledge_items")
        .select("*")
        .eq("project_id", projectId)
        .order("updated_at", { ascending: false });

      if (!error && data && data.length > 0) return data;
      return knowledgeStore.get(projectId) || [];
    } catch {
      return knowledgeStore.get(projectId) || [];
    }
  }

  async saveKnowledgeItem(item: KnowledgeItemEntity): Promise<KnowledgeItemEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("knowledge_items").upsert(item).select().single();
      if (!error && data) {
        const list = knowledgeStore.get(item.project_id) || [];
        const existingIdx = list.findIndex((i) => i.id === data.id);
        if (existingIdx >= 0) list[existingIdx] = data;
        else list.unshift(data);
        knowledgeStore.set(item.project_id, list);
        return data;
      }
    } catch {}

    const list = knowledgeStore.get(item.project_id) || [];
    const existingIdx = list.findIndex((i) => i.id === item.id);
    if (existingIdx >= 0) list[existingIdx] = item;
    else list.unshift(item);
    knowledgeStore.set(item.project_id, list);
    return item;
  }

  async getChangesByProjectId(projectId: string): Promise<KnowledgeChangeEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("knowledge_changes")
        .select("*")
        .eq("project_id", projectId)
        .order("detected_at", { ascending: false });

      if (!error && data && data.length > 0) return data;
      return changesStore.get(projectId) || [];
    } catch {
      return changesStore.get(projectId) || [];
    }
  }

  async recordChange(change: KnowledgeChangeEntity): Promise<KnowledgeChangeEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("knowledge_changes").insert(change).select().single();
      if (!error && data) {
        const list = changesStore.get(change.project_id) || [];
        list.unshift(data);
        changesStore.set(change.project_id, list);
        return data;
      }
    } catch {}

    const list = changesStore.get(change.project_id) || [];
    list.unshift(change);
    changesStore.set(change.project_id, list);
    return change;
  }
}
