import { createClient } from "@/lib/supabase/server";

export type IntegrationProvider = "YOUTUBE" | "SLACK" | "DISCORD" | "NOTION" | "GITHUB" | "GOOGLE_DRIVE";
export type IntegrationStatus = "CONNECTED" | "DISCONNECTED" | "ERROR" | "REAUTH_REQUIRED";

export interface IntegrationEntity {
  id: string;
  workspace_id: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  metadata?: Record<string, any>;
  connected_at?: string;
}

const globalIntegrations = globalThis as unknown as {
  integrationsStore: Map<string, IntegrationEntity[]> | undefined;
};
const integrationsStore = globalIntegrations.integrationsStore ?? new Map<string, IntegrationEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalIntegrations.integrationsStore = integrationsStore;
}

export class IntegrationsRepository {
  async getIntegrationsByWorkspace(workspaceId: string): Promise<IntegrationEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("integrations").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return integrationsStore.get(workspaceId) || [
      { id: "int-1", workspace_id: workspaceId, provider: "YOUTUBE", status: "CONNECTED", connected_at: new Date().toISOString() },
      { id: "int-2", workspace_id: workspaceId, provider: "SLACK", status: "DISCONNECTED" },
    ];
  }

  async saveIntegration(integ: IntegrationEntity): Promise<IntegrationEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("integrations").upsert(integ).select().single();
      if (!error && data) {
        const list = integrationsStore.get(integ.workspace_id) || [];
        const idx = list.findIndex((i) => i.id === data.id);
        if (idx >= 0) list[idx] = data;
        else list.push(data);
        integrationsStore.set(integ.workspace_id, list);
        return data;
      }
    } catch {}

    const list = integrationsStore.get(integ.workspace_id) || [];
    const idx = list.findIndex((i) => i.id === integ.id);
    if (idx >= 0) list[idx] = integ;
    else list.push(integ);
    integrationsStore.set(integ.workspace_id, list);
    return integ;
  }
}
