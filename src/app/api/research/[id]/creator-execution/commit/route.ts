import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { CreatorProjectProvider } from "@/lib/creator/project/creator-project.provider";
import { CreatorExecutionProvider } from "@/lib/creator/execution/creator-execution.provider";
import { ScriptTrainingService } from "@/lib/creator/script-training.service";
import { DEFAULT_PRODUCTION_PREFERENCES } from "@/lib/creator/production-preferences.types";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const profile = ScriptTrainingService.getProfile(userId);
    const body = await req.json().catch(() => ({}));

    let report = run.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(run, 12, DEFAULT_PRODUCTION_PREFERENCES, profile, "SCRIPT_READY");
      run.creatorStudio = report;
      ResearchEngine.setRun(run);
    }

    const planId = body.planId;
    const plan = planId ? CreatorExecutionProvider.getPlan(planId, userId) : CreatorExecutionProvider.getActivePlan(run.id, userId);
    const staged = CreatorExecutionProvider.getStagedExecution(run.id, userId);

    if (!plan || !staged) {
      return NextResponse.json({ success: false, error: "Validated staged execution not found" }, { status: 404 });
    }

    const snapshot = CreatorProjectProvider.getProjectSnapshot(
      run,
      report,
      DEFAULT_PRODUCTION_PREFERENCES,
      profile
    );

    const result = CreatorExecutionProvider.commitExecution(
      run,
      report,
      staged,
      plan,
      snapshot.snapshotHash,
      userId
    );

    if (!result.success || !result.committedReport) {
      return NextResponse.json({
        success: false,
        error: result.errorMessage,
        rebaseRequired: result.rebaseRequired,
      }, { status: 400 });
    }

    // Persist committed report to active run
    run.creatorStudio = result.committedReport;
    ResearchEngine.setRun(run);

    return NextResponse.json({
      success: true,
      committedScriptVersion: result.committedReport.scriptVersion,
      report: result.committedReport,
      message: `Script Version ${result.committedReport.scriptVersion} committed successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
