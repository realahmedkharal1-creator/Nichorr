
CREATE TABLE enterprise_billing_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    account_code TEXT NOT NULL,
    account_name TEXT NOT NULL,
    billing_currency TEXT DEFAULT 'USD',
    payment_terms TEXT DEFAULT 'NET_30',
    billing_status TEXT DEFAULT 'ACTIVE',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_billing_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    billing_account_id UUID REFERENCES enterprise_billing_accounts(id) ON DELETE CASCADE,
    cadence TEXT DEFAULT 'MONTHLY_ARREARS',
    next_invoice_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_billing_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    billing_account_id UUID REFERENCES enterprise_billing_accounts(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_amount_usd NUMERIC(12,2) DEFAULT 4500.00,
    status TEXT DEFAULT 'PROCESSED',
    event_timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    billing_account_id UUID REFERENCES enterprise_billing_accounts(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal_usd NUMERIC(14,2) DEFAULT 12500.00,
    tax_usd NUMERIC(12,2) DEFAULT 1000.00,
    total_usd NUMERIC(14,2) DEFAULT 13500.00,
    status TEXT DEFAULT 'ISSUED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_invoice_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES enterprise_invoices(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    description TEXT NOT NULL,
    quantity NUMERIC(10,2) DEFAULT 1.0,
    unit_price_usd NUMERIC(12,2) DEFAULT 12500.00,
    amount_usd NUMERIC(14,2) DEFAULT 12500.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES enterprise_invoices(id) ON DELETE CASCADE,
    payment_method TEXT DEFAULT 'ACH_DIRECT_DEBIT',
    amount_paid_usd NUMERIC(14,2) DEFAULT 13500.00,
    status TEXT DEFAULT 'SETTLED',
    paid_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_payment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES enterprise_invoices(id) ON DELETE CASCADE,
    attempt_number INTEGER DEFAULT 1,
    gateway_response TEXT DEFAULT 'APPROVED',
    status TEXT DEFAULT 'SUCCESSFUL',
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES enterprise_payments(id) ON DELETE CASCADE,
    settlement_reference TEXT NOT NULL,
    settled_amount_usd NUMERIC(14,2) DEFAULT 13500.00,
    settled_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_receivables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES enterprise_invoices(id) ON DELETE CASCADE,
    aging_bucket TEXT DEFAULT 'CURRENT_1_30',
    outstanding_balance_usd NUMERIC(14,2) DEFAULT 0.00,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    billing_account_id UUID REFERENCES enterprise_billing_accounts(id) ON DELETE CASCADE,
    collection_stage TEXT DEFAULT 'STANDARD_REMINDER',
    priority TEXT DEFAULT 'MEDIUM',
    status TEXT DEFAULT 'OPEN',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_dunning_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES enterprise_collections(id) ON DELETE CASCADE,
    action_type TEXT DEFAULT 'EMAIL_NOTICE',
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_billing_disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES enterprise_invoices(id) ON DELETE CASCADE,
    dispute_reason TEXT NOT NULL,
    disputed_amount_usd NUMERIC(12,2) DEFAULT 1200.00,
    status TEXT DEFAULT 'RESOLVED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_credit_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES enterprise_invoices(id) ON DELETE CASCADE,
    credit_note_number TEXT NOT NULL,
    credit_amount_usd NUMERIC(12,2) DEFAULT 1200.00,
    reason TEXT NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES enterprise_payments(id) ON DELETE CASCADE,
    refund_amount_usd NUMERIC(12,2) DEFAULT 500.00,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_billing_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    billing_account_id UUID REFERENCES enterprise_billing_accounts(id) ON DELETE CASCADE,
    adjustment_type TEXT DEFAULT 'GOODWILL_CREDIT',
    amount_usd NUMERIC(12,2) DEFAULT 250.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_billing_anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    anomaly_type TEXT NOT NULL,
    deviation_pct NUMERIC(5,2) DEFAULT 28.5,
    status TEXT DEFAULT 'INVESTIGATING',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_billing_leakage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    leakage_type TEXT DEFAULT 'UNBILLED_USAGE',
    estimated_loss_usd NUMERIC(14,2) DEFAULT 45000.00,
    status TEXT DEFAULT 'RECOVERABLE',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_revenue_assurance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    assurance_domain TEXT DEFAULT 'CONTRACT_TO_BILL',
    accuracy_score NUMERIC(5,2) DEFAULT 99.4,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_cash_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    dso_days NUMERIC(5,2) DEFAULT 34.2,
    collection_effectiveness_pct NUMERIC(5,2) DEFAULT 96.8,
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_cash_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    forecast_horizon TEXT DEFAULT '12_MONTHS',
    projected_cash_inflow_usd NUMERIC(14,2) DEFAULT 34000000.00,
    status TEXT DEFAULT 'FORECAST',
    confidence_score NUMERIC(5,2) DEFAULT 88.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_billing_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    scenario_name TEXT NOT NULL,
    simulated_dso_delta_days NUMERIC(5,2) DEFAULT -4.5,
    status TEXT DEFAULT 'SIMULATED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_billing_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    projected_value_usd NUMERIC(14,2) NOT NULL,
    realized_value_usd NUMERIC(14,2) DEFAULT 0.00,
    variance_usd NUMERIC(14,2) DEFAULT 0.00,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_billing_drift (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL,
    drift_type TEXT NOT NULL,
    drift_level TEXT DEFAULT 'NO_DRIFT',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_billing_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    append_only BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_billing_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    title TEXT NOT NULL,
    rationale TEXT NOT NULL,
    confidence_score NUMERIC(5,2) DEFAULT 89.0,
    status TEXT DEFAULT 'AI_PROPOSED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enterprise_billing_traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    root_signal_id TEXT NOT NULL,
    trace_payload JSONB DEFAULT '{}'::jsonb,
    provenance_hash TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE enterprise_billing_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_billing_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_receivables ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_dunning_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_billing_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_credit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_billing_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_billing_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_billing_leakage ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_revenue_assurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_cash_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_cash_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_billing_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_billing_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_billing_drift ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_billing_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_billing_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_billing_traces ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_enterprise_billing_accounts_workspace_id ON enterprise_billing_accounts(workspace_id);
CREATE INDEX idx_enterprise_billing_schedules_workspace_id ON enterprise_billing_schedules(workspace_id);
CREATE INDEX idx_enterprise_billing_events_workspace_id ON enterprise_billing_events(workspace_id);
CREATE INDEX idx_enterprise_invoices_workspace_id ON enterprise_invoices(workspace_id);
CREATE INDEX idx_enterprise_invoice_lines_workspace_id ON enterprise_invoice_lines(workspace_id);
CREATE INDEX idx_enterprise_payments_workspace_id ON enterprise_payments(workspace_id);
CREATE INDEX idx_enterprise_payment_attempts_workspace_id ON enterprise_payment_attempts(workspace_id);
CREATE INDEX idx_enterprise_settlements_workspace_id ON enterprise_settlements(workspace_id);
CREATE INDEX idx_enterprise_receivables_workspace_id ON enterprise_receivables(workspace_id);
CREATE INDEX idx_enterprise_collections_workspace_id ON enterprise_collections(workspace_id);
CREATE INDEX idx_enterprise_dunning_actions_workspace_id ON enterprise_dunning_actions(workspace_id);
CREATE INDEX idx_enterprise_billing_disputes_workspace_id ON enterprise_billing_disputes(workspace_id);
CREATE INDEX idx_enterprise_credit_notes_workspace_id ON enterprise_credit_notes(workspace_id);
CREATE INDEX idx_enterprise_refunds_workspace_id ON enterprise_refunds(workspace_id);
CREATE INDEX idx_enterprise_billing_adjustments_workspace_id ON enterprise_billing_adjustments(workspace_id);
CREATE INDEX idx_enterprise_billing_anomalies_workspace_id ON enterprise_billing_anomalies(workspace_id);
CREATE INDEX idx_enterprise_billing_leakage_workspace_id ON enterprise_billing_leakage(workspace_id);
CREATE INDEX idx_enterprise_revenue_assurance_workspace_id ON enterprise_revenue_assurance(workspace_id);
CREATE INDEX idx_enterprise_cash_conversions_workspace_id ON enterprise_cash_conversions(workspace_id);
CREATE INDEX idx_enterprise_cash_forecasts_workspace_id ON enterprise_cash_forecasts(workspace_id);
CREATE INDEX idx_enterprise_billing_scenarios_workspace_id ON enterprise_billing_scenarios(workspace_id);
CREATE INDEX idx_enterprise_billing_values_workspace_id ON enterprise_billing_values(workspace_id);
CREATE INDEX idx_enterprise_billing_drift_workspace_id ON enterprise_billing_drift(workspace_id);
CREATE INDEX idx_enterprise_billing_learning_workspace_id ON enterprise_billing_learning(workspace_id);
CREATE INDEX idx_enterprise_billing_recommendations_workspace_id ON enterprise_billing_recommendations(workspace_id);
CREATE INDEX idx_enterprise_billing_traces_workspace_id ON enterprise_billing_traces(workspace_id);
