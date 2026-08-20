import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorPublishingProvider } from "@/lib/creator/publishing/creator-publishing.provider";
import { CreatorPublishingPreflightEngine } from "@/lib/creator/publishing/publishing.preflight";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const body = await req.json().catch(() => ({}));
    const plan = CreatorPublishingProvider.getPublishingPlan(run.id, userId);

    const target = plan.targets.find((t) => t.targetId === body.targetId) || plan.targets[0];
    if (!target) {
      return NextResponse.json({ success: false, error: "No target specified or found." }, { status: 404 });
    }

    const preflight = CreatorPublishingPreflightEngine.runPreflight(target.targetId, target.platform, target, {
      projectSnapshotHash: plan.projectSnapshotHash,
      expectedProjectSnapshotHash: body.expectedProjectSnapshotHash,
      evidenceSnapshotHash: plan.evidenceSnapshotHash,
      expectedEvidenceSnapshotHash: body.expectedEvidenceSnapshotHash,
      scriptVersion: plan.scriptVersion,
      expectedScriptVersion: body.expectedScriptVersion,
      timelineFingerprint: plan.timelineFingerprint,
      expectedTimelineFingerprint: body.expectedTimelineFingerprint,
      certificationCertificateId: plan.certificationCertificateId,
      isCertificationValid: body.isCertificationValid !== false,
      releaseLockId: plan.releaseLockId,
      isReleaseLockValid: body.isReleaseLockValid !== false,
      exportPackageId: plan.exportPackageId,
      exportPackageSnapshotHash: plan.exportPackageSnapshotHash,
      expectedPackageSnapshotHash: body.expectedPackageSnapshotHash,
      isExportPackageValid: body.isExportPackageValid !== false,
      activeBlockers: body.activeBlockers || [],
    });

    target.preflightResult = preflight;
    target.status = preflight.status === "BLOCKED" ? "PREFLIGHT_BLOCKED" : "PREFLIGHT_PASSED";

    return NextResponse.json({
      success: true,
      preflight,
      target,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to run preflight" }, { status: 500 });
  }
}
