import { NextResponse } from "next/server";
import { OptimizationSimulatorEngine } from "@/lib/intelligence/optimization-simulator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = OptimizationSimulatorEngine.simulateChange({
      recommendationId: body.recommendationId || "rec-default",
      proposedChange: body.proposedChange || "ROUTE_TO_FLASH",
    });
    return NextResponse.json({ success: true, simulation: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
