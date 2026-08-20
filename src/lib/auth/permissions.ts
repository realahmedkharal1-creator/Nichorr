import { WorkspaceRole } from "@/lib/database/repositories/workspaces.repo";

export type PermissionAction =
  | "CREATE_RESEARCH"
  | "CANCEL_RESEARCH"
  | "MANAGE_KNOWLEDGE"
  | "PUBLISH_CONTENT"
  | "INVITE_MEMBER"
  | "MANAGE_WORKSPACE"
  | "VIEW_INTELLIGENCE";

const ROLE_PERMISSIONS: Record<WorkspaceRole, PermissionAction[]> = {
  OWNER: ["CREATE_RESEARCH", "CANCEL_RESEARCH", "MANAGE_KNOWLEDGE", "PUBLISH_CONTENT", "INVITE_MEMBER", "MANAGE_WORKSPACE", "VIEW_INTELLIGENCE"],
  ADMIN: ["CREATE_RESEARCH", "CANCEL_RESEARCH", "MANAGE_KNOWLEDGE", "PUBLISH_CONTENT", "INVITE_MEMBER", "VIEW_INTELLIGENCE"],
  RESEARCHER: ["CREATE_RESEARCH", "CANCEL_RESEARCH", "MANAGE_KNOWLEDGE", "VIEW_INTELLIGENCE"],
  CREATOR: ["CREATE_RESEARCH", "PUBLISH_CONTENT", "VIEW_INTELLIGENCE"],
  REVIEWER: ["VIEW_INTELLIGENCE"],
  VIEWER: ["VIEW_INTELLIGENCE"],
};

export function hasPermission(role: WorkspaceRole, action: PermissionAction): boolean {
  const allowedActions = ROLE_PERMISSIONS[role] || [];
  return allowedActions.includes(action);
}
