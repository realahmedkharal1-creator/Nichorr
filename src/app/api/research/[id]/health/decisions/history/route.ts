import { NextRequest, NextResponse } from "next/server";
import { ResearchHealthDecisionProvider } from "@/lib/research-health/decision/research-health-decision.provider";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const history = ResearchHealthDecisionProvider.getHistory(params.id, userId);

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
