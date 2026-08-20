import { NextResponse } from "next/server";
import { ProjectsRepository } from "@/lib/database/repositories/projects.repo";
import { ResearchRunsRepository } from "@/lib/database/repositories/research-runs.repo";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const projectsRepo = new ProjectsRepository();
    const project = await projectsRepo.getProjectById(params.id, user?.id);

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    const runsRepo = new ResearchRunsRepository();
    const dbRuns = await runsRepo.getRunsByProjectId(params.id, user?.id);

    // Merge in-memory runStore runs that belong to this project
    const { ResearchEngine } = await import("@/features/research/research-engine");
    const allSessions = ResearchEngine.getAllRuns();
    const projectSessions = allSessions.filter((s) => s.projectId === params.id);

    const mergedRuns = projectSessions.length > 0 ? projectSessions : (dbRuns.length > 0 ? dbRuns : project.research_runs || []);

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        research_runs: mergedRuns,
        run_count: mergedRuns.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const projectsRepo = new ProjectsRepository();
    const success = await projectsRepo.deleteProject(params.id, user?.id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
