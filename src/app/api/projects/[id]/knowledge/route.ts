import { NextResponse } from "next/server";
import { KnowledgeRepository } from "@/lib/database/repositories/knowledge.repo";
import { KnowledgeNormalizer } from "@/lib/intelligence/knowledge-normalizer";
import { ResearchEngine } from "@/features/research/research-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const repo = new KnowledgeRepository();
    const items = await repo.getKnowledgeByProjectId(params.id);
    const changes = await repo.getChangesByProjectId(params.id);
    return NextResponse.json({ success: true, knowledge: items, changes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await req.json();
    const { runId } = body;

    if (!runId) {
      return NextResponse.json({ success: false, error: "runId is required" }, { status: 400 });
    }

    const session = await ResearchEngine.getRunAsync(runId, user?.id);
    if (!session) {
      return NextResponse.json({ success: false, error: "Research run session not found" }, { status: 404 });
    }

    const normalizer = new KnowledgeNormalizer();
    const res = await normalizer.reconcileRunClaims(params.id, session);

    return NextResponse.json({ success: true, reconciliation: res });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
