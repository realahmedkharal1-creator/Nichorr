export class EnterpriseAccessGrantRepository {
  async getAccessGrants(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
