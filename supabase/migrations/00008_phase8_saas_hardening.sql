-- VeritasTech AI Database Migration Schema: Phase 8 Production SaaS Hardening & Collaboration
-- Adds workspaces, members, invitations, comments, workspace activities, and rate limit logs.

-- 1. WORKSPACES TABLE
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WORKSPACE MEMBERS TABLE
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'RESEARCHER', -- 'OWNER', 'ADMIN', 'RESEARCHER', 'CREATOR', 'REVIEWER', 'VIEWER'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- 3. WORKSPACE INVITATIONS TABLE
CREATE TABLE IF NOT EXISTS workspace_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'RESEARCHER',
  token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'EXPIRED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTEXTUAL COMMENTS TABLE
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL, -- 'CLAIM', 'EVIDENCE', 'SOURCE', 'KNOWLEDGE', 'CONTENT', 'SCRIPT'
  target_id TEXT NOT NULL,
  author_id UUID,
  author_name TEXT NOT NULL DEFAULT 'Collaborator',
  text TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WORKSPACE ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS workspace_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL DEFAULT 'System',
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_ws ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_comments_target ON comments(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_activities_ws ON workspace_activities(workspace_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_activities ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR WORKSPACE TENANCY ISOLATION
CREATE POLICY "Users can manage workspaces they belong to" ON workspaces
  FOR ALL USING (
    owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM workspace_members WHERE workspace_members.workspace_id = workspaces.id AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view members of their workspaces" ON workspace_members
  FOR ALL USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = workspace_members.workspace_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage comments in their workspaces" ON comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workspace_members WHERE workspace_members.workspace_id = comments.workspace_id AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view activities in their workspaces" ON workspace_activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workspace_members WHERE workspace_members.workspace_id = workspace_activities.workspace_id AND workspace_members.user_id = auth.uid()
    )
  );
