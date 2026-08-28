-- sources.repo.ts upserts on canonical_url via `ON CONFLICT (canonical_url)`, but 00001 only
-- ever created a plain btree index (idx_sources_url) on that column, never a UNIQUE constraint.
-- Postgres rejects an ON CONFLICT target that isn't backed by a unique index / constraint, so
-- every saveSources() call was failing on this independently of the RLS issue fixed in 00067.
--
-- If duplicate canonical_url rows already exist this will fail; collapse them first with:
--   SELECT canonical_url, count(*) FROM sources GROUP BY canonical_url HAVING count(*) > 1;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.sources'::regclass AND conname = 'sources_canonical_url_key'
  ) THEN
    ALTER TABLE sources ADD CONSTRAINT sources_canonical_url_key UNIQUE (canonical_url);
  END IF;
END $$;
