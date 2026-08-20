export class EnterpriseSecurityDriftRepository {
  async getSecurityDrifts(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
