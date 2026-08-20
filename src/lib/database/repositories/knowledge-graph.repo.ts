import { createClient } from "@/lib/supabase/server";

export type KGNodeType = "PROJECT" | "RESEARCH_RUN" | "SOURCE" | "EVIDENCE" | "CLAIM" | "KNOWLEDGE" | "CONTENT";
export type KGRelationshipType = "SUPPORTED_BY" | "DERIVED_FROM" | "CONFLICTS_WITH" | "SUPERSEDES" | "CONTESTED_BY" | "AFFECTS" | "USES";

export interface KGNodeEntity {
  id: string;
  project_id: string;
  node_type: KGNodeType;
  label: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface KGEdgeEntity {
  id: string;
  project_id: string;
  source_node_id: string;
  target_node_id: string;
  relationship_type: KGRelationshipType;
  metadata?: Record<string, any>;
  created_at?: string;
}

const globalKG = globalThis as unknown as {
  nodesStore: Map<string, KGNodeEntity[]> | undefined;
  edgesStore: Map<string, KGEdgeEntity[]> | undefined;
};
const nodesStore = globalKG.nodesStore ?? new Map<string, KGNodeEntity[]>();
const edgesStore = globalKG.edgesStore ?? new Map<string, KGEdgeEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalKG.nodesStore = nodesStore;
  globalKG.edgesStore = edgesStore;
}

export class KnowledgeGraphRepository {
  async getGraph(projectId?: string): Promise<{ nodes: KGNodeEntity[]; edges: KGEdgeEntity[] }> {
    try {
      const supabase = createClient();
      let nodesQuery = supabase.from("knowledge_graph_nodes").select("*");
      let edgesQuery = supabase.from("knowledge_graph_edges").select("*");
      if (projectId) {
        nodesQuery = nodesQuery.eq("project_id", projectId);
        edgesQuery = edgesQuery.eq("project_id", projectId);
      }

      const { data: nodesData } = await nodesQuery;
      const { data: edgesData } = await edgesQuery;

      if (nodesData && nodesData.length > 0) {
        return { nodes: nodesData, edges: edgesData || [] };
      }
    } catch {}

    const allNodes = Array.from(nodesStore.values()).flat();
    const allEdges = Array.from(edgesStore.values()).flat();

    if (projectId) {
      return {
        nodes: allNodes.filter((n) => n.project_id === projectId),
        edges: allEdges.filter((e) => e.project_id === projectId),
      };
    }
    return { nodes: allNodes, edges: allEdges };
  }

  async addNode(node: KGNodeEntity): Promise<KGNodeEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("knowledge_graph_nodes").upsert(node).select().single();
      if (!error && data) {
        const list = nodesStore.get(node.project_id) || [];
        list.push(data);
        nodesStore.set(node.project_id, list);
        return data;
      }
    } catch {}

    const list = nodesStore.get(node.project_id) || [];
    list.push(node);
    nodesStore.set(node.project_id, list);
    return node;
  }

  async addEdge(edge: KGEdgeEntity): Promise<KGEdgeEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("knowledge_graph_edges").upsert(edge).select().single();
      if (!error && data) {
        const list = edgesStore.get(edge.project_id) || [];
        list.push(data);
        edgesStore.set(edge.project_id, list);
        return data;
      }
    } catch {}

    const list = edgesStore.get(edge.project_id) || [];
    list.push(edge);
    edgesStore.set(edge.project_id, list);
    return edge;
  }
}
