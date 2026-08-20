import { NextResponse } from "next/server";
import { AnomalyRepository } from "@/lib/database/repositories/anomaly.repo";

export async function GET(req: Request) {
  try {
    const repo = new AnomalyRepository();
    const anomalies = await repo.getAnomalies();
    return NextResponse.json({ success: true, anomalies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
