import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { ScriptQualityProvider } from "@/lib/creator/quality/script-quality.provider";
import { ScriptTrainingService } from "@/lib/creator/script-training.service";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const profile = ScriptTrainingService.getProfile(userId);

    // Ensure report exists
    let report = run.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(run, 12, undefined, profile);
      run.creatorStudio = report;
      ResearchEngine.setRun(run);
    }

    const qualityReview = report.qualityReview || ScriptQualityProvider.review(run, report, profile);
    report.qualityReview = qualityReview;

    return NextResponse.json({
      success: true,
      qualityReview,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
