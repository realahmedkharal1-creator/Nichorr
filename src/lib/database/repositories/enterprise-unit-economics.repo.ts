export class EnterpriseFinancialUnitEconomicsRepository {
    async getUnitEconomicss(workspaceId: string) { return []; }
    async createUnitEconomics(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
