export class EnterpriseAccessAnomalyRepository {
  async getAccessAnomalys(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
