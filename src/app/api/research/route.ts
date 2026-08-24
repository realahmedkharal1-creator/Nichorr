import { NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { ResearchRunsRepository } from "@/lib/database/repositories/research-runs.repo";
import { RateLimiter } from "@/lib/security/rate-limiter";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || "local-ip";
    const rateCheck = RateLimiter.checkLimit(clientIp);
    if (!rateCheck.allowed) {
      return NextResponse.json({ success: false, error: "Too many requests. Rate limit exceeded." }, { status: 429 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co";

    if (isSupabaseConfigured && !user) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const repo = new ResearchRunsRepository();
    const dbRuns = await repo.getAllRuns(user?.id);

    if (dbRuns && dbRuns.length > 0) {
      return NextResponse.json({ success: true, runs: dbRuns });
    }

    // Fallback to in-memory sessions for development/offline testing
    const runs = ResearchEngine.getAllRuns();
    return NextResponse.json({ success: true, runs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || "local-ip";
    const rateCheck = RateLimiter.checkLimit(clientIp);
    if (!rateCheck.allowed) {
      return NextResponse.json({ success: false, error: "Too many requests. Rate limit exceeded." }, { status: 429 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co";

    if (isSupabaseConfigured && !user) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const engine = new ResearchEngine();
    const session = await engine.createRun({
      topic: body.topic,
      objective: body.objective,
      contentType: body.contentType,
      targetAudience: body.targetAudience,
      requestedDepth: body.requestedDepth,
      outputLanguage: body.outputLanguage,
    }, user?.id);

    return NextResponse.json({ success: true, run: session });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
