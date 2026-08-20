import { NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { ResearchAssistantService } from "@/features/research/research-assistant";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await req.json();
    const { question } = body;

    if (!question || !question.trim()) {
      return NextResponse.json({ success: false, error: "Question is required" }, { status: 400 });
    }

    const session = await ResearchEngine.getRunAsync(params.id, user?.id);
    if (!session) {
      return NextResponse.json({ success: false, error: "Research run session not found" }, { status: 404 });
    }

    const result = await ResearchAssistantService.answerQuestion(session, question);

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
