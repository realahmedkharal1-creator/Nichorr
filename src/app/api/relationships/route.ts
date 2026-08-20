import { NextResponse } from "next/server";
import { RelationshipsRepository } from "@/lib/database/repositories/relationships.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new RelationshipsRepository();
    const relationships = await repo.getRelationships(workspaceId);
    return NextResponse.json({ success: true, relationships });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
