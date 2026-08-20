-- VeritasTech AI Database Migration Schema: Phase 6 Production Automation & Orchestration
-- Adds automation events, workflow runs, human approvals, notifications, and audit logs.

-- 1. AUTOMATION EVENTS TABLE
CREATE TABLE IF NOT EXISTS automation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'RESEARCH_COMPLETED', 'KNOWLEDGE_UPDATED', 'KNOWLEDGE_CONTESTED', 'WATCH_ITEM_CHANGED', 'ALERT_CREATED', 'CONTENT_STAGE_CHANGED', 'CONTENT_REQUIRES_REVIEW'
  payload JSONB DEFAULT '{}'::jsonb,
  idempotency_key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WORKFLOW RUNS TABLE
CREATE TABLE IF NOT EXISTS workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  trigger_event_id UUID REFERENCES automation_events(id) ON DELETE SET NULL,
  workflow_type TEXT NOT NULL, -- 'RESEARCH_SYNC', 'KNOWLEDGE_CHANGE_CASCADE', 'CONTENT_IMPACT_AUDIT', 'STALE_EVIDENCE_SWEEP'
  status TEXT DEFAULT 'RUNNING', -- 'QUEUED', 'RUNNING', 'WAITING_APPROVAL', 'COMPLETED', 'FAILED', 'CANCELLED'
  current_step TEXT DEFAULT 'INITIALIZING',
  retry_count INT DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AUTOMATION APPROVALS TABLE
CREATE TABLE IF NOT EXISTS automation_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES workflow_runs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  rationale TEXT NOT NULL,
  proposed_action TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  decided_at TIMESTAMPTZ
);

-- 4. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'INFORMATIONAL', -- 'INFORMATIONAL', 'WARNING', 'IMPORTANT', 'CRITICAL'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AUTOMATION AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS automation_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES workflow_runs(id) ON DELETE SET NULL,
  actor TEXT DEFAULT 'SYSTEM_AUTOMATION', -- 'SYSTEM_AUTOMATION', 'USER'
  event_name TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_automation_events_project ON automation_events(project_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_project ON workflow_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_automation_approvals_project ON automation_approvals(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_project ON notifications(project_id);
CREATE INDEX IF NOT EXISTS idx_automation_audit_project ON automation_audit_logs(project_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE automation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR USER TENANCY ISOLATION
CREATE POLICY "Users can manage automation events for their projects" ON automation_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = automation_events.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage workflow runs for their projects" ON workflow_runs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = workflow_runs.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage approvals for their projects" ON automation_approvals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = automation_approvals.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage notifications for their projects" ON notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = notifications.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage audit logs for their projects" ON automation_audit_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = automation_audit_logs.project_id AND projects.user_id = auth.uid()
    )
  );
