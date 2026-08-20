import { NextResponse } from "next/server";
import { KnowledgeRepository } from "@/lib/database/repositories/knowledge.repo";
import { detectResearchGaps } from "@/lib/intelligence/research-gaps";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const repo = new KnowledgeRepository();
    const items = await repo.getKnowledgeByProjectId(params.id);
    const gapsResult = detectResearchGaps(items);
    return NextResponse.json({ success: true, ...gapsResult });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
