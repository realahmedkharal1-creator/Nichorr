-- Stores a full JSON snapshot of the in-progress research run session so that the
-- pipeline can be resumed, stage by stage, across multiple short-lived serverless
-- invocations instead of requiring one long-running request to finish the whole run.
ALTER TABLE research_runs
  ADD COLUMN IF NOT EXISTS session_state JSONB;

COMMENT ON COLUMN research_runs.session_state IS
  'Full ResearchRunSession JSON snapshot, refreshed after every pipeline stage. Used to resume execution from the last completed stage.';
