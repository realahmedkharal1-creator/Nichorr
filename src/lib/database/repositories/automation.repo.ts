import { createClient } from "@/lib/supabase/server";

export type WorkflowStatus = "QUEUED" | "RUNNING" | "WAITING_APPROVAL" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface WorkflowRunEntity {
  id: string;
  project_id: string;
  trigger_event_id?: string;
  workflow_type: string;
  status: WorkflowStatus;
  current_step: string;
  retry_count: number;
  last_error?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AutomationApprovalEntity {
  id: string;
  project_id: string;
  workflow_id: string;
  title: string;
  rationale: string;
  proposed_action: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at?: string;
  decided_at?: string;
}

export interface AutomationAuditEntity {
  id: string;
  project_id: string;
  workflow_id?: string;
  actor: string;
  event_name: string;
  details: string;
  created_at?: string;
}

const globalAuto = globalThis as unknown as {
  workflowsStore: Map<string, WorkflowRunEntity[]> | undefined;
  approvalsStore: Map<string, AutomationApprovalEntity[]> | undefined;
  auditStore: Map<string, AutomationAuditEntity[]> | undefined;
};
const workflowsStore = globalAuto.workflowsStore ?? new Map<string, WorkflowRunEntity[]>();
const approvalsStore = globalAuto.approvalsStore ?? new Map<string, AutomationApprovalEntity[]>();
const auditStore = globalAuto.auditStore ?? new Map<string, AutomationAuditEntity[]>();

if (process.env.NODE_ENV !== "production") {
  globalAuto.workflowsStore = workflowsStore;
  globalAuto.approvalsStore = approvalsStore;
  globalAuto.auditStore = auditStore;
}

export class AutomationRepository {
  async getWorkflowRuns(projectId?: string): Promise<WorkflowRunEntity[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("workflow_runs").select("*").order("updated_at", { ascending: false });
      if (projectId) query = query.eq("project_id", projectId);

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {}

    const all = Array.from(workflowsStore.values()).flat();
    if (projectId) return all.filter((w) => w.project_id === projectId);
    return all;
  }

  async saveWorkflowRun(run: WorkflowRunEntity): Promise<WorkflowRunEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("workflow_runs").upsert(run).select().single();
      if (!error && data) {
        const list = workflowsStore.get(run.project_id) || [];
        const idx = list.findIndex((w) => w.id === data.id);
        if (idx >= 0) list[idx] = data;
        else list.unshift(data);
        workflowsStore.set(run.project_id, list);
        return data;
      }
    } catch {}

    const list = workflowsStore.get(run.project_id) || [];
    const idx = list.findIndex((w) => w.id === run.id);
    if (idx >= 0) list[idx] = run;
    else list.unshift(run);
    workflowsStore.set(run.project_id, list);
    return run;
  }

  async getApprovals(projectId?: string): Promise<AutomationApprovalEntity[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("automation_approvals").select("*").order("created_at", { ascending: false });
      if (projectId) query = query.eq("project_id", projectId);

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {}

    const all = Array.from(approvalsStore.values()).flat();
    if (projectId) return all.filter((a) => a.project_id === projectId);
    return all;
  }

  async saveApproval(approval: AutomationApprovalEntity): Promise<AutomationApprovalEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("automation_approvals").upsert(approval).select().single();
      if (!error && data) {
        const list = approvalsStore.get(approval.project_id) || [];
        const idx = list.findIndex((a) => a.id === data.id);
        if (idx >= 0) list[idx] = data;
        else list.unshift(data);
        approvalsStore.set(approval.project_id, list);
        return data;
      }
    } catch {}

    const list = approvalsStore.get(approval.project_id) || [];
    const idx = list.findIndex((a) => a.id === approval.id);
    if (idx >= 0) list[idx] = approval;
    else list.unshift(approval);
    approvalsStore.set(approval.project_id, list);
    return approval;
  }

  async saveAuditLog(log: AutomationAuditEntity): Promise<AutomationAuditEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("automation_audit_logs").insert(log).select().single();
      if (!error && data) {
        const list = auditStore.get(log.project_id) || [];
        list.unshift(data);
        auditStore.set(log.project_id, list);
        return data;
      }
    } catch {}

    const list = auditStore.get(log.project_id) || [];
    list.unshift(log);
    auditStore.set(log.project_id, list);
    return log;
  }

  async getAuditLogs(projectId?: string): Promise<AutomationAuditEntity[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("automation_audit_logs").select("*").order("created_at", { ascending: false });
      if (projectId) query = query.eq("project_id", projectId);

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {}

    const all = Array.from(auditStore.values()).flat();
    if (projectId) return all.filter((l) => l.project_id === projectId);
    return all;
  }
}
