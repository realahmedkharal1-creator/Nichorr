-- Nichorr Database Migration Schema (20 Core Tables)
-- Created for evidence-first tech research platform

-- Custom ENUM Types
CREATE TYPE run_status_type AS ENUM (
  'CREATED', 'PLANNING', 'PLAN_READY', 'DISCOVERING', 'RETRIEVING', 
  'EXTRACTING', 'CLAIMING', 'VERIFYING', 'CORRELATING', 'CONFLICT_ANALYSIS', 
  'COMMUNITY_ANALYSIS', 'AUDIENCE_ANALYSIS', 'OPPORTUNITY_ANALYSIS', 
  'QUALITY_CHECK', 'GENERATING_BRIEF', 'COMPLETED', 'PARTIAL', 'FAILED', 'CANCELLED'
);

CREATE TYPE source_type_enum AS ENUM (
  'OFFICIAL_SPEC', 'DOCUMENTATION', 'INDEPENDENT_BENCHMARK', 'TECH_PUBLICATION', 
  'COMMUNITY_FORUM', 'YOUTUBE_VIDEO', 'REGULATORY_FILING', 'OTHER'
);

CREATE TYPE evidence_type_enum AS ENUM (
  'OFFICIAL_FACT', 'MEASURED_RESULT', 'INDEPENDENT_TEST', 'FIRSTHAND_REPORT', 
  'COMMUNITY_SIGNAL', 'EXPERT_OPINION', 'EDITORIAL_OPINION', 'INFERENCE', 'UNSUPPORTED'
);

CREATE TYPE claim_type_enum AS ENUM (
  'FACT', 'MEASUREMENT', 'COMPARISON', 'EXPERIENCE', 'COMMUNITY_SIGNAL', 'OPINION', 'INFERENCE'
);

CREATE TYPE claim_status_enum AS ENUM (
  'SUPPORTED', 'PARTIALLY_SUPPORTED', 'CONTRADICTED', 'INSUFFICIENT', 'OUTDATED', 'MISATTRIBUTED', 'UNVERIFIED'
);

CREATE TYPE confidence_enum AS ENUM ('HIGH', 'MEDIUM', 'LOW');

CREATE TYPE query_type_enum AS ENUM (
  'PRIMARY', 'INDEPENDENT', 'COMMUNITY', 'CONTRARIAN', 'RECENCY', 'PROBLEM', 'COMPARISON'
);

CREATE TYPE relationship_type_enum AS ENUM (
  'DIRECTLY_SUPPORTS', 'PARTIALLY_SUPPORTS', 'CONTRADICTS', 'CONTEXTUALIZES', 'DUPLICATES', 'DERIVED_FROM'
);

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  default_content_type TEXT DEFAULT 'Review',
  default_target_audience TEXT DEFAULT 'Tech Enthusiasts',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RESEARCH RUNS
CREATE TABLE IF NOT EXISTS research_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  objective TEXT NOT NULL,
  content_type TEXT DEFAULT 'Comparison',
  target_audience TEXT DEFAULT 'Tech Creators',
  requested_depth TEXT DEFAULT 'Standard',
  status run_status_type DEFAULT 'CREATED',
  research_engine_version TEXT DEFAULT 'v1.0.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  cost_estimate NUMERIC(10, 4) DEFAULT 0.0000,
  token_usage JSONB DEFAULT '{}'::jsonb,
  source_count INT DEFAULT 0,
  claim_count INT DEFAULT 0
);

