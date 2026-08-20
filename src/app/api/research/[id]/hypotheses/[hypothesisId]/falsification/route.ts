import { NextRequest, NextResponse } from "next/server";
import { HypothesisReconciliationProvider } from "@/lib/creator/hypothesis-reconciliation/hypothesis.provider";
import { HypothesisFalsificationEngine } from "@/lib/creator/hypothesis-reconciliation/hypothesis.falsification.engine";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; hypothesisId: string } }
) {
  try {
    const researchRunId = params.id;
    const userId = request.headers.get("x-user-id") || "anonymous-creator";

    const state = HypothesisReconciliationProvider.getState(researchRunId, userId);
    const hyp = state.hypotheses.find((h) => h.hypothesisId === params.hypothesisId);

    if (!hyp) {
      return NextResponse.json({ success: false, error: "Hypothesis not found." }, { status: 404 });
    }

    const hypEvidence = (state.evidence || []).filter((e) => e.hypothesisId === params.hypothesisId);
    const hypPreds = (state.predictions || []).filter((p) => p.hypothesisId === params.hypothesisId);

    const falsEvaluation = HypothesisFalsificationEngine.evaluateFalsification({
      evidence: hypEvidence,
      predictions: hypPreds,
      disconfirmingObservations: hyp.disconfirmingObservations,
    });

    return NextResponse.json({
      success: true,
      data: { falsification: falsEvaluation },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve falsification evaluation." },
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
      { success: false, error: error.message || "Failed to evaluate falsification." },
      { status: 500 }
    );
  }
}
