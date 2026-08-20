-- Phase 55: Enterprise Product Operations, Product Lifecycle & Product Experience Intelligence
CREATE TABLE enterprise_product_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_family TEXT DEFAULT 'CORE_PLATFORM',
  lifecycle_status TEXT DEFAULT 'ACTIVE',
  market_status TEXT DEFAULT 'GA',
  owner_role TEXT NOT NULL,
  provenance_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  type_code TEXT NOT NULL,
  type_name TEXT NOT NULL,
  default_lifecycle_model TEXT DEFAULT 'CONTINUOUS_DELIVERY',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  product_id UUID REFERENCES enterprise_product_catalog(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  release_channel TEXT DEFAULT 'STABLE',
  support_status TEXT DEFAULT 'SUPPORTED',
  release_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  product_id UUID REFERENCES enterprise_product_catalog(id) ON DELETE CASCADE,
  capability_name TEXT NOT NULL,
  maturity_level TEXT DEFAULT 'ESTABLISHED',
  availability_tier TEXT DEFAULT 'ENTERPRISE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  capability_id UUID REFERENCES enterprise_product_capabilities(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  feature_lifecycle TEXT DEFAULT 'GA',
  is_core BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  product_id UUID REFERENCES enterprise_product_catalog(id) ON DELETE CASCADE,
  active_users_count INTEGER DEFAULT 18500,
  usage_depth_score NUMERIC(5,2) DEFAULT 84.5,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_adoption (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  feature_id UUID REFERENCES enterprise_product_features(id) ON DELETE CASCADE,
  adoption_rate_pct NUMERIC(5,2) DEFAULT 78.4,
  retention_rate_pct NUMERIC(5,2) DEFAULT 92.1,
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  product_id UUID REFERENCES enterprise_product_catalog(id) ON DELETE CASCADE,
  experience_score NUMERIC(5,2) DEFAULT 89.2,
  customer_friction_score NUMERIC(5,2) DEFAULT 11.5,
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  product_id UUID REFERENCES enterprise_product_catalog(id) ON DELETE CASCADE,
  feedback_source TEXT DEFAULT 'PORTAL',
  theme TEXT DEFAULT 'WORKFLOW_EFFICIENCY',
  sentiment_category TEXT DEFAULT 'POSITIVE',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  product_id UUID REFERENCES enterprise_product_catalog(id) ON DELETE CASCADE,
  request_title TEXT NOT NULL,
  request_count INTEGER DEFAULT 42,
  priority_score NUMERIC(5,2) DEFAULT 86.5,
  status TEXT DEFAULT 'UNDER_REVIEW',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_defects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  product_id UUID REFERENCES enterprise_product_catalog(id) ON DELETE CASCADE,
  defect_title TEXT NOT NULL,
  severity TEXT DEFAULT 'HIGH',
  containment_state TEXT DEFAULT 'CONTAINED',
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  product_id UUID REFERENCES enterprise_product_catalog(id) ON DELETE CASCADE,
  incident_code TEXT NOT NULL,
  duration_minutes NUMERIC(8,2) DEFAULT 25.0,
  status TEXT DEFAULT 'RESOLVED',
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  upstream_product_id UUID REFERENCES enterprise_product_catalog(id) ON DELETE CASCADE,
  downstream_product_id UUID REFERENCES enterprise_product_catalog(id) ON DELETE CASCADE,
  dependency_type TEXT DEFAULT 'SERVICE_API',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  product_id UUID REFERENCES enterprise_product_catalog(id) ON DELETE CASCADE,
  roadmap_name TEXT NOT NULL,
  horizon_quarter TEXT DEFAULT 'Q3_2026',
  status TEXT DEFAULT 'COMMITTED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_roadmap_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  roadmap_id UUID REFERENCES enterprise_product_roadmaps(id) ON DELETE CASCADE,
  item_title TEXT NOT NULL,
  target_release_date DATE NOT NULL,
  status TEXT DEFAULT 'IN_DEVELOPMENT',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_prioritization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  request_id UUID REFERENCES enterprise_product_requests(id) ON DELETE CASCADE,
  strategic_alignment_score NUMERIC(5,2) DEFAULT 94.0,
  revenue_impact_score NUMERIC(5,2) DEFAULT 88.0,
  overall_priority_rank INTEGER DEFAULT 1,
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_release_readiness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  version_id UUID REFERENCES enterprise_product_versions(id) ON DELETE CASCADE,
  quality_readiness_pct NUMERIC(5,2) DEFAULT 98.5,
  security_readiness_pct NUMERIC(5,2) DEFAULT 99.2,
  status TEXT DEFAULT 'RELEASE_READY',
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_launches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  product_id UUID REFERENCES enterprise_product_catalog(id) ON DELETE CASCADE,
  launch_name TEXT NOT NULL,
  launch_window TEXT DEFAULT 'GLOBAL_GA',
  status TEXT DEFAULT 'SUCCESSFUL',
  launched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_retirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  product_id UUID REFERENCES enterprise_product_catalog(id) ON DELETE CASCADE,
  retirement_phase TEXT DEFAULT 'MAINTENANCE_ONLY',
  sunset_target_date DATE NOT NULL,
  migration_readiness_pct NUMERIC(5,2) DEFAULT 91.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  forecast_horizon TEXT DEFAULT '12_MONTHS',
  projected_adoption_rate_pct NUMERIC(5,2) DEFAULT 85.0,
  projected_arr_usd NUMERIC(14,2) DEFAULT 18500000.00,
  status TEXT DEFAULT 'FORECAST',
  confidence_score NUMERIC(5,2) DEFAULT 88.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  scenario_name TEXT NOT NULL,
  simulated_adoption_delta_pct NUMERIC(5,2) DEFAULT 18.5,
  status TEXT DEFAULT 'SIMULATED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  projected_value_usd NUMERIC(14,2) NOT NULL,
  realized_value_usd NUMERIC(14,2) DEFAULT 0.00,
  variance_usd NUMERIC(14,2) DEFAULT 0.00,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_drift (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL,
  drift_type TEXT NOT NULL,
  drift_level TEXT DEFAULT 'NO_DRIFT',
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  append_only BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  title TEXT NOT NULL,
  rationale TEXT NOT NULL,
  confidence_score NUMERIC(5,2) DEFAULT 89.0,
  status TEXT DEFAULT 'AI_PROPOSED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_product_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  root_signal_id TEXT NOT NULL,
  trace_payload JSONB DEFAULT '{}'::jsonb,
  provenance_hash TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS & Indexes
ALTER TABLE enterprise_product_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_adoption ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_prioritization ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_release_readiness ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_launches ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_retirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_drift ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_traces ENABLE ROW LEVEL SECURITY;
