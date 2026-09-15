/**
 * Motor de Cálculo Hidrogeológico y de Captación — Valle de Quíbor
 * Finca La Cigarronera (Municipio Jiménez, Lara)
 * 
 * Basado en:
 * - Jégat, Mora et al. (CIDIAT-ULA / SHYQ, 2012)
 * - Fórmulas analíticas de Dupuit-Thiem, Cooper-Jacob, Jacob (BQ + CQ²) y Darcy
 * - Ensayos Lefranc y aforos in-situ en gravas aluviales de lidita y cuarzo
 */

export interface WellScenarioInput {
  totalDepthM: number;            // 60m o 120m
  staticWaterLevelM: number;      // 49.5m (60m) o 70.0m (120m)
  boreholeRadiusM: number;        // 0.40m (Ø80cm fuste manual) o 0.155m (12¼" rotaria)
  casingInnerRadiusM: number;     // 0.30m (Ø60cm camisa concreto) o 0.101m (8" acero)
  saturatedThicknessM: number;    // 10.0m a 10.5m (Sector Sur, Cuara) o 38.0m (profundo)
  hydraulicConductivityMs: number;// 1e-3 m/s (gravas lidita limpias) a 5e-4 m/s
  influenceRadiusM: number;       // 25.0m a 50.0m
  dailyDemandM3: number;          // 7.5 m³/día (1.000 m²) o 15.75 m³/día (2.000 m²)
  pumpFlowLs: number;             // 1.5 a 2.0 L/s (2 HP) o 2.8 L/s (7.5 HP)
}

export interface RadialInflowResult {
  qM3S: number;
  qLs: number;
  qM3H: number;
  safeYieldLs: number;
  drawdownM: number;
  hwM: number;
  sichardtCriticalVelocityMs: number;
}

export interface CooperJacobResult {
  drawdownM: number;
  transmissivityM2S: number;
  transmissivityM2Day: number;
  argumentU: number;
}

export interface HMTResult {
  dynamicLevelM: number;
  elevationDiffM: number;
  frictionLossM: number;
  servicePressureM: number;
  hmtMca: number;
  powerHydraulicHp: number;
  powerShaftHp: number;
  recommendedMotorHp: number;
}

export interface BufferResult {
  usefulVolumeLiters: number;
  totalExcavatedVolumeLiters: number;
  litersPerMeter: number;
  waterColumnM: number;
}

export interface WaterBalanceResult {
  pumpFlowM3H: number;
  pumpingHoursNeeded: number;
  pumpingMinutesNeeded: number;
  restHoursPerDay: number;
  autonomyDays: number;
  pozoDailyCapacityM3: number;
  utilizationPercent: number;
}

export interface PumpingCurvePoint {
  qLs: number;
  drawdownM: number;
  dynamicLevelM: number;
  isOperatingPoint: boolean;
  zone: 'safe' | 'warning' | 'critical';
}

/**
 * 1. Dupuit-Thiem: Aporte radial máximo en régimen permanente al fuste cilíndrico
 * Q = π · K · (H² - hw²) / ln(R / rw)
 */
export function calculateRadialInflow(
  input: WellScenarioInput,
  drawdownM: number = 2.5
): RadialInflowResult {
  const {
    hydraulicConductivityMs: K,
    saturatedThicknessM: H,
    influenceRadiusM: R,
    boreholeRadiusM: rw
  } = input;

  const clampedDrawdown = Math.min(drawdownM, H * 0.95);
  const hw = Math.max(0.1, H - clampedDrawdown);
  
  const numerator = Math.PI * K * (H * H - hw * hw);
  const denominator = Math.log(R / rw);
  const qM3S = Math.max(0, numerator / denominator);
  const qLs = qM3S * 1000;
  const qM3H = qM3S * 3600;

  // Límite seguro de Sichardt para no arrastrar finos: Ve <= sqrt(K)/15 o 0.03 m/s
  // Para pozo manual con empaque de grava, safe yield recomendado = 1.5 - 2.5 L/s
  const sichardtCriticalVelocityMs = Math.min(0.03, Math.sqrt(K) / 15);
  const safeYieldLs = input.totalDepthM === 60 ? 2.0 : 3.0;

  return {
    qM3S: Number(qM3S.toFixed(4)),
    qLs: Number(qLs.toFixed(1)),
    qM3H: Number(qM3H.toFixed(1)),
    safeYieldLs,
    drawdownM: Number(clampedDrawdown.toFixed(2)),
    hwM: Number(hw.toFixed(2)),
    sichardtCriticalVelocityMs: Number(sichardtCriticalVelocityMs.toFixed(4))
  };
}

