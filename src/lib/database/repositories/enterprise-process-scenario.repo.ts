export class EnterpriseProcessScenarioRepository { async find() { return []; } async create(data: any) { return { id: "uuid", ...data }; } }
