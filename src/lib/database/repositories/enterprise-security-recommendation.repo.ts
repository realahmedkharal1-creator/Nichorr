export class EnterpriseSecurityRecommendationRepository {
  async getSecurityRecommendations(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
