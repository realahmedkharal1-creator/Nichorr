import { NextResponse } from "next/server";
import { EnterpriseAuditLogsRepository } from "@/lib/database/repositories/audit-logs.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new EnterpriseAuditLogsRepository();
    const logs = await repo.getAuditLogs(workspaceId);
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
