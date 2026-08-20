import { createClient } from "@/lib/supabase/server";

export interface WatchItemEntity {
  id: string;
  project_id: string;
  topic_or_entity: string;
  description?: string;
  freshness_interval_days: number;
  is_enabled: boolean;
  last_checked_at: string;
  next_check_due: string;
  changes_count: number;
  created_at?: string;
}

export interface AlertEntity {
  id: string;
  project_id: string;
  watch_item_id?: string;
  alert_type: "NEW_INFORMATION" | "CLAIM_CHANGED" | "CLAIM_CONTRADICTED" | "EVIDENCE_STALE" | "REVIEW_REQUIRED";
  title: string;
  message: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  is_read: boolean;
  is_resolved: boolean;
  created_at?: string;
}

const globalMonitoring = globalThis as unknown as {
  watchStore: Map<string, WatchItemEntity[]> | undefined;
  alertsStore: Map<string, AlertEntity[]> | undefined;
};
const watchStore = globalMonitoring.watchStore ?? new Map<string, WatchItemEntity[]>();
const alertsStore = globalMonitoring.alertsStore ?? new Map<string, AlertEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalMonitoring.watchStore = watchStore;
  globalMonitoring.alertsStore = alertsStore;
}

export class MonitoringRepository {
  async getWatchItems(projectId?: string): Promise<WatchItemEntity[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("watch_items").select("*").order("created_at", { ascending: false });
      if (projectId) query = query.eq("project_id", projectId);

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {}

    const all = Array.from(watchStore.values()).flat();
    if (projectId) return all.filter((w) => w.project_id === projectId);
    return all;
  }

  async createWatchItem(item: WatchItemEntity): Promise<WatchItemEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("watch_items").insert(item).select().single();
      if (!error && data) {
        const list = watchStore.get(item.project_id) || [];
        list.unshift(data);
        watchStore.set(item.project_id, list);
        return data;
      }
    } catch {}

    const list = watchStore.get(item.project_id) || [];
    list.unshift(item);
    watchStore.set(item.project_id, list);
    return item;
  }

  async getAlerts(projectId?: string): Promise<AlertEntity[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("alerts").select("*").order("created_at", { ascending: false });
      if (projectId) query = query.eq("project_id", projectId);

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {}

    const all = Array.from(alertsStore.values()).flat();
    if (projectId) return all.filter((a) => a.project_id === projectId);
    return all;
  }

  async createAlert(alert: AlertEntity): Promise<AlertEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("alerts").insert(alert).select().single();
      if (!error && data) {
        const list = alertsStore.get(alert.project_id) || [];
        list.unshift(data);
        alertsStore.set(alert.project_id, list);
        return data;
      }
    } catch {}

    const list = alertsStore.get(alert.project_id) || [];
    list.unshift(alert);
    alertsStore.set(alert.project_id, list);
    return alert;
  }

  async resolveAlert(alertId: string): Promise<boolean> {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("alerts").update({ is_resolved: true }).eq("id", alertId);
      if (!error) return true;
    } catch {}

    for (const [projId, list] of alertsStore.entries()) {
      const target = list.find((a) => a.id === alertId);
      if (target) {
        target.is_resolved = true;
        return true;
      }
    }
    return false;
  }
}
