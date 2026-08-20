export class StrategicInterventionsRepository {
  async getInterventions(workspaceId: string) { return []; }
  async createIntervention(workspaceId: string, data: any) { return { id: 'interv-1', ...data }; }
}
