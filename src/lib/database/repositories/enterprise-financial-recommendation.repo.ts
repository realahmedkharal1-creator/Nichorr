export class EnterpriseFinancialRecommendationRepository {
    async getRecommendations(workspaceId: string) { return []; }
    async createRecommendation(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
