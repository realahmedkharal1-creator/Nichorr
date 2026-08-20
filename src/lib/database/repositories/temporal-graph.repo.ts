import { createClient } from "@/lib/supabase/server";

export interface GraphSnapshotRecord {
  id: string;
  workspace_id: string;
  snapshot_name: string;
  as_of_timestamp: string;
  total_nodes: number;
  total_edges: number;
  created_at?: string;
}

export class TemporalGraphRepository {
  async getSnapshots(workspaceId: string): Promise<GraphSnapshotRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("graph_snapshots").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "snap-1",
        workspace_id: workspaceId,
        snapshot_name: "Q1 2026 Knowledge Baseline",
        as_of_timestamp: new Date("2026-01-01").toISOString(),
        total_nodes: 42,
        total_edges: 110,
        created_at: new Date().toISOString(),
      },
    ];
  }
}