-- 4. RESEARCH QUESTIONS
CREATE TABLE IF NOT EXISTS research_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id UUID REFERENCES research_runs(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT DEFAULT 'FACT',
  priority TEXT DEFAULT 'HIGH',
  reason TEXT,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SEARCH QUERIES
CREATE TABLE IF NOT EXISTS search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id UUID REFERENCES research_runs(id) ON DELETE CASCADE,
  question_id UUID REFERENCES research_questions(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  provider TEXT NOT NULL,
  query_type query_type_enum DEFAULT 'PRIMARY',
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  result_count INT DEFAULT 0,
  status TEXT DEFAULT 'SUCCESS'
);

-- 6. SOURCES
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_url TEXT NOT NULL,
  original_url TEXT NOT NULL,
  title TEXT NOT NULL,
  publisher TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  retrieved_at TIMESTAMPTZ DEFAULT NOW(),
  source_type source_type_enum DEFAULT 'TECH_PUBLICATION',
  source_tier INT DEFAULT 2,
  language TEXT DEFAULT 'en',
  country TEXT DEFAULT 'US',
  content_hash TEXT,
  quality_score NUMERIC(4, 2) DEFAULT 8.0,
  is_primary_source BOOLEAN DEFAULT FALSE,
  is_duplicate BOOLEAN DEFAULT FALSE,
  is_accessible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SOURCE RELATIONSHIPS
CREATE TABLE IF NOT EXISTS source_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  related_source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL, -- 'syndicated', 'cites', 'summarizes', 'originates_from'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SOURCE SNAPSHOTS
CREATE TABLE IF NOT EXISTS source_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  retrieved_at TIMESTAMPTZ DEFAULT NOW(),
  content_hash TEXT NOT NULL,
  content_location TEXT,
  title TEXT,
  extracted_text TEXT NOT NULL,
  extraction_method TEXT DEFAULT 'MARKDOWN_DOM',
  metadata_json JSONB DEFAULT '{}'::jsonb
);

-- 9. EVIDENCE
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id UUID REFERENCES research_runs(id) ON DELETE CASCADE,
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  question_id UUID REFERENCES research_questions(id) ON DELETE SET NULL,
  evidence_type evidence_type_enum DEFAULT 'MEASURED_RESULT',
  excerpt TEXT NOT NULL,
  context TEXT,
  source_location TEXT,
  product_entity TEXT,
  product_variant TEXT,
  region TEXT DEFAULT 'Global',
  software_version TEXT,
  methodology TEXT,
  captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CLAIMS
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id UUID REFERENCES research_runs(id) ON DELETE CASCADE,
  question_id UUID REFERENCES research_questions(id) ON DELETE SET NULL,
  claim_text TEXT NOT NULL,
  claim_type claim_type_enum DEFAULT 'FACT',
  status claim_status_enum DEFAULT 'SUPPORTED',
  confidence confidence_enum DEFAULT 'HIGH',
  product_entity TEXT,
  product_variant TEXT,
  region TEXT,
  software_version TEXT,
  freshness_status TEXT DEFAULT 'FRESH',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CLAIM EVIDENCE RELATIONSHIPS
CREATE TABLE IF NOT EXISTS claim_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  evidence_id UUID REFERENCES evidence(id) ON DELETE CASCADE,
  relationship_type relationship_type_enum DEFAULT 'DIRECTLY_SUPPORTS',
  support_strength NUMERIC(4, 2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CLAIM RELATIONSHIPS
CREATE TABLE IF NOT EXISTS claim_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  related_claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  relationship_type relationship_type_enum DEFAULT 'DIRECTLY_SUPPORTS',
  confidence confidence_enum DEFAULT 'HIGH'
);

-- 13. CONFLICTS
CREATE TABLE IF NOT EXISTS conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id UUID REFERENCES research_runs(id) ON DELETE CASCADE,
  claim_a_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  claim_b_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  conflict_type TEXT NOT NULL, -- 'METHODOLOGICAL', 'VARIANT', 'TEMPORAL', 'NUMERIC'
  severity TEXT DEFAULT 'MEDIUM',
  explanation TEXT NOT NULL,
  resolution_status TEXT DEFAULT 'UNRESOLVED', -- 'RESOLVED', 'PARTIALLY_RESOLVED', 'UNRESOLVED'
  resolution TEXT
);

