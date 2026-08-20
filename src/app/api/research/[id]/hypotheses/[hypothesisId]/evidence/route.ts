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
    const evidence = (state.evidence || []).filter((e) => e.hypothesisId === params.hypothesisId);

    return NextResponse.json({
      success: true,
      data: { evidence },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve hypothesis evidence." },
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
    const body = await request.json();

    const attachment = HypothesisReconciliationProvider.attachEvidence(
      researchRunId,
      userId,
      {
        hypothesisId: params.hypothesisId,
        ...body,
      }
    );

    return NextResponse.json({
      success: true,
      data: { evidence: attachment },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to attach evidence." },
      { status: 500 }
    );
  }
}
