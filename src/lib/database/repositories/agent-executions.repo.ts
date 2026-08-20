import { createClient } from "@/lib/supabase/server";

export type AgentType = "DISCOVERY" | "VERIFICATION" | "CONTRADICTION" | "FRESHNESS" | "SOURCE_QUALITY" | "KNOWLEDGE" | "CREATOR_INTELLIGENCE";
export type AgentExecutionStatus = "QUEUED" | "PLANNING" | "RUNNING" | "WAITING_EVIDENCE" | "WAITING_APPROVAL" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface AgentExecutionEntity {
  id: string;
  project_id: string;
  agent_type: AgentType;
  task_id: string;
  status: AgentExecutionStatus;
  confidence_score?: number;
  input_context?: Record<string, any>;
  output_result?: Record<string, any>;
  resource_usage?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

const globalAgents = globalThis as unknown as {
  agentsStore: Map<string, AgentExecutionEntity[]> | undefined;
};
const agentsStore = globalAgents.agentsStore ?? new Map<string, AgentExecutionEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalAgents.agentsStore = agentsStore;
}

export class AgentExecutionsRepository {
  async getExecutions(projectId?: string): Promise<AgentExecutionEntity[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("agent_executions").select("*").order("created_at", { ascending: false });
      if (projectId) query = query.eq("project_id", projectId);

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {}

    const all = Array.from(agentsStore.values()).flat();
    if (projectId) return all.filter((a) => a.project_id === projectId);
    return all;
  }

  async saveExecution(exec: AgentExecutionEntity): Promise<AgentExecutionEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("agent_executions").upsert(exec).select().single();
      if (!error && data) {
        const list = agentsStore.get(exec.project_id) || [];
        const idx = list.findIndex((a) => a.id === data.id);
        if (idx >= 0) list[idx] = data;
        else list.unshift(data);
        agentsStore.set(exec.project_id, list);
        return data;
      }
    } catch {}

    const list = agentsStore.get(exec.project_id) || [];
    const idx = list.findIndex((a) => a.id === exec.id);
    if (idx >= 0) list[idx] = exec;
    else list.unshift(exec);
    agentsStore.set(exec.project_id, list);
    return exec;
  }

  async cancelExecution(id: string): Promise<boolean> {
    try {
      const supabase = createClient();
      await supabase.from("agent_executions").update({ status: "CANCELLED", updated_at: new Date().toISOString() }).eq("id", id);
    } catch {}

    for (const list of agentsStore.values()) {
      const target = list.find((a) => a.id === id);
      if (target) {
        target.status = "CANCELLED";
        target.updated_at = new Date().toISOString();
        return true;
      }
    }
    return false;
  }
}
