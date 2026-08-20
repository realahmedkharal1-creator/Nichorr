import { NextResponse } from "next/server";
import { CommentsRepository } from "@/lib/database/repositories/comments.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetType = searchParams.get("targetType") || "CLAIM";
    const targetId = searchParams.get("targetId") || "default";

    const repo = new CommentsRepository();
    const comments = await repo.getComments(targetType, targetId);
    return NextResponse.json({ success: true, comments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, commentId, targetType, targetId, text, authorName } = body;
    const repo = new CommentsRepository();

    if (action === "RESOLVE") {
      const success = await repo.resolveComment(commentId);
      return NextResponse.json({ success });
    }

    if (!targetType || !targetId || !text) {
      return NextResponse.json({ success: false, error: "targetType, targetId, and text are required" }, { status: 400 });
    }

    const comment = await repo.addComment({
      id: `cmt-${Date.now()}`,
      workspace_id: "ws-primary-default",
      target_type: targetType,
      target_id: targetId,
      author_name: authorName || "Collaborator",
      text,
      is_resolved: false,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, comment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
