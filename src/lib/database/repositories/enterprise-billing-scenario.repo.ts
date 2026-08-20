export class EnterpriseBillingScenarioRepository {
  constructor() {}
  async findById(id: string) { return { id }; }
  async findAll() { return []; }
  async create(data: any) { return { id: "123", ...data }; }
}
