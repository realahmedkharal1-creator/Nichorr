import { NextRequest, NextResponse } from "next/server";
import { HypothesisReconciliationProvider } from "@/lib/creator/hypothesis-reconciliation/hypothesis.provider";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; hypothesisId: string } }
) {
  try {
    const researchRunId = params.id;
    const userId = request.headers.get("x-user-id") || "anonymous-creator";

    const state = HypothesisReconciliationProvider.getState(researchRunId, userId);
    const groups = (state.competingGroups || []).filter((g) =>
      g.hypotheses.some((h) => h.hypothesisId === params.hypothesisId)
    );

    return NextResponse.json({
      success: true,
      data: { competingGroups: groups },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve competing hypotheses." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; hypothesisId: string } }
) {
  try {
    const researchRunId = params.id;
    const userId = request.headers.get("x-user-id") || "anonymous-creator";

    const state = HypothesisReconciliationProvider.getState(researchRunId, userId);
    return NextResponse.json({
      success: true,
      data: state,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update competing hypotheses." },
      { status: 500 }
    );
  }
}
