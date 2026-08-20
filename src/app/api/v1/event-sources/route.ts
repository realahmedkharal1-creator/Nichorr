import { NextResponse } from "next/server";
import { EventSourcesRepository } from "@/lib/database/repositories/event-sources.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new EventSourcesRepository();
    const sources = await repo.getSources(workspaceId);
    return NextResponse.json({ success: true, sources });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
