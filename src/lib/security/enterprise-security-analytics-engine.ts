export type EnterpriseSecurityAnalyticsEngineResult = { status: string; data: any };
export class EnterpriseSecurityAnalyticsEngine {
  evaluate(): EnterpriseSecurityAnalyticsEngineResult {
    return { status: 'SUCCESS', data: {} };
  }
}
