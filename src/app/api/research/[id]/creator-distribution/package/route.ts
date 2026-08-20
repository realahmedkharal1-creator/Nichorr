import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { PublishingProvider } from "@/lib/creator/publishing/publishing.provider";
import { ResearchHealthProvider } from "@/lib/research-health/research-health.provider";
import { DistributionProvider } from "@/lib/creator/distribution/distribution.provider";
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
    const { preferences, packageVersion, parentPackageVersion } = body;

    const profile = ScriptTrainingService.getProfile(userId);
    let report = run.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(run, 12, preferences || DEFAULT_PRODUCTION_PREFERENCES, profile, "SCRIPT_READY");
      run.creatorStudio = report;
      ResearchEngine.setRun(run);
    }

    const preflight = PublishingProvider.runPreflight(run, report, preferences || DEFAULT_PRODUCTION_PREFERENCES);
    const healthReport = ResearchHealthProvider.evaluateHealth(run, report);

    const distPackage = DistributionProvider.generatePackage(
      run,
      report,
      preflight,
      healthReport,
      preferences || DEFAULT_PRODUCTION_PREFERENCES,
      userId,
      packageVersion || 1,
      parentPackageVersion
    );

    return NextResponse.json({
      success: true,
      distributionPackage: distPackage,
      readiness: distPackage.readinessReport,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
