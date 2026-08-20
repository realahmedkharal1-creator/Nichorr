export class EnterpriseFinancialActualRepository {
    async getActuals(workspaceId: string) { return []; }
    async createActual(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
