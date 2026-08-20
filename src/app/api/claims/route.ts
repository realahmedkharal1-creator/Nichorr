import { NextResponse } from "next/server";
import { ClaimsRepository } from "@/lib/database/repositories/claims.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new ClaimsRepository();
    const claims = await repo.getClaims(workspaceId);
    return NextResponse.json({ success: true, claims });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
