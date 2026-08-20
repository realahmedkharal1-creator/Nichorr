import { NextResponse } from "next/server";
import { EpistemicContractFormatter } from "@/lib/developer/epistemic-contract-formatter";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json({ success: false, error: "Missing required query parameter: q" }, { status: 400 });
    }

    const results = [
      {
        id: "claim-sub-path-1",
        title: "Sub-path Distillation Edge Optimization",
        summary: "Reduces latency by 42% on edge TPU acceleration.",
        confidence: 98.5,
      },
    ];

    const response = EpistemicContractFormatter.formatResponse(results, `req_search_${Date.now()}`, "SUPPORTED");
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
