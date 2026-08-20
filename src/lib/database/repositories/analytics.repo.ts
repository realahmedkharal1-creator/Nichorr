import { createClient } from "@/lib/supabase/server";

export interface AnalyticsEventEntity {
  id: string;
  workspace_id: string;
  event_name: string;
  user_id?: string;
  properties?: Record<string, any>;
  created_at?: string;
}

const globalAnalytics = globalThis as unknown as {
  analyticsStore: Map<string, AnalyticsEventEntity[]> | undefined;
};
const analyticsStore = globalAnalytics.analyticsStore ?? new Map<string, AnalyticsEventEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalAnalytics.analyticsStore = analyticsStore;
}

export class ProductAnalyticsRepository {
  async trackEvent(evt: AnalyticsEventEntity): Promise<AnalyticsEventEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("analytics_events").insert(evt).select().single();
      if (!error && data) {
        const list = analyticsStore.get(evt.workspace_id) || [];
        list.unshift(data);
        analyticsStore.set(evt.workspace_id, list);
        return data;
      }
    } catch {}

    const list = analyticsStore.get(evt.workspace_id) || [];
    list.unshift(evt);
    analyticsStore.set(evt.workspace_id, list);
    return evt;
  }

  async getEvents(workspaceId: string): Promise<AnalyticsEventEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("analytics_events").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch {}

    return analyticsStore.get(workspaceId) || [];
  }
}
