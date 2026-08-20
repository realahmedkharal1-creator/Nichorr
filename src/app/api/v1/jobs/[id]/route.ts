import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({
      jobId: params.id,
      status: "COMPLETED",
      progress: 100,
      startedAt: new Date(Date.now() - 5000).toISOString(),
      completedAt: new Date().toISOString(),
      result: {
        success: true,
        outputReference: `/api/v1/knowledge/answer`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
