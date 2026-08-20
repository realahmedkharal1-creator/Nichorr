import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine, ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { ResearchChangesProvider } from "@/lib/creator/changes/research-changes.provider";
import { DEFAULT_PRODUCTION_PREFERENCES, CreatorProductionPreferences } from "@/lib/creator/production-preferences.types";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentRun = await ResearchEngine.getRunAsync(params.id);
    if (!currentRun) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const { updatedSession, preferences } = body;

    let report = currentRun.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(currentRun, 12, preferences || DEFAULT_PRODUCTION_PREFERENCES);
      currentRun.creatorStudio = report;
      ResearchEngine.setRun(currentRun);
    }

    const sessionToCompare: ResearchRunSession = updatedSession || currentRun;

    const impactReport = ResearchChangesProvider.detectAndEvaluateChanges(
      currentRun,
      sessionToCompare,
      report,
      preferences || DEFAULT_PRODUCTION_PREFERENCES
    );

    return NextResponse.json({
      success: true,
      impactReport,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
