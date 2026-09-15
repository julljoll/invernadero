import { CropType } from '../types/agronomy';

export type PhenologicalStage = 
  | 'establishment' 
  | 'vegetative' 
  | 'flowering' 
  | 'fruiting' 
  | 'harvest';

export interface CropThermalSpecs {
  baseTempC: number;
  optMinTempC: number;
  optMaxTempC: number;
  cutoffTempC: number;
  stageGddThresholds: {
    establishment: number; // Trasplante a enraizamiento pleno
    vegetative: number;    // Crecimiento vegetativo hasta primeros botones florales
    flowering: number;     // Floración y cuajado inicial
    fruiting: number;      // Llenado de frutos
    harvest: number;       // Maduración comercial y cosecha
  };
  totalCycleGdd: number;
  totalCycleDaysExpected: number;
}

export const CROP_THERMAL_SPECS: Record<CropType, CropThermalSpecs> = {
  pepper: {
    baseTempC: 12.0,
    optMinTempC: 24.0,
    optMaxTempC: 28.0,
    cutoffTempC: 34.0,
    stageGddThresholds: {
      establishment: 160,  // ~12-14 días
      vegetative: 450,     // ~30-35 días
      flowering: 750,      // ~50-55 días
      fruiting: 1100,      // ~75-80 días
      harvest: 1650,       // ~120-140 días
    },
    totalCycleGdd: 1650,
    totalCycleDaysExpected: 140,
  },
  tomato: {
    baseTempC: 10.0,
    optMinTempC: 22.0,
    optMaxTempC: 26.0,
    cutoffTempC: 32.0,
    stageGddThresholds: {
      establishment: 140,
      vegetative: 420,
      flowering: 720,
      fruiting: 1150,
      harvest: 1800,
    },
    totalCycleGdd: 1800,
    totalCycleDaysExpected: 150,
  },
  cucumber: {
    baseTempC: 12.0,
    optMinTempC: 22.0,
    optMaxTempC: 28.0,
    cutoffTempC: 35.0,
    stageGddThresholds: {
      establishment: 120,
      vegetative: 350,
      flowering: 550,
      fruiting: 850,
      harvest: 1300,
    },
    totalCycleGdd: 1300,
    totalCycleDaysExpected: 90,
  },
};

export interface GddCalculationResult {
  crop: CropType;
  daysElapsed: number;
  accumulatedGdd: number;
  dailyAvgGdd: number;
  currentStage: PhenologicalStage;
  currentStageLabel: string;
  stageProgressPct: number;
  totalCycleProgressPct: number;
  daysToNextStage: number;
  projectedHarvestDateDays: number;
  thermalStatus: 'cold_stress' | 'optimum' | 'heat_stress';
  thermalStatusMessage: string;
}

/**
 * Calcula los Grados-Día de Desarrollo acumulados para un día con Tmax y Tmin
 * aplicando la ecuación de Baskerville-Emin simplificada con cutoff superior
 */
export function calculateDailyGdd(
  tMaxC: number,
  tMinC: number,
  baseTempC: number,
  cutoffTempC: number
): number {
  // Ajuste por cutoff para evitar acumulación errónea durante estrés por calor extremo
  const cappedMax = Math.min(tMaxC, cutoffTempC);
  const meanTemp = (cappedMax + tMinC) / 2;
  return Math.max(0, Number((meanTemp - baseTempC).toFixed(2)));
}

/**
 * Calcula la proyección fenológica de un cultivo en base a días transcurridos
 * y los promedios térmicos validados de Quíbor (NASA MERRA-2)
 */
