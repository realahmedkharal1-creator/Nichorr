import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { CreatorProjectProvider } from "@/lib/creator/project/creator-project.provider";
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
    const { targetNodeType, targetNodeId, simulationAction, preferences } = body;

    if (!targetNodeType || !targetNodeId) {
      return NextResponse.json({
        success: false,
        error: "Missing required parameters: targetNodeType and targetNodeId are mandatory for simulation.",
      }, { status: 400 });
    }

    const profile = ScriptTrainingService.getProfile(userId);
    let report = run.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(run, 12, preferences || DEFAULT_PRODUCTION_PREFERENCES, profile, "SCRIPT_READY");
      run.creatorStudio = report;
      ResearchEngine.setRun(run);
    }

    const preview = CreatorProjectProvider.simulateImpact(
      run,
      report,
      targetNodeType,
      targetNodeId,
      simulationAction || "VALUE_CHANGED",
      preferences || DEFAULT_PRODUCTION_PREFERENCES
    );

    return NextResponse.json({
      success: true,
      simulation: preview,
      willChange: preview.willChange,
      mayChange: preview.mayChange,
      willRemainUnchanged: preview.willRemainUnchanged,
      blocked: preview.blocked,
      expectedConsequences: preview.expectedConsequences,
      summary: preview.summary,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
