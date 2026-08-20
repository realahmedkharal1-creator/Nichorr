export class EnterpriseTrustRepository {
  async getTrusts(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
