import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { TargetVideoDuration, ScriptOutputMode } from "@/lib/creator/creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "@/lib/creator/production-preferences.types";
import { ScriptTrainingService } from "@/lib/creator/script-training.service";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const durationParam = Number(searchParams.get("duration"));
    const targetDuration: TargetVideoDuration = (durationParam === 8 || durationParam === 18) ? durationParam : 12;
    const modeParam = searchParams.get("mode") as ScriptOutputMode;
    const outputMode: ScriptOutputMode = (modeParam === "OUTLINE" || modeParam === "FULL_NARRATION") ? modeParam : "SCRIPT_READY";
    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const profile = ScriptTrainingService.getProfile(userId);

    // If report already cached with same duration, mode, and no training profile override
    if (run.creatorStudio && run.creatorStudio.targetDurationMinutes === targetDuration && run.creatorStudio.outputMode === outputMode && !profile) {
      return NextResponse.json({ success: true, creatorStudio: run.creatorStudio });
    }

    // Generate report for requested duration and preferences
    const report = CreatorStudioProvider.generateReport(run, targetDuration, DEFAULT_PRODUCTION_PREFERENCES, profile, outputMode);
    run.creatorStudio = report;
    ResearchEngine.setRun(run);

    return NextResponse.json({ success: true, creatorStudio: report });
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
    const targetDuration: TargetVideoDuration = (body.duration === 8 || body.duration === 18) ? body.duration : 12;
    const outputMode: ScriptOutputMode = (body.outputMode === "OUTLINE" || body.outputMode === "FULL_NARRATION") ? body.outputMode : "SCRIPT_READY";
    const preferences: CreatorProductionPreferences = {
      ...DEFAULT_PRODUCTION_PREFERENCES,
      ...(body.preferences || {}),
    };
    const userId = body.userId || req.headers.get("x-user-id") || "anonymous-creator";
    const profile = body.profile || ScriptTrainingService.getProfile(userId);

    const report = CreatorStudioProvider.generateReport(run, targetDuration, preferences, profile, outputMode);
    run.creatorStudio = report;
    ResearchEngine.setRun(run);

    return NextResponse.json({ success: true, creatorStudio: report, preferences });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
