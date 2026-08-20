-- Fix foreign key constraints on user_id to reference auth.users(id) instead of public.users(id)

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey;
ALTER TABLE projects ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE research_runs DROP CONSTRAINT IF EXISTS research_runs_user_id_fkey;
ALTER TABLE research_runs ADD CONSTRAINT research_runs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE research_feedback DROP CONSTRAINT IF EXISTS research_feedback_user_id_fkey;
ALTER TABLE research_feedback ADD CONSTRAINT research_feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
