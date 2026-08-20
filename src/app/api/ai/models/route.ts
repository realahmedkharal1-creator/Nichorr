import { NextResponse } from "next/server";
import { AIModelsRepository } from "@/lib/database/repositories/ai-models.repo";

export async function GET() {
  try {
    const repo = new AIModelsRepository();
    const models = await repo.getModels();
    return NextResponse.json({ success: true, models });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
