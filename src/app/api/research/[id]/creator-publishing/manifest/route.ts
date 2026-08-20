import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { PublishingProvider } from "@/lib/creator/publishing/publishing.provider";
import { ScriptTrainingService } from "@/lib/creator/script-training.service";
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

    const preflight = PublishingProvider.runPreflight(
      run,
      report,
      DEFAULT_PRODUCTION_PREFERENCES,
      profile
    );

    const manifest = PublishingProvider.buildManifest(
      run,
      report,
      preflight,
      DEFAULT_PRODUCTION_PREFERENCES
    );

    return NextResponse.json({
      success: true,
      manifest,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
