import { NextResponse } from "next/server";
import { ProjectsRepository } from "@/lib/database/repositories/projects.repo";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const repo = new ProjectsRepository();
    const projects = await repo.getProjects(user?.id);
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await req.json();
    const { name, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Project name is required" }, { status: 400 });
    }

    const repo = new ProjectsRepository();
    const project = await repo.createProject(name, description, user?.id);

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
