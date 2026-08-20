import { NextResponse } from "next/server";
import { IncidentsRepository } from "@/lib/database/repositories/incidents.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new IncidentsRepository();
    const incidents = await repo.getIncidents(workspaceId);
    return NextResponse.json({ success: true, incidents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
