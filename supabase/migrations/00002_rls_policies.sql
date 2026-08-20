-- VeritasTech AI Row Level Security Policies (RLS)
-- Enables strict multi-tenant isolation per authenticated user_id

-- 1. Enable RLS on all user-owned tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_runs ENABLE ROW LEVEL SECURITY;

-- 2. Define RLS Policies for Projects & Research Runs
CREATE POLICY "Users can manage their own profile" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage their own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own research runs" ON research_runs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access research questions for their runs" ON research_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM research_runs 
      WHERE research_runs.id = research_questions.research_run_id 
      AND research_runs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access evidence for their runs" ON evidence
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM research_runs 
      WHERE research_runs.id = evidence.research_run_id 
      AND research_runs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access claims for their runs" ON claims
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM research_runs 
      WHERE research_runs.id = claims.research_run_id 
      AND research_runs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access briefs for their runs" ON research_briefs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM research_runs 
      WHERE research_runs.id = research_briefs.research_run_id 
      AND research_runs.user_id = auth.uid()
    )
  );
