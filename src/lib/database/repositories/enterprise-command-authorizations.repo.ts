export class EnterpriseCommandAuthorizationsRepository {
  async getAuthorizations(commandId: string) { return []; }
  async createAuthorization(workspaceId: string, data: any) { return { ...data, decision: 'APPROVED' }; }
}
