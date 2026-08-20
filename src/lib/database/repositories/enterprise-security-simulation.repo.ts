export class EnterpriseSecuritySimulationRepository {
  async getSecuritySimulations(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
