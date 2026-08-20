import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { CreatorWorkflowProvider } from "@/lib/creator/workflow/creator-workflow.provider";
import { ScriptTrainingService } from "@/lib/creator/script-training.service";
import { TargetVideoDuration, ScriptOutputMode } from "@/lib/creator/creator-studio.types";
import { DEFAULT_PRODUCTION_PREFERENCES, CreatorProductionPreferences } from "@/lib/creator/production-preferences.types";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const profile = ScriptTrainingService.getProfile(userId);

    let report = run.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(run, 12, DEFAULT_PRODUCTION_PREFERENCES, profile, "SCRIPT_READY");
      run.creatorStudio = report;
      ResearchEngine.setRun(run);
    }

    const readiness = CreatorWorkflowProvider.evaluateReadiness(
      run,
      report,
      undefined,
      DEFAULT_PRODUCTION_PREFERENCES,
      profile,
      report.targetDurationMinutes || 12,
      report.outputMode || "SCRIPT_READY"
    );

    return NextResponse.json({
      success: true,
      workflowState: readiness.readyToRecord ? "PRODUCTION_READY_FINAL" : "SCRIPT_READY",
      readiness,
      report,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const duration: TargetVideoDuration = (body.duration === 8 || body.duration === 18) ? body.duration : 12;
    const outputMode: ScriptOutputMode = (body.outputMode === "OUTLINE" || body.outputMode === "FULL_NARRATION") ? body.outputMode : "SCRIPT_READY";
    const preferences: CreatorProductionPreferences = {
      ...DEFAULT_PRODUCTION_PREFERENCES,
      ...(body.preferences || {}),
    };
    const userId = body.userId || req.headers.get("x-user-id") || "anonymous-creator";
    const profile = body.profile || ScriptTrainingService.getProfile(userId);

    const report = CreatorStudioProvider.generateReport(run, duration, preferences, profile, outputMode);
    run.creatorStudio = report;
    ResearchEngine.setRun(run);

    const readiness = CreatorWorkflowProvider.evaluateReadiness(
      run,
      report,
      undefined,
      preferences,
      profile,
      duration,
      outputMode
    );

    return NextResponse.json({
      success: true,
      workflowState: readiness.readyToRecord ? "PRODUCTION_READY_FINAL" : "SCRIPT_READY",
      readiness,
      report,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
