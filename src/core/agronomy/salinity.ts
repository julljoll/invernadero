import { SalinityResult, CropType } from '../types/agronomy';
import { CROPS_CATALOG } from '../constants/crops';

/**
 * Calcula la fracción de lixiviación y el factor de sobre-riego necesario
 * según la calidad de agua del pozo de Quíbor (fórmula de Rhodes / FAO-29)
 * @param ecWater Conductividad eléctrica del agua de riego (dS/m)
 * @param cropId Tipo de cultivo ('pepper')
 */
export function calculateSalinityImpact(
  ecWater: number,
  cropId: CropType = 'pepper'
): SalinityResult {
  const crop = CROPS_CATALOG[cropId] || CROPS_CATALOG.pepper;
  const ecThreshold = crop.ecThreshold;
  const slope = crop.slopePercentPerDs;

  // Evitar división por cero o números negativos
  const denominator = 5 * ecThreshold - ecWater;
  let lf = 0;

  if (denominator > 0) {
    lf = ecWater / denominator;
  } else {
    lf = 0.50; // Límite máximo de lixiviación práctico (50%)
  }

  // Clampear LF entre 0.05 y 0.50
  lf = Math.max(0.05, Math.min(0.50, lf));
  const leachingFractionPct = Number((lf * 100).toFixed(1));

  // Factor multiplicador de lámina bruta: 1 / (1 - LF)
  const grossFactor = 1 / (1 - lf);

  // Pérdida estimada de rendimiento si el agua sola supera el umbral
  let yieldLossPct = 0;
  if (ecWater > ecThreshold) {
    yieldLossPct = Math.min(100, (ecWater - ecThreshold) * slope);
  }

  let riskLevel: SalinityResult['riskLevel'] = 'optimum';
  let warningMessage = 'Calidad hídrica excelente. Lavado mínimo requerido del 5-10%.';

  if (ecWater > 1.0 && ecWater <= 1.5) {
    riskLevel = 'moderate';
    warningMessage = `Salinidad moderada (${ecWater} dS/m). Requiere lixiviación preventiva de ${leachingFractionPct}% para evitar acumulación de sales.`;
  } else if (ecWater > 1.5 && ecWater <= 2.2) {
    riskLevel = 'high_salinity';
    warningMessage = `¡Atención! Agua salobre de pozo típico de Quíbor. Supera el umbral de ${crop.name}. Es obligatorio aplicar una fracción de lavado de ${leachingFractionPct}% y suplementar Calcio solubilizado.`;
  } else if (ecWater > 2.2) {
    riskLevel = 'critical';
    warningMessage = `Salinidad crítica (> 2.2 dS/m). Riesgo severo de toxicidad por cloro/sodio, bloqueo radicular y caída de rendimiento de hasta ${yieldLossPct.toFixed(0)}%. Se recomienda dilución con agua de lluvia o ósmosis inversa.`;
  }

  return {
    ecWater: Number(ecWater.toFixed(2)),
    ecThreshold,
    leachingFractionPct,
    grossIrrigationFactor: Number(grossFactor.toFixed(3)),
    yieldLossPct: Number(yieldLossPct.toFixed(1)),
    riskLevel,
    warningMessage
  };
}
