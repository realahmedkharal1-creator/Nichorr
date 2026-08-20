-- VeritasTech AI Database Migration Schema: Phase 7 Agentic Intelligence & Knowledge Graph
-- Adds Knowledge Graph nodes/edges, agent executions, tool calls, and resource usage tracking.

-- 1. KNOWLEDGE GRAPH NODES TABLE
CREATE TABLE IF NOT EXISTS knowledge_graph_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  node_type TEXT NOT NULL, -- 'PROJECT', 'RESEARCH_RUN', 'SOURCE', 'EVIDENCE', 'CLAIM', 'KNOWLEDGE', 'CONTENT'
  label TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. KNOWLEDGE GRAPH EDGES TABLE
CREATE TABLE IF NOT EXISTS knowledge_graph_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  source_node_id UUID REFERENCES knowledge_graph_nodes(id) ON DELETE CASCADE,
  target_node_id UUID REFERENCES knowledge_graph_nodes(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL, -- 'SUPPORTED_BY', 'DERIVED_FROM', 'CONFLICTS_WITH', 'SUPERSEDES', 'CONTESTED_BY', 'AFFECTS', 'USES'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AGENT EXECUTIONS TABLE
CREATE TABLE IF NOT EXISTS agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL, -- 'DISCOVERY', 'VERIFICATION', 'CONTRADICTION', 'FRESHNESS', 'SOURCE_QUALITY', 'KNOWLEDGE', 'CREATOR_INTELLIGENCE'
  task_id TEXT NOT NULL,
  status TEXT DEFAULT 'RUNNING', -- 'QUEUED', 'PLANNING', 'RUNNING', 'WAITING_EVIDENCE', 'WAITING_APPROVAL', 'COMPLETED', 'FAILED', 'CANCELLED'
  confidence_score NUMERIC(5,2),
  input_context JSONB DEFAULT '{}'::jsonb,
  output_result JSONB DEFAULT '{}'::jsonb,
  resource_usage JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RESOURCE USAGE LOGS TABLE
CREATE TABLE IF NOT EXISTS resource_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL,
  model_name TEXT DEFAULT 'gemini-1.5-flash',
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  estimated_cost_usd NUMERIC(10,6) DEFAULT 0.000000,
  execution_time_ms INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_kg_nodes_project ON knowledge_graph_nodes(project_id);
CREATE INDEX IF NOT EXISTS idx_kg_edges_project ON knowledge_graph_edges(project_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_project ON agent_executions(project_id);
CREATE INDEX IF NOT EXISTS idx_resource_usage_project ON resource_usage_logs(project_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE knowledge_graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_graph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR USER TENANCY ISOLATION
CREATE POLICY "Users can manage KG nodes for their projects" ON knowledge_graph_nodes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = knowledge_graph_nodes.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage KG edges for their projects" ON knowledge_graph_edges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = knowledge_graph_edges.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage agent executions for their projects" ON agent_executions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = agent_executions.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage resource usage for their projects" ON resource_usage_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = resource_usage_logs.project_id AND projects.user_id = auth.uid()
    )
  );
