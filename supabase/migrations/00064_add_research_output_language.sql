-- Adds output language selection for research run generation.
-- Existing rows default to 'en' to preserve current English-only behavior.
ALTER TABLE research_runs
  ADD COLUMN IF NOT EXISTS output_language TEXT DEFAULT 'en';

COMMENT ON COLUMN research_runs.output_language IS
  'Language code the LLM-generated brief/claims were produced in (en, es, hi, pt-BR, ja, de, fr, ko, id, ar).';
