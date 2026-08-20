export class EnterpriseFinancialForecastRepository {
    async getForecasts(workspaceId: string) { return []; }
    async createForecast(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
