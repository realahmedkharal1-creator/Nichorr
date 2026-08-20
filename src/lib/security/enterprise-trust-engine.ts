export type EnterpriseTrustEngineResult = { status: string; data: any };
export class EnterpriseTrustEngine {
  evaluate(): EnterpriseTrustEngineResult {
    return { status: 'SUCCESS', data: {} };
  }
}
