import { NextResponse } from "next/server";
import { RemediationProposalsRepository } from "@/lib/database/repositories/remediation-proposals.repo";

export async function GET(req: Request) {
  try {
    const repo = new RemediationProposalsRepository();
    const proposals = await repo.getProposals();
    return NextResponse.json({ success: true, remediationProposals: proposals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
