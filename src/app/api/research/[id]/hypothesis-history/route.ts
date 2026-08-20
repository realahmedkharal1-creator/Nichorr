import { NextRequest, NextResponse } from "next/server";
import { HypothesisAuditService } from "@/lib/creator/hypothesis-reconciliation/hypothesis.audit";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const researchRunId = params.id;
    const userId = request.headers.get("x-user-id") || "anonymous-creator";

    const history = HypothesisAuditService.getLedger(researchRunId, userId);
    return NextResponse.json({
      success: true,
      data: { history },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve hypothesis audit history." },
      { status: 500 }
    );
  }
}
