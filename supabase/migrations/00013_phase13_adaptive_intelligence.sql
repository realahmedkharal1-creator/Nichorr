-- VeritasTech AI Database Migration Schema: Phase 13 Adaptive Intelligence & Continuous Optimization
-- Adds platform_signals, optimization_recommendations, optimization_executions, optimization_simulations, anomaly_events, prompt_versions, ai_quality_gates, and investigation_sessions.

-- 1. PLATFORM SIGNALS TABLE
CREATE TABLE IF NOT EXISTS platform_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'QUALITY', 'RELIABILITY', 'PERFORMANCE', 'COST', 'KNOWLEDGE'
  severity TEXT DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  source_subsystem TEXT NOT NULL,
  summary TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. OPTIMIZATION RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS optimization_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'RESEARCH_VALUE', 'AI_ROUTING', 'CACHE_EFFICIENCY', 'COST_REDUCTION'
  title TEXT NOT NULL,
  explanation TEXT NOT NULL,
  confidence NUMERIC(5, 2) DEFAULT 95.00,
  expected_impact TEXT NOT NULL,
  estimated_cost_delta NUMERIC(10, 4) DEFAULT 0.0,
  approval_required BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'DETECTED', -- 'DETECTED', 'REVIEWING', 'APPROVED', 'REJECTED', 'EXECUTING', 'COMPLETED', 'FAILED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. OPTIMIZATION SIMULATIONS TABLE
CREATE TABLE IF NOT EXISTS optimization_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID REFERENCES optimization_recommendations(id) ON DELETE CASCADE,
  simulated_quality_impact NUMERIC(5, 2) DEFAULT 0.0,
  simulated_cost_impact NUMERIC(10, 4) DEFAULT -0.05,
  simulated_latency_impact INTEGER DEFAULT -150,
  assumptions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ANOMALY EVENTS TABLE
CREATE TABLE IF NOT EXISTS anomaly_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subsystem TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  baseline_value NUMERIC(12, 4) NOT NULL,
  observed_value NUMERIC(12, 4) NOT NULL,
  deviation_percentage NUMERIC(6, 2) NOT NULL,
  severity TEXT DEFAULT 'MEDIUM',
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INVESTIGATION SESSIONS TABLE
CREATE TABLE IF NOT EXISTS investigation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_entity_type TEXT NOT NULL, -- 'INCIDENT', 'ANOMALY', 'CONTRADICTION', 'COST_SPIKE'
  target_entity_id TEXT NOT NULL,
  status TEXT DEFAULT 'OPEN', -- 'OPEN', 'INVESTIGATING', 'RESOLVED'
  findings JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_signals_cat ON platform_signals(category);
CREATE INDEX IF NOT EXISTS idx_rec_ws ON optimization_recommendations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_sub ON anomaly_events(subsystem);
CREATE INDEX IF NOT EXISTS idx_invest_ws ON investigation_sessions(workspace_id);

-- RLS POLICIES
ALTER TABLE platform_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomaly_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigation_sessions ENABLE ROW LEVEL SECURITY;
