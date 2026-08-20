import { NextResponse } from "next/server";
import { ApiUsageRepository } from "@/lib/database/repositories/api-usage.repo";

export async function GET(req: Request) {
  try {
    const repo = new ApiUsageRepository();
    const usage = await repo.getUsage("ws-primary-default");
    return NextResponse.json({ success: true, usage });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
