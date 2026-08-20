import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { ChangeReviewDecision } from "@/lib/creator/changes/research-changes.types";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const { changeSetId, action, note, targetAssetIds } = body;

    const userId = req.headers.get("x-user-id") || "anonymous-creator";

    const decision: ChangeReviewDecision = {
      decisionId: `dec-${params.id}-${Date.now()}`,
      changeSetId: changeSetId || `chgset-${params.id}`,
      action: action || "REVIEWED",
      reviewedBy: userId,
      reviewedAt: new Date().toISOString(),
      note: note || `User chose ${action || "REVIEWED"}`,
      targetAssetIds,
    };

    return NextResponse.json({
      success: true,
      decision,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
