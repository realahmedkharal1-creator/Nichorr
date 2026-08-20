import { NextRequest, NextResponse } from "next/server";
import { HypothesisReconciliationProvider } from "@/lib/creator/hypothesis-reconciliation/hypothesis.provider";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; hypothesisId: string } }
) {
  try {
    const researchRunId = params.id;
    const userId = request.headers.get("x-user-id") || "anonymous-creator";

    const state = HypothesisReconciliationProvider.getState(researchRunId, userId);
    const reconciliation = (state.reconciliations || []).find((r) => r.hypothesisId === params.hypothesisId);

    return NextResponse.json({
      success: true,
      data: { reconciliation },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reconcile hypothesis." },
      { status: 500 }
    );
  }
}