-- 14. COMMUNITY SIGNALS
CREATE TABLE IF NOT EXISTS community_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id UUID REFERENCES research_runs(id) ON DELETE CASCADE,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  question_id UUID REFERENCES research_questions(id) ON DELETE SET NULL,
  signal TEXT NOT NULL,
  signal_type TEXT DEFAULT 'PROBLEM', -- 'PROBLEM', 'PRAISE', 'WORKAROUND', 'CONFUSION'
  frequency_estimate TEXT DEFAULT 'MEDIUM',
  recency_score NUMERIC(4, 2) DEFAULT 9.0,
  firsthand_likelihood confidence_enum DEFAULT 'HIGH',
  independence_score NUMERIC(4, 2) DEFAULT 8.5,
  confidence confidence_enum DEFAULT 'MEDIUM',
  supporting_evidence_ids UUID[] DEFAULT '{}'
);

-- 15. AUDIENCE QUESTIONS
CREATE TABLE IF NOT EXISTS audience_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id UUID REFERENCES research_runs(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  frequency_signal TEXT DEFAULT 'HIGH',
  importance_score NUMERIC(4, 2) DEFAULT 8.8,
  existing_coverage_score NUMERIC(4, 2) DEFAULT 4.0,
  coverage_gap_score NUMERIC(4, 2) DEFAULT 8.5,
  evidence_ids UUID[] DEFAULT '{}',
  confidence confidence_enum DEFAULT 'HIGH'
);

-- 16. CONTENT OPPORTUNITIES
CREATE TABLE IF NOT EXISTS content_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id UUID REFERENCES research_runs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  opportunity_type TEXT DEFAULT 'UNDER_COVERED', -- 'UNDER_COVERED', 'MISCONCEPTION', 'COMPARISON_GAP'
  audience_demand TEXT DEFAULT 'HIGH',
  coverage_gap TEXT DEFAULT 'HIGH',
  evidence_strength TEXT DEFAULT 'HIGH',
  freshness TEXT DEFAULT 'HIGH',
  opportunity_score NUMERIC(4, 2) DEFAULT 9.2,
  supporting_question_ids UUID[] DEFAULT '{}',
  supporting_evidence_ids UUID[] DEFAULT '{}'
);

-- 17. RESEARCH BRIEFS
CREATE TABLE IF NOT EXISTS research_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id UUID UNIQUE REFERENCES research_runs(id) ON DELETE CASCADE,
  executive_summary JSONB DEFAULT '[]'::jsonb,
  key_findings JSONB DEFAULT '[]'::jsonb,
  verified_facts JSONB DEFAULT '[]'::jsonb,
  measured_results JSONB DEFAULT '[]'::jsonb,
  conflicts JSONB DEFAULT '[]'::jsonb,
  community_signals JSONB DEFAULT '[]'::jsonb,
  audience_questions JSONB DEFAULT '[]'::jsonb,
  content_opportunities JSONB DEFAULT '[]'::jsonb,
  caveats JSONB DEFAULT '[]'::jsonb,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  model_provider TEXT DEFAULT 'Gemini',
  model_name TEXT DEFAULT 'gemini-2.5-flash',
  prompt_version TEXT DEFAULT 'v1.0.0'
);

-- 18. RESEARCH FEEDBACK
CREATE TABLE IF NOT EXISTS research_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id UUID REFERENCES research_runs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. RESEARCH ERRORS
CREATE TABLE IF NOT EXISTS research_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id UUID REFERENCES research_runs(id) ON DELETE CASCADE,
  stage run_status_type NOT NULL,
  provider TEXT,
  error_code TEXT,
  error_message TEXT NOT NULL,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. MODEL RUNS & PROMPT VERSIONS
CREATE TABLE IF NOT EXISTS model_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_run_id UUID REFERENCES research_runs(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_version TEXT DEFAULT 'v1.0.0',
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  latency_ms INT DEFAULT 0,
  status TEXT DEFAULT 'SUCCESS',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prompt_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_name TEXT NOT NULL,
  version TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  prompt_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Fast Querying
CREATE INDEX IF NOT EXISTS idx_research_runs_user ON research_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_run ON evidence(research_run_id);
CREATE INDEX IF NOT EXISTS idx_claims_run ON claims(research_run_id);
CREATE INDEX IF NOT EXISTS idx_sources_url ON sources(canonical_url);
