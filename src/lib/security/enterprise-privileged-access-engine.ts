export type EnterprisePrivilegedAccessEngineResult = { status: string; data: any };
export class EnterprisePrivilegedAccessEngine {
  evaluate(): EnterprisePrivilegedAccessEngineResult {
    return { status: 'SUCCESS', data: {} };
  }
}
