import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { ResearchCalibrationProvider } from "@/lib/creator/research-calibration/research-calibration.provider";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; calibrationId: string } }
) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const item = ResearchCalibrationProvider.getCalibrationById(params.calibrationId, run.id, userId);

    if (!item) {
      return NextResponse.json({ success: false, error: "Calibration item not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to load calibration item" }, { status: 500 });
  }
}
