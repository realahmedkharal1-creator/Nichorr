import { NextResponse } from "next/server";
import { ImprovementExperimentsRepository } from "@/lib/database/repositories/improvement-experiments.repo";

export async function GET(req: Request) {
  try {
    const repo = new ImprovementExperimentsRepository();
    const experiments = await repo.getExperiments();
    return NextResponse.json({ success: true, experiments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
