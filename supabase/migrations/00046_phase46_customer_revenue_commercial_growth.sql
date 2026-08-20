CREATE TABLE IF NOT EXISTS enterprise_commercial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  tier TEXT DEFAULT 'ENTERPRISE',
  annual_recurring_revenue_usd NUMERIC(14,2) DEFAULT 120000.00,
  health_score NUMERIC(5,2) DEFAULT 92.5,
  status TEXT DEFAULT 'ACTIVE',
  provenance_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_commercial_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  account_id UUID REFERENCES enterprise_commercial_accounts(id) ON DELETE CASCADE,
  opportunity_title TEXT NOT NULL,
  stage TEXT DEFAULT 'QUALIFIED_PIPELINE',
  expected_value_usd NUMERIC(14,2) NOT NULL,
  win_probability_percentage NUMERIC(5,2) DEFAULT 65.0,
  status TEXT DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_commercial_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  account_id UUID REFERENCES enterprise_commercial_accounts(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  arr_amount_usd NUMERIC(14,2) NOT NULL,
  net_retention_rate_percentage NUMERIC(5,2) DEFAULT 118.5,
  revenue_type TEXT DEFAULT 'RECURRING_SUBSCRIPTION',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_commercial_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  pipeline_name TEXT NOT NULL,
  total_pipeline_value_usd NUMERIC(14,2) NOT NULL,
  weighted_forecast_usd NUMERIC(14,2) NOT NULL,
  average_sales_cycle_days INTEGER DEFAULT 62,
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_customer_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  account_id UUID REFERENCES enterprise_commercial_accounts(id) ON DELETE CASCADE,
  overall_health_score NUMERIC(5,2) NOT NULL,
  engagement_index NUMERIC(5,2) DEFAULT 88.0,
  support_signal_score NUMERIC(5,2) DEFAULT 95.0,
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_customer_retention (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  account_id UUID REFERENCES enterprise_commercial_accounts(id) ON DELETE CASCADE,
  renewal_date DATE NOT NULL,
  renewal_probability_percentage NUMERIC(5,2) DEFAULT 94.0,
  retention_status TEXT DEFAULT 'SECURE',
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_customer_churn (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  account_id UUID REFERENCES enterprise_commercial_accounts(id) ON DELETE CASCADE,
  churn_risk_level TEXT DEFAULT 'LOW',
  churn_risk_score NUMERIC(5,2) DEFAULT 8.5,
  primary_risk_factor TEXT NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_customer_expansion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  account_id UUID REFERENCES enterprise_commercial_accounts(id) ON DELETE CASCADE,
  expansion_type TEXT DEFAULT 'UPSELL_SEATS',
  potential_expansion_arr_usd NUMERIC(14,2) DEFAULT 45000.00,
  readiness_score NUMERIC(5,2) DEFAULT 85.0,
  status TEXT DEFAULT 'AI_PROPOSED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_revenue_concentration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  top_10_account_share_percentage NUMERIC(5,2) DEFAULT 24.5,
  top_customer_share_percentage NUMERIC(5,2) DEFAULT 4.8,
  concentration_risk_level TEXT DEFAULT 'MODERATE',
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_revenue_leakage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  account_id UUID REFERENCES enterprise_commercial_accounts(id) ON DELETE CASCADE,
  leakage_type TEXT NOT NULL,
  estimated_leakage_usd NUMERIC(12,2) DEFAULT 12500.00,
  status TEXT DEFAULT 'IDENTIFIED',
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_pricing_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  product_tier TEXT NOT NULL,
  list_price_usd NUMERIC(10,2) NOT NULL,
  realized_average_price_usd NUMERIC(10,2) NOT NULL,
  average_discount_percentage NUMERIC(5,2) DEFAULT 12.5,
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_commercial_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  forecast_horizon TEXT DEFAULT '12_MONTHS',
  projected_revenue_usd NUMERIC(14,2) NOT NULL,
  confidence_interval_lower NUMERIC(14,2),
  confidence_interval_upper NUMERIC(14,2),
  status TEXT DEFAULT 'FORECAST',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_commercial_drift (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  account_id UUID NOT NULL,
  drift_type TEXT NOT NULL,
  drift_level TEXT DEFAULT 'NO_DRIFT',
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_commercial_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  append_only BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_commercial_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  title TEXT NOT NULL,
  rationale TEXT NOT NULL,
  status TEXT DEFAULT 'AI_PROPOSED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_commercial_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  root_signal_id TEXT NOT NULL,
  trace_payload JSONB DEFAULT '{}'::jsonb,
  provenance_hash TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE enterprise_commercial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_commercial_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_commercial_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_commercial_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_customer_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_customer_retention ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_customer_churn ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_customer_expansion ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_revenue_concentration ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_revenue_leakage ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_pricing_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_commercial_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_commercial_drift ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_commercial_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_commercial_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_commercial_traces ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_ent_com_acc_workspace ON enterprise_commercial_accounts(workspace_id);
CREATE INDEX idx_ent_com_opp_workspace ON enterprise_commercial_opportunities(workspace_id);
CREATE INDEX idx_ent_com_rev_workspace ON enterprise_commercial_revenue(workspace_id);
CREATE INDEX idx_ent_com_pip_workspace ON enterprise_commercial_pipeline(workspace_id);
CREATE INDEX idx_ent_cus_hlt_workspace ON enterprise_customer_health(workspace_id);
CREATE INDEX idx_ent_cus_ret_workspace ON enterprise_customer_retention(workspace_id);
CREATE INDEX idx_ent_cus_chu_workspace ON enterprise_customer_churn(workspace_id);
CREATE INDEX idx_ent_cus_exp_workspace ON enterprise_customer_expansion(workspace_id);
CREATE INDEX idx_ent_rev_con_workspace ON enterprise_revenue_concentration(workspace_id);
CREATE INDEX idx_ent_rev_lea_workspace ON enterprise_revenue_leakage(workspace_id);
CREATE INDEX idx_ent_pri_int_workspace ON enterprise_pricing_intelligence(workspace_id);
CREATE INDEX idx_ent_com_for_workspace ON enterprise_commercial_forecasts(workspace_id);
CREATE INDEX idx_ent_com_dri_workspace ON enterprise_commercial_drift(workspace_id);
CREATE INDEX idx_ent_com_lea_workspace ON enterprise_commercial_learning(workspace_id);
CREATE INDEX idx_ent_com_rec_workspace ON enterprise_commercial_recommendations(workspace_id);
CREATE INDEX idx_ent_com_tra_workspace ON enterprise_commercial_traces(workspace_id);
