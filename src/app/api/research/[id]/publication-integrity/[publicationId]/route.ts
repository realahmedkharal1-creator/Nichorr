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
    const publication = PublicationIntegrityProvider.getPublicationById(params.publicationId, run.id, userId);

    if (!publication) {
      return NextResponse.json({ success: false, error: "Publication not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      publication,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to load publication" }, { status: 500 });
  }
}
