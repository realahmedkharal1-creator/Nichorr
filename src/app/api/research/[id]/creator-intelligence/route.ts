import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorIntelligenceProvider } from "@/lib/creator/intelligence/creator-intelligence.provider";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const snapshots = CreatorIntelligenceProvider.getIngestionSnapshots(run.id, userId);
    const latestSnapshot = CreatorIntelligenceProvider.getLatestSnapshot(run.id, userId);
    const latestSynthesis = CreatorIntelligenceProvider.getLatestSynthesis(run.id, userId);
    const insights = CreatorIntelligenceProvider.getInsights(run.id, userId);
    const history = CreatorIntelligenceProvider.getHistory(run.id, userId);

    return NextResponse.json({
      success: true,
      researchRunId: run.id,
      latestSnapshot,
      snapshots,
      latestSynthesis,
      insights,
      history,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to load creator intelligence" }, { status: 500 });
  }
}
