export class EnterpriseSecurityLearningRepository {
  async getSecurityLearnings(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
