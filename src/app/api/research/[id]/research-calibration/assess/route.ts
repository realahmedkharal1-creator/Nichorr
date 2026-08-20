import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { ResearchCalibrationProvider } from "@/lib/creator/research-calibration/research-calibration.provider";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const body = await req.json().catch(() => ({}));
    const { candidateId, ...options } = body;

    if (!candidateId) {
      return NextResponse.json({ success: false, error: "candidateId is required" }, { status: 400 });
    }

    const queueItem = ResearchCalibrationProvider.assessCandidate(candidateId, run.id, userId, options);

    return NextResponse.json({
      success: true,
      queueItem,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to assess candidate" }, { status: 500 });
  }
}
