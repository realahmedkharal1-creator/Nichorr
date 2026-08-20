CREATE TABLE IF NOT EXISTS creator_intelligence_artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artifact_type VARCHAR(255) NOT NULL,
    namespace VARCHAR(255) NOT NULL,
    lookup_key VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_creator_intel_lookup ON creator_intelligence_artifacts(artifact_type, lookup_key);

CREATE TABLE IF NOT EXISTS creator_intelligence_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    namespace VARCHAR(255) NOT NULL,
    lookup_key VARCHAR(255) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_creator_intel_audits_lookup ON creator_intelligence_audits(namespace, lookup_key);
