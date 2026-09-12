export type CropType = 'pepper';

export interface CropInfo {
  id: CropType;
  name: string;
  scientificName: string;
  ecThreshold: number; // dS/m
  slopePercentPerDs: number; // % reducción por cada dS/m sobre umbral
  recommendedGsm: string;
  pesticideReduction: string;
  virosisRiskReduction: string;
  targetYieldTons: number; // Tons por ciclo en 1.000 m²
  avgPriceUsdPerKg: number;
}

export interface ClimateMonth {
  mes: string;
  max: number;
  min: number;
  tmed: number;
  lluvia: number;
  viento: number;
  bochorno: number;
  rh: number;
  rad: number;
  eto: number;
  dir: string;
  picoCalor?: boolean;
  maxLluvia?: boolean;
  maxViento?: boolean;
  masFresco?: boolean;
  picoBochorno?: boolean;
  masCalmado?: boolean;
}

export interface VpdResult {
  esAir: number;      // Presión de vapor de saturación a Taire (kPa)
  eaAir: number;      // Presión de vapor actual (kPa)
  vpdAir: number;     // VPD del aire (kPa)
  vpdCanopy: number;  // VPD foliar estimado (kPa)
  status: 'danger_low' | 'optimum' | 'warning_high' | 'danger_high';
  statusLabel: string;
  recommendation: string;
}

export interface IrrigationStage {
  stageName: string;
  weeks: string;
  kc: number;
  grossMmDay: number;
  litersPerPlantWeek: number;
}

export interface SalinityResult {
  ecWater: number;
  ecThreshold: number;
  leachingFractionPct: number;
  grossIrrigationFactor: number;
  yieldLossPct: number;
  riskLevel: 'optimum' | 'moderate' | 'high_salinity' | 'critical';
  warningMessage: string;
}

export interface VentilationResult {
  windSpeedAtRidgeKmH: number;
  convectiveFlowM3H: number;
  ridgeFansFlowM3H: number;
  totalFlowM3H: number;
  airChangesPerHour: number; // RAH
  isAdequate: boolean;
  thermalGradientDeltaT: number;
}
