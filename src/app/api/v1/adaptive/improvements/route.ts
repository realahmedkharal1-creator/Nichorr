import { NextResponse } from "next/server";
import { ImprovementProposalsRepository } from "@/lib/database/repositories/improvement-proposals.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new ImprovementProposalsRepository();
    const proposals = await repo.getProposals(workspaceId);
    return NextResponse.json({ success: true, improvementProposals: proposals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