export function calculatePhenologyGdd(
  crop: CropType,
  daysElapsed: number,
  customAvgTMax?: number,
  customAvgTMin?: number
): GddCalculationResult {
  const specs = CROP_THERMAL_SPECS[crop] || CROP_THERMAL_SPECS.pepper;
  const days = Math.max(1, daysElapsed);

  // Determinar Tmax y Tmin de referencia (promedio anual de Quíbor o mes)
  const avgTMax = customAvgTMax ?? 29.8;
  const avgTMin = customAvgTMin ?? 17.3;

  const dailyGdd = calculateDailyGdd(avgTMax, avgTMin, specs.baseTempC, specs.cutoffTempC);
  const accumulatedGdd = Number((dailyGdd * days).toFixed(1));

  // Determinar etapa fenológica actual
  const t = specs.stageGddThresholds;
  let currentStage: PhenologicalStage = 'establishment';
  let currentStageLabel = 'I. Establecimiento y Enraizamiento';
  let prevThreshold = 0;
  let nextThreshold = t.establishment;

  if (accumulatedGdd < t.establishment) {
    currentStage = 'establishment';
    currentStageLabel = 'I. Establecimiento y Enraizamiento';
    prevThreshold = 0;
    nextThreshold = t.establishment;
  } else if (accumulatedGdd < t.vegetative) {
    currentStage = 'vegetative';
    currentStageLabel = 'II. Desarrollo Vegetativo y Vigor';
    prevThreshold = t.establishment;
    nextThreshold = t.vegetative;
  } else if (accumulatedGdd < t.flowering) {
    currentStage = 'flowering';
    currentStageLabel = 'III. Floración y Cuajado de Primeros Frutos';
    prevThreshold = t.vegetative;
    nextThreshold = t.flowering;
  } else if (accumulatedGdd < t.fruiting) {
    currentStage = 'fruiting';
    currentStageLabel = 'IV. Llenado Activo de Frutos y Calibre';
    prevThreshold = t.flowering;
    nextThreshold = t.fruiting;
  } else {
    currentStage = 'harvest';
    currentStageLabel = 'V. Maduración Comercial y Cosecha Plena';
    prevThreshold = t.fruiting;
    nextThreshold = specs.totalCycleGdd;
  }

  // Cálculos de porcentaje y días restantes
  const stageSpan = Math.max(1, nextThreshold - prevThreshold);
  const stageGddEarned = Math.max(0, accumulatedGdd - prevThreshold);
  const stageProgressPct = Math.min(100, Math.round((stageGddEarned / stageSpan) * 100));

  const totalCycleProgressPct = Math.min(
    100,
    Math.round((accumulatedGdd / specs.totalCycleGdd) * 100)
  );

  const gddRemainingToNext = Math.max(0, nextThreshold - accumulatedGdd);
  const daysToNextStage = Math.ceil(gddRemainingToNext / (dailyGdd || 1));
  const remainingTotalGdd = Math.max(0, specs.totalCycleGdd - accumulatedGdd);
  const projectedHarvestDateDays = Math.ceil(remainingTotalGdd / (dailyGdd || 1));

  // Diagnóstico de estrés térmico
  let thermalStatus: 'cold_stress' | 'optimum' | 'heat_stress' = 'optimum';
  let thermalStatusMessage = 'Régimen térmico en rango óptimo de asimilación fotosintética.';

  if (avgTMax > specs.optMaxTempC + 3) {
    thermalStatus = 'heat_stress';
    thermalStatusMessage = 'Alerta de sobrecalentamiento diurno. Riesgo de aborto floral. Activar ventilación cenital y microaspersión.';
  } else if (avgTMin < specs.baseTempC + 2) {
    thermalStatus = 'cold_stress';
    thermalStatusMessage = 'Noches frías ralentizan la tasa metabólica del cultivo.';
  }

  return {
    crop,
    daysElapsed: days,
    accumulatedGdd,
    dailyAvgGdd: dailyGdd,
    currentStage,
    currentStageLabel,
    stageProgressPct,
    totalCycleProgressPct,
    daysToNextStage,
    projectedHarvestDateDays,
    thermalStatus,
    thermalStatusMessage,
  };
}
