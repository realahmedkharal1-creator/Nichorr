-- Phase 40 Migration
CREATE TABLE IF NOT EXISTS enterprise_autonomy_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    autonomy_tier TEXT DEFAULT 'TIER_1_ASSISTIVE',
    max_budget_usd NUMERIC(12,2) DEFAULT 1000.00,
    requires_human_approval BOOLEAN DEFAULT true,
    circuit_breaker_status TEXT DEFAULT 'CLOSED',
    status TEXT DEFAULT 'ACTIVE',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_autonomy_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    policy_id UUID REFERENCES enterprise_autonomy_policies(id) ON DELETE CASCADE,
    allocated_budget_usd NUMERIC(12,2) NOT NULL,
    consumed_budget_usd NUMERIC(12,2) DEFAULT 0.00,
    budget_period TEXT DEFAULT 'MONTHLY',
    reset_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_self_healing_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    trigger_source TEXT NOT NULL,
    trigger_entity_id TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    proposed_actions JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'AI_PROPOSED',
    phase32_command_id TEXT,
    simulation_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_self_healing_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES enterprise_self_healing_plans(id) ON DELETE CASCADE,
    executed_by TEXT NOT NULL,
    authorization_id TEXT,
    execution_status TEXT DEFAULT 'IN_PROGRESS',
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_self_healing_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    execution_id UUID REFERENCES enterprise_self_healing_executions(id) ON DELETE CASCADE,
    expected_state JSONB DEFAULT '{}'::jsonb,
    observed_state JSONB DEFAULT '{}'::jsonb,
    verification_status TEXT DEFAULT 'VERIFIED_SUCCESS',
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_circuit_breakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    trigger_condition TEXT NOT NULL,
    trip_count INTEGER DEFAULT 0,
    state TEXT DEFAULT 'CLOSED',
    tripped_at TIMESTAMPTZ,
    reset_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_value_drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    driver_category TEXT NOT NULL,
    target_value NUMERIC(12,2) NOT NULL,
    current_value NUMERIC(12,2) NOT NULL,
    unit TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_value_optimizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES enterprise_value_drivers(id) ON DELETE CASCADE,
    optimization_type TEXT NOT NULL,
    projected_gain_usd NUMERIC(12,2) NOT NULL,
    realized_gain_usd NUMERIC(12,2) DEFAULT 0.00,
    status TEXT DEFAULT 'AI_PROPOSED',
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_roi_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    initiative_or_command_id TEXT NOT NULL,
    projected_roi_percentage NUMERIC(6,2) NOT NULL,
    realized_roi_percentage NUMERIC(6,2) DEFAULT 0.00,
    calculation_factors JSONB DEFAULT '{}'::jsonb,
    computed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_adaptive_governance_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    rule_name TEXT NOT NULL,
    min_trust_score NUMERIC(5,2) DEFAULT 90.0,
    allowed_autonomy_tier TEXT DEFAULT 'TIER_2_DELEGATED',
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_autonomy_drift (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    policy_id UUID REFERENCES enterprise_autonomy_policies(id) ON DELETE CASCADE,
    drift_type TEXT NOT NULL,
    drift_level TEXT DEFAULT 'NO_DRIFT',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_autonomy_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    append_only BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_autonomy_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    title TEXT NOT NULL,
    rationale TEXT NOT NULL,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_universal_intelligence_traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    root_signal_id TEXT NOT NULL,
    trace_payload JSONB DEFAULT '{}'::jsonb,
    provenance_hash TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE enterprise_autonomy_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_autonomy_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_self_healing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_self_healing_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_self_healing_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_circuit_breakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_value_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_value_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_roi_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_adaptive_governance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_autonomy_drift ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_autonomy_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_autonomy_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_universal_intelligence_traces ENABLE ROW LEVEL SECURITY;

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_ent_auto_policies_ws ON enterprise_autonomy_policies(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_auto_budgets_ws ON enterprise_autonomy_budgets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_sh_plans_ws ON enterprise_self_healing_plans(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_sh_execs_ws ON enterprise_self_healing_executions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_sh_verifs_ws ON enterprise_self_healing_verifications(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_cb_ws ON enterprise_circuit_breakers(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_val_dr_ws ON enterprise_value_drivers(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_val_opt_ws ON enterprise_value_optimizations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_roi_ws ON enterprise_roi_intelligence(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_ad_gov_ws ON enterprise_adaptive_governance_rules(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_drift_ws ON enterprise_autonomy_drift(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_learn_ws ON enterprise_autonomy_learning(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_rec_ws ON enterprise_autonomy_recommendations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_trace_ws ON enterprise_universal_intelligence_traces(workspace_id);
