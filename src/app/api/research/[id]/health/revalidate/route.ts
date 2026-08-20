import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { ResearchHealthProvider, RevalidationOptions } from "@/lib/research-health/research-health.provider";
import { ScriptTrainingService } from "@/lib/creator/script-training.service";
import { DEFAULT_PRODUCTION_PREFERENCES } from "@/lib/creator/production-preferences.types";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const options: RevalidationOptions = {
      mode: body.mode || 'AFFECTED_CLAIMS_ONLY',
      claimIds: body.claimIds,
      includePrimaryOEM: body.includePrimaryOEM !== false,
      includeIndependentLab: body.includeIndependentLab !== false,
      includeYouTubeConsensus: body.includeYouTubeConsensus !== false,
      includeHardwareBenchmarks: body.includeHardwareBenchmarks !== false,
    };

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const profile = ScriptTrainingService.getProfile(userId);

    let report = run.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(run, 12, DEFAULT_PRODUCTION_PREFERENCES, profile, "SCRIPT_READY");
    }

    // 1. Evaluate current health to generate fresh revalidation plan
    const initialHealth = ResearchHealthProvider.evaluateHealth(run, report, options);
    const plan = initialHealth.revalidationPlan;

    if (!plan || plan.items.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No revalidation actions required. Evidence and claims are already healthy.",
        healthReport: initialHealth,
      });
    }

    // 2. Execute revalidation plan
    const result = ResearchHealthProvider.executeRevalidation(run, plan);
    
    // 3. Update session in runstore
    ResearchEngine.setRun(result.updatedSession);

    // 4. Generate updated creator studio report and health report
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
      executedPlan: result.executedPlan,
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
