import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { ResearchHealthProvider } from "@/lib/research-health/research-health.provider";
import { ResearchHealthDecisionProvider } from "@/lib/research-health/decision/research-health-decision.provider";
import { ScriptTrainingService } from "@/lib/creator/script-training.service";
import { DEFAULT_PRODUCTION_PREFERENCES } from "@/lib/creator/production-preferences.types";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const body = await req.json().catch(() => ({}));
    const { decisionId, decisionType, action, note, targetClaimIds, targetAssetIds } = body;

    if (!decisionId || !action) {
      return NextResponse.json({ success: false, error: "Missing decisionId or action" }, { status: 400 });
    }

    const recorded = ResearchHealthDecisionProvider.recordUserReview(
      run,
      decisionId,
      decisionType || 'REVALIDATE_CLAIM',
      action,
      note,
      userId,
      targetClaimIds,
      targetAssetIds
    );

    const profile = ScriptTrainingService.getProfile(userId);
    let report = run.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(run, 12, DEFAULT_PRODUCTION_PREFERENCES, profile, "SCRIPT_READY");
    }

    const healthReport = ResearchHealthProvider.evaluateHealth(run, report);
    const decisionReport = ResearchHealthDecisionProvider.evaluateDecisions(run, healthReport, report, userId);

    return NextResponse.json({
      success: true,
      decisionRecord: recorded,
      decisionReport,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
