import { createClient } from "@/lib/supabase/server";

export class CreatorIntelligenceRepo {
  private static tryGetClient() {
    try {
      if (process.env.NODE_ENV === "test" || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return null;
      }
      return createClient();
    } catch (e) {
      return null;
    }
  }

  static async saveArtifact(namespace: string, artifactType: string, lookupKey: string, payload: any) {
    const supabase = this.tryGetClient();
    if (!supabase) return false;

    try {
      // Upsert logic based on artifact_type and lookup_key
      const { data: existing } = await supabase
        .from("creator_intelligence_artifacts")
        .select("id")
        .eq("artifact_type", artifactType)
        .eq("lookup_key", lookupKey)
        .eq("namespace", namespace)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("creator_intelligence_artifacts")
          .update({ payload, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("creator_intelligence_artifacts")
          .insert({ artifact_type: artifactType, namespace, lookup_key: lookupKey, payload });
      }
      return true;
    } catch (e) {
      console.warn(`[CreatorIntelligenceRepo] DB Save failed for ${artifactType}`, e);
      return false;
    }
  }

  static async getArtifacts(namespace: string, artifactType: string, lookupKey: string): Promise<any[]> {
    const supabase = this.tryGetClient();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from("creator_intelligence_artifacts")
        .select("payload")
        .eq("artifact_type", artifactType)
        .eq("namespace", namespace)
        .eq("lookup_key", lookupKey)
        .order("created_at", { ascending: false });

      if (error || !data) return [];
      return data.map(row => row.payload);
    } catch (e) {
      return [];
    }
  }

  static async saveAudit(namespace: string, lookupKey: string, eventType: string, payload: any) {
    const supabase = this.tryGetClient();
    if (!supabase) return false;

    try {
      await supabase
        .from("creator_intelligence_audits")
        .insert({ namespace, lookup_key: lookupKey, event_type: eventType, payload });
      return true;
    } catch (e) {
      return false;
    }
  }
}
