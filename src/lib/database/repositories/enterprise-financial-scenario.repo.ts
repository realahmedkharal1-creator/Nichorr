export class EnterpriseFinancialScenarioRepository {
    async getScenarios(workspaceId: string) { return []; }
    async createScenario(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
