import { NextRequest, NextResponse } from "next/server";
import { HypothesisReconciliationProvider } from "@/lib/creator/hypothesis-reconciliation/hypothesis.provider";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; hypothesisId: string } }
) {
  try {
    const researchRunId = params.id;
    const userId = request.headers.get("x-user-id") || "anonymous-creator";

    const lineage = HypothesisReconciliationProvider.getLineage(
      researchRunId,
      userId,
      params.hypothesisId
    );

    if (!lineage) {
      return NextResponse.json(
        { success: false, error: "Hypothesis lineage trace not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { lineage },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve hypothesis lineage." },
      { status: 500 }
    );
  }
}
