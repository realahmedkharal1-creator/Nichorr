import { NextResponse } from "next/server";
import { MemoryRepository } from "@/lib/database/repositories/memory.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || "ws-primary-default";

    const repo = new MemoryRepository();
    const memories = await repo.getMemories(workspaceId);
    return NextResponse.json({ success: true, memories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
