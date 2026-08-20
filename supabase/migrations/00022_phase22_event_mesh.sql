-- VeritasTech AI Database Migration Schema: Phase 22 Real-Time Intelligence Event Mesh & Signal Ingestion Fabric
-- Adds event_sources, intelligence_events, event_processing_attempts, event_deduplication, event_knowledge_impacts, event_dead_letters, event_schemas, and event_source_metrics.

-- 1. EVENT SOURCES TABLE
CREATE TABLE IF NOT EXISTS event_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  source_type TEXT DEFAULT 'WEBHOOK', -- 'WEBHOOK', 'API', 'FEED', 'ENTERPRISE_SYSTEM', 'INTERNAL', 'SCHEDULED'
  trust_level TEXT DEFAULT 'VERIFIED', -- 'UNTRUSTED', 'LIMITED', 'VERIFIED', 'ENTERPRISE_TRUSTED'
  status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'PAUSED', 'DISABLED', 'REVOKED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INTELLIGENCE EVENTS TABLE
CREATE TABLE IF NOT EXISTS intelligence_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  source_id UUID REFERENCES event_sources(id) ON DELETE CASCADE,
  external_event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  normalized_payload JSONB DEFAULT '{}',
  trust_level TEXT DEFAULT 'VERIFIED',
  verification_status TEXT DEFAULT 'UNVERIFIED', -- 'UNVERIFIED', 'CANDIDATE', 'SUPPORTED', 'VERIFIED', 'CONTESTED', 'REJECTED'
  processing_status TEXT DEFAULT 'COMPLETED', -- 'RECEIVED', 'VALIDATING', 'NORMALIZED', 'DEDUPLICATED', 'PROCESSING', 'COMPLETED', 'FAILED'
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  received_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EVENT KNOWLEDGE IMPACTS TABLE
CREATE TABLE IF NOT EXISTS event_knowledge_impacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES intelligence_events(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL, -- 'ENTITY', 'CLAIM', 'RELATIONSHIP', 'PRODUCT', 'FORESIGHT'
  target_id TEXT NOT NULL,
  severity TEXT DEFAULT 'MEDIUM', -- 'NO_IMPACT', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  explanation TEXT,
  status TEXT DEFAULT 'DETECTED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_evt_sources_ws ON event_sources(workspace_id);
CREATE INDEX IF NOT EXISTS idx_intel_evts_source ON intelligence_events(source_id);
CREATE INDEX IF NOT EXISTS idx_evt_impacts_evt ON event_knowledge_impacts(event_id);

-- RLS POLICIES
ALTER TABLE event_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_knowledge_impacts ENABLE ROW LEVEL SECURITY;
