CREATE TABLE IF NOT EXISTS enterprise_innovation_initiatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'VALIDATED_CONCEPT',
    priority TEXT DEFAULT 'HIGH',
    expected_investment_usd NUMERIC(14,2) DEFAULT 350000.00,
    expected_time_to_value_months INTEGER DEFAULT 12,
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_emerging_technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    technology_name TEXT NOT NULL,
    domain TEXT NOT NULL,
    horizon_tier TEXT DEFAULT 'HORIZON_2',
    technical_maturity_score NUMERIC(5,2) DEFAULT 76.5,
    business_readiness_score NUMERIC(5,2) DEFAULT 68.0,
    status TEXT DEFAULT 'ACTIVE',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_technology_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES enterprise_emerging_technologies(id) ON DELETE CASCADE,
    signal_type TEXT NOT NULL,
    signal_summary TEXT NOT NULL,
    source TEXT NOT NULL,
    confidence_score NUMERIC(5,2) DEFAULT 88.0,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_technology_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES enterprise_emerging_technologies(id) ON DELETE CASCADE,
    assessment_type TEXT DEFAULT 'COMPREHENSIVE_EVALUATION',
    disruption_potential TEXT DEFAULT 'HIGH',
    ecosystem_maturity_score NUMERIC(5,2) DEFAULT 74.0,
    status TEXT DEFAULT 'VERIFIED',
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_technology_readiness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES enterprise_emerging_technologies(id) ON DELETE CASCADE,
    security_readiness_score NUMERIC(5,2) DEFAULT 85.0,
    compliance_readiness_score NUMERIC(5,2) DEFAULT 90.0,
    operational_readiness_score NUMERIC(5,2) DEFAULT 72.0,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_innovation_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_capability TEXT NOT NULL,
    projected_value_usd NUMERIC(14,2) DEFAULT 750000.00,
    feasibility_score NUMERIC(5,2) DEFAULT 82.5,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_innovation_threats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    threat_title TEXT NOT NULL,
    threat_type TEXT DEFAULT 'DISRUPTIVE_SUBSTITUTION',
    severity TEXT DEFAULT 'HIGH',
    mitigation_hypothesis TEXT NOT NULL,
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_rd_portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    portfolio_name TEXT NOT NULL,
    total_budget_usd NUMERIC(14,2) DEFAULT 2500000.00,
    allocated_budget_usd NUMERIC(14,2) DEFAULT 1850000.00,
    risk_profile TEXT DEFAULT 'BALANCED',
    status TEXT DEFAULT 'ACTIVE',
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_rd_experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    portfolio_id UUID REFERENCES enterprise_rd_portfolios(id) ON DELETE CASCADE,
    experiment_name TEXT NOT NULL,
    hypothesis TEXT NOT NULL,
    success_criteria TEXT NOT NULL,
    outcome_status TEXT DEFAULT 'IN_PROGRESS',
    started_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_innovation_prototypes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    prototype_name TEXT NOT NULL,
    technical_performance_score NUMERIC(5,2) DEFAULT 88.0,
    user_validation_score NUMERIC(5,2) DEFAULT 91.0,
    status TEXT DEFAULT 'TESTING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_innovation_pilots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    pilot_name TEXT NOT NULL,
    target_environment TEXT NOT NULL,
    operational_reliability_percentage NUMERIC(5,2) DEFAULT 99.4,
    readiness_for_production TEXT DEFAULT 'NEEDS_REVIEW',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_build_buy_partner_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    decision_title TEXT NOT NULL,
    recommended_path TEXT DEFAULT 'BUILD_INTERNAL',
    rationale TEXT NOT NULL,
    status TEXT DEFAULT 'AI_PROPOSED',
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_technology_substitution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    incumbent_tech TEXT NOT NULL,
    emerging_substitute TEXT NOT NULL,
    switching_cost_usd NUMERIC(14,2) DEFAULT 150000.00,
    estimated_payback_months INTEGER DEFAULT 18,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_innovation_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    scenario_name TEXT NOT NULL,
    scenario_type TEXT DEFAULT 'DISRUPTIVE_ADOPTION',
    simulated_roi_percentage NUMERIC(6,2) DEFAULT 210.0,
    status TEXT DEFAULT 'SIMULATED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_technology_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    forecast_horizon TEXT DEFAULT '24_MONTHS',
    projected_adoption_rate_percentage NUMERIC(5,2) DEFAULT 45.0,
    status TEXT DEFAULT 'FORECAST',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_innovation_value (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    initiative_id UUID REFERENCES enterprise_innovation_initiatives(id) ON DELETE CASCADE,
    projected_value_usd NUMERIC(14,2) NOT NULL,
    realized_value_usd NUMERIC(14,2) DEFAULT 0.00,
    variance_usd NUMERIC(14,2) DEFAULT 0.00,
    status TEXT DEFAULT 'OBSERVED',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_innovation_drift (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL,
    drift_type TEXT NOT NULL,
    drift_level TEXT DEFAULT 'NO_DRIFT',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_innovation_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    append_only BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_innovation_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    title TEXT NOT NULL,
    rationale TEXT NOT NULL,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_innovation_traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    root_signal_id TEXT NOT NULL,
    trace_payload JSONB DEFAULT '{}'::jsonb,
    provenance_hash TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE enterprise_innovation_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_emerging_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_technology_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_technology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_technology_readiness ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_innovation_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_innovation_threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_rd_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_rd_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_innovation_prototypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_innovation_pilots ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_build_buy_partner_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_technology_substitution ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_innovation_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_technology_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_innovation_value ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_innovation_drift ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_innovation_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_innovation_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_innovation_traces ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_ent_innov_init_ws ON enterprise_innovation_initiatives(workspace_id);
CREATE INDEX idx_ent_emerg_tech_ws ON enterprise_emerging_technologies(workspace_id);
CREATE INDEX idx_ent_tech_signals_tech ON enterprise_technology_signals(technology_id);
CREATE INDEX idx_ent_tech_assess_tech ON enterprise_technology_assessments(technology_id);
CREATE INDEX idx_ent_tech_ready_tech ON enterprise_technology_readiness(technology_id);
CREATE INDEX idx_ent_innov_opp_ws ON enterprise_innovation_opportunities(workspace_id);
CREATE INDEX idx_ent_innov_threats_ws ON enterprise_innovation_threats(workspace_id);
CREATE INDEX idx_ent_rd_port_ws ON enterprise_rd_portfolios(workspace_id);
CREATE INDEX idx_ent_rd_exp_port ON enterprise_rd_experiments(portfolio_id);
CREATE INDEX idx_ent_innov_proto_ws ON enterprise_innovation_prototypes(workspace_id);
CREATE INDEX idx_ent_innov_pilots_ws ON enterprise_innovation_pilots(workspace_id);
CREATE INDEX idx_ent_bbp_decisions_ws ON enterprise_build_buy_partner_decisions(workspace_id);
CREATE INDEX idx_ent_tech_subst_ws ON enterprise_technology_substitution(workspace_id);
CREATE INDEX idx_ent_innov_scen_ws ON enterprise_innovation_scenarios(workspace_id);
CREATE INDEX idx_ent_tech_fcast_ws ON enterprise_technology_forecasts(workspace_id);
CREATE INDEX idx_ent_innov_val_init ON enterprise_innovation_value(initiative_id);
CREATE INDEX idx_ent_innov_drift_ws ON enterprise_innovation_drift(workspace_id);
CREATE INDEX idx_ent_innov_learn_ws ON enterprise_innovation_learning(workspace_id);
CREATE INDEX idx_ent_innov_rec_ws ON enterprise_innovation_recommendations(workspace_id);
CREATE INDEX idx_ent_innov_traces_ws ON enterprise_innovation_traces(workspace_id);
