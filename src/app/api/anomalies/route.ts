import { NextResponse } from "next/server";
import { AnomaliesRepository } from "@/lib/database/repositories/anomalies.repo";

export async function GET() {
  try {
    const repo = new AnomaliesRepository();
    const anomalies = await repo.getAnomalies();
    return NextResponse.json({ success: true, anomalies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
