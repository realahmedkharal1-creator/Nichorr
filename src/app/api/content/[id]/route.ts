import { NextResponse } from "next/server";
import { ContentRepository } from "@/lib/database/repositories/content.repo";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const repo = new ContentRepository();
    const item = await repo.getContentItemById(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Content item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, contentItem: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const repo = new ContentRepository();
    const existing = await repo.getContentItemById(params.id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Content item not found" }, { status: 404 });
    }

    const updated = await repo.saveContentItem({
      ...existing,
      ...body,
      id: params.id,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, contentItem: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const repo = new ContentRepository();
    const success = await repo.deleteContentItem(params.id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
