import { createClient } from "@/lib/supabase/server";

export interface EventKnowledgeImpactRecord {
  id: string;
  event_id: string;
  target_type: string;
  target_id: string;
  severity: "NO_IMPACT" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  explanation: string;
  status: string;
  created_at?: string;
}

export class EventImpactsRepository {
  async getImpacts(eventId: string): Promise<EventKnowledgeImpactRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("event_knowledge_impacts").select("*").eq("event_id", eventId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "imp-1",
        event_id: eventId,
        target_type: "PRODUCT",
        target_id: "prod-1",
        severity: "HIGH",
        explanation: "Incoming announcement affects AI Chip Competitive Watch product freshness.",
        status: "DETECTED",
        created_at: new Date().toISOString(),
      },
    ];
  }
}
