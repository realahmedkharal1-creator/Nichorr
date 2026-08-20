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
    const { plan, preferences } = body;

    let report = run.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(run, 12, preferences || DEFAULT_PRODUCTION_PREFERENCES);
      run.creatorStudio = report;
      ResearchEngine.setRun(run);
    }

    const currentPlan = plan || EditorIntegrationProvider.generateSyncPlan(run, report, undefined, preferences || DEFAULT_PRODUCTION_PREFERENCES);
    const result = EditorIntegrationProvider.applySync(run, report, currentPlan, preferences || DEFAULT_PRODUCTION_PREFERENCES);

    return NextResponse.json({
      success: true,
      snapshot: result.snapshot,
      auditRecord: result.auditRecord,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
