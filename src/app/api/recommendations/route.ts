import { NextResponse } from "next/server";
import { RecommendationsRepository } from "@/lib/database/repositories/recommendations.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new RecommendationsRepository();
    const recommendations = await repo.getRecommendations(workspaceId);
    return NextResponse.json({ success: true, recommendations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
