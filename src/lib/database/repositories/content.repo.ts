import { createClient } from "@/lib/supabase/server";

export type ContentStage =
  | "IDEA"
  | "RESEARCH_NEEDED"
  | "RESEARCH_READY"
  | "OUTLINE_READY"
  | "SCRIPTING"
  | "FACT_CHECK"
  | "READY_TO_RECORD"
  | "RECORDED"
  | "EDITING"
  | "READY_TO_PUBLISH"
  | "PUBLISHED"
  | "ARCHIVED";

export interface ContentItemEntity {
  id: string;
  project_id: string;
  research_run_id?: string;
  opportunity_id?: string;
  title: string;
  working_title?: string;
  content_type: string; // 'YouTube Video', 'YouTube Short', 'Instagram Reel', 'TikTok', 'Article', 'Newsletter', 'Social Post'
  topic: string;
  objective?: string;
  stage: ContentStage;
  priority: "HIGH" | "MEDIUM" | "LOW";
  audience?: string;
  hook?: string;
  outline?: any;
  script?: string;
  fact_check_status?: "PENDING" | "PASSED" | "WARNINGS" | "FAILED";
  publish_readiness_status?: "READY" | "READY_WITH_WARNINGS" | "NOT_READY";
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

export interface ContentClaimEntity {
  id: string;
  content_item_id: string;
  claim_text: string;
  evidence_status: "SUPPORTED" | "NEEDS_CONTEXT" | "CONTRADICTED" | "UNSUPPORTED" | "STALE";
  knowledge_item_id?: string;
  created_at?: string;
}

// In-Memory store for development / offline session fallbacks
const globalContent = globalThis as unknown as {
  contentStore: Map<string, ContentItemEntity[]> | undefined;
  claimsStore: Map<string, ContentClaimEntity[]> | undefined;
};
const contentStore = globalContent.contentStore ?? new Map<string, ContentItemEntity[]>();
const claimsStore = globalContent.claimsStore ?? new Map<string, ContentClaimEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalContent.contentStore = contentStore;
  globalContent.claimsStore = claimsStore;
}

// Deterministic Stage Transition Map
const STAGE_TRANSITION_MAP: Record<ContentStage, ContentStage[]> = {
  IDEA: ["RESEARCH_NEEDED", "RESEARCH_READY", "ARCHIVED"],
  RESEARCH_NEEDED: ["RESEARCH_READY", "ARCHIVED"],
  RESEARCH_READY: ["OUTLINE_READY", "SCRIPTING", "ARCHIVED"],
  OUTLINE_READY: ["SCRIPTING", "FACT_CHECK", "ARCHIVED"],
  SCRIPTING: ["FACT_CHECK", "READY_TO_RECORD", "ARCHIVED"],
  FACT_CHECK: ["READY_TO_RECORD", "SCRIPTING", "ARCHIVED"],
  READY_TO_RECORD: ["RECORDED", "FACT_CHECK", "ARCHIVED"],
  RECORDED: ["EDITING", "ARCHIVED"],
  EDITING: ["READY_TO_PUBLISH", "FACT_CHECK", "ARCHIVED"],
  READY_TO_PUBLISH: ["PUBLISHED", "EDITING", "ARCHIVED"],
  PUBLISHED: ["ARCHIVED"],
  ARCHIVED: ["IDEA"],
};

export function isValidStageTransition(current: ContentStage, next: ContentStage): boolean {
  if (current === next) return true;
  const allowed = STAGE_TRANSITION_MAP[current] || [];
  return allowed.includes(next);
}

export class ContentRepository {
  async getContentItems(projectId?: string): Promise<ContentItemEntity[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("content_items").select("*").order("updated_at", { ascending: false });
      if (projectId) query = query.eq("project_id", projectId);

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {}

    const all = Array.from(contentStore.values()).flat();
    if (projectId) return all.filter((i) => i.project_id === projectId);
    return all;
  }

  async getContentItemById(id: string): Promise<ContentItemEntity | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("content_items").select("*").eq("id", id).single();
      if (!error && data) return data;
    } catch {}

    for (const list of contentStore.values()) {
      const found = list.find((i) => i.id === id);
      if (found) return found;
    }
    return null;
  }

  async saveContentItem(item: ContentItemEntity): Promise<ContentItemEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("content_items").upsert(item).select().single();
      if (!error && data) {
        const list = contentStore.get(item.project_id) || [];
        const idx = list.findIndex((i) => i.id === data.id);
        if (idx >= 0) list[idx] = data;
        else list.unshift(data);
        contentStore.set(item.project_id, list);
        return data;
      }
    } catch {}

    const list = contentStore.get(item.project_id) || [];
    const idx = list.findIndex((i) => i.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.unshift(item);
    contentStore.set(item.project_id, list);
    return item;
  }

  async deleteContentItem(id: string): Promise<boolean> {
    try {
      const supabase = createClient();
      await supabase.from("content_items").delete().eq("id", id);
    } catch {}

    for (const [projId, list] of contentStore.entries()) {
      const filtered = list.filter((i) => i.id !== id);
      contentStore.set(projId, filtered);
    }
    return true;
  }
}
