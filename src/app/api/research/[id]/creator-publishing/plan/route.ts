import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorPublishingProvider } from "@/lib/creator/publishing/creator-publishing.provider";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const body = await req.json().catch(() => ({}));

    const plan = CreatorPublishingProvider.createPublishingPlan(userId, run.id, body);

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to create publishing plan" }, { status: 500 });
  }
}
