import { createClient } from "@/lib/supabase/server";

export interface RunbookRecord {
  id: string;
  title: string;
  target_system: string;
  version: number;
  status: "DRAFT" | "REVIEW" | "APPROVED" | "PUBLISHED" | "DEPRECATED";
  created_at?: string;
}

export class RunbooksRepository {
  async getRunbooks(): Promise<RunbookRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("runbooks").select("*");
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "rb-1",
        title: "Edge TPU Node Latency Remediation Protocol",
        target_system: "Production Edge TPU Orchestrator",
        version: 1,
        status: "PUBLISHED",
        created_at: new Date().toISOString(),
      },
    ];
  }
}
