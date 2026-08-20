import { NextResponse } from "next/server";
import { GraphReasoningEngine } from "@/lib/intelligence/graph-reasoning-engine";

export async function GET() {
  try {
    const explanation = GraphReasoningEngine.evaluatePath("Google DeepMind", "Gemini 1.5 Flash", 2, 99.0);
    return NextResponse.json({ success: true, explanationPath: explanation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
