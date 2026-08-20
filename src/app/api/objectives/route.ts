import { NextResponse } from "next/server";
import { ObjectivesRepository } from "@/lib/database/repositories/objectives.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new ObjectivesRepository();
    const objectives = await repo.getObjectives(workspaceId);
    return NextResponse.json({ success: true, objectives });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
