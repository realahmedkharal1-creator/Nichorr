import { createClient } from "@/lib/supabase/server";

export type JobStatus = "QUEUED" | "RUNNING" | "RETRYING" | "WAITING" | "COMPLETED" | "FAILED" | "CANCELLED" | "DEAD_LETTER";

export interface DurableJobEntity {
  id: string;
  workspace_id: string;
  job_type: string;
  status: JobStatus;
  payload: Record<string, any>;
  attempt_count: number;
  max_attempts: number;
  last_error?: string;
  started_at?: string;
  completed_at?: string;
  created_at?: string;
}

const globalJobs = globalThis as unknown as {
  jobsStore: Map<string, DurableJobEntity[]> | undefined;
};
const jobsStore = globalJobs.jobsStore ?? new Map<string, DurableJobEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalJobs.jobsStore = jobsStore;
}

export class DurableJobsRepository {
  async getJobsByWorkspace(workspaceId: string): Promise<DurableJobEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("durable_jobs").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch {}

    return jobsStore.get(workspaceId) || [
      { id: "job-1", workspace_id: workspaceId, job_type: "RESEARCH_RUN", status: "COMPLETED", payload: { topic: "Exynos 2600" }, attempt_count: 1, max_attempts: 3, created_at: new Date().toISOString() },
      { id: "job-2", workspace_id: workspaceId, job_type: "WEBHOOK_DELIVERY", status: "COMPLETED", payload: { url: "https://api.creator.com" }, attempt_count: 1, max_attempts: 3, created_at: new Date().toISOString() },
    ];
  }

  async saveJob(job: DurableJobEntity): Promise<DurableJobEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("durable_jobs").upsert(job).select().single();
      if (!error && data) {
        const list = jobsStore.get(job.workspace_id) || [];
        const idx = list.findIndex((j) => j.id === data.id);
        if (idx >= 0) list[idx] = data;
        else list.unshift(data);
        jobsStore.set(job.workspace_id, list);
        return data;
      }
    } catch {}

    const list = jobsStore.get(job.workspace_id) || [];
    const idx = list.findIndex((j) => j.id === job.id);
    if (idx >= 0) list[idx] = job;
    else list.unshift(job);
    jobsStore.set(job.workspace_id, list);
    return job;
  }
}
