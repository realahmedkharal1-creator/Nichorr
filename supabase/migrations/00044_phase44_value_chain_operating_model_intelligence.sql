CREATE TABLE enterprise_value_chains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    business_domain TEXT NOT NULL,
    strategic_alignment_score NUMERIC(5,2) DEFAULT 95.0,
    criticality_tier TEXT DEFAULT 'TIER_1_CORE_VALUE',
    status TEXT DEFAULT 'ACTIVE',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_value_chain_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    value_chain_id UUID REFERENCES enterprise_value_chains(id) ON DELETE CASCADE,
    stage_name TEXT NOT NULL,
    stage_order INTEGER NOT NULL,
    input_description TEXT NOT NULL,
    output_description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_operating_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL,
    business_unit TEXT NOT NULL,
    capability_catalog JSONB DEFAULT '[]'::jsonb,
    organizational_structure JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'ACTIVE',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_business_processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    value_chain_id UUID REFERENCES enterprise_value_chains(id) ON DELETE CASCADE,
    process_name TEXT NOT NULL,
    process_owner TEXT NOT NULL,
    automation_level TEXT DEFAULT 'SEMI_AUTOMATED',
    criticality TEXT DEFAULT 'CRITICAL',
    cycle_time_minutes INTEGER DEFAULT 45,
    throughput_per_day INTEGER DEFAULT 1200,
    status TEXT DEFAULT 'ACTIVE',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_process_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    process_id UUID REFERENCES enterprise_business_processes(id) ON DELETE CASCADE,
    error_rate NUMERIC(5,2) DEFAULT 0.8,
    rework_rate NUMERIC(5,2) DEFAULT 1.2,
    sla_adherence_percentage NUMERIC(5,2) DEFAULT 99.1,
    cost_per_execution_usd NUMERIC(8,2) DEFAULT 14.50,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_process_bottlenecks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    process_id UUID REFERENCES enterprise_business_processes(id) ON DELETE CASCADE,
    bottleneck_type TEXT NOT NULL,
    severity TEXT DEFAULT 'HIGH',
    root_cause_hypothesis TEXT NOT NULL,
    estimated_delay_minutes INTEGER DEFAULT 120,
    status TEXT DEFAULT 'IDENTIFIED',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_process_value_leakage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    process_id UUID REFERENCES enterprise_business_processes(id) ON DELETE CASCADE,
    leakage_category TEXT NOT NULL,
    estimated_annual_loss_usd NUMERIC(12,2) DEFAULT 180000.00,
    primary_cause TEXT NOT NULL,
    confidence_score NUMERIC(5,2) DEFAULT 91.0,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_process_automation_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    process_id UUID REFERENCES enterprise_business_processes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    feasibility_score NUMERIC(5,2) DEFAULT 88.0,
    projected_annual_savings_usd NUMERIC(12,2) DEFAULT 250000.00,
    governance_sensitivity TEXT DEFAULT 'LOW',
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_process_optimization_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    process_id UUID REFERENCES enterprise_business_processes(id) ON DELETE CASCADE,
    proposal_title TEXT NOT NULL,
    proposed_changes JSONB DEFAULT '[]'::jsonb,
    hard_constraints_satisfied BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_operating_model_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    scenario_name TEXT NOT NULL,
    scenario_type TEXT DEFAULT 'AUTOMATION_EXPANSION',
    projected_efficiency_gain_percentage NUMERIC(5,2) DEFAULT 28.5,
    simulated_headcount_impact INTEGER DEFAULT -2,
    status TEXT DEFAULT 'SIMULATED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_process_maturity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    process_id UUID REFERENCES enterprise_business_processes(id) ON DELETE CASCADE,
    maturity_level INTEGER DEFAULT 4,
    automation_maturity NUMERIC(5,2) DEFAULT 85.0,
    governance_maturity NUMERIC(5,2) DEFAULT 95.0,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_operating_model_drift (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL,
    drift_type TEXT NOT NULL,
    drift_level TEXT DEFAULT 'NO_DRIFT',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_operating_model_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    append_only BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_operating_model_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    title TEXT NOT NULL,
    rationale TEXT NOT NULL,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_operating_model_traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    root_signal_id TEXT NOT NULL,
    trace_payload JSONB DEFAULT '{}'::jsonb,
    provenance_hash TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE enterprise_value_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_value_chain_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_operating_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_business_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_process_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_process_bottlenecks ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_process_value_leakage ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_process_automation_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_process_optimization_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_operating_model_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_process_maturity ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_operating_model_drift ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_operating_model_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_operating_model_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_operating_model_traces ENABLE ROW LEVEL SECURITY;
