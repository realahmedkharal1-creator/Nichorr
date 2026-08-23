import { createClient } from "@/lib/supabase/server";

export type WorkspaceRole = "OWNER" | "ADMIN" | "RESEARCHER" | "CREATOR" | "REVIEWER" | "VIEWER";

export interface WorkspaceEntity {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface WorkspaceMemberEntity {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  created_at?: string;
}

export interface WorkspaceInvitationEntity {
  id: string;
  workspace_id: string;
  email: string;
  role: WorkspaceRole;
  token: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  created_at?: string;
}

const globalWS = globalThis as unknown as {
  workspacesStore: Map<string, WorkspaceEntity> | undefined;
  membersStore: Map<string, WorkspaceMemberEntity[]> | undefined;
  invitesStore: Map<string, WorkspaceInvitationEntity[]> | undefined;
};
const workspacesStore = globalWS.workspacesStore ?? new Map<string, WorkspaceEntity>();
const membersStore = globalWS.membersStore ?? new Map<string, WorkspaceMemberEntity[]>();
const invitesStore = globalWS.invitesStore ?? new Map<string, WorkspaceInvitationEntity[]>();

// Default Primary Workspace
const DEFAULT_WS: WorkspaceEntity = {
  id: "ws-primary-default",
  name: "Nichorr Primary Workspace",
  slug: "nichorr-primary",
  owner_id: "usr-default-owner",
  created_at: new Date().toISOString(),
};
if (!workspacesStore.has(DEFAULT_WS.id)) {
  workspacesStore.set(DEFAULT_WS.id, DEFAULT_WS);
  membersStore.set(DEFAULT_WS.id, [
    { id: "wm-1", workspace_id: DEFAULT_WS.id, user_id: "usr-default-owner", role: "OWNER" },
    { id: "wm-2", workspace_id: DEFAULT_WS.id, user_id: "usr-collab-1", role: "CREATOR" },
  ]);
}

if (process.env.NODE_ENV !== "production") {
  globalWS.workspacesStore = workspacesStore;
  globalWS.membersStore = membersStore;
  globalWS.invitesStore = invitesStore;
}

export class WorkspacesRepository {
  async getWorkspaces(): Promise<WorkspaceEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("workspaces").select("*");
      if (!error && data && data.length > 0) return data;
    } catch {}

    return Array.from(workspacesStore.values());
  }

  async saveWorkspace(ws: WorkspaceEntity): Promise<WorkspaceEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("workspaces").upsert(ws).select().single();
      if (!error && data) {
        workspacesStore.set(data.id, data);
        return data;
      }
    } catch {}

    workspacesStore.set(ws.id, ws);
    return ws;
  }

  async getMembers(workspaceId: string): Promise<WorkspaceMemberEntity[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("workspace_members").select("*").eq("workspace_id", workspaceId);
      if (!error && data && data.length > 0) return data;
    } catch {}

    return membersStore.get(workspaceId) || [];
  }

  async addMember(member: WorkspaceMemberEntity): Promise<WorkspaceMemberEntity> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("workspace_members").insert(member).select().single();
      if (!error && data) {
        const list = membersStore.get(member.workspace_id) || [];
        list.push(data);
        membersStore.set(member.workspace_id, list);
        return data;
      }
    } catch {}

    const list = membersStore.get(member.workspace_id) || [];
    list.push(member);
    membersStore.set(member.workspace_id, list);
    return member;
  }
}
