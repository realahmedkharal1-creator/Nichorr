export type EnterpriseAccessGraphEngineResult = { status: string; data: any };
export class EnterpriseAccessGraphEngine {
  evaluate(): EnterpriseAccessGraphEngineResult {
    return { status: 'SUCCESS', data: {} };
  }
}
