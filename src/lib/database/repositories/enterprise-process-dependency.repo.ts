export class EnterpriseProcessDependencyRepository { async find() { return []; } async create(data: any) { return { id: "uuid", ...data }; } }
