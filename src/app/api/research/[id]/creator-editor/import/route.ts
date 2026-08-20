import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { EditorIntegrationProvider } from "@/lib/creator/editor/editor-integration.provider";
import { DEFAULT_PRODUCTION_PREFERENCES, CreatorProductionPreferences } from "@/lib/creator/production-preferences.types";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const { content, format, fps } = body;

    if (!content || !format) {
      return NextResponse.json({ success: false, error: "Missing timeline content or format." }, { status: 400 });
    }

    const imported = EditorIntegrationProvider.importTimeline(content, format, fps || 24);

    let report = run.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(run, 12, DEFAULT_PRODUCTION_PREFERENCES);
      run.creatorStudio = report;
      ResearchEngine.setRun(run);
    }

    const syncPlan = EditorIntegrationProvider.generateSyncPlan(
      run,
      report,
      imported.markers,
      DEFAULT_PRODUCTION_PREFERENCES
    );

    return NextResponse.json({
      success: true,
      imported,
      syncPlan,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
