import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { CreatorExecutionProvider } from "@/lib/creator/execution/creator-execution.provider";
import { ScriptTrainingService } from "@/lib/creator/script-training.service";
import { DEFAULT_PRODUCTION_PREFERENCES } from "@/lib/creator/production-preferences.types";
import { ExecutionTriggerType } from "@/lib/creator/execution/creator-execution.types";

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

    const triggerType: ExecutionTriggerType = body.triggerType || 'MANUAL_CREATOR_REQUEST';
    const rootCause: string = body.rootCause || "Creator requested safe action execution.";
    const affectedClaimIds: string[] = Array.isArray(body.affectedClaimIds) ? body.affectedClaimIds : [];
    const targetAssetIds: string[] = Array.isArray(body.targetAssetIds) ? body.targetAssetIds : [];

    const plan = CreatorExecutionProvider.createPlan(
      run,
      report,
      triggerType,
      rootCause,
      affectedClaimIds,
      targetAssetIds,
      DEFAULT_PRODUCTION_PREFERENCES,
      profile,
      undefined,
      undefined,
      undefined,
      userId
    );

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
