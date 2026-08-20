-- VeritasTech AI Database Migration Schema: Phase 16 Institutional Foresight & Strategic Preparedness
-- Adds foresight_signals, trends, forecasts, scenarios, leading_indicators, early_warnings, strategic_risks, and contingency_plans.

-- 1. FORESIGHT SIGNALS TABLE
CREATE TABLE IF NOT EXISTS foresight_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'WEAK_SIGNAL', 'EMERGING_TREND', 'CONFIRMED_TREND', 'ANOMALY', 'RISK_SIGNAL'
  severity TEXT DEFAULT 'MODERATE', -- 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'
  confidence NUMERIC(5, 2) DEFAULT 90.00,
  horizon TEXT DEFAULT 'MEDIUM_TERM', -- 'IMMEDIATE', 'SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM', 'STRATEGIC'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SCENARIOS TABLE
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  scenario_type TEXT NOT NULL, -- 'BASELINE', 'UPSIDE', 'DOWNSIDE', 'DISRUPTION', 'TRANSFORMATION'
  probability NUMERIC(5, 2) DEFAULT 85.00,
  drivers JSONB DEFAULT '[]'::jsonb,
  strategic_implications TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EARLY WARNINGS TABLE
CREATE TABLE IF NOT EXISTS early_warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  indicator_name TEXT NOT NULL,
  threshold_value NUMERIC(10, 2) NOT NULL,
  current_value NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'WATCH', -- 'NORMAL', 'WATCH', 'WARNING', 'CRITICAL'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTINGENCY PLANS TABLE
CREATE TABLE IF NOT EXISTS contingency_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  trigger_condition TEXT NOT NULL,
  preparedness_score NUMERIC(5, 2) DEFAULT 92.00,
  status TEXT DEFAULT 'READY', -- 'DRAFT', 'READY', 'ACTIVATED', 'ARCHIVED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_signals_ws ON foresight_signals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_ws ON scenarios(workspace_id);
CREATE INDEX IF NOT EXISTS idx_warnings_ws ON early_warnings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_contingency_ws ON contingency_plans(workspace_id);

-- RLS POLICIES
ALTER TABLE foresight_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE early_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contingency_plans ENABLE ROW LEVEL SECURITY;
