-- VeritasTech AI Database Migration Schema: Phase 17 Adaptive Knowledge Graph & Entity Intelligence
-- Adds entities, entity_aliases, entity_versions, relationships, claims, claim_evidence, graph_events, and graph_review_queue.

-- 1. ENTITIES TABLE
CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  canonical_name TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'COMPANY', 'TECHNOLOGY', 'MODEL', 'PLATFORM', 'PERSON', 'PRODUCT'
  description TEXT,
  confidence NUMERIC(5, 2) DEFAULT 95.00,
  freshness_status TEXT DEFAULT 'FRESH', -- 'FRESH', 'AGING', 'STALE', 'CRITICAL'
  status TEXT DEFAULT 'CONFIRMED', -- 'UNRESOLVED', 'CANDIDATE', 'CONFIRMED', 'MERGED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ENTITY ALIASES TABLE
CREATE TABLE IF NOT EXISTS entity_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  alias_name TEXT NOT NULL,
  confidence NUMERIC(5, 2) DEFAULT 90.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RELATIONSHIPS TABLE
CREATE TABLE IF NOT EXISTS relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  source_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  target_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL, -- 'OWNS', 'BUILDS', 'USES', 'DEPENDS_ON', 'COMPETES_WITH', 'INTEGRATES_WITH'
  confidence NUMERIC(5, 2) DEFAULT 90.00,
  evidence_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CLAIMS TABLE
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  claim_text TEXT NOT NULL,
  status TEXT DEFAULT 'UNCONTESTED', -- 'UNCONTESTED', 'CONTESTED', 'RESOLVED'
  confidence NUMERIC(5, 2) DEFAULT 95.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GRAPH REVIEW QUEUE TABLE
CREATE TABLE IF NOT EXISTS graph_review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  review_type TEXT NOT NULL, -- 'DUPLICATE', 'MERGE_CANDIDATE', 'RELATIONSHIP_CANDIDATE'
  entity_a_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  entity_b_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_entities_ws ON entities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_aliases_ent ON entity_aliases(entity_id);
CREATE INDEX IF NOT EXISTS idx_relationships_ws ON relationships(workspace_id);
CREATE INDEX IF NOT EXISTS idx_claims_ws ON claims(workspace_id);
CREATE INDEX IF NOT EXISTS idx_graph_queue_ws ON graph_review_queue(workspace_id);

-- RLS POLICIES
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_review_queue ENABLE ROW LEVEL SECURITY;
