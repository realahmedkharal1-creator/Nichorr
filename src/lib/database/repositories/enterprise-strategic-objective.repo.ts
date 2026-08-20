export class EnterpriseStrategicObjectiveRepository {
    async getObjectives(workspaceId: string) {
        return [];
    }
    async getObjectiveById(id: string) { return null; }
    async createObjective(workspaceId: string, data: any) { return { id: 'new' }; }
}
export const enterpriseStrategicObjectiveRepository = new EnterpriseStrategicObjectiveRepository();
