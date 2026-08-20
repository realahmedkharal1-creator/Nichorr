import { NextResponse } from "next/server";
import { PredictionsRepository } from "@/lib/database/repositories/predictions.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new PredictionsRepository();
    const predictions = await repo.getPredictions(workspaceId);
    return NextResponse.json({ success: true, predictions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
