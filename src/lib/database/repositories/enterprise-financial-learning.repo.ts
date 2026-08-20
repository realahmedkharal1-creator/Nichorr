export class EnterpriseFinancialLearningRepository {
    async getLearnings(workspaceId: string) { return []; }
    async createLearning(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
