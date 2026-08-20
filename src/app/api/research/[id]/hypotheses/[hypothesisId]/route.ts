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
    const hypothesis = (state.hypotheses || []).find((h) => h.hypothesisId === params.hypothesisId);

    if (!hypothesis) {
      return NextResponse.json({ success: false, error: "Hypothesis not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { hypothesis },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve hypothesis." },
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
    const hypothesis = (state.hypotheses || []).find((h) => h.hypothesisId === params.hypothesisId);

    if (!hypothesis) {
      return NextResponse.json({ success: false, error: "Hypothesis not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { hypothesis },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update hypothesis." },
      { status: 500 }
    );
  }
}
