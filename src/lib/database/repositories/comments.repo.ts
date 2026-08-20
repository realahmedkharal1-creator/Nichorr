import { createClient } from "@/lib/supabase/server";

export interface CommentEntity {
  id: string;
  workspace_id: string;
  project_id?: string;
  target_type: string; // 'CLAIM', 'EVIDENCE', 'SOURCE', 'KNOWLEDGE', 'CONTENT', 'SCRIPT'
  target_id: string;
  author_id?: string;
  author_name: string;
  text: string;
  is_resolved: boolean;
  resolved_by?: string;
  created_at?: string;
}

const globalComments = globalThis as unknown as {
  commentsStore: Map<string, CommentEntity[]> | undefined;
};
const commentsStore = globalComments.commentsStore ?? new Map<string, CommentEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalComments.commentsStore = commentsStore;
}

export class CommentsRepository {
  async getComments(targetType: string, targetId: string): Promise<CommentEntity[]> {
    const key = `${targetType}:${targetId}`;
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("target_type", targetType)
        .eq("target_id", targetId)
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) return data;
    } catch {}

    return commentsStore.get(key) || [];
  }

  async addComment(comment: CommentEntity): Promise<CommentEntity> {
    const key = `${comment.target_type}:${comment.target_id}`;
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("comments").insert(comment).select().single();
      if (!error && data) {
        const list = commentsStore.get(key) || [];
        list.push(data);
        commentsStore.set(key, list);
        return data;
      }
    } catch {}

    const list = commentsStore.get(key) || [];
    list.push(comment);
    commentsStore.set(key, list);
    return comment;
  }

  async resolveComment(id: string, resolvedBy?: string): Promise<boolean> {
    try {
      const supabase = createClient();
      await supabase.from("comments").update({ is_resolved: true, resolved_by: resolvedBy }).eq("id", id);
    } catch {}

    for (const list of commentsStore.values()) {
      const target = list.find((c) => c.id === id);
      if (target) {
        target.is_resolved = true;
        target.resolved_by = resolvedBy;
        return true;
      }
    }
    return false;
  }
}
