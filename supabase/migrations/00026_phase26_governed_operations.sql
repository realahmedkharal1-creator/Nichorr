-- VeritasTech AI Database Migration Schema: Phase 26 Governed Autonomous Operations, Incident Response & Control Plane
-- Adds operational_observations, health_states, anomalies, incidents, incident_impacts, root_cause_hypotheses, incident_response_plans, circuit_breakers, runbooks, recovery_verifications, post_incident_reviews, operational_lessons, and slo_definitions.

-- 1. OPERATIONAL OBSERVATIONS TABLE
CREATE TABLE IF NOT EXISTS operational_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  source_system TEXT NOT NULL,
  observation_type TEXT NOT NULL, -- 'LATENCY_SPIKE', 'ERROR_SPIKE', 'CONNECTOR_FAILURE', 'EXECUTION_FAILURE'
  observed_at TIMESTAMPTZ DEFAULT NOW(),
  severity TEXT DEFAULT 'MEDIUM',
  payload JSONB DEFAULT '{}'::jsonb
);

-- 2. HEALTH STATES TABLE
CREATE TABLE IF NOT EXISTS health_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_component TEXT NOT NULL,
  status TEXT DEFAULT 'HEALTHY', -- 'HEALTHY', 'DEGRADED', 'AT_RISK', 'UNHEALTHY', 'CRITICAL'
  reason_codes TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ANOMALIES TABLE
CREATE TABLE IF NOT EXISTS anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  detector_type TEXT NOT NULL,
  baseline_value NUMERIC(10, 4),
  observed_value NUMERIC(10, 4),
  threshold_value NUMERIC(10, 4),
  confidence NUMERIC(5, 2) DEFAULT 95.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INCIDENTS TABLE
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'DETECTED', -- 'DETECTED', 'TRIAGING', 'CONFIRMED', 'MITIGATING', 'MONITORING', 'RECOVERED', 'RESOLVED'
  severity TEXT DEFAULT 'SEV_3', -- 'SEV_5', 'SEV_4', 'SEV_3', 'SEV_2', 'SEV_1'
  affected_system TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CIRCUIT BREAKERS TABLE
CREATE TABLE IF NOT EXISTS circuit_breakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_connector TEXT NOT NULL,
  state TEXT DEFAULT 'CLOSED', -- 'CLOSED', 'OPEN', 'HALF_OPEN'
  failure_count INTEGER DEFAULT 0,
  last_tripped_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_obs_ws ON operational_observations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_incidents_ws ON incidents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_circuit_breakers_target ON circuit_breakers(target_connector);

-- RLS POLICIES
ALTER TABLE operational_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE circuit_breakers ENABLE ROW LEVEL SECURITY;
