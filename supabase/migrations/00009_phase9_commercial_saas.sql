-- VeritasTech AI Database Migration Schema: Phase 9 Commercial SaaS Platform
-- Adds subscriptions, api_keys, webhook_endpoints, webhook_deliveries, integrations, analytics_events, and onboarding_progress.

-- 1. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'FREE', -- 'FREE', 'CREATOR', 'PRO', 'TEAM', 'ENTERPRISE'
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELLED', 'EXPIRED'
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id)
);

-- 2. API KEYS TABLE
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  masked_key TEXT NOT NULL,
  scopes JSONB DEFAULT '["READ_RESEARCH"]'::jsonb,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WEBHOOK ENDPOINTS TABLE
CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events JSONB DEFAULT '["research.completed"]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WEBHOOK DELIVERIES TABLE
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'DELIVERED', -- 'DELIVERED', 'FAILED', 'RETRYING'
  response_code INTEGER,
  attempt_count INTEGER DEFAULT 1,
  delivered_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INTEGRATIONS TABLE
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'YOUTUBE', 'SLACK', 'DISCORD', 'NOTION', 'GITHUB', 'GOOGLE_DRIVE'
  status TEXT DEFAULT 'CONNECTED', -- 'CONNECTED', 'DISCONNECTED', 'ERROR', 'REAUTH_REQUIRED'
  metadata JSONB DEFAULT '{}'::jsonb,
  connected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRODUCT ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  user_id UUID,
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_subscriptions_ws ON subscriptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_ws ON api_keys(workspace_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_ws ON webhook_endpoints(workspace_id);
CREATE INDEX IF NOT EXISTS idx_integrations_ws ON integrations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_analytics_ws ON analytics_events(workspace_id);

-- ROW LEVEL SECURITY
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
