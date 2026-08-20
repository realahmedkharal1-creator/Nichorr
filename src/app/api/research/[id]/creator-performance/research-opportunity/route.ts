import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { PerformanceProvider } from "@/lib/creator/performance/performance.provider";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const body = await req.json().catch(() => ({}));

    if (!body.signalId) {
      return NextResponse.json({ success: false, error: "signalId is required" }, { status: 400 });
    }

    const signals = PerformanceProvider.getAudienceSignals(run.id, userId);
    const signal = signals.find((s) => s.signalId === body.signalId);

    if (!signal) {
      return NextResponse.json({ success: false, error: "Audience signal not found" }, { status: 404 });
    }

    const opportunity = PerformanceProvider.createResearchOpportunity(signal, run.id, userId);

    return NextResponse.json({
      success: true,
      opportunity,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to create research opportunity" }, { status: 500 });
  }
}
