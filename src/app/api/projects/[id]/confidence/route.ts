import { NextResponse } from "next/server";
import { TrustEngine } from "@/lib/intelligence/trust-engine";
import { KnowledgeRepository } from "@/lib/database/repositories/knowledge.repo";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const repo = new KnowledgeRepository();
    const items = await repo.getKnowledgeByProjectId(projectId);

    const engine = new TrustEngine();
    const trustOutput = engine.calculateTrustScore({
      supportingEvidenceCount: items.length * 2,
      independentSourceCount: Math.max(1, Math.floor(items.length * 1.5)),
      hasContradiction: items.some((i: any) => i.status === "CONTRADICTED" || i.lifecycle_state === "CONTESTED"),
      isStale: items.some((i: any) => i.status === "STALE" || i.lifecycle_state === "STALE"),
      primarySourceRatio: 0.8,
    });

    return NextResponse.json({ success: true, trustOutput });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
