import { createClient } from "@/lib/supabase/server";

export interface EnterpriseCommandLearningRecord {
  id: string;
  command_id: string;
  workspace_id: string;
  lesson_type: string;
  description: string;
  error_type?: string;
  feedback_signal: Record<string, any>;
  created_at: string;
}

export class EnterpriseCommandLearningRepository {
  private fallbackData: EnterpriseCommandLearningRecord[] = [
    {
      id: "lrn-1",
      command_id: "cmd-1",
      workspace_id: "ws-primary-default",
      lesson_type: "PARAMETRIC_CALIBRATION",
      description: "Pre-warming Node 5 cache by 200MB prevents 1.2ms temporary tail latency spike during traffic drain.",
      error_type: "MINOR_TAIL_LATENCY",
      feedback_signal: { target_component: "node-5-cache", recommended_prewarm_mb: 200 },
      created_at: new Date().toISOString(),
    },
  ];

  async getLessons(workspaceId: string): Promise<EnterpriseCommandLearningRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("enterprise_command_learning").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}
    return this.fallbackData.filter((l) => l.workspace_id === workspaceId);
  }

  async recordLesson(workspaceId: string, data: Partial<EnterpriseCommandLearningRecord>): Promise<EnterpriseCommandLearningRecord> {
    const record: EnterpriseCommandLearningRecord = {
      id: `lrn-${Date.now()}`,
      command_id: data.command_id || "cmd-unknown",
      workspace_id: workspaceId,
      lesson_type: data.lesson_type || "EXECUTION_LEARNING",
      description: data.description || "Command outcome learning record",
      error_type: data.error_type,
      feedback_signal: data.feedback_signal || {},
      created_at: new Date().toISOString(),
    };
    try {
      const supabase = createClient();
      const { data: inserted, error } = await supabase.from("enterprise_command_learning").insert(record).select().single();
      if (!error && inserted) return inserted;
    } catch {}
    this.fallbackData.push(record);
    return record;
  }
}

export const enterpriseCommandLearningRepository = new EnterpriseCommandLearningRepository();
