-- 00043_phase43_strategic_planning_portfolio_intelligence.sql
CREATE TABLE IF NOT EXISTS enterprise_strategic_objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    strategic_horizon TEXT DEFAULT '1_YEAR',
    target_kpi TEXT NOT NULL,
    target_value NUMERIC(12,2) NOT NULL,
    current_value NUMERIC(12,2) DEFAULT 0.00,
    status TEXT DEFAULT 'ACTIVE',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_strategic_initiatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    objective_id UUID REFERENCES enterprise_strategic_objectives(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    owner TEXT NOT NULL,
    expected_value_usd NUMERIC(12,2) DEFAULT 500000.00,
    expected_cost_usd NUMERIC(12,2) DEFAULT 100000.00,
    required_headcount INTEGER DEFAULT 5,
    status TEXT DEFAULT 'IN_PROGRESS',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_strategic_portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    portfolio_type TEXT DEFAULT 'STRATEGIC_GROWTH',
    total_budget_usd NUMERIC(12,2) DEFAULT 2000000.00,
    risk_score NUMERIC(5,2) DEFAULT 24.5,
    alignment_score NUMERIC(5,2) DEFAULT 92.0,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_resource_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    initiative_id UUID REFERENCES enterprise_strategic_initiatives(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL,
    allocated_amount NUMERIC(12,2) NOT NULL,
    consumed_amount NUMERIC(12,2) DEFAULT 0.00,
    unit TEXT NOT NULL,
    status TEXT DEFAULT 'COMMITTED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_strategic_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    scenario_type TEXT DEFAULT 'BASELINE',
    probability NUMERIC(5,2) DEFAULT 70.0,
    impact_multiplier NUMERIC(4,2) DEFAULT 1.0,
    assumptions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_strategic_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    objective_id UUID REFERENCES enterprise_strategic_objectives(id) ON DELETE CASCADE,
    option_title TEXT NOT NULL,
    description TEXT NOT NULL,
    projected_roi_percentage NUMERIC(6,2) DEFAULT 150.0,
    implementation_risk TEXT DEFAULT 'MEDIUM',
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_decision_dossiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    decision_question TEXT NOT NULL,
    objective_id UUID REFERENCES enterprise_strategic_objectives(id) ON DELETE CASCADE,
    recommended_option_id UUID REFERENCES enterprise_strategic_options(id) ON DELETE CASCADE,
    supporting_evidence JSONB DEFAULT '[]'::jsonb,
    trade_offs JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'UNDER_REVIEW',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_strategic_tradeoffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    decision_id UUID REFERENCES enterprise_decision_dossiers(id) ON DELETE CASCADE,
    dimension_a TEXT NOT NULL,
    dimension_b TEXT NOT NULL,
    tradeoff_ratio NUMERIC(5,2) DEFAULT 1.5,
    analysis TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_portfolio_optimizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    portfolio_id UUID REFERENCES enterprise_strategic_portfolios(id) ON DELETE CASCADE,
    optimization_goal TEXT NOT NULL,
    projected_gain_usd NUMERIC(12,2) DEFAULT 750000.00,
    realized_gain_usd NUMERIC(12,2) DEFAULT 0.00,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_strategic_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    dossier_id UUID REFERENCES enterprise_decision_dossiers(id) ON DELETE CASCADE,
    authorized_by TEXT NOT NULL,
    chosen_option_id UUID REFERENCES enterprise_strategic_options(id) ON DELETE CASCADE,
    execution_command_id TEXT,
    decision_status TEXT DEFAULT 'AUTHORIZED',
    decided_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_strategic_drift (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    objective_id UUID REFERENCES enterprise_strategic_objectives(id) ON DELETE CASCADE,
    drift_type TEXT NOT NULL,
    drift_level TEXT DEFAULT 'NO_DRIFT',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_strategic_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    append_only BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_strategic_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    title TEXT NOT NULL,
    rationale TEXT NOT NULL,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_strategic_traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    root_signal_id TEXT NOT NULL,
    trace_payload JSONB DEFAULT '{}'::jsonb,
    provenance_hash TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
    EXECUTE 'ALTER TABLE enterprise_strategic_objectives ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE enterprise_strategic_initiatives ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE enterprise_strategic_portfolios ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE enterprise_resource_allocations ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE enterprise_strategic_scenarios ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE enterprise_strategic_options ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE enterprise_decision_dossiers ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE enterprise_strategic_tradeoffs ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE enterprise_portfolio_optimizations ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE enterprise_strategic_decisions ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE enterprise_strategic_drift ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE enterprise_strategic_learning ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE enterprise_strategic_recommendations ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE enterprise_strategic_traces ENABLE ROW LEVEL SECURITY';
EXCEPTION WHEN OTHERS THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_strat_obj_workspace ON enterprise_strategic_objectives(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_init_workspace ON enterprise_strategic_initiatives(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_port_workspace ON enterprise_strategic_portfolios(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_alloc_workspace ON enterprise_resource_allocations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_scen_workspace ON enterprise_strategic_scenarios(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_opt_workspace ON enterprise_strategic_options(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_doss_workspace ON enterprise_decision_dossiers(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_trade_workspace ON enterprise_strategic_tradeoffs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_optz_workspace ON enterprise_portfolio_optimizations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_dec_workspace ON enterprise_strategic_decisions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_drift_workspace ON enterprise_strategic_drift(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_learn_workspace ON enterprise_strategic_learning(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_reco_workspace ON enterprise_strategic_recommendations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strat_trace_workspace ON enterprise_strategic_traces(workspace_id);
