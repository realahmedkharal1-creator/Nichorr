export class EnterpriseWorkforceRetentionRepository {
    async findAll() { return []; }
    async findById(id: string) { return null; }
    async create(data: any) { return { id: 'test-id', ...data }; }
}
