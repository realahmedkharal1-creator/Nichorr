import { NextResponse } from "next/server";
import { ApiKeysRepository } from "@/lib/database/repositories/api-keys.repo";

export async function GET(req: Request) {
  try {
    const repo = new ApiKeysRepository();
    const keys = await repo.getKeys("client-1");
    return NextResponse.json({ success: true, keys });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { secret, prefix, hash } = ApiKeysRepository.generateKeySecret();
    return NextResponse.json({
      success: true,
      key: {
        id: `key_${Date.now()}`,
        name: "New Developer Integration Key",
        prefix,
        secret, // Full secret exposed ONCE at creation time
        scopes: ["knowledge:read", "knowledge:answer"],
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
