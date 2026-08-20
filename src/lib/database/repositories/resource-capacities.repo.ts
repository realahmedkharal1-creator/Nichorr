export class ResourceCapacitiesRepository {
  async getCapacities(workspaceId: string) { return [{ id: 'cap-1', resource_type: 'ENGINEERING', total_capacity: 100, consumed_capacity: 50 }]; }
  async getCommitments(workspaceId: string) { return [{ id: 'com-1', amount: 50 }]; }
}
