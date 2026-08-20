import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorIntelligenceProvider } from "@/lib/creator/intelligence/creator-intelligence.provider";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const body = await req.json().catch(() => ({}));

    const platform = body.platform || "YOUTUBE";
    const rawData = body.data || {
      views: 18500,
      retention: 61,
      ctr: 7.8,
      watchTimeHours: 2100,
      likes: 1200,
      comments: 180,
    };

    const result = CreatorIntelligenceProvider.ingestPlatformData(
      userId,
      run.id,
      platform,
      rawData,
      body.measurementWindow || "FIRST_48_HOURS"
    );

    if (!result.success) {
      return NextResponse.json({ success: false, errors: result.errors, warnings: result.warnings }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      snapshot: result.snapshot,
      warnings: result.warnings,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to import platform data" }, { status: 500 });
  }
}
