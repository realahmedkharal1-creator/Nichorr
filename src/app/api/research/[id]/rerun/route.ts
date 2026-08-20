import { NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const previousRun = await ResearchEngine.getRunAsync(params.id, user?.id);
    if (!previousRun) {
      return NextResponse.json({ success: false, error: "Previous research run not found" }, { status: 404 });
    }

    const engine = new ResearchEngine();
    const newSession = await engine.createRun(
      {
        topic: previousRun.topic,
        objective: previousRun.objective,
        contentType: previousRun.contentType,
        targetAudience: previousRun.targetAudience,
        requestedDepth: previousRun.requestedDepth,
        projectId: previousRun.projectId,
        sourcePreferences: previousRun.sourcePreferences,
        evidenceRequirements: previousRun.evidenceRequirements,
        freshnessRequirement: previousRun.freshnessRequirement,
      },
      user?.id
    );

    // Trigger asynchronous background execution
    engine.executeRun(newSession.id, user?.id).catch((err) => {
      console.error(`Background re-run failed for session ${newSession.id}:`, err);
    });

    return NextResponse.json({ success: true, runId: newSession.id, run: newSession });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
