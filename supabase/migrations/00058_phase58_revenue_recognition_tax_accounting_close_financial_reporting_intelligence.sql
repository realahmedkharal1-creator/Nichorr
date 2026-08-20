-- Phase 58 Migration

CREATE TABLE IF NOT EXISTS enterprise_revenue_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    contract_number TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    total_contract_value_usd NUMERIC(14,2) DEFAULT 120000.00,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'ACTIVE',
    provenance_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_performance_obligations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES enterprise_revenue_contracts(id) ON DELETE CASCADE,
    obligation_name TEXT NOT NULL,
    allocated_amount_usd NUMERIC(14,2) DEFAULT 60000.00,
    recognition_method TEXT DEFAULT 'OVER_TIME',
    status TEXT DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_transaction_price_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES enterprise_revenue_contracts(id) ON DELETE CASCADE,
    allocation_method TEXT DEFAULT 'STANDALONE_SELLING_PRICE',
    allocated_pct NUMERIC(5,2) DEFAULT 50.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_revenue_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    obligation_id UUID REFERENCES enterprise_performance_obligations(id) ON DELETE CASCADE,
    period_name TEXT NOT NULL,
    scheduled_amount_usd NUMERIC(12,2) DEFAULT 5000.00,
    recognized_amount_usd NUMERIC(12,2) DEFAULT 5000.00,
    status TEXT DEFAULT 'RECOGNIZED',
    scheduled_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_revenue_recognition_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES enterprise_revenue_schedules(id) ON DELETE CASCADE,
    event_type TEXT DEFAULT 'DELIVERY_SATISFACTION',
    recognized_usd NUMERIC(12,2) DEFAULT 5000.00,
    event_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_deferred_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES enterprise_revenue_contracts(id) ON DELETE CASCADE,
    deferred_balance_usd NUMERIC(14,2) DEFAULT 55000.00,
    amortization_period_months INTEGER DEFAULT 12,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_accrued_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES enterprise_revenue_contracts(id) ON DELETE CASCADE,
    accrued_balance_usd NUMERIC(14,2) DEFAULT 12500.00,
    unbilled_status TEXT DEFAULT 'PENDING_BILLING',
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_contract_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES enterprise_revenue_contracts(id) ON DELETE CASCADE,
    asset_amount_usd NUMERIC(14,2) DEFAULT 15000.00,
    classification TEXT DEFAULT 'UNCONDITIONAL_RIGHT_PENDING',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_contract_liabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES enterprise_revenue_contracts(id) ON DELETE CASCADE,
    liability_amount_usd NUMERIC(14,2) DEFAULT 45000.00,
    fulfillment_status TEXT DEFAULT 'UNSATISFIED_OBLIGATION',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_revenue_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES enterprise_revenue_contracts(id) ON DELETE CASCADE,
    adjustment_type TEXT DEFAULT 'CONTRACT_MODIFICATION',
    adjustment_amount_usd NUMERIC(12,2) DEFAULT -2500.00,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_accounting_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    period_code TEXT NOT NULL,
    period_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    close_status TEXT DEFAULT 'OPEN',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    period_id UUID REFERENCES enterprise_accounting_periods(id) ON DELETE CASCADE,
    entry_number TEXT NOT NULL,
    total_debit_usd NUMERIC(14,2) DEFAULT 25000.00,
    total_credit_usd NUMERIC(14,2) DEFAULT 25000.00,
    status TEXT DEFAULT 'POSTED',
    posted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_journal_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    entry_id UUID REFERENCES enterprise_journal_entries(id) ON DELETE CASCADE,
    account_code TEXT NOT NULL,
    line_type TEXT DEFAULT 'DEBIT',
    amount_usd NUMERIC(14,2) DEFAULT 25000.00,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_account_reconciliations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    period_id UUID REFERENCES enterprise_accounting_periods(id) ON DELETE CASCADE,
    account_code TEXT NOT NULL,
    subledger_balance_usd NUMERIC(14,2) DEFAULT 120000.00,
    gl_balance_usd NUMERIC(14,2) DEFAULT 120000.00,
    variance_usd NUMERIC(14,2) DEFAULT 0.00,
    status TEXT DEFAULT 'RECONCILED',
    reconciled_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_reconciliation_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    reconciliation_id UUID REFERENCES enterprise_account_reconciliations(id) ON DELETE CASCADE,
    exception_type TEXT NOT NULL,
    variance_amount_usd NUMERIC(12,2) DEFAULT 0.00,
    status TEXT DEFAULT 'RESOLVED',
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_tax_jurisdictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    jurisdiction_code TEXT NOT NULL,
    jurisdiction_name TEXT NOT NULL,
    country_code TEXT DEFAULT 'US',
    tax_type TEXT DEFAULT 'SALES_AND_USE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_tax_nexus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    jurisdiction_id UUID REFERENCES enterprise_tax_jurisdictions(id) ON DELETE CASCADE,
    nexus_type TEXT DEFAULT 'ECONOMIC_NEXUS',
    threshold_exceeded BOOLEAN DEFAULT true,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_tax_determinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    jurisdiction_id UUID REFERENCES enterprise_tax_jurisdictions(id) ON DELETE CASCADE,
    tax_rate_pct NUMERIC(5,2) DEFAULT 8.25,
    taxable_amount_usd NUMERIC(12,2) DEFAULT 10000.00,
    calculated_tax_usd NUMERIC(10,2) DEFAULT 825.00,
    determined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_tax_liabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    jurisdiction_id UUID REFERENCES enterprise_tax_jurisdictions(id) ON DELETE CASCADE,
    period_id UUID REFERENCES enterprise_accounting_periods(id) ON DELETE CASCADE,
    liability_amount_usd NUMERIC(12,2) DEFAULT 45000.00,
    status TEXT DEFAULT 'ACCRUED',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_tax_reconciliations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    period_id UUID REFERENCES enterprise_accounting_periods(id) ON DELETE CASCADE,
    expected_tax_usd NUMERIC(14,2) DEFAULT 45000.00,
    reported_tax_usd NUMERIC(14,2) DEFAULT 45000.00,
    status TEXT DEFAULT 'BALANCED',
    reconciled_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_tax_exposures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    jurisdiction_id UUID REFERENCES enterprise_tax_jurisdictions(id) ON DELETE CASCADE,
    exposure_risk TEXT DEFAULT 'LOW',
    estimated_exposure_usd NUMERIC(12,2) DEFAULT 0.00,
    assessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_financial_close (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    period_id UUID REFERENCES enterprise_accounting_periods(id) ON DELETE CASCADE,
    close_phase TEXT DEFAULT 'HARD_CLOSE',
    readiness_score NUMERIC(5,2) DEFAULT 100.0,
    status TEXT DEFAULT 'COMPLETED',
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_financial_close_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    close_id UUID REFERENCES enterprise_financial_close(id) ON DELETE CASCADE,
    task_name TEXT NOT NULL,
    assignee_role TEXT NOT NULL,
    status TEXT DEFAULT 'COMPLETED',
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_financial_close_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    close_id UUID REFERENCES enterprise_financial_close(id) ON DELETE CASCADE,
    blocker_description TEXT NOT NULL,
    severity TEXT DEFAULT 'LOW',
    status TEXT DEFAULT 'RESOLVED',
    resolved_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_financial_reporting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    period_id UUID REFERENCES enterprise_accounting_periods(id) ON DELETE CASCADE,
    report_type TEXT DEFAULT 'GAAP_INCOME_STATEMENT',
    report_payload JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'CERTIFIED',
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enterprise_accounting_traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    root_signal_id TEXT NOT NULL,
    trace_payload JSONB DEFAULT '{}'::jsonb,
    provenance_hash TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE enterprise_revenue_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_performance_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_transaction_price_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_revenue_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_revenue_recognition_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_deferred_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_accrued_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_contract_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_contract_liabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_revenue_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_accounting_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_journal_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_account_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_reconciliation_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_tax_jurisdictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_tax_nexus ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_tax_determinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_tax_liabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_tax_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_tax_exposures ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_financial_close ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_financial_close_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_financial_close_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_financial_reporting ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_accounting_traces ENABLE ROW LEVEL SECURITY;

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_ent_rev_contracts_ws ON enterprise_revenue_contracts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_perf_obl_ws ON enterprise_performance_obligations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_txn_alloc_ws ON enterprise_transaction_price_allocations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_rev_sched_ws ON enterprise_revenue_schedules(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_rev_recog_ws ON enterprise_revenue_recognition_events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_def_rev_ws ON enterprise_deferred_revenue(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_accr_rev_ws ON enterprise_accrued_revenue(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_contract_assets_ws ON enterprise_contract_assets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_contract_liab_ws ON enterprise_contract_liabilities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_rev_adj_ws ON enterprise_revenue_adjustments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_acct_period_ws ON enterprise_accounting_periods(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_journal_ws ON enterprise_journal_entries(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_journ_line_ws ON enterprise_journal_lines(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_acct_recon_ws ON enterprise_account_reconciliations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_recon_exc_ws ON enterprise_reconciliation_exceptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_tax_jur_ws ON enterprise_tax_jurisdictions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_tax_nex_ws ON enterprise_tax_nexus(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_tax_det_ws ON enterprise_tax_determinations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_tax_liab_ws ON enterprise_tax_liabilities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_tax_rec_ws ON enterprise_tax_reconciliations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_tax_exp_ws ON enterprise_tax_exposures(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_fin_close_ws ON enterprise_financial_close(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_fin_cl_task_ws ON enterprise_financial_close_tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_fin_cl_exc_ws ON enterprise_financial_close_exceptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_fin_rpt_ws ON enterprise_financial_reporting(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_acct_tr_ws ON enterprise_accounting_traces(workspace_id);
