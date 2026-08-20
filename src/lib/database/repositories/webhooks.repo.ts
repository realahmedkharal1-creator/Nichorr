import { createClient } from "@/lib/supabase/server";

export interface WebhookEndpointEntity {
  id: string;
  workspace_id: string;
  url: string;
  secret: string;
  events: string[];
  is_active: boolean;
  created_at?: string;
}

export interface WebhookDeliveryEntity {
  id: string;
  endpoint_id: string;
  event_type: string;
  payload: Record<string, any>;
  status: "DELIVERED" | "FAILED" | "RETRYING";
  response_code?: number;
  attempt_count: number;
  delivered_at?: string;
}

const globalWebhooks = globalThis as unknown as {
  endpointsStore: Map<string, WebhookEndpointEntity[]> | undefined;
  deliveriesStore: Map<string, WebhookDeliveryEntity[]> | undefined;
};
const endpointsStore = globalWebhooks.endpointsStore ?? new Map<string, WebhookEndpointEntity[]>();
const deliveriesStore = globalWebhooks.deliveriesStore ?? new Map<string, WebhookDeliveryEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalWebhooks.endpointsStore = endpointsStore;
  globalWebhooks.deliveriesStore = deliveriesStore;
}

export class WebhooksRepository {
  async getEndpointsByWorkspace(workspaceId: string): Promise<WebhookEndpointEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("webhook_endpoints").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return endpointsStore.get(workspaceId) || [];
  }

  async saveEndpoint(ep: WebhookEndpointEntity): Promise<WebhookEndpointEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("webhook_endpoints").insert(ep).select().single();
      if (!error && data) {
        const list = endpointsStore.get(ep.workspace_id) || [];
        list.push(data);
        endpointsStore.set(ep.workspace_id, list);
        return data;
      }
    } catch {}

    const list = endpointsStore.get(ep.workspace_id) || [];
    list.push(ep);
    endpointsStore.set(ep.workspace_id, list);
    return ep;
  }

  async recordDelivery(del: WebhookDeliveryEntity): Promise<WebhookDeliveryEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("webhook_deliveries").insert(del).select().single();
      if (!error && data) {
        const list = deliveriesStore.get(del.endpoint_id) || [];
        list.unshift(data);
        deliveriesStore.set(del.endpoint_id, list);
        return data;
      }
    } catch {}

    const list = deliveriesStore.get(del.endpoint_id) || [];
    list.unshift(del);
    deliveriesStore.set(del.endpoint_id, list);
    return del;
  }
}
