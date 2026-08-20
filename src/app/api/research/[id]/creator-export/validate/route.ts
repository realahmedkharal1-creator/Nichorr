import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorExportProvider } from "@/lib/creator/export/creator-export.provider";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const body = await req.json().catch(() => ({}));

    const pkg = CreatorExportProvider.getExportPackage(run.id, userId);
    const report = CreatorExportProvider.validatePackage(pkg, {
      projectSnapshotHash: pkg.projectSnapshotHash,
      expectedProjectSnapshotHash: body.expectedProjectSnapshotHash,
      evidenceSnapshotHash: pkg.evidenceSnapshotHash,
      expectedEvidenceSnapshotHash: body.expectedEvidenceSnapshotHash,
      scriptVersion: pkg.scriptVersion,
      expectedScriptVersion: body.expectedScriptVersion,
      timelineFingerprint: pkg.timelineFingerprint,
      expectedTimelineFingerprint: body.expectedTimelineFingerprint,
      certificationCertificateId: pkg.certificationCertificateId,
      isCertificationValid: body.isCertificationValid !== false,
      activeBlockers: body.activeBlockers || [],
    });

    return NextResponse.json({
      success: true,
      report,
      package: pkg,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to validate export package" }, { status: 500 });
  }
}
