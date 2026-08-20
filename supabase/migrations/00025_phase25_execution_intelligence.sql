-- VeritasTech AI Database Migration Schema: Phase 25 Execution Intelligence & Governed Action Orchestration Layer
-- Adds actions, action_plans, execution_proposals, executions, execution_events, execution_approvals, execution_outcomes, execution_rollbacks, and execution_policies.

-- 1. ACTIONS TABLE
CREATE TABLE IF NOT EXISTS actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  action_type TEXT DEFAULT 'EXTERNAL_SYSTEM_ACTION', -- 'NOTIFICATION', 'DATA_UPDATE', 'API_CALL', 'WORKFLOW_TRIGGER', 'EXTERNAL_SYSTEM_ACTION'
  target_system TEXT NOT NULL,
  reversibility TEXT DEFAULT 'REVERSIBLE', -- 'REVERSIBLE', 'PARTIALLY_REVERSIBLE', 'IRREVERSIBLE', 'UNKNOWN'
  risk_level TEXT DEFAULT 'MEDIUM',
  autonomy_level INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EXECUTION PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS execution_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE,
  action_id UUID REFERENCES actions(id) ON DELETE CASCADE,
  proposed_by TEXT DEFAULT 'AI_AGENT',
  status TEXT DEFAULT 'AI_PROPOSED', -- 'AI_PROPOSED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXECUTED'
  reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EXECUTIONS TABLE
CREATE TABLE IF NOT EXISTS executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  action_id UUID REFERENCES actions(id) ON DELETE CASCADE,
  proposal_id UUID REFERENCES execution_proposals(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'SUCCEEDED', -- 'CREATED', 'VALIDATING', 'AUTHORIZED', 'QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'ROLLED_BACK'
  idempotency_key TEXT NOT NULL,
  target_system TEXT NOT NULL,
  executed_by TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXECUTION APPROVALS TABLE
CREATE TABLE IF NOT EXISTS execution_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID REFERENCES executions(id) ON DELETE CASCADE,
  approver TEXT NOT NULL,
  status TEXT DEFAULT 'APPROVED', -- 'PENDING', 'APPROVED', 'REJECTED'
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_actions_ws ON actions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_exec_proposals_dec ON execution_proposals(decision_id);
CREATE INDEX IF NOT EXISTS idx_executions_ws ON executions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_exec_approvals_exec ON execution_approvals(execution_id);

-- RLS POLICIES
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_approvals ENABLE ROW LEVEL SECURITY;
