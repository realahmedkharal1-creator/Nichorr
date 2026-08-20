import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { PublicationIntegrityProvider } from "@/lib/creator/publication-integrity/publication-integrity.provider";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; publicationId: string } }
) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const lineage = PublicationIntegrityProvider.getLineage(params.publicationId, run.id, userId);

    if (!lineage) {
      return NextResponse.json({ success: false, error: "Lineage trace not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      lineage,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to load publication lineage" }, { status: 500 });
  }
}
