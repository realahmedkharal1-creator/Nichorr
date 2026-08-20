import { NextResponse } from "next/server";
import { WebhooksRepository } from "@/lib/database/repositories/webhooks.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new WebhooksRepository();
    const endpoints = await repo.getEndpointsByWorkspace(workspaceId);
    return NextResponse.json({ success: true, endpoints });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, url, events, endpointId, eventType, payload } = body;
    const repo = new WebhooksRepository();

    if (action === "TEST_DELIVERY") {
      const delivery = await repo.recordDelivery({
        id: `del-${Date.now()}`,
        endpoint_id: endpointId || "ep-1",
        event_type: eventType || "research.completed",
        payload: payload || { test: true },
        status: "DELIVERED",
        response_code: 200,
        attempt_count: 1,
        delivered_at: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, delivery });
    }

    if (!url) {
      return NextResponse.json({ success: false, error: "url is required" }, { status: 400 });
    }

    const endpoint = await repo.saveEndpoint({
      id: `ep-${Date.now()}`,
      workspace_id: "ws-primary-default",
      url,
      secret: `whsec_${Math.random().toString(36).substring(2)}`,
      events: events || ["research.completed", "knowledge.updated"],
      is_active: true,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, endpoint });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
