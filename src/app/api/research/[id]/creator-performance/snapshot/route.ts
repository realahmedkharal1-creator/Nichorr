import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { CreatorProjectProvider } from "@/lib/creator/project/creator-project.provider";
import { PerformanceProvider } from "@/lib/creator/performance/performance.provider";
import { ScriptTrainingService } from "@/lib/creator/script-training.service";
import { DEFAULT_PRODUCTION_PREFERENCES } from "@/lib/creator/production-preferences.types";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const profile = ScriptTrainingService.getProfile(userId);
    const body = await req.json().catch(() => ({}));

    let report = run.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(run, 12, DEFAULT_PRODUCTION_PREFERENCES, profile, "SCRIPT_READY");
      run.creatorStudio = report;
      ResearchEngine.setRun(run);
    }

    const snapshot = CreatorProjectProvider.getProjectSnapshot(
      run,
      report,
      DEFAULT_PRODUCTION_PREFERENCES,
      profile
    );

    const platform = body.platform || "YOUTUBE_LONG_FORM";
    const contentIdentifier = body.contentIdentifier || `video-${run.id}`;
    const measurementWindow = body.measurementWindow || "FIRST_48_HOURS";
    const publicationTimestamp = body.publicationTimestamp || new Date().toISOString();

    const metrics = body.metrics || {
      views: { name: "Views", value: 12500, availability: "AVAILABLE" },
      averagePercentageViewed: { name: "Average % Viewed", value: 58, unit: "%", availability: "AVAILABLE" },
      ctr: { name: "Click-Through Rate", value: 7.2, unit: "%", availability: "AVAILABLE" },
      watchTimeHours: { name: "Watch Time", value: 1450, unit: "hrs", availability: "AVAILABLE" },
      likes: { name: "Likes", value: 890, availability: "AVAILABLE" },
      comments: { name: "Comments", value: 142, availability: "AVAILABLE" },
    };

    const perfSnapshot = PerformanceProvider.recordSnapshot(
      run.id,
      snapshot.snapshotHash,
      snapshot.evidenceSnapshotHash,
      report.scriptVersion || 1,
      platform,
      contentIdentifier,
      measurementWindow,
      publicationTimestamp,
      metrics,
      body.certificationCertificateId,
      body.distributionPackageId,
      userId
    );

    return NextResponse.json({
      success: true,
      snapshot: perfSnapshot,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to record performance snapshot" }, { status: 500 });
  }
}
