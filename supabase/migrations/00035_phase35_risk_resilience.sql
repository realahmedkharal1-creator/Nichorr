
CREATE TABLE IF NOT EXISTS enterprise_risk_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT DEFAULT 'HIGH',
    likelihood NUMERIC(5,2) DEFAULT 75.0,
    blast_radius TEXT DEFAULT 'MULTI_DOMAIN',
    status TEXT DEFAULT 'ACTIVE',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_risk_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_id UUID REFERENCES enterprise_risk_profiles(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    signal_type TEXT NOT NULL,
    source_domain TEXT NOT NULL,
    confidence NUMERIC(5,2) DEFAULT 85.0,
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_risk_propagations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_risk_id UUID REFERENCES enterprise_risk_profiles(id) ON DELETE CASCADE,
    target_domain TEXT NOT NULL,
    propagation_type TEXT DEFAULT 'DEPENDENCY_PROPAGATION',
    estimated_delay_minutes INTEGER DEFAULT 15,
    cascade_depth INTEGER DEFAULT 2,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_risk_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    upstream_entity TEXT NOT NULL,
    downstream_entity TEXT NOT NULL,
    criticality TEXT DEFAULT 'CRITICAL',
    has_redundancy BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_vulnerabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    affected_asset TEXT NOT NULL,
    severity TEXT DEFAULT 'CRITICAL',
    exploitability TEXT DEFAULT 'MEDIUM',
    containment_status TEXT DEFAULT 'OPEN',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_exposures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    exposure_type TEXT NOT NULL,
    affected_entity TEXT NOT NULL,
    estimated_loss NUMERIC(12,2) DEFAULT 250000.00,
    time_horizon TEXT DEFAULT '30D',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_resilience_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    redundancy_score NUMERIC(5,2) DEFAULT 80.0,
    recovery_speed_score NUMERIC(5,2) DEFAULT 85.0,
    containment_score NUMERIC(5,2) DEFAULT 90.0,
    overall_resilience TEXT DEFAULT 'RESILIENT',
    assessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_resilience_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    required_capability TEXT NOT NULL,
    current_capability TEXT NOT NULL,
    gap_level TEXT DEFAULT 'MATERIAL_GAP',
    evidence TEXT[],
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_single_points_of_failure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    entity_name TEXT NOT NULL,
    entity_type TEXT DEFAULT 'SERVICE',
    blast_radius_count INTEGER DEFAULT 8,
    estimated_impact TEXT DEFAULT 'CRITICAL',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_business_impacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_id UUID REFERENCES enterprise_risk_profiles(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    impact_domain TEXT NOT NULL,
    potential_impact TEXT DEFAULT 'HIGH',
    observed_impact TEXT,
    epistemic_status TEXT DEFAULT 'FORECAST',
    assessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_stress_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    scenario_name TEXT NOT NULL,
    simulated_failure TEXT NOT NULL,
    system_survival_rate NUMERIC(5,2) DEFAULT 88.0,
    recovery_duration_seconds INTEGER DEFAULT 45,
    side_effect_free BOOLEAN DEFAULT true,
    epistemic_status TEXT DEFAULT 'SIMULATED',
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_crisis_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    crisis_level TEXT DEFAULT 'CRISIS_CANDIDATE',
    state TEXT DEFAULT 'DETECTED',
    multi_domain_impact BOOLEAN DEFAULT true,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_recovery_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crisis_id UUID REFERENCES enterprise_crisis_events(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    strategy_type TEXT NOT NULL,
    rationale TEXT NOT NULL,
    estimated_rto_minutes INTEGER DEFAULT 30,
    estimated_rpo_minutes INTEGER DEFAULT 5,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_recovery_objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    target_rto_minutes INTEGER DEFAULT 15,
    target_rpo_minutes INTEGER DEFAULT 0,
    verified_rto_minutes INTEGER,
    verified_rpo_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_resilience_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    recommendation_type TEXT NOT NULL,
    rationale TEXT NOT NULL,
    expected_benefit TEXT NOT NULL,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_risk_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    incident_id TEXT,
    lesson_type TEXT NOT NULL,
    description TEXT NOT NULL,
    append_only BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE enterprise_risk_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_risk_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_risk_propagations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_risk_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_exposures ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_resilience_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_resilience_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_single_points_of_failure ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_business_impacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_stress_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_crisis_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_recovery_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_recovery_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_resilience_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_risk_learning ENABLE ROW LEVEL SECURITY;

-- Workspace indexes
CREATE INDEX idx_enterprise_risk_profiles_workspace ON enterprise_risk_profiles(workspace_id);
CREATE INDEX idx_enterprise_risk_signals_workspace ON enterprise_risk_signals(workspace_id);
CREATE INDEX idx_enterprise_risk_propagations_source ON enterprise_risk_propagations(source_risk_id);
CREATE INDEX idx_enterprise_risk_dependencies_workspace ON enterprise_risk_dependencies(workspace_id);
CREATE INDEX idx_enterprise_vulnerabilities_workspace ON enterprise_vulnerabilities(workspace_id);
CREATE INDEX idx_enterprise_exposures_workspace ON enterprise_exposures(workspace_id);
CREATE INDEX idx_enterprise_resilience_assessments_workspace ON enterprise_resilience_assessments(workspace_id);
CREATE INDEX idx_enterprise_resilience_gaps_workspace ON enterprise_resilience_gaps(workspace_id);
CREATE INDEX idx_enterprise_single_points_of_failure_workspace ON enterprise_single_points_of_failure(workspace_id);
CREATE INDEX idx_enterprise_business_impacts_workspace ON enterprise_business_impacts(workspace_id);
CREATE INDEX idx_enterprise_stress_tests_workspace ON enterprise_stress_tests(workspace_id);
CREATE INDEX idx_enterprise_crisis_events_workspace ON enterprise_crisis_events(workspace_id);
CREATE INDEX idx_enterprise_recovery_strategies_workspace ON enterprise_recovery_strategies(workspace_id);
CREATE INDEX idx_enterprise_recovery_objectives_workspace ON enterprise_recovery_objectives(workspace_id);
CREATE INDEX idx_enterprise_resilience_recommendations_workspace ON enterprise_resilience_recommendations(workspace_id);
CREATE INDEX idx_enterprise_risk_learning_workspace ON enterprise_risk_learning(workspace_id);
