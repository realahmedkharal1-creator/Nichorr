import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({
      success: true,
      entity: {
        id: params.id,
        canonical_name: "Gemini 1.5 Flash",
        entity_type: "MODEL",
        description: "High-efficiency multimodal LLM optimized for low-latency inference.",
        confidence: 98.5,
        freshness_status: "FRESH",
        status: "CONFIRMED",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
