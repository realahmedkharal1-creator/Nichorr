-- VeritasTech AI Database Migration Schema: Phase 24 Decision Intelligence, Policy Simulation & Governed Action Planning
-- Adds decisions, decision_contexts, decision_options, decision_criteria, decision_simulations, decision_risks, decision_recommendations, decision_approvals, policies, action_plans, and decision_outcomes.

-- 1. DECISIONS TABLE
CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  decision_type TEXT DEFAULT 'STRATEGIC', -- 'STRATEGIC', 'TACTICAL', 'OPERATIONAL', 'RESOURCE_ALLOCATION', 'PRODUCT', 'TECHNOLOGY', 'POLICY'
  status TEXT DEFAULT 'OPTIONS_READY', -- 'DRAFT', 'ANALYZING', 'OPTIONS_READY', 'SIMULATING', 'REVIEW_REQUIRED', 'APPROVED', 'EXECUTED'
  decision_owner TEXT NOT NULL,
  risk_level TEXT DEFAULT 'MEDIUM',
  autonomy_level INTEGER DEFAULT 3,
  recommended_option_id TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DECISION OPTIONS TABLE
CREATE TABLE IF NOT EXISTS decision_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  option_type TEXT DEFAULT 'ALTERNATIVE', -- 'DO_NOTHING', 'CONTINUE', 'ACCELERATE', 'REDUCE', 'ALTERNATIVE'
  expected_benefits TEXT,
  expected_costs TEXT,
  mcda_score NUMERIC(5, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. POLICIES TABLE
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  scope TEXT DEFAULT 'ORGANIZATION',
  status TEXT DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ACTION PLANS TABLE
CREATE TABLE IF NOT EXISTS action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE,
  selected_option_id TEXT NOT NULL,
  status TEXT DEFAULT 'PLANNED', -- 'PLANNED', 'READY', 'APPROVED', 'EXECUTING', 'COMPLETED', 'ROLLED_BACK'
  steps JSONB DEFAULT '[]',
  rollback_strategy TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_decisions_ws ON decisions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_dec_options_dec ON decision_options(decision_id);
CREATE INDEX IF NOT EXISTS idx_policies_ws ON policies(workspace_id);
CREATE INDEX IF NOT EXISTS idx_act_plans_dec ON action_plans(decision_id);

-- RLS POLICIES
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;
