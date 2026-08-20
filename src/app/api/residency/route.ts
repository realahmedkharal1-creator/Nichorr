import { NextResponse } from "next/server";
import { ResidencyRepository } from "@/lib/database/repositories/residency.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new ResidencyRepository();
    const policy = await repo.getPolicy(workspaceId);
    return NextResponse.json({ success: true, policy });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
