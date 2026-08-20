-- VeritasTech AI Database Migration Schema: Phase 19 Governed Multi-Agent Intelligence Orchestration
-- Adds intelligence_tasks, intelligence_task_steps, agent_registry, agent_delegations, agent_results, agent_conflicts, orchestration_checkpoints, and orchestration_memory.

-- 1. INTELLIGENCE TASKS TABLE
CREATE TABLE IF NOT EXISTS intelligence_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_intent TEXT NOT NULL,
  task_type TEXT DEFAULT 'COMPLEX_RESEARCH',
  status TEXT DEFAULT 'RUNNING', -- 'CREATED', 'PLANNING', 'RUNNING', 'WAITING_FOR_APPROVAL', 'VERIFYING', 'COMPLETED', 'FAILED'
  autonomy_level INTEGER DEFAULT 3,
  risk_level TEXT DEFAULT 'MEDIUM',
  confidence NUMERIC(5, 2) DEFAULT 95.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INTELLIGENCE TASK STEPS TABLE
CREATE TABLE IF NOT EXISTS intelligence_task_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES intelligence_tasks(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_name TEXT NOT NULL,
  assigned_agent TEXT NOT NULL,
  status TEXT DEFAULT 'COMPLETED',
  step_output TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AGENT REGISTRY TABLE
CREATE TABLE IF NOT EXISTS agent_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'DISCOVERY', 'VERIFICATION', 'CONTRADICTION', 'FORESIGHT', 'STRATEGY'
  capabilities TEXT[] DEFAULT '{}',
  risk_level TEXT DEFAULT 'LOW',
  status TEXT DEFAULT 'ACTIVE',
  version TEXT DEFAULT '1.0.0',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AGENT CONFLICTS TABLE
CREATE TABLE IF NOT EXISTS agent_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES intelligence_tasks(id) ON DELETE CASCADE,
  conflict_type TEXT NOT NULL,
  agent_a TEXT NOT NULL,
  agent_b TEXT NOT NULL,
  claim_a TEXT NOT NULL,
  claim_b TEXT NOT NULL,
  status TEXT DEFAULT 'CONTESTED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_tasks_ws ON intelligence_tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_steps_task ON intelligence_task_steps(task_id);
CREATE INDEX IF NOT EXISTS idx_conflicts_task ON agent_conflicts(task_id);

-- RLS POLICIES
ALTER TABLE intelligence_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_task_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_conflicts ENABLE ROW LEVEL SECURITY;
