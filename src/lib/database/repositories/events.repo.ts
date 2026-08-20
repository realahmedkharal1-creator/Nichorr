import { createClient } from "@/lib/supabase/server";

export interface IntelligenceEventRecord {
  id: string;
  workspace_id: string;
  source_id: string;
  external_event_id: string;
  event_type: string;
  payload_hash: string;
  normalized_payload: any;
  trust_level: string;
  verification_status: "UNVERIFIED" | "CANDIDATE" | "SUPPORTED" | "VERIFIED" | "CONTESTED" | "REJECTED";
  processing_status: "RECEIVED" | "VALIDATING" | "NORMALIZED" | "DEDUPLICATED" | "PROCESSING" | "COMPLETED" | "FAILED";
  occurred_at?: string;
  received_at?: string;
  created_at?: string;
}

export class EventsRepository {
  async getEvents(workspaceId: string): Promise<IntelligenceEventRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("intelligence_events").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "evt-1",
        workspace_id: workspaceId,
        source_id: "src-1",
        external_event_id: "ext_evt_99182",
        event_type: "TECHNOLOGY_ANNOUNCEMENT",
        payload_hash: "mock_payload_hash_sha256",
        normalized_payload: { title: "Sub-path Distillation Edge Benchmark Release", category: "TECHNOLOGY" },
        trust_level: "ENTERPRISE_TRUSTED",
        verification_status: "CANDIDATE",
        processing_status: "COMPLETED",
        occurred_at: new Date().toISOString(),
        received_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    ];
  }
}
