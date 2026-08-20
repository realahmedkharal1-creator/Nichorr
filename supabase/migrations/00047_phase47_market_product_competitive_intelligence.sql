-- Migration 00047_phase47_market_product_competitive_intelligence.sql
CREATE TABLE IF NOT EXISTS enterprise_market_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    signal_type TEXT NOT NULL,
    title TEXT NOT NULL,
    source_feed TEXT NOT NULL,
    impact_score NUMERIC(5,2) DEFAULT 84.5,
    confidence_score NUMERIC(5,2) DEFAULT 91.0,
    freshness_status TEXT DEFAULT 'FRESH',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    competitor_name TEXT NOT NULL,
    market_segment TEXT NOT NULL,
    threat_level TEXT DEFAULT 'HIGH',
    estimated_market_share_percentage NUMERIC(5,2) DEFAULT 22.4,
    positioning_summary TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_competitor_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    competitor_id UUID REFERENCES enterprise_competitors(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    feature_set JSONB DEFAULT '[]'::jsonb,
    pricing_model TEXT DEFAULT 'SUBSCRIPTION_TIERED',
    list_price_usd NUMERIC(10,2) DEFAULT 999.00,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_competitive_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    competitor_id UUID REFERENCES enterprise_competitors(id) ON DELETE CASCADE,
    battlecard_title TEXT NOT NULL,
    competitive_strengths JSONB DEFAULT '[]'::jsonb,
    competitive_weaknesses JSONB DEFAULT '[]'::jsonb,
    win_strategy TEXT NOT NULL,
    status TEXT DEFAULT 'VERIFIED',
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_product_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    lifecycle_stage TEXT DEFAULT 'GROWTH',
    adoption_rate_percentage NUMERIC(5,2) DEFAULT 78.5,
    gross_margin_percentage NUMERIC(5,2) DEFAULT 82.0,
    status TEXT DEFAULT 'ACTIVE',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_product_market_fit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    product_id UUID REFERENCES enterprise_product_intelligence(id) ON DELETE CASCADE,
    overall_pmf_score NUMERIC(5,2) NOT NULL,
    retention_signal_score NUMERIC(5,2) DEFAULT 89.0,
    willingness_to_pay_score NUMERIC(5,2) DEFAULT 92.0,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_market_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    opportunity_title TEXT NOT NULL,
    target_segment TEXT NOT NULL,
    estimated_tam_usd NUMERIC(14,2) DEFAULT 500000000.00,
    strategic_fit_score NUMERIC(5,2) DEFAULT 94.0,
    status TEXT DEFAULT 'VALIDATED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_market_threats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    threat_title TEXT NOT NULL,
    threat_category TEXT DEFAULT 'COMPETITOR_DISRUPTION',
    severity TEXT DEFAULT 'HIGH',
    mitigation_strategy TEXT NOT NULL,
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_competitive_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    product_id UUID REFERENCES enterprise_product_intelligence(id) ON DELETE CASCADE,
    competitor_id UUID REFERENCES enterprise_competitors(id) ON DELETE CASCADE,
    differentiation_score NUMERIC(5,2) DEFAULT 88.5,
    price_to_value_ratio NUMERIC(5,2) DEFAULT 1.35,
    analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_market_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    forecast_horizon TEXT DEFAULT '12_MONTHS',
    projected_category_growth_percentage NUMERIC(5,2) DEFAULT 18.5,
    confidence_interval_lower NUMERIC(5,2),
    confidence_interval_upper NUMERIC(5,2),
    status TEXT DEFAULT 'FORECAST',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_market_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    scenario_name TEXT NOT NULL,
    scenario_type TEXT DEFAULT 'COMPETITIVE_ENTRY',
    market_share_impact_percentage NUMERIC(5,2) DEFAULT -3.5,
    status TEXT DEFAULT 'SIMULATED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_market_foresight (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    horizon_years INTEGER DEFAULT 3,
    inflection_signal TEXT NOT NULL,
    strategic_implication TEXT NOT NULL,
    confidence_level TEXT DEFAULT 'HIGH',
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_market_drift (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL,
    drift_type TEXT NOT NULL,
    drift_level TEXT DEFAULT 'NO_DRIFT',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_market_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    append_only BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_market_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    title TEXT NOT NULL,
    rationale TEXT NOT NULL,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_market_traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    root_signal_id TEXT NOT NULL,
    trace_payload JSONB DEFAULT '{}'::jsonb,
    provenance_hash TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE enterprise_market_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_competitor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_competitive_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_product_market_fit ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_market_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_market_threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_competitive_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_market_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_market_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_market_foresight ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_market_drift ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_market_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_market_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_market_traces ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_ent_mkt_signals_workspace ON enterprise_market_signals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_competitors_workspace ON enterprise_competitors(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_comp_products_workspace ON enterprise_competitor_products(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_comp_intel_workspace ON enterprise_competitive_intelligence(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_products_workspace ON enterprise_product_intelligence(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_pmf_workspace ON enterprise_product_market_fit(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_opp_workspace ON enterprise_market_opportunities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_threats_workspace ON enterprise_market_threats(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_pos_workspace ON enterprise_competitive_positions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_forecasts_workspace ON enterprise_market_forecasts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_scenarios_workspace ON enterprise_market_scenarios(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_foresight_workspace ON enterprise_market_foresight(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_drift_workspace ON enterprise_market_drift(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_learn_workspace ON enterprise_market_learning(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_rec_workspace ON enterprise_market_recommendations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_mkt_traces_workspace ON enterprise_market_traces(workspace_id);
