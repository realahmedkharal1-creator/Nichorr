CREATE TABLE enterprise_resilience_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    asset_name TEXT NOT NULL,
    asset_type TEXT NOT NULL,
    criticality_tier TEXT DEFAULT 'TIER_1_MISSION_CRITICAL',
    target_rto_seconds INTEGER DEFAULT 3600,
    target_rpo_seconds INTEGER DEFAULT 300,
    max_tolerable_downtime_seconds INTEGER DEFAULT 7200,
    status TEXT DEFAULT 'ACTIVE',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_business_impact_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES enterprise_resilience_assets(id) ON DELETE CASCADE,
    financial_impact_per_hour_usd NUMERIC(12,2) DEFAULT 50000.00,
    operational_impact_severity TEXT DEFAULT 'HIGH',
    regulatory_impact_severity TEXT DEFAULT 'HIGH',
    customer_impact_count INTEGER DEFAULT 1000,
    recovery_urgency TEXT DEFAULT 'CRITICAL',
    status TEXT DEFAULT 'EVALUATED',
    assessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_disaster_recovery_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES enterprise_resilience_assets(id) ON DELETE CASCADE,
    plan_title TEXT NOT NULL,
    recovery_tier TEXT DEFAULT 'TIER_1',
    recovery_sequence JSONB DEFAULT '[]'::jsonb,
    version INTEGER DEFAULT 1,
    approval_status TEXT DEFAULT 'APPROVED',
    approver TEXT,
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_business_continuity_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    process_name TEXT NOT NULL,
    continuity_objective TEXT NOT NULL,
    manual_fallback_procedure TEXT NOT NULL,
    alternate_system_id TEXT,
    escalation_path JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_backup_recovery_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES enterprise_resilience_assets(id) ON DELETE CASCADE,
    backup_type TEXT NOT NULL,
    backup_location TEXT NOT NULL,
    backup_integrity_hash TEXT NOT NULL,
    last_backup_at TIMESTAMPTZ DEFAULT NOW(),
    freshness_status TEXT DEFAULT 'FRESH',
    restore_tested_at TIMESTAMPTZ,
    restore_success BOOLEAN DEFAULT true,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_recovery_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES enterprise_disaster_recovery_plans(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL,
    test_status TEXT DEFAULT 'PASSED',
    simulated_duration_seconds INTEGER DEFAULT 1800,
    actual_duration_seconds INTEGER DEFAULT 1720,
    rto_achieved BOOLEAN DEFAULT true,
    rpo_achieved BOOLEAN DEFAULT true,
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_resilience_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    source_asset_id UUID REFERENCES enterprise_resilience_assets(id) ON DELETE CASCADE,
    dependent_asset_id UUID REFERENCES enterprise_resilience_assets(id) ON DELETE CASCADE,
    dependency_criticality TEXT DEFAULT 'CRITICAL',
    is_spof BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_resilience_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES enterprise_resilience_assets(id) ON DELETE CASCADE,
    strategy_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'AI_PROPOSED',
    projected_rto_seconds INTEGER DEFAULT 1800,
    projected_rpo_seconds INTEGER DEFAULT 120,
    estimated_cost_usd NUMERIC(10,2) DEFAULT 5000.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_recovery_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES enterprise_disaster_recovery_plans(id) ON DELETE CASCADE,
    trigger_incident_id TEXT,
    phase32_command_id TEXT,
    execution_status TEXT DEFAULT 'EXECUTING',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE enterprise_recovery_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    execution_id UUID REFERENCES enterprise_recovery_executions(id) ON DELETE CASCADE,
    observed_rto_seconds INTEGER DEFAULT 1650,
    observed_rpo_seconds INTEGER DEFAULT 110,
    business_process_restored BOOLEAN DEFAULT true,
    data_integrity_verified BOOLEAN DEFAULT true,
    verification_status TEXT DEFAULT 'VERIFIED_SUCCESS',
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_resilience_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES enterprise_resilience_assets(id) ON DELETE CASCADE,
    composite_resilience_score NUMERIC(5,2) DEFAULT 94.5,
    redundancy_score NUMERIC(5,2) DEFAULT 95.0,
    backup_readiness_score NUMERIC(5,2) DEFAULT 98.0,
    testing_maturity_score NUMERIC(5,2) DEFAULT 90.0,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_resilience_drift (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES enterprise_resilience_assets(id) ON DELETE CASCADE,
    drift_type TEXT NOT NULL,
    drift_level TEXT DEFAULT 'NO_DRIFT',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_resilience_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    append_only BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_resilience_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    title TEXT NOT NULL,
    rationale TEXT NOT NULL,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_resilience_traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    root_signal_id TEXT NOT NULL,
    trace_payload JSONB DEFAULT '{}'::jsonb,
    provenance_hash TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE enterprise_resilience_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_business_impact_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_disaster_recovery_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_business_continuity_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_backup_recovery_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_recovery_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_resilience_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_resilience_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_recovery_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_recovery_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_resilience_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_resilience_drift ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_resilience_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_resilience_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_resilience_traces ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_enterprise_resilience_assets_workspace ON enterprise_resilience_assets(workspace_id);
CREATE INDEX idx_enterprise_bia_workspace ON enterprise_business_impact_assessments(workspace_id);
CREATE INDEX idx_enterprise_drp_workspace ON enterprise_disaster_recovery_plans(workspace_id);
CREATE INDEX idx_enterprise_bcp_workspace ON enterprise_business_continuity_plans(workspace_id);
CREATE INDEX idx_enterprise_bre_workspace ON enterprise_backup_recovery_evidence(workspace_id);
CREATE INDEX idx_enterprise_rt_workspace ON enterprise_recovery_tests(workspace_id);
CREATE INDEX idx_enterprise_rd_workspace ON enterprise_resilience_dependencies(workspace_id);
CREATE INDEX idx_enterprise_rs_workspace ON enterprise_resilience_strategies(workspace_id);
CREATE INDEX idx_enterprise_re_workspace ON enterprise_recovery_executions(workspace_id);
CREATE INDEX idx_enterprise_rv_workspace ON enterprise_recovery_verifications(workspace_id);
CREATE INDEX idx_enterprise_rsc_workspace ON enterprise_resilience_scores(workspace_id);
CREATE INDEX idx_enterprise_rdr_workspace ON enterprise_resilience_drift(workspace_id);
CREATE INDEX idx_enterprise_rl_workspace ON enterprise_resilience_learning(workspace_id);
CREATE INDEX idx_enterprise_rrec_workspace ON enterprise_resilience_recommendations(workspace_id);
CREATE INDEX idx_enterprise_rtr_workspace ON enterprise_resilience_traces(workspace_id);
