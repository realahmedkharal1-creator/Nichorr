import { NextRequest, NextResponse } from "next/server";
import { ScriptTrainingService } from "@/lib/creator/script-training.service";
import { CreatorScriptTrainingProfile } from "@/lib/creator/script-training.types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || req.headers.get("x-user-id") || "anonymous-creator";
    const profile = ScriptTrainingService.getOrCreateProfile(userId);

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = body.userId || req.headers.get("x-user-id") || "anonymous-creator";

    // Handle action: add sample, remove sample, or full profile update
    if (body.action === "addSample" && body.sample) {
      const updatedProfile = ScriptTrainingService.addSampleScript(userId, body.sample);
      return NextResponse.json({ success: true, profile: updatedProfile });
    }

    if (body.action === "removeSample" && body.sampleId) {
      const updatedProfile = ScriptTrainingService.removeSampleScript(userId, body.sampleId);
      return NextResponse.json({ success: true, profile: updatedProfile });
    }

    // Full profile save/update
    const existing = ScriptTrainingService.getOrCreateProfile(userId);
    const profileToSave: CreatorScriptTrainingProfile = {
      ...existing,
      ...body,
      userId,
      updatedAt: new Date().toISOString(),
    };

    const saved = ScriptTrainingService.saveProfile(profileToSave);
    return NextResponse.json({ success: true, profile: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
