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
    const { action, preferences } = body;

    if (!action || !action.actionType) {
      return NextResponse.json({ success: false, error: "Missing required action payload" }, { status: 400 });
    }

    const profile = ScriptTrainingService.getProfile(userId);
    let report = run.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(run, 12, preferences || DEFAULT_PRODUCTION_PREFERENCES, profile, "SCRIPT_READY");
    }

    const { updatedSession, updatedReport, actionResult } = await ResearchHealthDecisionProvider.executeAction(
      run,
      report,
      action,
      userId,
      preferences || DEFAULT_PRODUCTION_PREFERENCES
    );

    // Save updated session in run store
    ResearchEngine.setRun(updatedSession);
    if (updatedReport) {
      updatedSession.creatorStudio = updatedReport;
      ResearchEngine.setRun(updatedSession);
    }

    const healthReport = ResearchHealthProvider.evaluateHealth(updatedSession, updatedReport);
    const decisionReport = ResearchHealthDecisionProvider.evaluateDecisions(updatedSession, healthReport, updatedReport, userId);

    return NextResponse.json({
      success: true,
      actionResult,
      updatedReport,
      healthReport,
      decisionReport,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
