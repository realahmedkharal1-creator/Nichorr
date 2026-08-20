-- VeritasTech AI Database Migration Schema: Phase 28 System Simulation & Digital Twin Intelligence
-- Adds digital_twin_snapshots, simulation_scenarios, simulation_runs, simulation_states, simulation_results, simulation_risks, simulation_assumptions, simulation_provenance, simulation_actual_comparisons, simulation_learning.

-- 1. DIGITAL TWIN SNAPSHOTS TABLE
CREATE TABLE IF NOT EXISTS digital_twin_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  snapshot_version TEXT NOT NULL,
  source_environment TEXT DEFAULT 'PRODUCTION',
  state_hash TEXT NOT NULL,
  status TEXT DEFAULT 'SIMULATION_READY', -- 'DRAFT', 'CAPTURED', 'VALIDATED', 'SIMULATION_READY', 'SIMULATING', 'EXPIRED'
  components_captured INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SIMULATION SCENARIOS TABLE
CREATE TABLE IF NOT EXISTS simulation_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  snapshot_id UUID REFERENCES digital_twin_snapshots(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  scenario_type TEXT NOT NULL, -- 'OPERATIONAL_FAILURE', 'EXECUTION', 'REMEDIATION', 'CONTROL_CHANGE', 'TRAFFIC_CHANGE'
  hypothetical_change JSONB NOT NULL,
  assumptions JSONB DEFAULT '[]'::jsonb,
  risk_level TEXT DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'GOVERNANCE_SENSITIVE'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SIMULATION RUNS TABLE
CREATE TABLE IF NOT EXISTS simulation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID REFERENCES simulation_scenarios(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'COMPLETED', -- 'CREATED', 'VALIDATING', 'READY', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'
  simulated_outcome JSONB NOT NULL,
  confidence_score NUMERIC(5, 2) DEFAULT 88.5,
  uncertainty_notes TEXT,
  provenance_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SIMULATION ACTUAL COMPARISONS TABLE
CREATE TABLE IF NOT EXISTS simulation_actual_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_run_id UUID REFERENCES simulation_runs(id) ON DELETE CASCADE,
  execution_id TEXT,
  prediction_accuracy TEXT DEFAULT 'ACCURATE', -- 'ACCURATE', 'PARTIALLY_ACCURATE', 'INACCURATE', 'UNKNOWN'
  predicted_latency NUMERIC(10, 2),
  actual_latency NUMERIC(10, 2),
  error_margin NUMERIC(5, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_twin_snapshots_ws ON digital_twin_snapshots(workspace_id);
CREATE INDEX IF NOT EXISTS idx_sim_scenarios_snap ON simulation_scenarios(snapshot_id);
CREATE INDEX IF NOT EXISTS idx_sim_runs_scen ON simulation_runs(scenario_id);

-- RLS POLICIES
ALTER TABLE digital_twin_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_actual_comparisons ENABLE ROW LEVEL SECURITY;
