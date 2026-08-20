import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
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

    if (!plan) {
      return NextResponse.json({ success: false, error: "Approved execution plan not found" }, { status: 404 });
    }

    const result = CreatorExecutionProvider.stageExecution(
      run,
      report,
      plan,
      DEFAULT_PRODUCTION_PREFERENCES,
      profile,
      userId
    );

    if (!result.success || !result.stagedExecution) {
      return NextResponse.json({ success: false, error: result.errorMessage }, { status: 400 });
    }

    // Auto-run validation
    const validationResult = CreatorExecutionProvider.validateExecution(
      run,
      report,
      result.stagedExecution,
      plan,
      userId
    );

    return NextResponse.json({
      success: true,
      stagedExecution: result.stagedExecution,
      validation: validationResult.report,
      planStatus: plan.executionStatus,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
