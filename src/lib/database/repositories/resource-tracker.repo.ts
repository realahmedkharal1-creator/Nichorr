import { createClient } from "@/lib/supabase/server";

export interface ResourceUsageLogEntity {
  id: string;
  project_id: string;
  agent_type: string;
  model_name?: string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost_usd: number;
  execution_time_ms: number;
  created_at?: string;
}

const globalUsage = globalThis as unknown as {
  usageStore: Map<string, ResourceUsageLogEntity[]> | undefined;
};
const usageStore = globalUsage.usageStore ?? new Map<string, ResourceUsageLogEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalUsage.usageStore = usageStore;
}

export class ResourceTrackerRepository {
  async logUsage(log: ResourceUsageLogEntity): Promise<ResourceUsageLogEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("resource_usage_logs").insert(log).select().single();
      if (!error && data) {
        const list = usageStore.get(log.project_id) || [];
        list.unshift(data);
        usageStore.set(log.project_id, list);
        return data;
      }
    } catch {}

    const list = usageStore.get(log.project_id) || [];
    list.unshift(log);
    usageStore.set(log.project_id, list);
    return log;
  }

  async getUsageSummary(projectId?: string): Promise<{
    totalInputTokens: number;
    totalOutputTokens: number;
    totalCostUSD: number;
    totalExecutionTimeMs: number;
    logs: ResourceUsageLogEntity[];
  }> {
    try {
      const supabase = createClient();
      let query = supabase.from("resource_usage_logs").select("*").order("created_at", { ascending: false });
      if (projectId) query = query.eq("project_id", projectId);

      const { data } = await query;
      if (data && data.length > 0) {
        const totalInputTokens = data.reduce((acc, l) => acc + (l.input_tokens || 0), 0);
        const totalOutputTokens = data.reduce((acc, l) => acc + (l.output_tokens || 0), 0);
        const totalCostUSD = data.reduce((acc, l) => acc + (Number(l.estimated_cost_usd) || 0), 0);
        const totalExecutionTimeMs = data.reduce((acc, l) => acc + (l.execution_time_ms || 0), 0);
        return { totalInputTokens, totalOutputTokens, totalCostUSD, totalExecutionTimeMs, logs: data };
      }
    } catch {}

    const all = Array.from(usageStore.values()).flat();
    const filtered = projectId ? all.filter((l) => l.project_id === projectId) : all;
    const totalInputTokens = filtered.reduce((acc, l) => acc + (l.input_tokens || 0), 0);
    const totalOutputTokens = filtered.reduce((acc, l) => acc + (l.output_tokens || 0), 0);
    const totalCostUSD = filtered.reduce((acc, l) => acc + (Number(l.estimated_cost_usd) || 0), 0);
    const totalExecutionTimeMs = filtered.reduce((acc, l) => acc + (l.execution_time_ms || 0), 0);

    return { totalInputTokens, totalOutputTokens, totalCostUSD, totalExecutionTimeMs, logs: filtered };
  }
}
