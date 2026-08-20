-- VeritasTech AI Database Migration Schema: Phase 23 Governed Experimentation, Causal Intelligence & Outcome Attribution Layer
-- Adds hypotheses, causal_questions, experiments, experiment_baselines, experiment_outcomes, causal_estimates, counterfactual_estimates, outcome_attributions, causal_findings, and causal_learning.

-- 1. HYPOTHESES TABLE
CREATE TABLE IF NOT EXISTS hypotheses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'TESTABLE', -- 'PROPOSED', 'UNDER_REVIEW', 'TESTABLE', 'ACTIVE', 'SUPPORTED', 'FALSIFIED', 'INCONCLUSIVE'
  confidence NUMERIC(5, 2) DEFAULT 80.00,
  falsification_criteria TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CAUSAL QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS causal_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  treatment TEXT NOT NULL,
  outcome TEXT NOT NULL,
  question_text TEXT NOT NULL,
  known_confounders TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EXPERIMENTS TABLE
CREATE TABLE IF NOT EXISTS experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  hypothesis_id UUID REFERENCES hypotheses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  experiment_type TEXT DEFAULT 'A_B_TEST', -- 'A_B_TEST', 'CONTROLLED_EXPERIMENT', 'QUASI_EXPERIMENT', 'DIFFERENCE_IN_DIFFERENCES'
  status TEXT DEFAULT 'RUNNING', -- 'DRAFT', 'PENDING_APPROVAL', 'RUNNING', 'COMPLETED', 'CONTAMINATED', 'INCONCLUSIVE'
  autonomy_level INTEGER DEFAULT 3,
  primary_metric TEXT NOT NULL,
  baseline_value NUMERIC(10, 4) DEFAULT 0.0000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. OUTCOME ATTRIBUTIONS TABLE
CREATE TABLE IF NOT EXISTS outcome_attributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
  observed_effect NUMERIC(10, 4) NOT NULL,
  counterfactual_estimate NUMERIC(10, 4) NOT NULL,
  attribution_class TEXT DEFAULT 'LIKELY_ATTRIBUTABLE', -- 'DIRECTLY_ATTRIBUTABLE', 'LIKELY_ATTRIBUTABLE', 'POSSIBLY_ATTRIBUTABLE', 'NOT_ATTRIBUTABLE', 'INCONCLUSIVE'
  causal_confidence TEXT DEFAULT 'HIGH', -- 'VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'CONTESTED', 'UNKNOWN'
  confounding_risk TEXT DEFAULT 'LOW',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_hypotheses_ws ON hypotheses(workspace_id);
CREATE INDEX IF NOT EXISTS idx_causal_q_ws ON causal_questions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_experiments_ws ON experiments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_attributions_exp ON outcome_attributions(experiment_id);

-- RLS POLICIES
ALTER TABLE hypotheses ENABLE ROW LEVEL SECURITY;
ALTER TABLE causal_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcome_attributions ENABLE ROW LEVEL SECURITY;
