export type EnterpriseAccessBlastRadiusEngineResult = { status: string; data: any };
export class EnterpriseAccessBlastRadiusEngine {
  evaluate(): EnterpriseAccessBlastRadiusEngineResult {
    return { status: 'SUCCESS', data: {} };
  }
}
