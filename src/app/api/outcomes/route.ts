import { NextResponse } from "next/server";
import { OutcomesRepository } from "@/lib/database/repositories/outcomes.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new OutcomesRepository();
    const outcomes = await repo.getOutcomes(workspaceId);
    return NextResponse.json({ success: true, outcomes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
