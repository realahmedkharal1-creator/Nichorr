export class EnterpriseSecurityRemediationRepository {
  async getSecurityRemediations(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
