import {
  AdapterPlatform,
  AdapterConnectionState,
  PlatformObservationItem,
} from "../intelligence.types";

export interface PlatformIngestionAdapter {
  getPlatform(): AdapterPlatform;
  getConnectionState(): AdapterConnectionState;
  validate(rawData: any): { isValid: boolean; errors: string[]; warnings: string[] };
  normalize(rawData: any): PlatformObservationItem[];
}
