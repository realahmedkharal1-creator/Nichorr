export class EnterpriseAccessRiskRepository {
  async getAccessRisks(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