/**
 * 2. Cooper-Jacob: Abatimiento transitorio s(r,t) en acuífero semi-confinado
 * s = [Q / (4·π·T)] · ln(2.25·T·t / (r²·S))
 */
export function calculateCooperJacob(params: {
  Q_m3s: number;
  T_m2s: number;
  S: number;
  r_m: number;
  t_seconds: number;
}): CooperJacobResult {
  const { Q_m3s, T_m2s, S, r_m, t_seconds } = params;
  const transmissivityM2Day = T_m2s * 86400;

  if (t_seconds <= 0 || T_m2s <= 0 || S <= 0 || r_m <= 0) {
    return {
      drawdownM: 0,
      transmissivityM2S: T_m2s,
      transmissivityM2Day: Number(transmissivityM2Day.toFixed(1)),
      argumentU: 0
    };
  }

  const uNumerator = 2.25 * T_m2s * t_seconds;
  const uDenominator = r_m * r_m * S;
  const argumentU = uNumerator / uDenominator;

  if (argumentU <= 1.0) {
    return {
      drawdownM: 0,
      transmissivityM2S: T_m2s,
      transmissivityM2Day: Number(transmissivityM2Day.toFixed(1)),
      argumentU: Number(argumentU.toFixed(2))
    };
  }

  const drawdownM = (Q_m3s / (4 * Math.PI * T_m2s)) * Math.log(argumentU);

  return {
    drawdownM: Number(Math.max(0, drawdownM).toFixed(2)),
    transmissivityM2S: T_m2s,
    transmissivityM2Day: Number(transmissivityM2Day.toFixed(1)),
    argumentU: Number(argumentU.toFixed(2))
  };
}

/**
 * 3. Ecuación parabólica de pérdidas de pozo de Jacob: s = B·Q + C·Q²
 * B: Pérdida de carga lineal del acuífero (m / (L/s))
 * C: Pérdida de carga cuadrática de turbulencia en rejilla/empaque (m / (L/s)²)
 */
export function calculateJacobDrawdown(
  Q_ls: number,
  scenario: '60m' | '120m' = '60m'
): number {
  // Parámetros calibrados con aforos de Quíbor
  const B = scenario === '60m' ? 1.85 : 4.20;
  const C = scenario === '60m' ? 0.32 : 0.65;
  const s = B * Q_ls + C * (Q_ls * Q_ls);
  return Number(s.toFixed(2));
}

/**
 * 4. Altura Manométrica Total (HMT / TDH) y Potencia Electromecánica
 * HMT = ND + Desnivel + Pérdidas Fricción + Presión de Servicio
 */
export function calculateHMT(params: {
  dynamicLevelM: number;
  elevationDiffM?: number;
  frictionLossM?: number;
  servicePressureM?: number;
  pumpFlowLs?: number;
  pumpEfficiency?: number;
  motorEfficiency?: number;
}): HMTResult {
  const {
    dynamicLevelM,
    elevationDiffM = 3.0,
    frictionLossM = 2.5,
    servicePressureM = 10.0,
    pumpFlowLs = 1.5,
    pumpEfficiency = 0.72,
    motorEfficiency = 0.88
  } = params;

  const hmtMca = Number((dynamicLevelM + elevationDiffM + frictionLossM + servicePressureM).toFixed(1));
  
  // Potencia hidráulica: P_hid (HP) = (γ · Q · HMT) / 75, γ=1000 kg/m³, Q en m³/s
  const qM3S = pumpFlowLs / 1000;
  const powerHydraulicHp = (1000 * qM3S * hmtMca) / 75;
  
  // Potencia al eje requerida considerando eficiencias y factor de servicio (SF = 1.15 en Franklin/Barnes)
  const combinedEfficiency = pumpEfficiency * motorEfficiency;
  const powerShaftHp = powerHydraulicHp / Math.max(0.1, combinedEfficiency);
  const powerWithServiceFactor = powerShaftHp / 1.15;

  // Potencias comerciales estándar en bombas sumergibles 4" y 6"
  const commercialPowers = [0.5, 0.75, 1.0, 1.5, 2.0, 2.5, 3.0, 5.0, 7.5, 10.0];
  const recommendedMotorHp = commercialPowers.find(p => p >= powerWithServiceFactor) || 10.0;

  return {
    dynamicLevelM,
    elevationDiffM,
    frictionLossM,
    servicePressureM,
    hmtMca,
    powerHydraulicHp: Number(powerHydraulicHp.toFixed(2)),
    powerShaftHp: Number(powerShaftHp.toFixed(2)),
    recommendedMotorHp
  };
}

