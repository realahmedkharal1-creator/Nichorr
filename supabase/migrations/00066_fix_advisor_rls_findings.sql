-- Fixes 3 CRITICAL "RLS Disabled in Public" findings from Supabase's Advisor:
-- creator_intelligence_artifacts, creator_intelligence_audits, and prompt_versions
-- had no Row Level Security, making them readable/writable by anyone holding the
-- project's anon key, logged in or not.
--
-- None of these tables have a user_id/owner column — they're shared, app-level
-- cache/audit/config data (not per-user secrets) accessed only from server-side
-- code via the authenticated user's session (see src/lib/database/repositories/
-- creator-intelligence.repo.ts). So the fix is to require an authenticated
-- session for any access, matching how the app already uses these tables,
-- rather than modeling per-row ownership that doesn't exist.

ALTER TABLE creator_intelligence_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_intelligence_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can access creator intelligence artifacts" ON creator_intelligence_artifacts
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access creator intelligence audits" ON creator_intelligence_audits
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access prompt versions" ON prompt_versions
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
