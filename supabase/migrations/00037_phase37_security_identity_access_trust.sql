
CREATE TABLE IF NOT EXISTS enterprise_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE, identity_type TEXT NOT NULL, name TEXT NOT NULL, email TEXT, status TEXT DEFAULT 'ACTIVE', lifecycle_state TEXT DEFAULT 'ACTIVE', is_privileged BOOLEAN DEFAULT false, provenance_hash TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_identity_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), identity_id UUID REFERENCES enterprise_identities(id) ON DELETE CASCADE, workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, version INTEGER NOT NULL, state_snapshot JSONB DEFAULT '{}'::jsonb, provenance_hash TEXT NOT NULL, recorded_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, role_name TEXT NOT NULL, description TEXT, is_privileged BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, permission_code TEXT NOT NULL, resource_type TEXT NOT NULL, action TEXT NOT NULL, risk_level TEXT DEFAULT 'MEDIUM', created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, resource_name TEXT NOT NULL, resource_type TEXT NOT NULL, sensitivity_level TEXT DEFAULT 'CONFIDENTIAL', blast_radius_tier TEXT DEFAULT 'HIGH', created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_identity_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, identity_id UUID REFERENCES enterprise_identities(id) ON DELETE CASCADE, role_id UUID REFERENCES enterprise_roles(id) ON DELETE CASCADE, granted_by TEXT NOT NULL, granted_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, role_id UUID REFERENCES enterprise_roles(id) ON DELETE CASCADE, permission_id UUID REFERENCES enterprise_permissions(id) ON DELETE CASCADE, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_access_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, identity_id UUID REFERENCES enterprise_identities(id) ON DELETE CASCADE, resource_id UUID REFERENCES enterprise_resources(id) ON DELETE CASCADE, grant_type TEXT DEFAULT 'ROLE_BASED', status TEXT DEFAULT 'ACTIVE', justification TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_privileged_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, identity_id UUID REFERENCES enterprise_identities(id) ON DELETE CASCADE, privilege_tier TEXT DEFAULT 'ADMINISTRATIVE', justification TEXT NOT NULL, blast_radius_score NUMERIC(5,2) DEFAULT 85.0, status TEXT DEFAULT 'ACTIVE', last_used_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_access_risk_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, identity_id UUID REFERENCES enterprise_identities(id) ON DELETE CASCADE, composite_risk_score NUMERIC(5,2) DEFAULT 65.0, privilege_risk NUMERIC(5,2) DEFAULT 70.0, blast_radius_risk NUMERIC(5,2) DEFAULT 60.0, anomaly_risk NUMERIC(5,2) DEFAULT 20.0, status TEXT DEFAULT 'EVALUATED', calculated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_trust_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, identity_id UUID REFERENCES enterprise_identities(id) ON DELETE CASCADE, trust_level TEXT DEFAULT 'HIGH', verification_score NUMERIC(5,2) DEFAULT 95.0, behavioral_consistency NUMERIC(5,2) DEFAULT 90.0, assessed_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_access_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, identity_id UUID REFERENCES enterprise_identities(id) ON DELETE CASCADE, anomaly_type TEXT NOT NULL, anomaly_classification TEXT DEFAULT 'POTENTIALLY_ANOMALOUS', description TEXT NOT NULL, severity TEXT DEFAULT 'HIGH', detected_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, actor_id TEXT NOT NULL, target_resource TEXT NOT NULL, action TEXT NOT NULL, outcome TEXT DEFAULT 'ALLOWED', correlation_id TEXT NOT NULL, provenance_hash TEXT NOT NULL, recorded_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_access_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, review_title TEXT NOT NULL, review_type TEXT DEFAULT 'PRIVILEGED_ACCESS', target_identity_id UUID REFERENCES enterprise_identities(id) ON DELETE CASCADE, reviewer TEXT, decision TEXT DEFAULT 'PENDING', status TEXT DEFAULT 'OPEN', due_date TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_access_recertifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, identity_id UUID REFERENCES enterprise_identities(id) ON DELETE CASCADE, role_id UUID REFERENCES enterprise_roles(id) ON DELETE CASCADE, recertification_status TEXT DEFAULT 'CERTIFIED', certified_by TEXT NOT NULL, certified_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_security_remediations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, issue_type TEXT NOT NULL, target_identity_id UUID REFERENCES enterprise_identities(id) ON DELETE CASCADE, proposed_action TEXT NOT NULL, status TEXT DEFAULT 'AI_PROPOSED', phase32_command_id TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_security_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, simulation_name TEXT NOT NULL, target_change JSONB DEFAULT '{}'::jsonb, predicted_impact JSONB DEFAULT '{}'::jsonb, side_effect_free BOOLEAN DEFAULT true, epistemic_status TEXT DEFAULT 'SIMULATED', executed_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_security_drift (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, drift_type TEXT NOT NULL, affected_entity TEXT NOT NULL, drift_level TEXT DEFAULT 'NO_DRIFT', detected_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_security_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, event_id TEXT, lesson_type TEXT NOT NULL, description TEXT NOT NULL, append_only BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_security_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, recommendation_type TEXT NOT NULL, title TEXT NOT NULL, rationale TEXT NOT NULL, status TEXT DEFAULT 'AI_PROPOSED', created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enterprise_security_trace (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, identity_id TEXT NOT NULL, trace_payload JSONB DEFAULT '{}'::jsonb, provenance_hash TEXT NOT NULL, generated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE enterprise_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_identity_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_identity_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_access_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_privileged_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_access_risk_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_trust_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_access_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_access_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_access_recertifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_security_remediations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_security_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_security_drift ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_security_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_security_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_security_trace ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_ent_identities_ws ON enterprise_identities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_roles_ws ON enterprise_roles(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ent_permissions_ws ON enterprise_permissions(workspace_id);
