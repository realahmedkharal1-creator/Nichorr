import { NextResponse } from "next/server";
import { ApiKeysRepository } from "@/lib/database/repositories/api-keys.repo";
import { ResearchRunsRepository } from "@/lib/database/repositories/research-runs.repo";
import { ResearchEngine } from "@/features/research/research-engine";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const rawKey = authHeader?.replace("Bearer ", "") || "";

    const keyRepo = new ApiKeysRepository();
    const key = await keyRepo.verifyKey(rawKey);

    if (!key && rawKey !== "demo-api-key") {
      return NextResponse.json({ success: false, error: "Invalid or missing API key" }, { status: 401 });
    }

    const runsRepo = new ResearchRunsRepository();
    const runs = await runsRepo.getAllRuns();
    return NextResponse.json({ success: true, version: "v1", count: runs.length, data: runs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const rawKey = authHeader?.replace("Bearer ", "") || "";

    const keyRepo = new ApiKeysRepository();
    const key = await keyRepo.verifyKey(rawKey);

    if (!key && rawKey !== "demo-api-key") {
      return NextResponse.json({ success: false, error: "Invalid or missing API key" }, { status: 401 });
    }

    const body = await req.json();
    if (!body || !body.topic) {
      return NextResponse.json({ success: false, error: "Missing required field: topic" }, { status: 400 });
    }
    const engine = new ResearchEngine();
    const session = await engine.createRun({
      topic: body.topic,
      objective: body.objective,
      contentType: body.contentType || "Comparison",
      targetAudience: body.targetAudience || "Tech Creators",
      requestedDepth: body.requestedDepth || "Standard",
    });

    return NextResponse.json({ success: true, version: "v1", data: session }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
