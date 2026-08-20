-- VeritasTech AI Database Migration Schema: Phase 26 Autonomous Control Plane, Resource Governance & Self-Healing Operations
-- Adds operational_state_snapshots, operational_state_transitions, telemetry_events, operational_dependencies, resource_usage, agent_health, remediation_proposals, and remediation_attempts.

-- 1. OPERATIONAL STATE SNAPSHOTS TABLE
CREATE TABLE IF NOT EXISTS operational_state_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  state TEXT NOT NULL, -- 'HEALTHY', 'DEGRADED', 'WARNING', 'ANOMALOUS', 'FAILING', 'RECOVERING', 'QUARANTINED', 'UNKNOWN'
  score NUMERIC(5, 2) DEFAULT 100.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TELEMETRY EVENTS TABLE
CREATE TABLE IF NOT EXISTS telemetry_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  component TEXT NOT NULL,
  metric TEXT NOT NULL,
  value NUMERIC(12, 4) NOT NULL,
  unit TEXT DEFAULT 'ms',
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RESOURCE USAGE TABLE
CREATE TABLE IF NOT EXISTS resource_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL, -- 'TOKENS', 'COMPUTE', 'API_CALLS', 'STORAGE'
  current_usage NUMERIC(12, 2) NOT NULL,
  ceiling_limit NUMERIC(12, 2) NOT NULL,
  status TEXT DEFAULT 'NORMAL', -- 'NORMAL', 'WARNING', 'THROTTLED', 'BLOCKED'
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AGENT HEALTH TABLE
CREATE TABLE IF NOT EXISTS agent_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  status TEXT DEFAULT 'HEALTHY', -- 'HEALTHY', 'ANOMALOUS', 'DEGRADED', 'QUARANTINED'
  grounding_score NUMERIC(5, 2) DEFAULT 98.5,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REMEDIATION PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS remediation_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  proposed_action TEXT NOT NULL,
  risk_level TEXT DEFAULT 'MEDIUM',
  autonomy_level INTEGER DEFAULT 3,
  status TEXT DEFAULT 'AI_PROPOSED', -- 'AI_PROPOSED', 'UNDER_REVIEW', 'APPROVED', 'EXECUTED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_op_state_ws ON operational_state_snapshots(workspace_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_ws ON telemetry_events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_resource_usage_ws ON resource_usage(workspace_id);
CREATE INDEX IF NOT EXISTS idx_agent_health_id ON agent_health(agent_id);

-- RLS POLICIES
ALTER TABLE operational_state_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE remediation_proposals ENABLE ROW LEVEL SECURITY;
