export class StrategicGoalsRepository {
  async getGoals(workspaceId: string) { return [{ id: 'goal-1', title: 'Default Goal', status: 'ACTIVE' }]; }
  async createGoal(workspaceId: string, data: any) { return { id: 'goal-2', ...data, status: 'DRAFT' }; }
}
