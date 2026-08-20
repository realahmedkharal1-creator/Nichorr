-- VeritasTech AI Database Migration Schema: Phase 18 Temporal Knowledge Graph Intelligence & Governed Reasoning
-- Adds graph_snapshots, temporal_claim_versions, temporal_relationship_versions, semantic_documents, knowledge_answers, reasoning_paths, evidence_gaps, graph_diffs, and graph_impacts.

-- 1. GRAPH SNAPSHOTS TABLE
CREATE TABLE IF NOT EXISTS graph_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  snapshot_name TEXT NOT NULL,
  as_of_timestamp TIMESTAMPTZ NOT NULL,
  total_nodes INTEGER DEFAULT 0,
  total_edges INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. KNOWLEDGE ANSWERS TABLE
CREATE TABLE IF NOT EXISTS knowledge_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  confidence NUMERIC(5, 2) DEFAULT 95.00,
  certainty_level TEXT DEFAULT 'HIGH', -- 'HIGH', 'MEDIUM', 'LOW', 'CONTESTED', 'UNKNOWN'
  reasoning_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EVIDENCE GAPS TABLE
CREATE TABLE IF NOT EXISTS evidence_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  gap_description TEXT NOT NULL,
  severity TEXT DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  recommended_remediation TEXT,
  status TEXT DEFAULT 'OPEN', -- 'OPEN', 'RESEARCHING', 'RESOLVED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. REASONING PATHS TABLE
CREATE TABLE IF NOT EXISTS reasoning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  query_id UUID REFERENCES knowledge_answers(id) ON DELETE CASCADE,
  path_summary TEXT NOT NULL,
  traversal_depth INTEGER DEFAULT 2,
  path_confidence NUMERIC(5, 2) DEFAULT 90.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_snapshots_ws ON graph_snapshots(workspace_id);
CREATE INDEX IF NOT EXISTS idx_answers_ws ON knowledge_answers(workspace_id);
CREATE INDEX IF NOT EXISTS idx_gaps_ws ON evidence_gaps(workspace_id);
CREATE INDEX IF NOT EXISTS idx_reasoning_ws ON reasoning_paths(workspace_id);

-- RLS POLICIES
ALTER TABLE graph_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE reasoning_paths ENABLE ROW LEVEL SECURITY;
