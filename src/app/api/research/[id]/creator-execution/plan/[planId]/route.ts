import { NextRequest, NextResponse } from "next/server";
import { CreatorExecutionProvider } from "@/lib/creator/execution/creator-execution.provider";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; planId: string } }
) {
  try {
    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const plan = CreatorExecutionProvider.getPlan(params.planId, userId);

    if (!plan) {
      return NextResponse.json({ success: false, error: "Execution plan not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
