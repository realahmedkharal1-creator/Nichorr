export class EnterprisePermissionRepository {
  async getPermissions(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
