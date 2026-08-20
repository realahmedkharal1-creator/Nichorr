import { NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { ProvenanceProvider } from "@/lib/provenance/provenance.provider";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const session = await ResearchEngine.getRunAsync(params.id, user?.id);
    if (!session) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const provenanceReport = ProvenanceProvider.generateReport(session);

    return NextResponse.json({
      success: true,
      provenanceReport,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
