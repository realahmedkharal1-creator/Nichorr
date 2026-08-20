import { NextResponse } from "next/server";
import { GraphQualityEngine } from "@/lib/intelligence/graph-quality-engine";

export async function GET() {
  try {
    const health = GraphQualityEngine.evaluateGraphHealth(45, 120, 1);
    return NextResponse.json({ success: true, graphHealth: health });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
