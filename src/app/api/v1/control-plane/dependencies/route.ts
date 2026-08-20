import { NextResponse } from "next/server";
import { DependencyGraphRepository } from "@/lib/database/repositories/dependency-graph.repo";

export async function GET(req: Request) {
  try {
    const repo = new DependencyGraphRepository();
    const nodes = await repo.getDependencyGraph();
    return NextResponse.json({ success: true, dependencyGraph: nodes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
