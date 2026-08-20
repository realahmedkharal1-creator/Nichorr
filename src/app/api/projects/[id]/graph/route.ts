import { NextResponse } from "next/server";
import { KnowledgeGraphRepository } from "@/lib/database/repositories/knowledge-graph.repo";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const repo = new KnowledgeGraphRepository();
    const graph = await repo.getGraph(projectId);
    return NextResponse.json({ success: true, graph });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const body = await req.json();
    const repo = new KnowledgeGraphRepository();

    if (body.type === "NODE") {
      const node = await repo.addNode({ ...body.node, project_id: projectId });
      return NextResponse.json({ success: true, node });
    } else if (body.type === "EDGE") {
      const edge = await repo.addEdge({ ...body.edge, project_id: projectId });
      return NextResponse.json({ success: true, edge });
    }

    return NextResponse.json({ success: false, error: "Invalid entity type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
