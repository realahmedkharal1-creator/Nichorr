import { createClient } from "@/lib/supabase/server";
import { ResearchRunSession } from "@/features/research/research-engine";

export class ResearchRunsRepository {
  async saveRun(session: ResearchRunSession, userId?: string): Promise<boolean> {
    try {
      const supabase = createClient();

      // Guard against a stale/orphaned invocation (e.g. a serverless function that kept running
      // after the client disconnected, then finished long after a faster parallel invocation
      // already completed the same run) clobbering an already-finished run with an earlier-stage
      // snapshot. Once a run is terminal in the DB, only another terminal write may touch it.
      const TERMINAL_STATUSES = ["COMPLETED", "FAILED", "CANCELLED", "PARTIAL"];
      if (session.id && !session.id.startsWith("run-") && !TERMINAL_STATUSES.includes(session.status)) {
        const { data: existing } = await supabase
          .from("research_runs")
          .select("status")
          .eq("id", session.id)
          .single();
        if (existing && TERMINAL_STATUSES.includes(existing.status)) {
          return true;
        }
      }

      const payload: any = {
        topic: session.topic,
        objective: session.objective,
        content_type: session.contentType,
        target_audience: session.targetAudience,
        requested_depth: session.requestedDepth,
        output_language: session.outputLanguage || "en",
        status: session.status,
        source_count: session.sources.length,
        claim_count: session.claims.length,
        token_usage: { sources: session.sources },
        error_message: session.failureReason || null,
        // Full-fidelity snapshot so a later, possibly cold-started, serverless invocation can
        // resume the pipeline exactly where a previous short-lived invocation left off, instead
        // of losing in-memory-only fields (conflicts, community signals, youtube report, etc.)
        // that aren't modeled as their own DB columns/tables.
        session_state: session,
      };

      if (session.projectId) {
        payload.project_id = session.projectId;
      }

      if (userId) {
        payload.user_id = userId;
      }

      if (session.id && !session.id.startsWith("run-")) {
        payload.id = session.id;
      }

      const { data, error } = await supabase.from("research_runs").upsert(payload).select().single();

      if (error) {
        console.warn("Supabase saveRun query warning:", error.message);
        return false;
      }

      if (data && data.id) {
        session.id = data.id;
      }

      return true;
    } catch (e) {
      console.warn("Supabase database connection unavailable:", e);
      return false;
    }
  }

  async getRunsByProjectId(projectId: string, userId?: string): Promise<any[]> {
    try {
      const supabase = createClient();
      let query = supabase
        .from("research_runs")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (userId) query = query.eq("user_id", userId);

      const { data, error } = await query;
      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  }

  async getRunById(id: string, userId?: string): Promise<ResearchRunSession | null> {
    try {
      const supabase = createClient();
      let query = supabase
        .from("research_runs")
        .select("*, claims(*), evidence(*), conflicts(*), research_briefs(*)")
        .eq("id", id);

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query.single();
      if (error || !data) return null;

      // Prefer the full session snapshot when present — it carries fields (conflicts, community
      // signals, youtube intelligence, etc.) that aren't reconstructable from the relational
      // columns/tables below, which is what makes resuming a partially-completed run possible.
      if (data.session_state && typeof data.session_state === "object" && data.session_state.id) {
        return {
          ...(data.session_state as ResearchRunSession),
          status: data.status || data.session_state.status,
          failureReason: data.error_message || data.session_state.failureReason,
        };
      }

      const briefData = Array.isArray(data.research_briefs) && data.research_briefs.length > 0
        ? data.research_briefs[0]
        : data.research_briefs || undefined;

      return {
        id: data.id,
        topic: data.topic,
        objective: data.objective,
        contentType: data.content_type || "Comparison",
        targetAudience: data.target_audience || "Tech Creators",
        requestedDepth: data.requested_depth || "Standard",
        outputLanguage: data.output_language || "en",
        status: data.status || "COMPLETED",
        failureReason: data.error_message || undefined,
        createdAt: data.created_at,
        updatedAt: data.created_at,
        sources: (data.sources || []).map((s: any) => ({
          id: s.id,
          title: s.title || "Source",
          url: s.canonical_url || s.url || "",
          publisher: s.publisher || "Web",
          sourceType: s.source_type || "DOCUMENTATION",
          qualityScore: s.quality_score || 9.0,
        })),
        claims: (data.claims || []).map((c: any) => ({
          id: c.id,
          claim_text: c.claim_text,
          claim_type: c.claim_type,
          status: c.status,
          confidence: c.confidence,
          evidence_ids: [],
        })),
        evidence: (data.evidence || []).map((e: any) => ({
          id: e.id,
          source_id: e.source_id,
          excerpt: e.excerpt,
          evidence_type: e.evidence_type,
          product_entity: e.product_entity || "Target Device",
        })),
        conflicts: (data.conflicts || []).map((cnf: any) => ({
          id: cnf.id,
          claim_a_id: cnf.claim_a_id || "",
          claim_b_id: cnf.claim_b_id || "",
          conflict_type: cnf.conflict_type || "METHODOLOGICAL",
          explanation: cnf.explanation,
        })),
        communitySignals: [],
        audienceQuestions: [],
        opportunities: [],
        brief: briefData ? {
          executive_summary: briefData.executive_summary || [],
          key_findings: briefData.key_findings || [],
          verified_facts: briefData.verified_facts || [],
          measured_results: briefData.measured_results || [],
          conflicts: briefData.conflicts || [],
          community_signals: briefData.community_signals || [],
          audience_questions: briefData.audience_questions || [],
          content_opportunities: briefData.content_opportunities || [],
          important_caveats: briefData.important_caveats || briefData.caveats || [],
        } : undefined,
        qualityGateStatus: "READY",
      };
    } catch {
      return null;
    }
  }

  async getAllRuns(userId?: string): Promise<any[]> {
    try {
      const supabase = createClient();
      let query = supabase
        .from("research_runs")
        .select("*")
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;
      if (error || !data) return [];
      
      const { ResearchEngine } = await import("@/features/research/research-engine");

      return data.map((r: any) => {
        const activeRun = ResearchEngine.getRun(r.id);
        const sourceCount = (activeRun?.sources && activeRun.sources.length > 0)
          ? activeRun.sources.length
          : (r.source_count || 0);
        const claimCount = (activeRun?.claims && activeRun.claims.length > 0)
          ? activeRun.claims.length
          : (r.claim_count || 0);

        return {
          id: r.id,
          topic: r.topic,
          objective: r.objective,
          contentType: r.content_type || "Comparison",
          targetAudience: r.target_audience || "Tech Creators",
          requestedDepth: r.requested_depth || "Standard",
          outputLanguage: r.output_language || "en",
          status: activeRun?.status || r.status || "COMPLETED",
          createdAt: r.created_at,
          updatedAt: r.created_at,
          sources: activeRun?.sources || [],
          claims: activeRun?.claims || [],
          evidence: activeRun?.evidence || [],
          conflicts: activeRun?.conflicts || [],
          communitySignals: activeRun?.communitySignals || [],
          audienceQuestions: activeRun?.audienceQuestions || [],
          opportunities: activeRun?.opportunities || [],
          source_count: sourceCount,
          claim_count: claimCount,
          qualityGateStatus: activeRun?.qualityGateStatus || "READY",
        };
      });
    } catch {
      return [];
    }
  }
}
