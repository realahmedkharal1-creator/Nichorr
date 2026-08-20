-- Migration 00034_phase34_enterprise_foresight.sql
CREATE TABLE IF NOT EXISTS enterprise_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_metric TEXT NOT NULL,
    forecast_horizon TEXT NOT NULL,
    predicted_value NUMERIC(10,2),
    predicted_range JSONB DEFAULT '{}'::jsonb,
    probability NUMERIC(5,2) DEFAULT 80.0,
    confidence_score NUMERIC(5,2) DEFAULT 85.0,
    uncertainty_level TEXT DEFAULT 'MODERATE',
    status TEXT DEFAULT 'PUBLISHED',
    epistemic_status TEXT DEFAULT 'FORECAST',
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    provenance_hash TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_forecast_baselines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    baseline_value NUMERIC(10,2) NOT NULL,
    baseline_type TEXT DEFAULT 'ROLLING_30D',
    volatility NUMERIC(5,2) DEFAULT 2.5,
    confidence NUMERIC(5,2) DEFAULT 90.0,
    sample_count INTEGER DEFAULT 100,
    established_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_forecast_trajectories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    direction TEXT DEFAULT 'RISING',
    rate_of_change NUMERIC(5,2) DEFAULT 1.5,
    acceleration TEXT DEFAULT 'STABLE',
    trajectory_classification TEXT DEFAULT 'RISING',
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_forecast_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    forecast_id UUID REFERENCES enterprise_forecasts(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    scenario_type TEXT NOT NULL,
    projected_value NUMERIC(10,2) NOT NULL,
    assumptions JSONB DEFAULT '[]'::jsonb,
    simulation_link_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_predictive_risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    risk_category TEXT NOT NULL,
    probability NUMERIC(5,2) NOT NULL,
    expected_impact TEXT DEFAULT 'HIGH',
    time_to_risk TEXT,
    risk_trajectory TEXT DEFAULT 'RISING',
    uncertainty TEXT DEFAULT 'MODERATE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_predictive_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    opportunity_type TEXT NOT NULL,
    probability NUMERIC(5,2) NOT NULL,
    expected_value NUMERIC(10,2),
    time_window TEXT,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_early_warnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    trigger_condition TEXT NOT NULL,
    severity TEXT DEFAULT 'HIGH',
    expected_time_window TEXT,
    confidence NUMERIC(5,2) DEFAULT 90.0,
    affected_entity TEXT NOT NULL,
    recommended_attention TEXT DEFAULT 'IMMEDIATE',
    status TEXT DEFAULT 'ACTIVE',
    triggered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_forecast_assumptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    forecast_id UUID REFERENCES enterprise_forecasts(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    assumption_text TEXT NOT NULL,
    status TEXT DEFAULT 'VALID',
    criticality TEXT DEFAULT 'HIGH',
    last_checked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_forecast_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    forecast_a_id TEXT NOT NULL,
    forecast_b_id TEXT NOT NULL,
    conflict_reason TEXT NOT NULL,
    status TEXT DEFAULT 'UNRESOLVED',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_forecast_validations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    forecast_id UUID REFERENCES enterprise_forecasts(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    predicted_value NUMERIC(10,2) NOT NULL,
    actual_observed_value NUMERIC(10,2) NOT NULL,
    absolute_error NUMERIC(10,2) NOT NULL,
    relative_error_percent NUMERIC(5,2) NOT NULL,
    validation_classification TEXT DEFAULT 'ACCURATE',
    validated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_forecast_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    forecast_id UUID REFERENCES enterprise_forecasts(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    lesson_type TEXT NOT NULL,
    description TEXT NOT NULL,
    bias_direction TEXT,
    model_adjustment_signal JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_forecast_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    forecast_id TEXT,
    recommendation_type TEXT NOT NULL,
    rationale TEXT NOT NULL,
    expected_benefit TEXT NOT NULL,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS and Policies
ALTER TABLE enterprise_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_forecast_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_forecast_trajectories ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_forecast_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_predictive_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_predictive_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_early_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_forecast_assumptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_forecast_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_forecast_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_forecast_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_forecast_recommendations ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_enterprise_forecasts_workspace_id ON enterprise_forecasts(workspace_id);
CREATE INDEX idx_enterprise_forecast_baselines_workspace_id ON enterprise_forecast_baselines(workspace_id);
CREATE INDEX idx_enterprise_forecast_trajectories_workspace_id ON enterprise_forecast_trajectories(workspace_id);
CREATE INDEX idx_enterprise_forecast_scenarios_forecast_id ON enterprise_forecast_scenarios(forecast_id);
CREATE INDEX idx_enterprise_predictive_risks_workspace_id ON enterprise_predictive_risks(workspace_id);
CREATE INDEX idx_enterprise_predictive_opportunities_workspace_id ON enterprise_predictive_opportunities(workspace_id);
CREATE INDEX idx_enterprise_early_warnings_workspace_id ON enterprise_early_warnings(workspace_id);
CREATE INDEX idx_enterprise_forecast_assumptions_forecast_id ON enterprise_forecast_assumptions(forecast_id);
CREATE INDEX idx_enterprise_forecast_conflicts_workspace_id ON enterprise_forecast_conflicts(workspace_id);
CREATE INDEX idx_enterprise_forecast_validations_forecast_id ON enterprise_forecast_validations(forecast_id);
CREATE INDEX idx_enterprise_forecast_learning_forecast_id ON enterprise_forecast_learning(forecast_id);
CREATE INDEX idx_enterprise_forecast_recommendations_workspace_id ON enterprise_forecast_recommendations(workspace_id);
