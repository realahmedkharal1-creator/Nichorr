-- VeritasTech AI Database Migration Schema: Phase 15 Organizational Learning & Causal Intelligence
-- Adds outcomes, outcome_metrics, assumptions, predictions, causal_assessments, lessons, institutional_memory, decision_reviews, and agent_performance.

-- 1. OUTCOMES TABLE
CREATE TABLE IF NOT EXISTS outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  originating_type TEXT NOT NULL, -- 'DECISION', 'EXPERIMENT', 'RECOMMENDATION', 'ACTION'
  originating_id TEXT NOT NULL,
  title TEXT NOT NULL,
  expected_outcome TEXT NOT NULL,
  observed_outcome TEXT,
  status TEXT DEFAULT 'OBSERVING', -- 'EXPECTED', 'OBSERVING', 'ACHIEVED', 'MISSED', 'INCONCLUSIVE'
  confidence NUMERIC(5, 2) DEFAULT 95.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INSTITUTIONAL MEMORY TABLE
CREATE TABLE IF NOT EXISTS institutional_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  lesson_statement TEXT NOT NULL,
  domain TEXT NOT NULL, -- 'RESEARCH', 'KNOWLEDGE', 'CREATOR', 'STRATEGY', 'OPERATIONS'
  confidence NUMERIC(5, 2) DEFAULT 95.00,
  evidence_summary TEXT NOT NULL,
  status TEXT DEFAULT 'VERIFIED', -- 'PROPOSED', 'VERIFIED', 'CONTESTED', 'OBSOLETE', 'ARCHIVED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PREDICTIONS TABLE
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  forecast_statement TEXT NOT NULL,
  probability NUMERIC(5, 2) DEFAULT 90.00,
  expected_by TIMESTAMPTZ,
  actual_result TEXT,
  is_accurate BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CAUSAL ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS causal_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  action_title TEXT NOT NULL,
  observed_change TEXT NOT NULL,
  causal_confidence TEXT DEFAULT 'HIGH', -- 'LOW', 'MODERATE', 'HIGH'
  competing_explanations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_outcomes_ws ON outcomes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_memory_ws ON institutional_memory(workspace_id);
CREATE INDEX IF NOT EXISTS idx_predictions_ws ON predictions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_causal_ws ON causal_assessments(workspace_id);

-- RLS POLICIES
ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutional_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE causal_assessments ENABLE ROW LEVEL SECURITY;
