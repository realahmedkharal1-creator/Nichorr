CREATE TABLE enterprise_legal_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    entity_name TEXT NOT NULL,
    entity_type TEXT DEFAULT 'SUBSIDIARY',
    jurisdiction TEXT DEFAULT 'DELAWARE_USA',
    registration_number TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_legal_jurisdictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    country TEXT NOT NULL,
    subdivision TEXT DEFAULT 'FEDERAL',
    regulatory_body TEXT NOT NULL,
    governing_law TEXT NOT NULL,
    applicability_level TEXT DEFAULT 'PRIMARY',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_legal_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    contract_title TEXT NOT NULL,
    counterparty TEXT NOT NULL,
    contract_type TEXT DEFAULT 'MASTER_SERVICES_AGREEMENT',
    status TEXT DEFAULT 'ACTIVE',
    effective_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    total_value_usd NUMERIC(14,2) DEFAULT 750000.00,
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_contract_clauses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES enterprise_legal_contracts(id) ON DELETE CASCADE,
    clause_type TEXT DEFAULT 'LIMITATION_OF_LIABILITY',
    clause_text TEXT NOT NULL,
    risk_level TEXT DEFAULT 'MEDIUM',
    is_standard BOOLEAN DEFAULT true,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_contract_obligations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES enterprise_legal_contracts(id) ON DELETE CASCADE,
    obligation_title TEXT NOT NULL,
    obligation_owner TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    fulfillment_status TEXT DEFAULT 'IN_PROGRESS',
    verification_status TEXT DEFAULT 'UNVERIFIED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_contract_rights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES enterprise_legal_contracts(id) ON DELETE CASCADE,
    right_type TEXT DEFAULT 'AUDIT_RIGHT',
    description TEXT NOT NULL,
    is_exercised BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_contract_risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES enterprise_legal_contracts(id) ON DELETE CASCADE,
    risk_category TEXT DEFAULT 'FINANCIAL_EXPOSURE',
    severity TEXT DEFAULT 'MEDIUM',
    exposure_amount_usd NUMERIC(14,2) DEFAULT 150000.00,
    assessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_contract_deadlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES enterprise_legal_contracts(id) ON DELETE CASCADE,
    deadline_type TEXT DEFAULT 'RENEWAL_NOTICE',
    deadline_date DATE NOT NULL,
    notice_window_days INTEGER DEFAULT 60,
    status TEXT DEFAULT 'UPCOMING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_regulatory_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    authority_name TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    source_feed_url TEXT DEFAULT 'https://regulations.gov',
    confidence_score NUMERIC(5,2) DEFAULT 95.0,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_regulatory_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    source_id UUID REFERENCES enterprise_regulatory_sources(id) ON DELETE CASCADE,
    requirement_code TEXT NOT NULL,
    description TEXT NOT NULL,
    enforcement_date DATE NOT NULL,
    applicability TEXT DEFAULT 'MANDATORY',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_regulatory_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    source_id UUID REFERENCES enterprise_regulatory_sources(id) ON DELETE CASCADE,
    change_title TEXT NOT NULL,
    change_type TEXT DEFAULT 'AMENDMENT',
    effective_date DATE NOT NULL,
    status TEXT DEFAULT 'DETECTED',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_legal_applicability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES enterprise_regulatory_requirements(id) ON DELETE CASCADE,
    applicability_status TEXT DEFAULT 'APPLICABLE',
    rationale TEXT NOT NULL,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_licenses_permits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    license_name TEXT NOT NULL,
    issuing_authority TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT DEFAULT 'VALID',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_policy_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    policy_name TEXT NOT NULL,
    policy_owner TEXT NOT NULL,
    version TEXT DEFAULT '1.0',
    compliance_coverage_pct NUMERIC(5,2) DEFAULT 96.5,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_legal_impacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    impact_scope TEXT NOT NULL,
    estimated_compliance_cost_usd NUMERIC(14,2) DEFAULT 120000.00,
    operational_friction_score NUMERIC(5,2) DEFAULT 35.0,
    assessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_legal_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    scenario_name TEXT NOT NULL,
    scenario_type TEXT DEFAULT 'REGULATORY_TIGHTENING',
    simulated_cost_delta_usd NUMERIC(14,2) DEFAULT 250000.00,
    status TEXT DEFAULT 'SIMULATED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_legal_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    forecast_horizon TEXT DEFAULT '12_MONTHS',
    projected_obligation_count INTEGER DEFAULT 180,
    projected_regulatory_risk_score NUMERIC(5,2) DEFAULT 28.5,
    status TEXT DEFAULT 'FORECAST',
    confidence_score NUMERIC(5,2) DEFAULT 86.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_contract_optimization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES enterprise_legal_contracts(id) ON DELETE CASCADE,
    optimization_opportunity TEXT NOT NULL,
    estimated_savings_usd NUMERIC(14,2) DEFAULT 85000.00,
    status TEXT DEFAULT 'AI_PROPOSED',
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_legal_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    title TEXT NOT NULL,
    rationale TEXT NOT NULL,
    confidence_score NUMERIC(5,2) DEFAULT 88.0,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_legal_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    obligation_id UUID REFERENCES enterprise_contract_obligations(id) ON DELETE CASCADE,
    verification_method TEXT DEFAULT 'INDEPENDENT_AUDIT',
    is_verified BOOLEAN DEFAULT true,
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_legal_drift (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL,
    drift_type TEXT NOT NULL,
    drift_level TEXT DEFAULT 'NO_DRIFT',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_legal_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    append_only BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_legal_traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    root_signal_id TEXT NOT NULL,
    trace_payload JSONB DEFAULT '{}'::jsonb,
    provenance_hash TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_legal_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    projected_value_usd NUMERIC(14,2) NOT NULL,
    realized_value_usd NUMERIC(14,2) DEFAULT 0.00,
    variance_usd NUMERIC(14,2) DEFAULT 0.00,
    status TEXT DEFAULT 'OBSERVED',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
DECLARE
    t_name text;
BEGIN
    FOR t_name IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name LIKE 'enterprise_%'
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t_name);
        EXECUTE format('CREATE INDEX IF NOT EXISTS %I_workspace_idx ON %I (workspace_id);', t_name, t_name);
    END LOOP;
END
$$;
