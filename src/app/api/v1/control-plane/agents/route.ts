import { NextResponse } from "next/server";
import { AgentPerformanceRepository } from "@/lib/database/repositories/agent-performance.repo";

export async function GET(req: Request) {
  try {
    const repo = new AgentPerformanceRepository();
    const agents = await repo.getAgentHealth();
    return NextResponse.json({ success: true, agents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
