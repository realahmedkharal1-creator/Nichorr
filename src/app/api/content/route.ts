import { NextResponse } from "next/server";
import { ContentRepository, ContentItemEntity } from "@/lib/database/repositories/content.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const repo = new ContentRepository();
    const items = await repo.getContentItems(projectId);
    return NextResponse.json({ success: true, contentItems: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, researchRunId, opportunityId, title, contentType, topic, objective, priority } = body;

    if (!projectId || !title || !topic) {
      return NextResponse.json({ success: false, error: "projectId, title, and topic are required" }, { status: 400 });
    }

    const repo = new ContentRepository();
    const newItem: ContentItemEntity = {
      id: `content-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      project_id: projectId,
      research_run_id: researchRunId || undefined,
      opportunity_id: opportunityId || undefined,
      title,
      working_title: `[Draft] ${title}`,
      content_type: contentType || "YouTube Video",
      topic,
      objective: objective || "",
      stage: researchRunId ? "RESEARCH_READY" : "IDEA",
      priority: priority || "MEDIUM",
      fact_check_status: "PENDING",
      publish_readiness_status: "NOT_READY",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const saved = await repo.saveContentItem(newItem);
    return NextResponse.json({ success: true, contentItem: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
