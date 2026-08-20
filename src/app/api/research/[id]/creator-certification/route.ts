import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { CreatorCertificationProvider } from "@/lib/creator/certification/creator-certification.provider";
import { ScriptTrainingService } from "@/lib/creator/script-training.service";
import { DEFAULT_PRODUCTION_PREFERENCES } from "@/lib/creator/production-preferences.types";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const profile = ScriptTrainingService.getProfile(userId);

    let report = run.creatorStudio;
    if (!report) {
      report = CreatorStudioProvider.generateReport(run, 12, DEFAULT_PRODUCTION_PREFERENCES, profile, "SCRIPT_READY");
      run.creatorStudio = report;
      ResearchEngine.setRun(run);
    }

    let certificate = CreatorCertificationProvider.getCertificate(run.id, userId);
    if (!certificate) {
      certificate = CreatorCertificationProvider.evaluateCertification(
        run,
        report,
        DEFAULT_PRODUCTION_PREFERENCES,
        profile,
        undefined,
        undefined,
        undefined,
        userId
      );
    }

    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to load project certificate" }, { status: 500 });
  }
}
