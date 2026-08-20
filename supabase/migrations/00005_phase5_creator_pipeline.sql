-- VeritasTech AI Database Migration Schema: Phase 5 Creator Operating System
-- Adds persistent content items, content claims, content versions, and unified action feed.

-- 1. CONTENT ITEMS TABLE
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  research_run_id UUID REFERENCES research_runs(id) ON DELETE SET NULL,
  opportunity_id TEXT,
  title TEXT NOT NULL,
  working_title TEXT,
  content_type TEXT DEFAULT 'YouTube Video', -- 'YouTube Video', 'YouTube Short', 'Instagram Reel', 'TikTok', 'Article', 'Newsletter', 'Social Post'
  topic TEXT NOT NULL,
  objective TEXT,
  stage TEXT DEFAULT 'IDEA', -- 'IDEA', 'RESEARCH_NEEDED', 'RESEARCH_READY', 'OUTLINE_READY', 'SCRIPTING', 'FACT_CHECK', 'READY_TO_RECORD', 'RECORDED', 'EDITING', 'READY_TO_PUBLISH', 'PUBLISHED', 'ARCHIVED'
  priority TEXT DEFAULT 'MEDIUM', -- 'HIGH', 'MEDIUM', 'LOW'
  audience TEXT,
  hook TEXT,
  outline JSONB,
  script TEXT,
  fact_check_status TEXT DEFAULT 'PENDING', -- 'PENDING', 'PASSED', 'WARNINGS', 'FAILED'
  publish_readiness_status TEXT DEFAULT 'NOT_READY', -- 'READY', 'READY_WITH_WARNINGS', 'NOT_READY'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- 2. CONTENT CLAIMS LINKING TABLE
CREATE TABLE IF NOT EXISTS content_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  claim_text TEXT NOT NULL,
  evidence_status TEXT DEFAULT 'SUPPORTED', -- 'SUPPORTED', 'NEEDS_CONTEXT', 'CONTRADICTED', 'UNSUPPORTED', 'STALE'
  knowledge_item_id UUID REFERENCES knowledge_items(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ACTION ITEMS TABLE (Unified Priority Action Feed)
CREATE TABLE IF NOT EXISTS action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reason TEXT NOT NULL,
  priority TEXT DEFAULT 'MEDIUM', -- 'HIGH', 'MEDIUM', 'LOW'
  category TEXT DEFAULT 'RESEARCH', -- 'RESEARCH', 'CONTENT', 'KNOWLEDGE', 'ALERT'
  action_type TEXT NOT NULL, -- 'START_RESEARCH', 'REVIEW_CONTENT', 'REFRESH_KNOWLEDGE', 'RESOLVE_ALERT'
  entity_id TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_content_items_project ON content_items(project_id);
CREATE INDEX IF NOT EXISTS idx_content_items_stage ON content_items(stage);
CREATE INDEX IF NOT EXISTS idx_content_claims_content ON content_claims(content_item_id);
CREATE INDEX IF NOT EXISTS idx_action_items_project ON action_items(project_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR USER TENANCY ISOLATION
CREATE POLICY "Users can manage content items for their projects" ON content_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = content_items.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage content claims for their projects" ON content_claims
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM content_items
      JOIN projects ON projects.id = content_items.project_id
      WHERE content_items.id = content_claims.content_item_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage action items for their projects" ON action_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = action_items.project_id AND projects.user_id = auth.uid()
    )
  );
