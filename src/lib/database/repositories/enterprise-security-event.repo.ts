export class EnterpriseSecurityEventRepository {
  async getSecurityEvents(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
