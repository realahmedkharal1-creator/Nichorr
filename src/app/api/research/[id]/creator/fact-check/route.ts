import { NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { KnowledgeRepository } from "@/lib/database/repositories/knowledge.repo";
import { factCheckCreatorDraft } from "@/lib/intelligence/fact-checker";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await req.json();
    const { statement } = body;

    if (!statement || !statement.trim()) {
      return NextResponse.json({ success: false, error: "Draft statement is required" }, { status: 400 });
    }

    const session = await ResearchEngine.getRunAsync(params.id, user?.id);
    const knowledgeRepo = new KnowledgeRepository();
    const projectKnowledge = session?.projectId
      ? await knowledgeRepo.getKnowledgeByProjectId(session.projectId)
      : [];

    // Combine project knowledge with session claims as fallback items
    const combinedKnowledge = [
      ...projectKnowledge,
      ...(session?.claims || []).map((c) => ({
        id: c.id,
        project_id: session?.projectId || "standalone",
        normalized_claim: c.claim_text,
        current_value: c.claim_text,
        confidence: c.confidence as any,
        status: c.status as any,
        supporting_sources_count: 1,
        last_verified_at: new Date().toISOString(),
        freshness_status: "FRESH" as any,
      })),
    ];

    const result = factCheckCreatorDraft(statement, combinedKnowledge);

    return NextResponse.json({ success: true, factCheck: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
