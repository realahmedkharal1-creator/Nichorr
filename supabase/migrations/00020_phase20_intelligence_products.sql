-- VeritasTech AI Database Migration Schema: Phase 20 Governed Intelligence Products, Continuous Briefings, Delivery & Distribution
-- Adds intelligence_products, intelligence_product_versions, intelligence_product_subscriptions, intelligence_deliveries, intelligence_webhooks, intelligence_webhook_events, and intelligence_product_changes.

-- 1. INTELLIGENCE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS intelligence_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  product_type TEXT DEFAULT 'BRIEF', -- 'BRIEF', 'REPORT', 'DIGEST', 'WATCHLIST', 'PROFILE', 'MONITOR', 'BULLETIN'
  status TEXT DEFAULT 'ACTIVE', -- 'DRAFT', 'ACTIVE', 'PAUSED', 'STALE', 'REQUIRES_REVIEW', 'ARCHIVED'
  freshness_policy TEXT DEFAULT 'DAILY', -- 'REALTIME', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'
  quality_score NUMERIC(5, 2) DEFAULT 98.00,
  current_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INTELLIGENCE PRODUCT VERSIONS TABLE
CREATE TABLE IF NOT EXISTS intelligence_product_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES intelligence_products(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  provenance_manifest JSONB DEFAULT '{}',
  confidence NUMERIC(5, 2) DEFAULT 95.00,
  quality_score NUMERIC(5, 2) DEFAULT 98.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INTELLIGENCE PRODUCT SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS intelligence_product_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES intelligence_products(id) ON DELETE CASCADE,
  subscriber_email TEXT NOT NULL,
  channel TEXT DEFAULT 'EMAIL', -- 'IN_APP', 'EMAIL', 'WEBHOOK', 'API'
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INTELLIGENCE DELIVERIES TABLE
CREATE TABLE IF NOT EXISTS intelligence_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES intelligence_products(id) ON DELETE CASCADE,
  version_id UUID REFERENCES intelligence_product_versions(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  recipient TEXT NOT NULL,
  status TEXT DEFAULT 'DELIVERED', -- 'QUEUED', 'SENDING', 'DELIVERED', 'FAILED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_ws ON intelligence_products(workspace_id);
CREATE INDEX IF NOT EXISTS idx_prod_versions_prod ON intelligence_product_versions(product_id);
CREATE INDEX IF NOT EXISTS idx_subs_prod ON intelligence_product_subscriptions(product_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_prod ON intelligence_deliveries(product_id);

-- RLS POLICIES
ALTER TABLE intelligence_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_product_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_product_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_deliveries ENABLE ROW LEVEL SECURITY;
