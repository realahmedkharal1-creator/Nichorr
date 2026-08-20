import { createClient } from "@/lib/supabase/server";

export interface ProjectEntity {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  default_content_type?: string;
  default_target_audience?: string;
  created_at?: string;
  updated_at?: string;
  research_runs?: any[];
  run_count?: number;
}

export class ProjectsRepository {
  async getProjects(userId?: string): Promise<ProjectEntity[]> {
    try {
      const supabase = createClient();
      let query = supabase
        .from("projects")
        .select("*, research_runs(*)")
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;
      if (error || !data) return [];

      return data.map((p: any) => ({
        id: p.id,
        user_id: p.user_id,
        name: p.name,
        description: p.description || "",
        default_content_type: p.default_content_type || "Comparison",
        default_target_audience: p.default_target_audience || "Tech Creators",
        created_at: p.created_at,
        updated_at: p.updated_at,
        research_runs: p.research_runs || [],
        run_count: (p.research_runs || []).length,
      }));
    } catch {
      return [];
    }
  }

  async getProjectById(id: string, userId?: string): Promise<ProjectEntity | null> {
    try {
      const supabase = createClient();
      let query = supabase
        .from("projects")
        .select("*, research_runs(*)")
        .eq("id", id);

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query.single();
      if (error || !data) return null;

      return {
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        description: data.description || "",
        default_content_type: data.default_content_type || "Comparison",
        default_target_audience: data.default_target_audience || "Tech Creators",
        created_at: data.created_at,
        updated_at: data.updated_at,
        research_runs: data.research_runs || [],
        run_count: (data.research_runs || []).length,
      };
    } catch {
      return null;
    }
  }

  async createProject(name: string, description?: string, userId?: string): Promise<ProjectEntity | null> {
    try {
      const supabase = createClient();
      const payload: any = {
        name,
        description: description || "",
      };
      if (userId) payload.user_id = userId;

      const { data, error } = await supabase.from("projects").insert(payload).select().single();
      if (error || !data) {
        // Fallback for offline memory
        const fakeId = `proj-${Date.now()}`;
        return {
          id: fakeId,
          name,
          description: description || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          research_runs: [],
          run_count: 0,
        };
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        created_at: data.created_at,
        updated_at: data.updated_at,
        research_runs: [],
        run_count: 0,
      };
    } catch {
      const fakeId = `proj-${Date.now()}`;
      return {
        id: fakeId,
        name,
        description: description || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        research_runs: [],
        run_count: 0,
      };
    }
  }

  async deleteProject(id: string, userId?: string): Promise<boolean> {
    try {
      const supabase = createClient();
      let query = supabase.from("projects").delete().eq("id", id);
      if (userId) query = query.eq("user_id", userId);
      const { error } = await query;
      return !error;
    } catch {
      return false;
    }
  }
}
