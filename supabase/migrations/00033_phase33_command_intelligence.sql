CREATE TABLE enterprise_command_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    originating_domain TEXT NOT NULL,
    requested_by TEXT NOT NULL,
    intent_type TEXT NOT NULL,
    objective_reference TEXT,
    expected_state JSONB DEFAULT '{}'::jsonb,
    expected_metrics JSONB DEFAULT '{}'::jsonb,
    expected_time_window TEXT,
    success_conditions JSONB DEFAULT '[]'::jsonb,
    failure_conditions JSONB DEFAULT '[]'::jsonb,
    constraints JSONB DEFAULT '[]'::jsonb,
    governance_requirements JSONB DEFAULT '[]'::jsonb,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_outcome_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    expected_state JSONB DEFAULT '{}'::jsonb,
    expected_metrics JSONB DEFAULT '{}'::jsonb,
    acceptable_variance NUMERIC(5,2) DEFAULT 5.0,
    success_threshold NUMERIC(5,2) DEFAULT 95.0,
    failure_threshold NUMERIC(5,2) DEFAULT 50.0,
    observation_window TEXT,
    verification_strategy TEXT NOT NULL,
    required_evidence JSONB DEFAULT '[]'::jsonb,
    epistemic_status TEXT DEFAULT 'FORECAST',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_actual_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    action_id TEXT,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    observed_state JSONB DEFAULT '{}'::jsonb,
    observed_metrics JSONB DEFAULT '{}'::jsonb,
    observation_sources JSONB DEFAULT '[]'::jsonb,
    verification_status TEXT DEFAULT 'VERIFIED_SUCCESS',
    evidence_refs JSONB DEFAULT '[]'::jsonb,
    provenance_hash TEXT NOT NULL,
    observed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_outcome_deviations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    deviation_level TEXT DEFAULT 'NO_DEVIATION',
    metric_deviation JSONB DEFAULT '{}'::jsonb,
    timing_deviation JSONB DEFAULT '{}'::jsonb,
    state_deviation JSONB DEFAULT '{}'::jsonb,
    resource_deviation JSONB DEFAULT '{}'::jsonb,
    risk_deviation JSONB DEFAULT '{}'::jsonb,
    epistemic_status TEXT DEFAULT 'OBSERVED',
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_command_effectiveness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    execution_correctness NUMERIC(5,2) DEFAULT 98.0,
    outcome_achievement NUMERIC(5,2) DEFAULT 95.0,
    time_efficiency NUMERIC(5,2) DEFAULT 90.0,
    resource_efficiency NUMERIC(5,2) DEFAULT 92.0,
    risk_efficiency NUMERIC(5,2) DEFAULT 94.0,
    strategic_contribution NUMERIC(5,2) DEFAULT 95.0,
    overall_effectiveness TEXT DEFAULT 'EFFECTIVE',
    epistemic_status TEXT DEFAULT 'OBSERVED',
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_command_impacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    impact_type TEXT NOT NULL,
    affected_entity TEXT NOT NULL,
    magnitude TEXT DEFAULT 'MEDIUM',
    evidence_basis JSONB DEFAULT '[]'::jsonb,
    classification TEXT DEFAULT 'DIRECTLY_OBSERVED',
    assessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_outcome_attributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    outcome_id TEXT NOT NULL,
    attribution_confidence TEXT DEFAULT 'SUPPORTED',
    score NUMERIC(5,2) DEFAULT 90.0,
    confounding_factors JSONB DEFAULT '[]'::jsonb,
    epistemic_note TEXT,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_outcome_recoveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    recovery_type TEXT NOT NULL,
    rationale TEXT NOT NULL,
    status TEXT DEFAULT 'AI_PROPOSED',
    recommended_actions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_command_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    pattern_name TEXT NOT NULL,
    pattern_type TEXT DEFAULT 'OBSERVED_PATTERN',
    frequency INTEGER DEFAULT 1,
    success_rate NUMERIC(5,2) DEFAULT 90.0,
    description TEXT,
    supporting_command_ids JSONB DEFAULT '[]'::jsonb,
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_command_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES enterprise_commands(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    lesson_type TEXT NOT NULL,
    description TEXT NOT NULL,
    error_type TEXT,
    feedback_signal JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_command_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    pattern_id TEXT,
    command_type TEXT NOT NULL,
    rationale TEXT NOT NULL,
    expected_benefit TEXT NOT NULL,
    expected_risk TEXT DEFAULT 'MEDIUM',
    supporting_evidence JSONB DEFAULT '[]'::jsonb,
    historical_success_rate NUMERIC(5,2) DEFAULT 92.0,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE enterprise_command_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_outcome_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_actual_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_outcome_deviations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_command_effectiveness ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_command_impacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_outcome_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_outcome_recoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_command_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_command_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_command_recommendations ENABLE ROW LEVEL SECURITY;

-- Create Indexes
CREATE INDEX idx_enterprise_command_intents_workspace ON enterprise_command_intents(workspace_id);
CREATE INDEX idx_enterprise_command_intents_command ON enterprise_command_intents(command_id);
CREATE INDEX idx_enterprise_outcome_contracts_workspace ON enterprise_outcome_contracts(workspace_id);
CREATE INDEX idx_enterprise_outcome_contracts_command ON enterprise_outcome_contracts(command_id);
CREATE INDEX idx_enterprise_actual_outcomes_workspace ON enterprise_actual_outcomes(workspace_id);
CREATE INDEX idx_enterprise_actual_outcomes_command ON enterprise_actual_outcomes(command_id);
CREATE INDEX idx_enterprise_outcome_deviations_workspace ON enterprise_outcome_deviations(workspace_id);
CREATE INDEX idx_enterprise_outcome_deviations_command ON enterprise_outcome_deviations(command_id);
CREATE INDEX idx_enterprise_command_effectiveness_workspace ON enterprise_command_effectiveness(workspace_id);
CREATE INDEX idx_enterprise_command_effectiveness_command ON enterprise_command_effectiveness(command_id);
CREATE INDEX idx_enterprise_command_impacts_workspace ON enterprise_command_impacts(workspace_id);
CREATE INDEX idx_enterprise_command_impacts_command ON enterprise_command_impacts(command_id);
CREATE INDEX idx_enterprise_outcome_attributions_workspace ON enterprise_outcome_attributions(workspace_id);
CREATE INDEX idx_enterprise_outcome_attributions_command ON enterprise_outcome_attributions(command_id);
CREATE INDEX idx_enterprise_outcome_recoveries_workspace ON enterprise_outcome_recoveries(workspace_id);
CREATE INDEX idx_enterprise_outcome_recoveries_command ON enterprise_outcome_recoveries(command_id);
CREATE INDEX idx_enterprise_command_patterns_workspace ON enterprise_command_patterns(workspace_id);
CREATE INDEX idx_enterprise_command_learning_workspace ON enterprise_command_learning(workspace_id);
CREATE INDEX idx_enterprise_command_learning_command ON enterprise_command_learning(command_id);
CREATE INDEX idx_enterprise_command_recommendations_workspace ON enterprise_command_recommendations(workspace_id);
