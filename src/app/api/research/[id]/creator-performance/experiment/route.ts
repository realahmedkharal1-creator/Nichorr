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

    if (!body.hypothesis || !body.variable || !body.control || !body.variant || !body.primaryMetric) {
      return NextResponse.json(
        { success: false, error: "hypothesis, variable, control, variant, and primaryMetric are required" },
        { status: 400 }
      );
    }

    const experiment = PerformanceProvider.createExperiment(
      run.id,
      body.hypothesis,
      body.variable,
      body.control,
      body.variant,
      body.primaryMetric,
      body.measurementWindow || "FIRST_48_HOURS",
      userId
    );

    return NextResponse.json({
      success: true,
      experiment,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to create experiment" }, { status: 500 });
  }
}
