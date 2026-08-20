export class EnterpriseProcessValueRepository { async find() { return []; } async create(data: any) { return { id: "uuid", ...data }; } }
