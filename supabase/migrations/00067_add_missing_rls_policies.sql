-- 00002_rls_policies.sql enabled RLS on every operational table but only wrote actual
-- policies for a handful of them (research_questions, evidence, claims, research_briefs,
-- plus the user-owned users/projects/research_runs). Postgres RLS denies ALL access when a
-- table has RLS enabled and zero policies, so authenticated (non-service-role) reads/writes
-- to the 13 tables below were silently failing — caught by try/catch in the repo layer and
-- logged as a warning, never a hard error ("new row violates row-level security policy").
-- Service-role write paths (sources / research_errors / model_runs / claims / brief repos)
-- bypass RLS and were unaffected. This fixes everything else and satisfies the Supabase
-- security advisor's "RLS enabled, no policy" findings.
--
-- Note: a prior hand-applied pass had since put blanket auth.role() = 'authenticated'
-- policies on all 13 tables. This migration drops the blanket policy on the 7 run-scoped
-- tables and replaces it with a stricter per-run one (section 2), keeps research_feedback
-- on its own user_id, and leaves the blanket policy as-is on the 5 shared/junction tables
-- (section 3), which have no per-row owner to scope by.
--
-- Two policy shapes, matching patterns already established in this codebase:
--
--  1. Run-scoped tables (have research_run_id) get the SAME per-user isolation that
--     00002 already applies to evidence/claims/research_questions/research_briefs:
--     access is allowed only when the parent research_runs row belongs to auth.uid().
--     research_feedback additionally has its own user_id column, so it keys off that
--     directly (matching the FK fixed in 00003).
--
--  2. Shared / junction tables (sources is a URL-deduped cache with no owner column;
--     source_relationships / source_snapshots / claim_evidence / claim_relationships are
--     link tables) get the "authenticated session required" pattern from 00066 — there is
--     no per-row owner to scope by, and they are only ever written by trusted server-side
--     code under an authenticated session.
--
-- Idempotent: safe to re-run (DROP POLICY IF EXISTS guards; ENABLE is a no-op if already on).

-- ---------------------------------------------------------------------------
-- 1. Ensure RLS is enabled (no-ops where 00002 already did this)
-- ---------------------------------------------------------------------------
ALTER TABLE search_queries        ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources               ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_relationships  ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_snapshots      ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_evidence        ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_relationships   ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflicts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_signals     ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_questions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_errors       ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_runs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_feedback     ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 2. Run-scoped tables: allow access only for rows whose research_run is owned
--    by the current user (mirrors the evidence/claims policies in 00002)
-- ---------------------------------------------------------------------------
-- A prior hand-applied pass had already put blanket auth.role() = 'authenticated'
-- policies on these 7 tables. Postgres OR-combines permissive policies, so leaving
-- those in place would let any authenticated user reach any user's rows regardless
-- of the per-run policy below. Drop them so the run-scoped policy is the only one.
DROP POLICY IF EXISTS "Authenticated users can access search queries" ON search_queries;
DROP POLICY IF EXISTS "Authenticated users can access conflicts" ON conflicts;
DROP POLICY IF EXISTS "Authenticated users can access community signals" ON community_signals;
DROP POLICY IF EXISTS "Authenticated users can access audience questions" ON audience_questions;
DROP POLICY IF EXISTS "Authenticated users can access content opportunities" ON content_opportunities;
DROP POLICY IF EXISTS "Authenticated users can access research errors" ON research_errors;
DROP POLICY IF EXISTS "Authenticated users can access model runs" ON model_runs;

DROP POLICY IF EXISTS "Users can access search queries for their runs" ON search_queries;
CREATE POLICY "Users can access search queries for their runs" ON search_queries
  FOR ALL
  USING (EXISTS (SELECT 1 FROM research_runs WHERE research_runs.id = search_queries.research_run_id AND research_runs.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM research_runs WHERE research_runs.id = search_queries.research_run_id AND research_runs.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can access conflicts for their runs" ON conflicts;
CREATE POLICY "Users can access conflicts for their runs" ON conflicts
  FOR ALL
  USING (EXISTS (SELECT 1 FROM research_runs WHERE research_runs.id = conflicts.research_run_id AND research_runs.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM research_runs WHERE research_runs.id = conflicts.research_run_id AND research_runs.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can access community signals for their runs" ON community_signals;
CREATE POLICY "Users can access community signals for their runs" ON community_signals
  FOR ALL
  USING (EXISTS (SELECT 1 FROM research_runs WHERE research_runs.id = community_signals.research_run_id AND research_runs.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM research_runs WHERE research_runs.id = community_signals.research_run_id AND research_runs.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can access audience questions for their runs" ON audience_questions;
CREATE POLICY "Users can access audience questions for their runs" ON audience_questions
  FOR ALL
  USING (EXISTS (SELECT 1 FROM research_runs WHERE research_runs.id = audience_questions.research_run_id AND research_runs.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM research_runs WHERE research_runs.id = audience_questions.research_run_id AND research_runs.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can access content opportunities for their runs" ON content_opportunities;
CREATE POLICY "Users can access content opportunities for their runs" ON content_opportunities
  FOR ALL
  USING (EXISTS (SELECT 1 FROM research_runs WHERE research_runs.id = content_opportunities.research_run_id AND research_runs.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM research_runs WHERE research_runs.id = content_opportunities.research_run_id AND research_runs.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can access research errors for their runs" ON research_errors;
CREATE POLICY "Users can access research errors for their runs" ON research_errors
  FOR ALL
  USING (EXISTS (SELECT 1 FROM research_runs WHERE research_runs.id = research_errors.research_run_id AND research_runs.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM research_runs WHERE research_runs.id = research_errors.research_run_id AND research_runs.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can access model runs for their runs" ON model_runs;
CREATE POLICY "Users can access model runs for their runs" ON model_runs
  FOR ALL
  USING (EXISTS (SELECT 1 FROM research_runs WHERE research_runs.id = model_runs.research_run_id AND research_runs.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM research_runs WHERE research_runs.id = model_runs.research_run_id AND research_runs.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage their own feedback" ON research_feedback;
CREATE POLICY "Users can manage their own feedback" ON research_feedback
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 3. Shared / junction tables: require an authenticated session (pattern from 00066).
--    No per-row owner column exists to scope these further.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can access sources" ON sources;
CREATE POLICY "Authenticated users can access sources" ON sources
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can access source relationships" ON source_relationships;
CREATE POLICY "Authenticated users can access source relationships" ON source_relationships
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can access source snapshots" ON source_snapshots;
CREATE POLICY "Authenticated users can access source snapshots" ON source_snapshots
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can access claim evidence" ON claim_evidence;
CREATE POLICY "Authenticated users can access claim evidence" ON claim_evidence
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can access claim relationships" ON claim_relationships;
CREATE POLICY "Authenticated users can access claim relationships" ON claim_relationships
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
