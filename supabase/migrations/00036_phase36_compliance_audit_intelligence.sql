
CREATE TABLE IF NOT EXISTS enterprise_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    policy_domain TEXT NOT NULL,
    scope TEXT NOT NULL,
    owner TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    version INTEGER DEFAULT 1,
    precedence_level INTEGER DEFAULT 1,
    effective_date TIMESTAMPTZ DEFAULT NOW(),
    expiration_date TIMESTAMPTZ,
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_policy_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES enterprise_policies(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    policy_body TEXT NOT NULL,
    rationale TEXT,
    approved_by TEXT,
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    control_code TEXT NOT NULL,
    title TEXT NOT NULL,
    control_objective TEXT NOT NULL,
    policy_id UUID REFERENCES enterprise_policies(id) ON DELETE CASCADE,
    control_type TEXT DEFAULT 'PREVENTATIVE',
    frequency TEXT DEFAULT 'CONTINUOUS',
    status TEXT DEFAULT 'OPERATING',
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_obligations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    source_reference TEXT NOT NULL,
    requirement_type TEXT DEFAULT 'USER_SUPPLIED_REQUIREMENT',
    jurisdiction TEXT DEFAULT 'GLOBAL',
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obligation_id UUID REFERENCES enterprise_obligations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    requirement_code TEXT NOT NULL,
    description TEXT NOT NULL,
    criticality TEXT DEFAULT 'HIGH',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_policy_control_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    policy_id UUID REFERENCES enterprise_policies(id) ON DELETE CASCADE,
    control_id UUID REFERENCES enterprise_controls(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES enterprise_requirements(id) ON DELETE CASCADE,
    mapping_status TEXT DEFAULT 'VALID',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_compliance_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    control_id UUID REFERENCES enterprise_controls(id) ON DELETE CASCADE,
    evidence_source TEXT NOT NULL,
    evidence_type TEXT NOT NULL,
    integrity_hash TEXT NOT NULL,
    freshness_status TEXT DEFAULT 'FRESH',
    collected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_compliance_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    control_id UUID REFERENCES enterprise_controls(id) ON DELETE CASCADE,
    compliance_status TEXT DEFAULT 'COMPLIANT',
    confidence_score NUMERIC(5,2) DEFAULT 95.0,
    reasoning TEXT NOT NULL,
    assessed_by TEXT DEFAULT 'COMPLIANCE_ENGINE',
    assessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_control_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    control_id UUID REFERENCES enterprise_controls(id) ON DELETE CASCADE,
    test_name TEXT NOT NULL,
    test_procedure TEXT NOT NULL,
    test_result TEXT DEFAULT 'PASS',
    execution_duration_ms INTEGER DEFAULT 120,
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_compliance_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    control_id UUID REFERENCES enterprise_controls(id) ON DELETE CASCADE,
    violation_type TEXT NOT NULL,
    severity TEXT DEFAULT 'HIGH',
    description TEXT NOT NULL,
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_audit_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    finding_status TEXT DEFAULT 'OPEN',
    severity TEXT DEFAULT 'HIGH',
    policy_id UUID REFERENCES enterprise_policies(id) ON DELETE CASCADE,
    control_id UUID REFERENCES enterprise_controls(id) ON DELETE CASCADE,
    root_evidence_refs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_compliance_remediations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finding_id UUID REFERENCES enterprise_audit_findings(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    proposed_action TEXT NOT NULL,
    expected_effect TEXT NOT NULL,
    status TEXT DEFAULT 'AI_PROPOSED',
    phase32_command_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_compliance_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remediation_id UUID REFERENCES enterprise_compliance_remediations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    verification_status TEXT DEFAULT 'REMEDIATED',
    observed_state JSONB DEFAULT '{}'::jsonb,
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_audit_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    audit_title TEXT NOT NULL,
    target_domain TEXT NOT NULL,
    planned_date TIMESTAMPTZ NOT NULL,
    priority TEXT DEFAULT 'HIGH',
    status TEXT DEFAULT 'SCHEDULED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_compliance_drift (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    drift_type TEXT NOT NULL,
    affected_entity TEXT NOT NULL,
    drift_level TEXT DEFAULT 'NO_DRIFT',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_compliance_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    finding_id TEXT,
    lesson_type TEXT NOT NULL,
    description TEXT NOT NULL,
    append_only BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_compliance_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    title TEXT NOT NULL,
    rationale TEXT NOT NULL,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    actor TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    provenance_hash TEXT NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);
