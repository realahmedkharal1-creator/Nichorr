import { NextResponse } from "next/server";
import { KnowledgeRepository } from "@/lib/database/repositories/knowledge.repo";
import { generateResearchQueue } from "@/lib/intelligence/research-planner";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || "default-project";
    const repo = new KnowledgeRepository();
    const items = await repo.getKnowledgeByProjectId(projectId);
    const queue = generateResearchQueue(projectId, items);
    return NextResponse.json({ success: true, queue });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
