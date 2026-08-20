-- 00031_phase31_enterprise_control_tower.sql

CREATE TABLE IF NOT EXISTS enterprise_state_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  snapshot_version TEXT NOT NULL,
  strategic_state JSONB DEFAULT '{}'::jsonb,
  decision_state JSONB DEFAULT '{}'::jsonb,
  execution_state JSONB DEFAULT '{}'::jsonb,
  operational_state JSONB DEFAULT '{}'::jsonb,
  adaptive_state JSONB DEFAULT '{}'::jsonb,
  simulation_state JSONB DEFAULT '{}'::jsonb,
  resource_state JSONB DEFAULT '{}'::jsonb,
  governance_state JSONB DEFAULT '{}'::jsonb,
  learning_state JSONB DEFAULT '{}'::jsonb,
  state_classification TEXT DEFAULT 'HEALTHY',
  provenance_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cross_domain_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  source_domain TEXT NOT NULL,
  source_entity_id TEXT NOT NULL,
  target_domain TEXT NOT NULL,
  target_entity_id TEXT NOT NULL,
  relationship_type TEXT NOT NULL,
  strength NUMERIC(5,2) DEFAULT 80.0,
  epistemic_status TEXT DEFAULT 'CORRELATED',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  risk_score NUMERIC(5,2) NOT NULL,
  severity TEXT DEFAULT 'MEDIUM',
  contributors JSONB DEFAULT '[]'::jsonb,
  affected_domains JSONB DEFAULT '[]'::jsonb,
  uncertainty_status TEXT DEFAULT 'ESTIMATED',
  mitigation_status TEXT DEFAULT 'MONITORED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  opportunity_classification TEXT DEFAULT 'EMERGING',
  expected_value NUMERIC(10,2),
  description TEXT,
  required_resources JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'AI_PROPOSED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_priorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  priority_level TEXT DEFAULT 'HIGH',
  urgency NUMERIC(5,2),
  impact NUMERIC(5,2),
  contributing_factors JSONB DEFAULT '[]'::jsonb,
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attention_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reason TEXT NOT NULL,
  source_domain TEXT NOT NULL,
  severity TEXT DEFAULT 'HIGH',
  urgency TEXT DEFAULT 'IMMEDIATE',
  required_role TEXT DEFAULT 'EXECUTIVE',
  resolution_state TEXT DEFAULT 'PENDING',
  source_evidence JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS enterprise_trace_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  trace_id TEXT NOT NULL,
  root_signal_id TEXT,
  research_id TEXT,
  intelligence_id TEXT,
  objective_id TEXT,
  goal_id TEXT,
  decision_id TEXT,
  plan_id TEXT,
  initiative_id TEXT,
  execution_id TEXT,
  outcome_id TEXT,
  learning_id TEXT,
  provenance_chain JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_impact_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  change_event TEXT NOT NULL,
  impact_level TEXT DEFAULT 'MEDIUM',
  affected_entities JSONB DEFAULT '[]'::jsonb,
  dependency_path JSONB DEFAULT '[]'::jsonb,
  governance_action TEXT DEFAULT 'ALLOWED',
  assessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_drift (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  drift_type TEXT NOT NULL,
  severity TEXT DEFAULT 'LOW_DRIFT',
  raw_variance NUMERIC(5,2),
  details TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_governance_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  domain TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  status TEXT DEFAULT 'REQUIRES_APPROVAL',
  reason TEXT NOT NULL,
  actor TEXT DEFAULT 'SYSTEM',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS and Indexes
ALTER TABLE enterprise_state_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_domain_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE attention_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_trace_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_impact_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_drift ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_governance_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_ent_state_ws ON enterprise_state_snapshots(workspace_id);
CREATE INDEX IF NOT EXISTS idx_cross_domain_ws ON cross_domain_relationships(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_risks_ws ON enterprise_risks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_opps_ws ON enterprise_opportunities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_priorities_ws ON enterprise_priorities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_attn_queue_ws ON attention_queue(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_trace_ws ON enterprise_trace_links(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_impact_ws ON enterprise_impact_assessments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_drift_ws ON enterprise_drift(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_gov_ws ON enterprise_governance_events(workspace_id);
