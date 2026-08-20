-- VeritasTech AI Database Migration Schema: Phase 10 Enterprise Production Hardening & Reliability
-- Adds durable_jobs, ai_generation_records, audit_logs, data_export_jobs, and security_events.

-- 1. DURABLE JOBS TABLE
CREATE TABLE IF NOT EXISTS durable_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL, -- 'RESEARCH_RUN', 'AGENT_EXECUTION', 'KNOWLEDGE_RECONCILIATION', 'WEBHOOK_DELIVERY'
  status TEXT NOT NULL DEFAULT 'QUEUED', -- 'QUEUED', 'RUNNING', 'RETRYING', 'WAITING', 'COMPLETED', 'FAILED', 'CANCELLED', 'DEAD_LETTER'
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  attempt_count INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  last_error TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AI GENERATION RECORDS TABLE (PROVENANCE & AUDIT)
CREATE TABLE IF NOT EXISTS ai_generation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  run_id TEXT,
  model_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  prompt_version TEXT DEFAULT 'v1.0',
  validation_status TEXT DEFAULT 'VALIDATED', -- 'GENERATED', 'VALIDATING', 'VALIDATED', 'REQUIRES_REVIEW', 'REJECTED', 'SUPERSEDED'
  confidence_score NUMERIC DEFAULT 85,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENTERPRISE AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  actor_id UUID,
  actor_name TEXT NOT NULL DEFAULT 'System',
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  outcome font-mono DEFAULT 'SUCCESS', -- 'SUCCESS', 'DENIED', 'FAILED'
  correlation_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DATA EXPORT JOBS TABLE
CREATE TABLE IF NOT EXISTS data_export_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  export_type font-mono DEFAULT 'WORKSPACE_FULL',
  status TEXT DEFAULT 'COMPLETED',
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST ENTERPRISE SEARCH & FILTERING
CREATE INDEX IF NOT EXISTS idx_durable_jobs_ws ON durable_jobs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_durable_jobs_status ON durable_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ai_generation_run ON ai_generation_records(run_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ws ON audit_logs(workspace_id);

-- ROW LEVEL SECURITY
ALTER TABLE durable_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_export_jobs ENABLE ROW LEVEL SECURITY;
