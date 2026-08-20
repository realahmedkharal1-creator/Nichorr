-- VeritasTech AI Database Migration: Phase 29 Strategic Optimization & Decision Planning Intelligence
-- Tables: strategic_objectives, strategic_decisions, decision_options, decision_constraints, decision_scores, strategic_plans, strategic_portfolios, strategic_outcomes, strategic_learning

CREATE TABLE IF NOT EXISTS strategic_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  owner_id TEXT,
  priority TEXT DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
  status TEXT DEFAULT 'DRAFT', -- DRAFT, ACTIVE, PAUSED, ACHIEVED, FAILED, SUPERSEDED, CLOSED
  timeframe TEXT,
  success_metrics JSONB DEFAULT '[]'::jsonb,
  baseline_value NUMERIC(10,2),
  target_value NUMERIC(10,2),
  minimum_acceptable_outcome TEXT,
  maximum_acceptable_risk TEXT DEFAULT 'MEDIUM',
  budget_constraint NUMERIC(10,2),
  resource_constraints JSONB DEFAULT '[]'::jsonb,
  dependencies JSONB DEFAULT '[]'::jsonb,
  assumptions JSONB DEFAULT '[]'::jsonb,
  exclusions JSONB DEFAULT '[]'::jsonb,
  governance_requirements JSONB DEFAULT '[]'::jsonb,
  version INTEGER DEFAULT 1,
  parent_objective_id UUID,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS strategic_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  objective_id UUID REFERENCES strategic_objectives(id) ON DELETE SET NULL,
  decision_question TEXT NOT NULL,
  decision_owner TEXT,
  decision_deadline TIMESTAMPTZ,
  status TEXT DEFAULT 'DRAFT', -- DRAFT, ANALYZING, OPTIONS_READY, SIMULATION_REQUIRED, SIMULATED, GOVERNANCE_REVIEW, READY_FOR_DECISION, DECIDED, EXECUTION_PENDING, EXECUTING, OUTCOME_PENDING, COMPLETED
  known_constraints JSONB DEFAULT '[]'::jsonb,
  unknowns JSONB DEFAULT '[]'::jsonb,
  assumptions JSONB DEFAULT '[]'::jsonb,
  dependencies JSONB DEFAULT '[]'::jsonb,
  required_evidence JSONB DEFAULT '[]'::jsonb,
  simulation_required BOOLEAN DEFAULT false,
  governance_requirements JSONB DEFAULT '[]'::jsonb,
  expected_outcomes JSONB DEFAULT '{}'::jsonb,
  risk_tolerance TEXT DEFAULT 'MEDIUM',
  selected_option_id UUID,
  autonomy_level INTEGER DEFAULT 2,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS decision_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES strategic_decisions(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  origin TEXT DEFAULT 'AI_PROPOSED', -- AI_PROPOSED, HUMAN_CREATED, HISTORICAL_MEMORY, CAUSAL_FINDING, FORESIGHT, SIMULATION_RESULT, ADAPTIVE_PROPOSAL, EXTERNAL_SIGNAL
  status TEXT DEFAULT 'AI_PROPOSED', -- AI_PROPOSED, HUMAN_REVIEWED, GOVERNED, SELECTED, REJECTED
  expected_benefits JSONB DEFAULT '[]'::jsonb,
  expected_costs JSONB DEFAULT '[]'::jsonb,
  risks JSONB DEFAULT '[]'::jsonb,
  dependencies JSONB DEFAULT '[]'::jsonb,
  resource_requirements JSONB DEFAULT '{}'::jsonb,
  reversibility TEXT DEFAULT 'REVERSIBLE', -- REVERSIBLE, PARTIALLY_REVERSIBLE, IRREVERSIBLE
  execution_complexity TEXT DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
  time_horizon TEXT,
  uncertainty TEXT DEFAULT 'MODERATE', -- LOW, MODERATE, HIGH, UNKNOWN
  assumptions JSONB DEFAULT '[]'::jsonb,
  simulation_required BOOLEAN DEFAULT false,
  governance_required BOOLEAN DEFAULT false,
  optimization_score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS decision_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES strategic_decisions(id) ON DELETE CASCADE,
  option_id UUID REFERENCES decision_options(id) ON DELETE CASCADE,
  expected_value NUMERIC(10,2),
  probability_of_success NUMERIC(5,2),
  downside_exposure NUMERIC(5,2),
  execution_risk TEXT DEFAULT 'MEDIUM',
  financial_cost NUMERIC(10,2),
  uncertainty_score NUMERIC(5,2),
  reversibility_score NUMERIC(5,2),
  strategic_alignment NUMERIC(5,2),
  evidence_quality NUMERIC(5,2),
  simulation_confidence NUMERIC(5,2),
  composite_score NUMERIC(5,2),
  epistemic_note TEXT,
  scored_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS strategic_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  objective_id UUID REFERENCES strategic_objectives(id) ON DELETE SET NULL,
  decision_id UUID REFERENCES strategic_decisions(id) ON DELETE SET NULL,
  selected_option_id UUID REFERENCES decision_options(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  rationale TEXT,
  evidence JSONB DEFAULT '[]'::jsonb,
  assumptions JSONB DEFAULT '[]'::jsonb,
  constraints JSONB DEFAULT '[]'::jsonb,
  dependencies JSONB DEFAULT '[]'::jsonb,
  expected_outcomes JSONB DEFAULT '{}'::jsonb,
  risks JSONB DEFAULT '[]'::jsonb,
  uncertainty TEXT DEFAULT 'MODERATE',
  simulation_ids JSONB DEFAULT '[]'::jsonb,
  resource_allocation JSONB DEFAULT '{}'::jsonb,
  timeline TEXT,
  milestones JSONB DEFAULT '[]'::jsonb,
  governance_requirements JSONB DEFAULT '[]'::jsonb,
  approval_status TEXT DEFAULT 'DRAFT', -- DRAFT, VALIDATED, SIMULATED, GOVERNANCE_REVIEW, APPROVED, ACTIVE, COMPLETED, EVALUATED
  execution_mapping JSONB DEFAULT '{}'::jsonb,
  measurement_plan JSONB DEFAULT '{}'::jsonb,
  rollback_strategy TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS strategic_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  plan_ids JSONB DEFAULT '[]'::jsonb,
  objective_ids JSONB DEFAULT '[]'::jsonb,
  total_budget NUMERIC(10,2),
  allocated_budget NUMERIC(10,2),
  risk_concentration TEXT DEFAULT 'MEDIUM',
  portfolio_expected_value NUMERIC(10,2),
  conflicts JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS strategic_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES strategic_plans(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  expected_outcome JSONB DEFAULT '{}'::jsonb,
  actual_outcome JSONB DEFAULT '{}'::jsonb,
  expected_cost NUMERIC(10,2),
  actual_cost NUMERIC(10,2),
  expected_timeline TEXT,
  actual_timeline TEXT,
  planning_accuracy TEXT DEFAULT 'INSUFFICIENT_DATA', -- ACCURATE, PARTIALLY_ACCURATE, INACCURATE, INSUFFICIENT_DATA
  variance_notes TEXT,
  observed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS strategic_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  outcome_id UUID REFERENCES strategic_outcomes(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES strategic_plans(id) ON DELETE SET NULL,
  lesson_type TEXT NOT NULL, -- PLANNING_ERROR, ASSUMPTION_ERROR, CONSTRAINT_ERROR, SIMULATION_ERROR, OPTIMIZATION_ERROR, RESOURCE_ESTIMATION_ERROR, OUTCOME_VARIANCE, GOVERNANCE_BOTTLENECK
  description TEXT NOT NULL,
  error_magnitude TEXT DEFAULT 'MINOR', -- MINOR, MODERATE, MAJOR, CRITICAL
  provenance JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_strat_obj_ws ON strategic_objectives(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_dec_ws ON strategic_decisions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_dec_opt_dec ON decision_options(decision_id);
CREATE INDEX IF NOT EXISTS idx_strat_plan_ws ON strategic_plans(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_outcome_plan ON strategic_outcomes(plan_id);
CREATE INDEX IF NOT EXISTS idx_strat_learning_ws ON strategic_learning(workspace_id);

-- RLS
ALTER TABLE strategic_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_learning ENABLE ROW LEVEL SECURITY;
