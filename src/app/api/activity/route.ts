import { NextResponse } from "next/server";
import { WorkspaceActivityRepository } from "@/lib/database/repositories/activity.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || undefined;
    const repo = new WorkspaceActivityRepository();
    const activities = await repo.getActivities(workspaceId);
    return NextResponse.json({ success: true, activities });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
