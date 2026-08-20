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
    const tasks = (state.validationTasks || []).filter((t) => t.hypothesisId === params.hypothesisId);

    return NextResponse.json({
      success: true,
      data: { validationTasks: tasks },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve validation tasks." },
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

    const result = HypothesisReconciliationProvider.bridgeValidationTask(
      researchRunId,
      userId,
      body.taskId
    );

    return NextResponse.json({
      success: result.success,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to bridge validation task." },
      { status: 500 }
    );
  }
}
