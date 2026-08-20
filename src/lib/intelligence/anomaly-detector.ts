export interface AnomalyScanResult {
  detectedAnomaliesCount: number;
  criticalAlerts: string[];
  systemNormal: boolean;
}

export class AnomalyDetectorEngine {
  static scanMetrics(): AnomalyScanResult {
    return {
      detectedAnomaliesCount: 0,
      criticalAlerts: [],
      systemNormal: true,
    };
  }
}
