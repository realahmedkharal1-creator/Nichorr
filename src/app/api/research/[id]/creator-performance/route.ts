import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { PerformanceProvider } from "@/lib/creator/performance/performance.provider";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const snapshots = PerformanceProvider.getSnapshots(run.id, userId);
    const latestSnapshot = PerformanceProvider.getLatestSnapshot(run.id, userId);
    const insights = PerformanceProvider.generateInsights(run.id, userId);
    const audienceSignals = PerformanceProvider.getAudienceSignals(run.id, userId);
    const experiments = PerformanceProvider.getExperiments(run.id, userId);
    const researchOpportunities = PerformanceProvider.getResearchOpportunities(run.id, userId);

    return NextResponse.json({
      success: true,
      researchRunId: run.id,
      latestSnapshot,
      snapshots,
      insights,
      audienceSignals,
      experiments,
      researchOpportunities,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to load performance intelligence" }, { status: 500 });
  }
}
