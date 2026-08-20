import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { ResearchHealthProvider } from "@/lib/research-health/research-health.provider";
import { ScriptTrainingService } from "@/lib/creator/script-training.service";
import { DEFAULT_PRODUCTION_PREFERENCES } from "@/lib/creator/production-preferences.types";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const claimId = body.claimId;

    if (!claimId) {
      return NextResponse.json({ success: false, error: "Missing required claimId parameter" }, { status: 400 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const profile = ScriptTrainingService.getProfile(userId);

    let report = run.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(run, 12, DEFAULT_PRODUCTION_PREFERENCES, profile, "SCRIPT_READY");
    }

    const result = ResearchHealthProvider.revalidateSingleClaim(run, claimId, report);
    ResearchEngine.setRun(result.updatedSession);

    const updatedReport = CreatorStudioProvider.generateReport(
      result.updatedSession,
      report.targetDurationMinutes || 12,
      DEFAULT_PRODUCTION_PREFERENCES,
      profile,
      report.outputMode || "SCRIPT_READY"
    );
    result.updatedSession.creatorStudio = updatedReport;
    ResearchEngine.setRun(result.updatedSession);

    const updatedHealth = ResearchHealthProvider.evaluateHealth(result.updatedSession, updatedReport);

    return NextResponse.json({
      success: true,
      summaryMessage: result.summaryMessage,
      auditEvents: result.auditEvents,
      previousSnapshotHash: result.previousSnapshotHash,
      newSnapshotHash: result.newSnapshotHash,
      healthReport: updatedHealth,
      updatedReport,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
