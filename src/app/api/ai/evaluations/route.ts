import { NextResponse } from "next/server";
import { EvaluationsRepository } from "@/lib/database/repositories/evaluations.repo";

export async function GET() {
  try {
    const repo = new EvaluationsRepository();
    const evaluations = await repo.getEvaluations();
    return NextResponse.json({ success: true, evaluations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
