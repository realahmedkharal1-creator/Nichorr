import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { ResearchChangesProvider } from "@/lib/creator/changes/research-changes.provider";
import { ScriptTrainingService } from "@/lib/creator/script-training.service";
import { DEFAULT_PRODUCTION_PREFERENCES, CreatorProductionPreferences } from "@/lib/creator/production-preferences.types";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const { changeSet, targetAssetIds, preferences, parentVersionNumber } = body;

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const profile = ScriptTrainingService.getProfile(userId);

    let report = run.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(run, 12, preferences || DEFAULT_PRODUCTION_PREFERENCES, profile);
      run.creatorStudio = report;
      ResearchEngine.setRun(run);
    }

    const currentChangeSet = changeSet || ResearchChangesProvider.detectAndEvaluateChanges(null, run, report, preferences || DEFAULT_PRODUCTION_PREFERENCES).changeSet;

    const result = ResearchChangesProvider.regenerateAffectedAssets(
      run,
      report,
      currentChangeSet,
      targetAssetIds,
      preferences || DEFAULT_PRODUCTION_PREFERENCES,
      profile,
      parentVersionNumber || 1
    );

    run.creatorStudio = result.updatedReport;
    ResearchEngine.setRun(run);

    return NextResponse.json({
      success: true,
      updatedReport: result.updatedReport,
      newScriptVersion: result.newScriptVersion,
      regeneratedAssetIds: result.regeneratedAssetIds,
      summaryMessage: result.summaryMessage,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
