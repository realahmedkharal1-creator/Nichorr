import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      reviews: [
        {
          id: "rev-1",
          review_type: "MERGE_CANDIDATE",
          entityA: "DeepMind",
          entityB: "Google DeepMind",
          confidence: 96.5,
          status: "PENDING",
        },
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
