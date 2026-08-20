import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({
      success: true,
      source: {
        id: params.id,
        name: "Enterprise Slack Intelligence Webhook",
        source_type: "WEBHOOK",
        trust_level: "ENTERPRISE_TRUSTED",
        status: "ACTIVE",
        metrics: {
          eventsReceived: 1420,
          eventsProcessed: 1420,
          duplicatesSuppressed: 18,
          healthStatus: "HEALTHY",
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
