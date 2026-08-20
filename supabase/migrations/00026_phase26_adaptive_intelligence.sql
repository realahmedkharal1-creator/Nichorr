-- VeritasTech AI Database Migration Schema: Phase 26 Adaptive Intelligence Control Plane
-- Adds adaptive_metrics, adaptive_baselines, adaptive_anomalies, adaptive_drift, improvement_proposals, improvement_experiments, control_versions, control_changes.

-- 1. ADAPTIVE METRICS TABLE
CREATE TABLE IF NOT EXISTS adaptive_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_category TEXT NOT NULL, -- 'RETRIEVAL', 'RESEARCH', 'AGENT', 'EXECUTION', 'COST'
  metric_value NUMERIC(12, 4) NOT NULL,
  metric_unit TEXT DEFAULT 'ratio',
  baseline_value NUMERIC(12, 4),
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADAPTIVE BASELINES TABLE
CREATE TABLE IF NOT EXISTS adaptive_baselines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  baseline_version TEXT NOT NULL,
  baseline_value NUMERIC(12, 4) NOT NULL,
  sample_size INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ADAPTIVE ANOMALIES TABLE
CREATE TABLE IF NOT EXISTS adaptive_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  severity TEXT DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  observed_value NUMERIC(12, 4) NOT NULL,
  expected_value NUMERIC(12, 4) NOT NULL,
  status TEXT DEFAULT 'OPEN', -- 'OPEN', 'INVESTIGATING', 'EXPLAINED', 'MITIGATED', 'CLOSED'
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ADAPTIVE DRIFT TABLE
CREATE TABLE IF NOT EXISTS adaptive_drift (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  drift_type TEXT NOT NULL, -- 'MODEL_DRIFT', 'RETRIEVAL_DRIFT', 'AGENT_DRIFT', 'SOURCE_DRIFT'
  component TEXT NOT NULL,
  drift_score NUMERIC(5, 2) NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. IMPROVEMENT PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS adaptive_improvement_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  problem_statement TEXT NOT NULL,
  proposed_change TEXT NOT NULL,
  risk_level TEXT DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'GOVERNANCE_SENSITIVE'
  autonomy_level INTEGER DEFAULT 3,
  status TEXT DEFAULT 'AI_PROPOSED', -- 'DRAFT', 'AI_PROPOSED', 'UNDER_REVIEW', 'APPROVED', 'IMPLEMENTED', 'ROLLED_BACK'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. IMPROVEMENT EXPERIMENTS TABLE
CREATE TABLE IF NOT EXISTS improvement_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES adaptive_improvement_proposals(id) ON DELETE CASCADE,
  experiment_type TEXT DEFAULT 'SHADOW', -- 'SHADOW', 'A_B', 'CANARY', 'SIMULATION'
  control_score NUMERIC(5, 2),
  treatment_score NUMERIC(5, 2),
  status TEXT DEFAULT 'RUNNING', -- 'RUNNING', 'COMPLETED', 'FAILED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONTROL VERSIONS TABLE
CREATE TABLE IF NOT EXISTS control_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  control_key TEXT NOT NULL,
  version TEXT NOT NULL,
  configuration JSONB NOT NULL,
  status TEXT DEFAULT 'ACTIVE', -- 'DRAFT', 'VALIDATED', 'APPROVED', 'ACTIVE', 'SUPERSEDED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_adaptive_metrics_ws ON adaptive_metrics(workspace_id);
CREATE INDEX IF NOT EXISTS idx_adaptive_anomalies_ws ON adaptive_anomalies(workspace_id);
CREATE INDEX IF NOT EXISTS idx_adaptive_proposals_ws ON adaptive_improvement_proposals(workspace_id);

-- RLS POLICIES
ALTER TABLE adaptive_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_drift ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_improvement_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE improvement_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE control_versions ENABLE ROW LEVEL SECURITY;
