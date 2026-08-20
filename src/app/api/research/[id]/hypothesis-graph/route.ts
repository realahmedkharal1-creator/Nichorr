import { NextRequest, NextResponse } from "next/server";
import { HypothesisReconciliationProvider } from "@/lib/creator/hypothesis-reconciliation/hypothesis.provider";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const researchRunId = params.id;
    const userId = request.headers.get("x-user-id") || "anonymous-creator";

    const state = HypothesisReconciliationProvider.getState(researchRunId, userId);
    return NextResponse.json({
      success: true,
      data: { graph: state.graph },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve hypothesis graph." },
      { status: 500 }
    );
  }
}
