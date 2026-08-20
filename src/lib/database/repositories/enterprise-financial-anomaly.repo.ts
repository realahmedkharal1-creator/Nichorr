export class EnterpriseFinancialAnomalyRepository {
    async getAnomalys(workspaceId: string) { return []; }
    async createAnomaly(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
