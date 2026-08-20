
-- Phase 50: Enterprise Workforce, Human Capital, Talent, Organization & Workforce Intelligence Layer

CREATE TABLE IF NOT EXISTS enterprise_workforce (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    entity_code TEXT NOT NULL,
    workforce_classification TEXT DEFAULT 'FULL_TIME',
    employment_status TEXT DEFAULT 'ACTIVE',
    location_region TEXT DEFAULT 'NORTH_AMERICA',
    department_code TEXT DEFAULT 'ENGINEERING',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    unit_name TEXT NOT NULL,
    unit_type TEXT DEFAULT 'BUSINESS_UNIT',
    span_of_control NUMERIC(5,2) DEFAULT 6.4,
    hierarchy_depth INTEGER DEFAULT 4,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    role_title TEXT NOT NULL,
    role_family TEXT DEFAULT 'PRODUCT_ENGINEERING',
    criticality TEXT DEFAULT 'BUSINESS_CRITICAL',
    is_key_person_dependent BOOLEAN DEFAULT false,
    redundancy_count INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_capabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    capability_name TEXT NOT NULL,
    capability_domain TEXT DEFAULT 'DATA_AI',
    maturity_level TEXT DEFAULT 'ESTABLISHED',
    strategic_importance TEXT DEFAULT 'HIGH',
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    category TEXT DEFAULT 'TECHNICAL',
    verification_status TEXT DEFAULT 'VERIFIED',
    proficiency_score NUMERIC(5,2) DEFAULT 84.5,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_capacity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    department_code TEXT NOT NULL,
    available_fte NUMERIC(8,2) DEFAULT 145.0,
    utilized_fte NUMERIC(8,2) DEFAULT 128.5,
    utilization_rate NUMERIC(5,2) DEFAULT 88.6,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_demand (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    capability_domain TEXT NOT NULL,
    required_fte NUMERIC(8,2) DEFAULT 160.0,
    current_fte NUMERIC(8,2) DEFAULT 145.0,
    gap_fte NUMERIC(8,2) DEFAULT 15.0,
    period TEXT DEFAULT '12_MONTHS',
    forecasted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_skill_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    target_proficiency NUMERIC(5,2) DEFAULT 90.0,
    current_proficiency NUMERIC(5,2) DEFAULT 72.5,
    gap_score NUMERIC(5,2) DEFAULT 17.5,
    urgency TEXT DEFAULT 'HIGH',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_attrition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    department_code TEXT NOT NULL,
    attrition_risk_score NUMERIC(5,2) DEFAULT 14.2,
    retention_signal_score NUMERIC(5,2) DEFAULT 85.8,
    risk_level TEXT DEFAULT 'LOW',
    confidence_score NUMERIC(5,2) DEFAULT 88.0,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_retention (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    department_code TEXT NOT NULL,
    retention_strategy TEXT NOT NULL,
    target_stability_score NUMERIC(5,2) DEFAULT 92.0,
    status TEXT DEFAULT 'ACTIVE',
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_succession (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    role_id UUID REFERENCES enterprise_workforce_roles(id) ON DELETE CASCADE,
    succession_coverage_ratio NUMERIC(5,2) DEFAULT 1.5,
    readiness_level TEXT DEFAULT 'READY_NOW',
    continuity_risk TEXT DEFAULT 'LOW',
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    program_name TEXT NOT NULL,
    capability_domain TEXT NOT NULL,
    completion_rate NUMERIC(5,2) DEFAULT 94.0,
    capability_transfer_score NUMERIC(5,2) DEFAULT 86.5,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_productivity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    department_code TEXT NOT NULL,
    delivery_throughput_score NUMERIC(5,2) DEFAULT 89.2,
    quality_score NUMERIC(5,2) DEFAULT 94.5,
    cycle_time_days NUMERIC(6,2) DEFAULT 8.4,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    department_code TEXT NOT NULL,
    organizational_health_score NUMERIC(5,2) DEFAULT 88.5,
    span_anomaly_count INTEGER DEFAULT 0,
    bottleneck_count INTEGER DEFAULT 1,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    source_role_id UUID REFERENCES enterprise_workforce_roles(id) ON DELETE CASCADE,
    target_capability_id UUID REFERENCES enterprise_workforce_capabilities(id) ON DELETE CASCADE,
    dependency_strength TEXT DEFAULT 'CRITICAL',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_resilience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    critical_role_coverage_pct NUMERIC(5,2) DEFAULT 91.5,
    emergency_staffing_capacity_pct NUMERIC(5,2) DEFAULT 85.0,
    workforce_recovery_time_hours NUMERIC(8,2) DEFAULT 48.0,
    resilience_score NUMERIC(5,2) DEFAULT 88.0,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    scenario_name TEXT NOT NULL,
    scenario_type TEXT DEFAULT 'RAPID_SCALE',
    capacity_delta_pct NUMERIC(5,2) DEFAULT 25.0,
    status TEXT DEFAULT 'SIMULATED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    forecast_horizon TEXT DEFAULT '12_MONTHS',
    projected_headcount INTEGER DEFAULT 450,
    projected_capability_demand_score NUMERIC(5,2) DEFAULT 91.0,
    status TEXT DEFAULT 'FORECAST',
    confidence_score NUMERIC(5,2) DEFAULT 84.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    strategy_type TEXT DEFAULT 'INTERNAL_RESKILLING',
    target_capability TEXT NOT NULL,
    rationale TEXT NOT NULL,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_value (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    projected_value_usd NUMERIC(14,2) NOT NULL,
    realized_value_usd NUMERIC(14,2) DEFAULT 0.00,
    variance_usd NUMERIC(14,2) DEFAULT 0.00,
    status TEXT DEFAULT 'OBSERVED',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_drift (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL,
    drift_type TEXT NOT NULL,
    drift_level TEXT DEFAULT 'NO_DRIFT',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_learning_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    append_only BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    title TEXT NOT NULL,
    rationale TEXT NOT NULL,
    confidence_score NUMERIC(5,2) DEFAULT 86.0,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_workforce_traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    root_signal_id TEXT NOT NULL,
    trace_payload JSONB DEFAULT '{}'::jsonb,
    provenance_hash TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Enablement
ALTER TABLE enterprise_workforce ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_capacity ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_demand ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_attrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_retention ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_succession ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_productivity ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_resilience ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_value ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_drift ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_learning_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_workforce_traces ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_workspace ON enterprise_workforce(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_organizations_workspace ON enterprise_workforce_organizations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_roles_workspace ON enterprise_workforce_roles(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_capabilities_workspace ON enterprise_workforce_capabilities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_skills_workspace ON enterprise_workforce_skills(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_capacity_workspace ON enterprise_workforce_capacity(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_demand_workspace ON enterprise_workforce_demand(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_skill_gaps_workspace ON enterprise_workforce_skill_gaps(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_attrition_workspace ON enterprise_workforce_attrition(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_retention_workspace ON enterprise_workforce_retention(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_succession_workspace ON enterprise_workforce_succession(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_learning_workspace ON enterprise_workforce_learning(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_productivity_workspace ON enterprise_workforce_productivity(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_health_workspace ON enterprise_workforce_health(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_dependencies_workspace ON enterprise_workforce_dependencies(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_resilience_workspace ON enterprise_workforce_resilience(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_scenarios_workspace ON enterprise_workforce_scenarios(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_forecasts_workspace ON enterprise_workforce_forecasts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_strategies_workspace ON enterprise_workforce_strategies(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_value_workspace ON enterprise_workforce_value(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_drift_workspace ON enterprise_workforce_drift(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_learning_history_workspace ON enterprise_workforce_learning_history(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_recommendations_workspace ON enterprise_workforce_recommendations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_workforce_traces_workspace ON enterprise_workforce_traces(workspace_id);
