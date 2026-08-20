import { createClient } from "@/lib/supabase/server";

export interface WorkspaceActivityEntity {
  id: string;
  workspace_id: string;
  project_id?: string;
  actor_name: string;
  entity_type: string;
  entity_id: string;
  action: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

const globalActivities = globalThis as unknown as {
  activitiesStore: Map<string, WorkspaceActivityEntity[]> | undefined;
};
const activitiesStore = globalActivities.activitiesStore ?? new Map<string, WorkspaceActivityEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalActivities.activitiesStore = activitiesStore;
}

export class WorkspaceActivityRepository {
  async logActivity(act: WorkspaceActivityEntity): Promise<WorkspaceActivityEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("workspace_activities").insert(act).select().single();
      if (!error && data) {
        const list = activitiesStore.get(act.workspace_id) || [];
        list.unshift(data);
        activitiesStore.set(act.workspace_id, list);
        return data;
      }
    } catch {}

    const list = activitiesStore.get(act.workspace_id) || [];
    list.unshift(act);
    activitiesStore.set(act.workspace_id, list);
    return act;
  }

  async getActivities(workspaceId?: string): Promise<WorkspaceActivityEntity[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("workspace_activities").select("*").order("created_at", { ascending: false });
      if (workspaceId) query = query.eq("workspace_id", workspaceId);

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {}

    const all = Array.from(activitiesStore.values()).flat();
    if (workspaceId) return all.filter((a) => a.workspace_id === workspaceId);
    return all;
  }
}
