import { NextResponse } from "next/server";
import { ResearchRunsRepository } from "@/lib/database/repositories/research-runs.repo";
import { KnowledgeRepository } from "@/lib/database/repositories/knowledge.repo";
import { ContentRepository } from "@/lib/database/repositories/content.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();

    if (!q) {
      return NextResponse.json({ success: true, results: { research: [], knowledge: [], content: [] } });
    }

    const researchRepo = new ResearchRunsRepository();
    const knowledgeRepo = new KnowledgeRepository();
    const contentRepo = new ContentRepository();

    const runs = await researchRepo.getAllRuns();
    const knowledgeItems = await knowledgeRepo.getKnowledgeByProjectId("proj-1");
    const contentItems = await contentRepo.getContentItems();

    const matchedRuns = runs.filter((r) => r.topic.toLowerCase().includes(q) || r.contentType.toLowerCase().includes(q));
    const matchedKnowledge = knowledgeItems.filter((k) => k.normalized_claim.toLowerCase().includes(q) || k.current_value.toLowerCase().includes(q));
    const matchedContent = contentItems.filter((c) => c.title.toLowerCase().includes(q) || c.hook?.toLowerCase().includes(q));

    return NextResponse.json({
      success: true,
      results: {
        research: matchedRuns,
        knowledge: matchedKnowledge,
        content: matchedContent,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
