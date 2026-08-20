-- VeritasTech AI Database Migration Schema: Phase 4 Knowledge & Monitoring
-- Adds persistent project-level knowledge, version history, watch items, and alerts.

-- 1. KNOWLEDGE ITEMS TABLE
CREATE TABLE IF NOT EXISTS knowledge_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  normalized_claim TEXT NOT NULL,
  current_value TEXT NOT NULL,
  confidence TEXT DEFAULT 'HIGH', -- 'HIGH', 'MEDIUM', 'LOW'
  status TEXT DEFAULT 'SUPPORTED', -- 'SUPPORTED', 'CONTRADICTED', 'STALE', 'UNVERIFIED', 'REQUIRES_REVIEW'
  supporting_sources_count INT DEFAULT 1,
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  freshness_status TEXT DEFAULT 'FRESH', -- 'FRESH', 'AGING', 'STALE'
  originating_run_id UUID REFERENCES research_runs(id) ON DELETE SET NULL,
  latest_run_id UUID REFERENCES research_runs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. KNOWLEDGE CHANGES LOG TABLE
CREATE TABLE IF NOT EXISTS knowledge_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  knowledge_item_id UUID REFERENCES knowledge_items(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL, -- 'NEW_INFO', 'VALUE_CHANGED', 'CONTRADICTION', 'CONFIDENCE_SHIFT', 'SOURCE_REPLACED'
  previous_value TEXT,
  new_value TEXT NOT NULL,
  explanation TEXT NOT NULL,
  detecting_run_id UUID REFERENCES research_runs(id) ON DELETE SET NULL,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WATCH ITEMS TABLE
CREATE TABLE IF NOT EXISTS watch_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  topic_or_entity TEXT NOT NULL,
  description TEXT,
  freshness_interval_days INT DEFAULT 30,
  is_enabled BOOLEAN DEFAULT TRUE,
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  next_check_due TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  changes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ALERTS TABLE
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  watch_item_id UUID REFERENCES watch_items(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL, -- 'NEW_INFORMATION', 'CLAIM_CHANGED', 'CLAIM_CONTRADICTED', 'EVIDENCE_STALE', 'REVIEW_REQUIRED'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'MEDIUM', -- 'HIGH', 'MEDIUM', 'LOW'
  is_read BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_knowledge_items_project ON knowledge_items(project_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_changes_project ON knowledge_changes(project_id);
CREATE INDEX IF NOT EXISTS idx_watch_items_project ON watch_items(project_id);
CREATE INDEX IF NOT EXISTS idx_alerts_project ON alerts(project_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR USER TENANCY ISOLATION
CREATE POLICY "Users can manage knowledge for their projects" ON knowledge_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = knowledge_items.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage knowledge changes for their projects" ON knowledge_changes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = knowledge_changes.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage watch items for their projects" ON watch_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = watch_items.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage alerts for their projects" ON alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = alerts.project_id AND projects.user_id = auth.uid()
    )
  );
