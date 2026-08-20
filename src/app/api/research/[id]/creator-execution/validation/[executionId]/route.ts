import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { CreatorExecutionProvider } from "@/lib/creator/execution/creator-execution.provider";
import { ScriptTrainingService } from "@/lib/creator/script-training.service";
import { DEFAULT_PRODUCTION_PREFERENCES } from "@/lib/creator/production-preferences.types";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; executionId: string } }
) {
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

    const plan = CreatorExecutionProvider.getActivePlan(run.id, userId);
    const staged = CreatorExecutionProvider.getStagedExecution(run.id, userId);

    if (!staged || !plan) {
      return NextResponse.json({ success: false, error: "Staged execution not found" }, { status: 404 });
    }

    const validationResult = CreatorExecutionProvider.validateExecution(
      run,
      report,
      staged,
      plan,
      userId
    );

    return NextResponse.json({
      success: true,
      validation: validationResult.report,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
