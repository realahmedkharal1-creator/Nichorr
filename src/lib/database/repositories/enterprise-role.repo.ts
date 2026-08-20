export class EnterpriseRoleRepository {
  async getRoles(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
