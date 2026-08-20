import { createClient } from "@/lib/supabase/server";

export interface ActionItemEntity {
  id: string;
  project_id: string;
  title: string;
  reason: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  category: "RESEARCH" | "CONTENT" | "KNOWLEDGE" | "ALERT";
  action_type: "START_RESEARCH" | "REVIEW_CONTENT" | "REFRESH_KNOWLEDGE" | "RESOLVE_ALERT";
  entity_id?: string;
  is_completed: boolean;
  created_at?: string;
}

const globalActions = globalThis as unknown as {
  actionsStore: Map<string, ActionItemEntity[]> | undefined;
};
const actionsStore = globalActions.actionsStore ?? new Map<string, ActionItemEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalActions.actionsStore = actionsStore;
}

export class ActionItemsRepository {
  async getActionItems(projectId?: string): Promise<ActionItemEntity[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("action_items").select("*").eq("is_completed", false).order("created_at", { ascending: false });
      if (projectId) query = query.eq("project_id", projectId);

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {}

    const all = Array.from(actionsStore.values()).flat().filter(a => !a.is_completed);
    if (projectId) return all.filter((a) => a.project_id === projectId);
    return all;
  }

  async saveActionItem(item: ActionItemEntity): Promise<ActionItemEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("action_items").upsert(item).select().single();
      if (!error && data) {
        const list = actionsStore.get(item.project_id) || [];
        const idx = list.findIndex((a) => a.id === data.id);
        if (idx >= 0) list[idx] = data;
        else list.unshift(data);
        actionsStore.set(item.project_id, list);
        return data;
      }
    } catch {}

    const list = actionsStore.get(item.project_id) || [];
    const idx = list.findIndex((a) => a.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.unshift(item);
    actionsStore.set(item.project_id, list);
    return item;
  }

  async completeActionItem(id: string): Promise<boolean> {
    try {
      const supabase = createClient();
      await supabase.from("action_items").update({ is_completed: true }).eq("id", id);
    } catch {}

    for (const list of actionsStore.values()) {
      const target = list.find((a) => a.id === id);
      if (target) {
        target.is_completed = true;
        return true;
      }
    }
    return false;
  }
}
