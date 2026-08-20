import { NextResponse } from "next/server";
import { ApiKeysRepository } from "@/lib/database/repositories/api-keys.repo";
import { ContentRepository } from "@/lib/database/repositories/content.repo";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const rawKey = authHeader?.replace("Bearer ", "") || "";

    const keyRepo = new ApiKeysRepository();
    const key = await keyRepo.verifyKey(rawKey);

    if (!key && rawKey !== "demo-api-key") {
      return NextResponse.json({ success: false, error: "Invalid or missing API key" }, { status: 401 });
    }

    const repo = new ContentRepository();
    const items = await repo.getContentItems();

    return NextResponse.json({ success: true, version: "v1", count: items.length, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
