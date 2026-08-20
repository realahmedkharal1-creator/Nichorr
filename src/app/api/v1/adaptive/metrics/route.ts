import { NextResponse } from "next/server";
import { AdaptiveMetricsRepository } from "@/lib/database/repositories/adaptive-metrics.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new AdaptiveMetricsRepository();
    const metrics = await repo.getMetrics(workspaceId);
    return NextResponse.json({
      success: true,
      adaptiveMetrics: metrics,
      epistemicContract: {
        certaintyLevel: "CONFIRMED",
        epistemicNote: "Metrics are measured observations, not proof of underlying causality.",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
