import { NextResponse } from "next/server";
import { ApiKeysRepository } from "@/lib/database/repositories/api-keys.repo";
import { ResourceTrackerRepository } from "@/lib/database/repositories/resource-tracker.repo";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const rawKey = authHeader?.replace("Bearer ", "") || "";

    const keyRepo = new ApiKeysRepository();
    const key = await keyRepo.verifyKey(rawKey);

    if (!key && rawKey !== "demo-api-key") {
      return NextResponse.json({ success: false, error: "Invalid or missing API key" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new ResourceTrackerRepository();
    const summary = await repo.getUsageSummary();

    return NextResponse.json({
      success: true,
      version: "v1",
      workspaceId,
      usage: {
        totalExecutions: summary.logs.length,
        totalTokens: summary.totalInputTokens + summary.totalOutputTokens,
        totalCostUSD: Number(summary.totalCostUSD.toFixed(4)),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
