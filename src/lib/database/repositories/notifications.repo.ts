import { createClient } from "@/lib/supabase/server";

export interface NotificationEntity {
  id: string;
  user_id?: string;
  project_id: string;
  type: "INFORMATIONAL" | "WARNING" | "IMPORTANT" | "CRITICAL";
  title: string;
  message: string;
  target_url?: string;
  is_read: boolean;
  created_at?: string;
}

const globalNotifs = globalThis as unknown as {
  notifsStore: Map<string, NotificationEntity[]> | undefined;
};
const notifsStore = globalNotifs.notifsStore ?? new Map<string, NotificationEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalNotifs.notifsStore = notifsStore;
}

export class NotificationsRepository {
  async getNotifications(projectId?: string): Promise<NotificationEntity[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("notifications").select("*").order("created_at", { ascending: false });
      if (projectId) query = query.eq("project_id", projectId);

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {}

    const all = Array.from(notifsStore.values()).flat();
    if (projectId) return all.filter((n) => n.project_id === projectId);
    return all;
  }

  async saveNotification(notif: NotificationEntity): Promise<NotificationEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("notifications").insert(notif).select().single();
      if (!error && data) {
        const list = notifsStore.get(notif.project_id) || [];
        list.unshift(data);
        notifsStore.set(notif.project_id, list);
        return data;
      }
    } catch {}

    const list = notifsStore.get(notif.project_id) || [];
    list.unshift(notif);
    notifsStore.set(notif.project_id, list);
    return notif;
  }

  async markAsRead(id: string): Promise<boolean> {
    try {
      const supabase = createClient();
      await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    } catch {}

    for (const list of notifsStore.values()) {
      const target = list.find((n) => n.id === id);
      if (target) {
        target.is_read = true;
        return true;
      }
    }
    return false;
  }
}
