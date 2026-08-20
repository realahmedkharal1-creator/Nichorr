-- VeritasTech AI Database Migration Schema: Phase 27 Governed Autonomous Operations, Self-Healing & Resilience Fabric
-- Adds operational_health, service_dependencies, incident_signals, incident_correlations, failure_graph_nodes, failure_graph_edges, recovery_hypotheses, remediation_plans, remediation_steps, remediation_attempts, remediation_verifications, incident_escalations, incident_postmortems, resilience_lessons, resilience_improvements.

-- 1. OPERATIONAL HEALTH TABLE
CREATE TABLE IF NOT EXISTS operational_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  subsystem TEXT NOT NULL, -- 'API', 'DATABASE', 'WORKERS', 'EVENT_MESH', 'RESEARCH', 'RETRIEVAL', 'GRAPH', 'AGENTS', 'PRODUCTS', 'EXECUTION'
  status TEXT DEFAULT 'HEALTHY', -- 'HEALTHY', 'DEGRADED', 'WARNING', 'CRITICAL', 'UNKNOWN', 'RECOVERING'
  health_score NUMERIC(5, 2) DEFAULT 100.0,
  latency_p95 NUMERIC(10, 2),
  error_rate NUMERIC(5, 4),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SERVICE DEPENDENCIES TABLE
CREATE TABLE IF NOT EXISTS service_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  depends_on TEXT NOT NULL,
  criticality TEXT DEFAULT 'HIGH', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  failure_propagation_risk NUMERIC(5, 2) DEFAULT 80.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. REMEDIATION PLANS TABLE
CREATE TABLE IF NOT EXISTS remediation_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  steps JSONB NOT NULL,
  risk_level TEXT DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'GOVERNANCE_SENSITIVE'
  autonomy_level INTEGER DEFAULT 3,
  status TEXT DEFAULT 'PROPOSED', -- 'PROPOSED', 'RISK_ASSESSED', 'AUTHORIZED', 'QUEUED', 'RUNNING', 'VERIFYING', 'SUCCEEDED', 'FAILED', 'ROLLED_BACK'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INCIDENT POSTMORTEMS TABLE
CREATE TABLE IF NOT EXISTS incident_postmortems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  timeline JSONB NOT NULL,
  root_cause_hypothesis TEXT NOT NULL,
  successful_remediation TEXT,
  failed_remediations JSONB DEFAULT '[]'::jsonb,
  recovery_verification_evidence JSONB DEFAULT '{}'::jsonb,
  resilience_lessons JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_op_health_ws ON operational_health(workspace_id);
CREATE INDEX IF NOT EXISTS idx_remediation_plans_inc ON remediation_plans(incident_id);
CREATE INDEX IF NOT EXISTS idx_postmortems_inc ON incident_postmortems(incident_id);

-- RLS POLICIES
ALTER TABLE operational_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE remediation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_postmortems ENABLE ROW LEVEL SECURITY;
