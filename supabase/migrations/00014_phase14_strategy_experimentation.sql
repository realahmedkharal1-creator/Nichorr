-- VeritasTech AI Database Migration Schema: Phase 14 Strategy, Experimentation & Decision Intelligence
-- Adds objectives, objective_metrics, strategic_recommendations, strategic_decisions, experiments, experiment_guardrails, strategic_memory, strategy_drift_events, opportunity_portfolio, and autonomy_policies.

-- 1. OBJECTIVES TABLE
CREATE TABLE IF NOT EXISTS objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL,
  priority TEXT DEFAULT 'HIGH', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  status TEXT DEFAULT 'ACTIVE', -- 'DRAFT', 'ACTIVE', 'AT_RISK', 'ACHIEVED', 'PAUSED'
  target_metric TEXT NOT NULL,
  baseline_value NUMERIC(12, 4) DEFAULT 0.0,
  target_value NUMERIC(12, 4) DEFAULT 100.0,
  current_value NUMERIC(12, 4) DEFAULT 0.0,
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STRATEGIC DECISIONS TABLE
CREATE TABLE IF NOT EXISTS strategic_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  objective_id UUID REFERENCES objectives(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  context TEXT NOT NULL,
  alternatives JSONB DEFAULT '[]'::jsonb,
  chosen_alternative TEXT,
  confidence NUMERIC(5, 2) DEFAULT 95.00,
  cost_estimate NUMERIC(10, 4) DEFAULT 0.0,
  reversibility TEXT DEFAULT 'REVERSIBLE', -- 'REVERSIBLE', 'IRREVERSIBLE'
  status TEXT DEFAULT 'PROPOSED', -- 'PROPOSED', 'ANALYZING', 'WAITING_APPROVAL', 'APPROVED', 'COMPLETED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EXPERIMENTS TABLE
CREATE TABLE IF NOT EXISTS experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  control_variant TEXT NOT NULL,
  test_variants JSONB DEFAULT '[]'::jsonb,
  success_metric TEXT NOT NULL,
  status TEXT DEFAULT 'RUNNING', -- 'DRAFT', 'PROPOSED', 'APPROVED', 'RUNNING', 'COMPLETED', 'FAILED'
  result_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUTONOMY POLICIES TABLE
CREATE TABLE IF NOT EXISTS autonomy_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  autonomy_level INTEGER DEFAULT 3, -- 0 (OBSERVE) to 5 (POLICY-BOUND AUTONOMY)
  max_cost_per_action NUMERIC(10, 4) DEFAULT 5.00,
  max_tokens_per_action INTEGER DEFAULT 500000,
  requires_human_approval BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_obj_ws ON objectives(workspace_id);
CREATE INDEX IF NOT EXISTS idx_dec_ws ON strategic_decisions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_exp_ws ON experiments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_autonomy_ws ON autonomy_policies(workspace_id);

-- RLS POLICIES
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE autonomy_policies ENABLE ROW LEVEL SECURITY;
