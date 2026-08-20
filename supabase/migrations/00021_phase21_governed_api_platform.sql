-- VeritasTech AI Database Migration Schema: Phase 21 Governed Intelligence API, Developer Platform & External Integration Fabric
-- Adds api_clients, api_keys, service_accounts, api_usage, api_rate_limits, api_idempotency_keys, api_audit_events, and integration_connections.

-- 1. API CLIENTS TABLE
CREATE TABLE IF NOT EXISTS api_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_type TEXT DEFAULT 'DEVELOPER_APP', -- 'SERVICE_ACCOUNT', 'ENTERPRISE_CONNECTOR', 'EXTERNAL_AGENT'
  trust_level TEXT DEFAULT 'VERIFIED', -- 'UNTRUSTED', 'LIMITED', 'VERIFIED', 'ENTERPRISE_TRUSTED'
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. API KEYS TABLE
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES api_clients(id) ON DELETE CASCADE,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  scopes TEXT[] DEFAULT ARRAY['knowledge:read'],
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. API USAGE METRICS TABLE
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  token_count INTEGER DEFAULT 0,
  compute_cost NUMERIC(10, 4) DEFAULT 0.0000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_api_clients_ws ON api_clients(workspace_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_client ON api_keys(client_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_ws ON api_usage(workspace_id);

-- RLS POLICIES
ALTER TABLE api_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
