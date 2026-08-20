import { NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const session = await ResearchEngine.getRunAsync(params.id, user?.id);
    if (!session) {
      return NextResponse.json({ success: false, error: "Research run session not found" }, { status: 404 });
    }

    const claims = session.claims || [];
    const conflicts = session.conflicts || [];
    const brief = session.brief;

    const scriptOutline = {
      hook: `Why the latest benchmark tests for "${session.topic}" change everything we thought we knew.`,
      context: brief?.executive_summary?.[0] || `An evidence-based deep dive into ${session.topic} based on ${session.sources.length} audited sources.`,
      keyClaimBlocks: claims.slice(0, 4).map((c, i) => ({
        sectionTitle: `POINT #${i + 1}: ${c.claim_type} EVIDENCE`,
        claimText: c.claim_text,
        confidence: c.confidence,
        status: c.status,
      })),
      counterarguments: conflicts.map((cnf) => ({
        type: cnf.conflict_type,
        advice: cnf.explanation,
      })),
      conclusion: `In summary, while testing confirms core architectural strengths, creators must explicitly disclaim regional and software version variables.`,
      callToAction: `What do you think about these benchmark results? Let us know in the comments below!`,
    };

    return NextResponse.json({ success: true, scriptOutline });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
