export class EnterpriseFinancialDriverRepository {
    async getDrivers(workspaceId: string) { return []; }
    async createDriver(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
