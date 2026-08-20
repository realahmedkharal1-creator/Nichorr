export class StrategicInitiativesRepository {
  async getInitiatives(workspaceId: string) { return [{ id: 'init-1', title: 'Initiative', status: 'EXECUTING' }]; }
  async getInitiativeById(id: string) { return { id, title: 'Initiative', status: 'EXECUTING' }; }
}
