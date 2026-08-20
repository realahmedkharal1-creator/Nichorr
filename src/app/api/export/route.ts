import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    return NextResponse.json({
      success: true,
      exportJob: {
        id: `exp-${Date.now()}`,
        workspaceId,
        status: "COMPLETED",
        fileUrl: `/exports/workspace-${workspaceId}-backup.json`,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workspaceId, exportType } = body;

    return NextResponse.json({
      success: true,
      exportJob: {
        id: `exp-${Date.now()}`,
        workspaceId: workspaceId || "ws-primary-default",
        exportType: exportType || "WORKSPACE_FULL",
        status: "QUEUED",
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
