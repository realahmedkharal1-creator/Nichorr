import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { ResearchCalibrationProvider } from "@/lib/creator/research-calibration/research-calibration.provider";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const candidates = ResearchCalibrationProvider.getCandidates(run.id, userId);

    return NextResponse.json({
      success: true,
      candidates,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to load candidates" }, { status: 500 });
  }
}
