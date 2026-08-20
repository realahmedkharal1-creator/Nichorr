CREATE TABLE enterprise_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    source_domain TEXT NOT NULL,
    source_entity_id TEXT NOT NULL,
    command_type TEXT NOT NULL,
    requested_action TEXT NOT NULL,
    rationale TEXT,
    evidence_references JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'DRAFT',
    risk_level TEXT DEFAULT 'MEDIUM',
    urgency TEXT DEFAULT 'NORMAL',
    reversibility TEXT DEFAULT 'REVERSIBLE',
    idempotency_key TEXT NOT NULL,
    provenance_hash TEXT NOT NULL,
    created_by TEXT DEFAULT 'SYSTEM',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_command_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    action_order INTEGER NOT NULL,
    domain TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    operation TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    prerequisites JSONB DEFAULT '[]'::jsonb,
    reversibility TEXT DEFAULT 'REVERSIBLE',
    rollback_action JSONB DEFAULT '{}'::jsonb,
    execution_adapter TEXT NOT NULL,
    verification_strategy TEXT NOT NULL,
    idempotency_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_command_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    source_action_id TEXT NOT NULL,
    target_action_id TEXT NOT NULL,
    relationship_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_command_authorizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    actor TEXT NOT NULL,
    role TEXT NOT NULL,
    authorization_scope TEXT NOT NULL,
    decision TEXT DEFAULT 'APPROVED',
    reason TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_command_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    from_status TEXT,
    to_status TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_command_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    expected_state JSONB DEFAULT '{}'::jsonb,
    observed_state JSONB DEFAULT '{}'::jsonb,
    verification_status TEXT DEFAULT 'VERIFIED_SUCCESS',
    variance_notes TEXT,
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_command_rollbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    rollback_plan JSONB DEFAULT '{}'::jsonb,
    rollback_status TEXT DEFAULT 'COMPLETED',
    verified_result TEXT DEFAULT 'VERIFIED_SUCCESS',
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_command_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    observed_value NUMERIC(10,2),
    epistemic_status TEXT DEFAULT 'OBSERVED',
    observed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE enterprise_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_command_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_command_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_command_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_command_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_command_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_command_rollbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_command_observations ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_enterprise_commands_workspace ON enterprise_commands(workspace_id);
CREATE INDEX idx_enterprise_command_actions_workspace ON enterprise_command_actions(workspace_id);
CREATE INDEX idx_enterprise_command_actions_command ON enterprise_command_actions(command_id);
CREATE INDEX idx_enterprise_command_dependencies_workspace ON enterprise_command_dependencies(workspace_id);
CREATE INDEX idx_enterprise_command_dependencies_command ON enterprise_command_dependencies(command_id);
CREATE INDEX idx_enterprise_command_authorizations_workspace ON enterprise_command_authorizations(workspace_id);
CREATE INDEX idx_enterprise_command_authorizations_command ON enterprise_command_authorizations(command_id);
CREATE INDEX idx_enterprise_command_events_workspace ON enterprise_command_events(workspace_id);
CREATE INDEX idx_enterprise_command_events_command ON enterprise_command_events(command_id);
CREATE INDEX idx_enterprise_command_verifications_workspace ON enterprise_command_verifications(workspace_id);
CREATE INDEX idx_enterprise_command_verifications_command ON enterprise_command_verifications(command_id);
CREATE INDEX idx_enterprise_command_rollbacks_workspace ON enterprise_command_rollbacks(workspace_id);
CREATE INDEX idx_enterprise_command_rollbacks_command ON enterprise_command_rollbacks(command_id);
CREATE INDEX idx_enterprise_command_observations_workspace ON enterprise_command_observations(workspace_id);
CREATE INDEX idx_enterprise_command_observations_command ON enterprise_command_observations(command_id);
