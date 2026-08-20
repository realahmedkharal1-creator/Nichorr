CREATE TABLE strategic_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    tenant_id UUID,
    title TEXT NOT NULL,
    description TEXT,
    owner_id UUID,
    status TEXT CHECK (status IN ('DRAFT','VALIDATING','ACTIVE','AT_RISK','ACHIEVED','MISSED','CLOSED')),
    target_metric TEXT,
    baseline_value NUMERIC,
    target_value NUMERIC,
    current_value NUMERIC,
    target_date TIMESTAMPTZ,
    constraints JSONB,
    dependencies JSONB,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE strategic_initiatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    organization_id UUID,
    title TEXT NOT NULL,
    description TEXT,
    objective_ids JSONB,
    goal_ids JSONB,
    owner TEXT,
    priority TEXT,
    status TEXT CHECK (status IN ('DRAFT','PROPOSED','VALIDATING','APPROVED','PLANNED','EXECUTING','AT_RISK','PAUSED','COMPLETED','CLOSED')),
    expected_value NUMERIC,
    estimated_cost NUMERIC,
    estimated_duration INTEGER,
    risk_level TEXT,
    reversibility TEXT,
    resource_requirements JSONB,
    dependencies JSONB,
    milestones JSONB,
    target_outcomes JSONB,
    governance_requirements JSONB,
    execution_linkage JSONB,
    simulation_linkage JSONB,
    causal_hypothesis_linkage JSONB,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE initiative_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    source_initiative_id UUID NOT NULL,
    target_initiative_id UUID NOT NULL,
    dependency_type TEXT CHECK (dependency_type IN ('BLOCKS','DEPENDS_ON','ENABLES','CONFLICTS_WITH','SEQUENCES_BEFORE','SEQUENCES_AFTER','SHARED_RESOURCE')),
    status TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resource_capacities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    resource_type TEXT CHECK (resource_type IN ('FINANCIAL','HUMAN','ENGINEERING','RESEARCH','INFRASTRUCTURE','OPERATIONAL','COMPUTE','AGENT')),
    total_capacity NUMERIC,
    committed_capacity NUMERIC DEFAULT 0,
    consumed_capacity NUMERIC DEFAULT 0,
    unit TEXT,
    period TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resource_commitments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    initiative_id UUID NOT NULL,
    resource_type TEXT,
    amount NUMERIC,
    status TEXT CHECK (status IN ('COMMITTED','ALLOCATED','CONSUMED','RELEASED')),
    period TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE strategic_alignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_id UUID NOT NULL,
    workspace_id UUID NOT NULL,
    objective_alignment TEXT,
    goal_alignment TEXT,
    expected_value_alignment TEXT,
    risk_alignment TEXT,
    resource_alignment TEXT,
    timing_alignment TEXT,
    dependency_alignment TEXT,
    overall_classification TEXT CHECK (overall_classification IN ('ALIGNED','PARTIALLY_ALIGNED','MISALIGNED','UNKNOWN','INSUFFICIENT_DATA')),
    epistemic_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE strategic_execution_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_id UUID NOT NULL,
    workspace_id UUID NOT NULL,
    schedule_status TEXT,
    budget_status TEXT,
    resource_status TEXT,
    milestone_status TEXT,
    risk_status TEXT,
    overall_health TEXT CHECK (overall_health IN ('HEALTHY','WATCH','AT_RISK','CRITICAL','BLOCKED','UNKNOWN')),
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE strategic_drift (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_id UUID NOT NULL,
    workspace_id UUID NOT NULL,
    drift_type TEXT CHECK (drift_type IN ('OBJECTIVE_DRIFT','SCOPE_DRIFT','RESOURCE_DRIFT','TIMELINE_DRIFT','OUTCOME_DRIFT','PRIORITY_DRIFT','EXECUTION_VS_STRATEGY_DRIFT')),
    severity TEXT CHECK (severity IN ('NO_DRIFT','LOW_DRIFT','MEDIUM_DRIFT','HIGH_DRIFT','CRITICAL_DRIFT','UNKNOWN')),
    details JSONB,
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE strategic_interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_id UUID NOT NULL,
    workspace_id UUID NOT NULL,
    intervention_type TEXT CHECK (intervention_type IN ('ACCELERATE','PAUSE','REALLOCATE_RESOURCES','CHANGE_PRIORITY','REVISE_TIMELINE','INVESTIGATE_DEPENDENCY','REQUEST_SIMULATION','REQUEST_HUMAN_REVIEW','REVISE_OBJECTIVE','CLOSE')),
    rationale TEXT,
    status TEXT CHECK (status IN ('AI_PROPOSED','GOVERNANCE_REVIEW','APPROVED','REJECTED','EXECUTED')),
    estimated_impact JSONB,
    simulation_evidence JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE strategic_trace_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    goal_id UUID,
    objective_id UUID,
    decision_id UUID,
    plan_id UUID,
    initiative_id UUID,
    execution_id UUID,
    outcome_id UUID,
    trace_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE strategic_orchestration_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    intervention_id UUID,
    plan_id UUID,
    initiative_id UUID,
    reviewer TEXT,
    decision TEXT CHECK (decision IN ('APPROVED','REJECTED','DEFERRED')),
    reason TEXT,
    autonomy_level TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE strategic_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiative_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_capacities ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_alignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_execution_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_drift ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_trace_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_orchestration_approvals ENABLE ROW LEVEL SECURITY;

-- Add basic Indexes
CREATE INDEX idx_sg_ws ON strategic_goals(workspace_id);
CREATE INDEX idx_si_ws ON strategic_initiatives(workspace_id);
CREATE INDEX idx_id_ws ON initiative_dependencies(workspace_id);
CREATE INDEX idx_rc_ws ON resource_capacities(workspace_id);
CREATE INDEX idx_rcmt_ws ON resource_commitments(workspace_id);
CREATE INDEX idx_sa_ws ON strategic_alignments(workspace_id);
CREATE INDEX idx_seh_ws ON strategic_execution_health(workspace_id);
CREATE INDEX idx_sdr_ws ON strategic_drift(workspace_id);
CREATE INDEX idx_si_ws2 ON strategic_interventions(workspace_id);
CREATE INDEX idx_stl_ws ON strategic_trace_links(workspace_id);
CREATE INDEX idx_soa_ws ON strategic_orchestration_approvals(workspace_id);
