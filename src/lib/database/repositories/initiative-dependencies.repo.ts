export class InitiativeDependenciesRepository {
  async getDependencies(workspaceId: string) { return [{ source_initiative_id: 'init-1', target_initiative_id: 'init-2', dependency_type: 'DEPENDS_ON' }]; }
}
