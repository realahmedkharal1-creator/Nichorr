import { NextResponse } from "next/server";
import { DurableJobsRepository } from "@/lib/database/repositories/durable-jobs.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new DurableJobsRepository();
    const jobs = await repo.getJobsByWorkspace(workspaceId);
    return NextResponse.json({ success: true, jobs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jobType, payload, workspaceId } = body;
    const repo = new DurableJobsRepository();

    const job = await repo.saveJob({
      id: `job-${Date.now()}`,
      workspace_id: workspaceId || "ws-primary-default",
      job_type: jobType || "RESEARCH_RUN",
      status: "QUEUED",
      payload: payload || {},
      attempt_count: 0,
      max_attempts: 3,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
