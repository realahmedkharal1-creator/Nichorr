import { NextResponse } from "next/server";
import { ContentRepository, isValidStageTransition, ContentStage } from "@/lib/database/repositories/content.repo";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { targetStage } = body as { targetStage: ContentStage };

    if (!targetStage) {
      return NextResponse.json({ success: false, error: "targetStage is required" }, { status: 400 });
    }

    const repo = new ContentRepository();
    const existing = await repo.getContentItemById(params.id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Content item not found" }, { status: 404 });
    }

    if (!isValidStageTransition(existing.stage, targetStage)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid stage transition from ${existing.stage} to ${targetStage}. Transition rejected by deterministic rules.`,
        },
        { status: 400 }
      );
    }

    existing.stage = targetStage;
    existing.updated_at = new Date().toISOString();
    if (targetStage === "PUBLISHED") {
      existing.published_at = new Date().toISOString();
    }

    const updated = await repo.saveContentItem(existing);
    return NextResponse.json({ success: true, contentItem: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
