import { NextRequest, NextResponse } from "next/server";
import { DistributionProvider } from "@/lib/creator/distribution/distribution.provider";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const history = DistributionProvider.getHistory(params.id, userId);

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
