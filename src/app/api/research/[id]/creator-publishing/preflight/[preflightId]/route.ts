import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorPublishingProvider } from "@/lib/creator/publishing/creator-publishing.provider";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; preflightId: string } }
) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const plan = CreatorPublishingProvider.getPublishingPlan(run.id, userId);

    const target = plan.targets.find((t) => t.preflightResult?.preflightId === params.preflightId);
    if (!target || !target.preflightResult) {
      return NextResponse.json({ success: false, error: "Preflight record not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      preflight: target.preflightResult,
      target,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to load preflight" }, { status: 500 });
  }
}
