import { NextResponse } from "next/server";
import { ResourceGovernanceRepository } from "@/lib/database/repositories/resource-governance.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new ResourceGovernanceRepository();
    const usage = await repo.getResourceUsage(workspaceId);
    return NextResponse.json({ success: true, resources: usage });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
