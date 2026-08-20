import { NextResponse } from "next/server";
import { KnowledgeRepository } from "@/lib/database/repositories/knowledge.repo";
import { generateContentIdeas } from "@/lib/intelligence/content-intelligence";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const repo = new KnowledgeRepository();
    const items = await repo.getKnowledgeByProjectId(params.id);
    const ideas = generateContentIdeas(params.id, items);
    return NextResponse.json({ success: true, ideas });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
