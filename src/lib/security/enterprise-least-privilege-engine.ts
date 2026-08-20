export type EnterpriseLeastPrivilegeEngineResult = { status: string; data: any };
export class EnterpriseLeastPrivilegeEngine {
  evaluate(): EnterpriseLeastPrivilegeEngineResult {
    return { status: 'SUCCESS', data: {} };
  }
}
