import { NextResponse } from "next/server";
import { ContentRepository } from "@/lib/database/repositories/content.repo";
import { evaluatePublishReadiness } from "@/lib/intelligence/publish-readiness";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const repo = new ContentRepository();
    const item = await repo.getContentItemById(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Content item not found" }, { status: 404 });
    }

    const readiness = evaluatePublishReadiness(item);

    // Update readiness status on content item
    item.publish_readiness_status = readiness.finalReadiness;
    await repo.saveContentItem(item);

    return NextResponse.json({ success: true, readiness });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
