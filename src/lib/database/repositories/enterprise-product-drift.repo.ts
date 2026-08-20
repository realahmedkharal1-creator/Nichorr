export class EnterpriseProductDriftRepository {
  async findAll() { return []; }
  async findById(id: string) { return null; }
  async create(data: any) { return { id: 'mock-id', ...data }; }
}
