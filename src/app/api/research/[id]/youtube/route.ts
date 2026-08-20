import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { YouTubeIntelligenceEngine } from "@/lib/youtube/youtube.provider";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    if (run.youtubeIntelligence) {
      return NextResponse.json({ success: true, youtube: run.youtubeIntelligence });
    }

    // If not already analyzed during run, compute live YouTube intelligence
    const engine = new YouTubeIntelligenceEngine();
    const report = await engine.analyzeTopic(run.topic);
    run.youtubeIntelligence = report;
    ResearchEngine.setRun(run);

    return NextResponse.json({ success: true, youtube: report });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
