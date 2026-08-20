import { NextResponse } from "next/server";
import { AgentExecutionsRepository } from "@/lib/database/repositories/agent-executions.repo";
import { SpecializedAgentsRunner } from "@/lib/agents/specialized-agents";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const repo = new AgentExecutionsRepository();
    const executions = await repo.getExecutions(projectId);
    return NextResponse.json({ success: true, executions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, agentType, taskId, action } = body;

    if (action === "CANCEL") {
      const repo = new AgentExecutionsRepository();
      const success = await repo.cancelExecution(taskId);
      return NextResponse.json({ success });
    }

    if (!projectId || !agentType || !taskId) {
      return NextResponse.json({ success: false, error: "projectId, agentType, and taskId are required" }, { status: 400 });
    }

    const runner = new SpecializedAgentsRunner();
    const result = await runner.runAgentTask({
      projectId,
      agentType,
      taskId,
      inputContext: body.inputContext || {},
    });

    return NextResponse.json({ success: true, execution: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
