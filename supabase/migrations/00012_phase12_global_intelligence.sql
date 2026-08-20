-- VeritasTech AI Database Migration Schema: Phase 12 Global Enterprise Intelligence
-- Adds ai_models, ai_evaluations, residency_policies, service_dependencies, slos, customer_health, experiments, and data_quality_issues.

-- 1. AI MODELS TABLE
CREATE TABLE IF NOT EXISTS ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL, -- 'google', 'openai', 'anthropic'
  model_id TEXT UNIQUE NOT NULL, -- 'gemini-1.5-pro', 'gemini-1.5-flash'
  capabilities TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'LIMITED', 'DEPRECATED', 'DISABLED'
  cost_per_1k_tokens NUMERIC(10, 4) DEFAULT 0.0015,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AI EVALUATIONS TABLE
CREATE TABLE IF NOT EXISTS ai_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id TEXT REFERENCES ai_models(model_id) ON DELETE CASCADE,
  task_type TEXT NOT NULL, -- 'RESEARCH_PLANNING', 'FACT_CHECKING', 'SCRIPT_GEN'
  grounding_score NUMERIC(5, 2) DEFAULT 98.50,
  latency_ms INTEGER DEFAULT 1200,
  passed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RESIDENCY POLICIES TABLE
CREATE TABLE IF NOT EXISTS residency_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  region TEXT DEFAULT 'US', -- 'GLOBAL', 'US', 'EU', 'APAC'
  cross_region_allowed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICE DEPENDENCIES TABLE
CREATE TABLE IF NOT EXISTS service_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'HEALTHY',
  depends_on TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SERVICE LEVEL OBJECTIVES (SLOS) TABLE
CREATE TABLE IF NOT EXISTS slos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  target_percentage NUMERIC(5, 2) DEFAULT 99.90,
  current_percentage NUMERIC(5, 2) DEFAULT 99.95,
  status TEXT DEFAULT 'HEALTHY',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOMER HEALTH TABLE
CREATE TABLE IF NOT EXISTS customer_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  health_score INTEGER DEFAULT 95,
  status TEXT DEFAULT 'HEALTHY', -- 'HEALTHY', 'ENGAGED', 'AT_RISK', 'INACTIVE'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DATA QUALITY ISSUES TABLE
CREATE TABLE IF NOT EXISTS data_quality_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subsystem TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  severity TEXT DEFAULT 'LOW',
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_ai_evals_model ON ai_evaluations(model_id);
CREATE INDEX IF NOT EXISTS idx_residency_ws ON residency_policies(workspace_id);
CREATE INDEX IF NOT EXISTS idx_cust_health_ws ON customer_health(workspace_id);

-- RLS POLICIES
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE residency_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE slos ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_quality_issues ENABLE ROW LEVEL SECURITY;