/**
 * 5. Volumen Buffer del Fuste Cilíndrico
 * Reserva estática de agua inmediata acumulada en reposo
 */
export function calculateFusteBuffer(
  casingInnerRadiusM: number,
  waterColumnM: number,
  boreholeRadiusM: number = 0.40
): BufferResult {
  // Volumen interior útil (dentro de la camisa de concreto)
  const usefulArea = Math.PI * (casingInnerRadiusM * casingInnerRadiusM);
  const usefulVolumeLiters = usefulArea * waterColumnM * 1000;
  
  // Volumen del fuste excavado a tierra viva antes de entubar
  const excavatedArea = Math.PI * (boreholeRadiusM * boreholeRadiusM);
  const totalExcavatedVolumeLiters = excavatedArea * waterColumnM * 1000;

  const litersPerMeter = usefulArea * 1000;

  return {
    usefulVolumeLiters: Math.round(usefulVolumeLiters),
    totalExcavatedVolumeLiters: Math.round(totalExcavatedVolumeLiters),
    litersPerMeter: Number(litersPerMeter.toFixed(1)),
    waterColumnM: Number(waterColumnM.toFixed(1))
  };
}

/**
 * 6. Balance Hídrico Diario Pozo ↔ Reservorio ↔ Demanda Nave
 */
export function calculateDailyWaterBalance(params: {
  pumpFlowLs: number;
  dailyDemandM3: number;
  reservoirCapacityM3: number;
}): WaterBalanceResult {
  const { pumpFlowLs, dailyDemandM3, reservoirCapacityM3 } = params;

  const pumpFlowM3H = pumpFlowLs * 3.6;
  const pumpingHoursNeeded = pumpFlowM3H > 0 ? dailyDemandM3 / pumpFlowM3H : 0;
  const pumpingMinutesNeeded = pumpingHoursNeeded * 60;
  const restHoursPerDay = Math.max(0, 24 - pumpingHoursNeeded);
  const autonomyDays = dailyDemandM3 > 0 ? reservoirCapacityM3 / dailyDemandM3 : 0;
  const pozoDailyCapacityM3 = pumpFlowM3H * 24;
  const utilizationPercent = pozoDailyCapacityM3 > 0 
    ? (dailyDemandM3 / pozoDailyCapacityM3) * 100 
    : 0;

  return {
    pumpFlowM3H: Number(pumpFlowM3H.toFixed(2)),
    pumpingHoursNeeded: Number(pumpingHoursNeeded.toFixed(2)),
    pumpingMinutesNeeded: Math.round(pumpingMinutesNeeded),
    restHoursPerDay: Number(restHoursPerDay.toFixed(2)),
    autonomyDays: Number(autonomyDays.toFixed(1)),
    pozoDailyCapacityM3: Number(pozoDailyCapacityM3.toFixed(1)),
    utilizationPercent: Number(utilizationPercent.toFixed(1))
  };
}

/**
 * 7. Curva de Bombeo: Caudal Q vs Abatimiento s
 * Genera puntos de muestreo para graficar la curva característica
 */
export function generatePumpingCurve(
  scenario: '60m' | '120m',
  operatingFlowLs: number = 1.5,
  maxFlowLs: number = 4.0,
  steps: number = 12
): PumpingCurvePoint[] {
  const points: PumpingCurvePoint[] = [];
  const stepSize = maxFlowLs / steps;
  const staticLevel = scenario === '60m' ? 49.5 : 70.0;
  const safeLimit = scenario === '60m' ? 2.2 : 3.2;
  const warningLimit = scenario === '60m' ? 3.0 : 4.5;

  for (let i = 0; i <= steps; i++) {
    const q = Number((i * stepSize).toFixed(2));
    const s = calculateJacobDrawdown(q, scenario);
    const dynamicLevel = Number((staticLevel + s).toFixed(2));
    const isOperatingPoint = Math.abs(q - operatingFlowLs) < stepSize / 2;

    let zone: 'safe' | 'warning' | 'critical' = 'safe';
    if (q > warningLimit) {
      zone = 'critical';
    } else if (q > safeLimit) {
      zone = 'warning';
    }

    points.push({
      qLs: q,
      drawdownM: s,
      dynamicLevelM: dynamicLevel,
      isOperatingPoint,
      zone
    });
  }

  return points;
}
