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
    const signals = PerformanceProvider.getAudienceSignals(run.id, userId);

    return NextResponse.json({
      success: true,
      researchRunId: run.id,
      signals,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to load audience signals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const body = await req.json().catch(() => ({}));

    if (!body.commentText) {
      return NextResponse.json({ success: false, error: "commentText is required" }, { status: 400 });
    }

    const signal = PerformanceProvider.logAudienceComment(
      body.commentText,
      run.id,
      userId,
      body.associatedSectionId
    );

    return NextResponse.json({
      success: true,
      signal,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to log audience comment" }, { status: 500 });
  }
}
