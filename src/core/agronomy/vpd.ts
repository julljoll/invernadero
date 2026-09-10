import { VpdResult } from '../types/agronomy';

/**
 * Calcula la presión de vapor de saturación mediante la ecuación de Tetens
 * @param tempC Temperatura en grados Celsius
 * @returns Presión de vapor de saturación en kPa
 */
export function calculateSaturationVaporPressure(tempC: number): number {
  return 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
}

/**
 * Calcula el Déficit de Presión de Vapor (VPD) atmosférico y foliar
 * @param tempAirC Temperatura del aire en °C
 * @param relativeHumidityPct Humedad relativa en % (0 - 100)
 * @param leafTempDeltaC Diferencial de temperatura foliar (típicamente -1.5 a -2.0 °C con transpiración activa)
 */
export function calculateVpd(
  tempAirC: number,
  relativeHumidityPct: number,
  leafTempDeltaC: number = -1.8
): VpdResult {
  const hrClamped = Math.max(0, Math.min(100, relativeHumidityPct));
  const esAir = calculateSaturationVaporPressure(tempAirC);
  const eaAir = esAir * (hrClamped / 100);
  const vpdAir = Math.max(0, esAir - eaAir);

  const leafTemp = tempAirC + leafTempDeltaC;
  const esLeaf = calculateSaturationVaporPressure(leafTemp);
  const vpdCanopy = Math.max(0, esLeaf - eaAir);

  let status: VpdResult['status'] = 'optimum';
  let statusLabel = 'Óptimo (Transpiración y Fotosíntesis Activa)';
  let recommendation = 'Condiciones bioclimáticas ideales para asimilación de Ca²⁺ y conductancia estomática.';

  if (vpdAir < 0.40) {
    status = 'danger_low';
    statusLabel = 'Peligro Humedad Excesiva (< 0.40 kPa)';
    recommendation = 'Riesgo inminente de edema foliar, gutación y germinación de hongos (Botrytis, mildiu). Activar ventilación cenital y abrir cortinas.';
  } else if (vpdAir >= 0.40 && vpdAir <= 1.25) {
    status = 'optimum';
    statusLabel = 'Zona de Confort Fisiológico (0.40 - 1.25 kPa)';
    recommendation = 'Máxima tasa fotosintética neta y transporte óptimo de calcio a frutos jóvenes.';
  } else if (vpdAir > 1.25 && vpdAir <= 1.55) {
    status = 'warning_high';
    statusLabel = 'Alerta Estrés Hídrico Moderado (1.25 - 1.55 kPa)';
    recommendation = 'Cierre estomático incipiente. Incrementar pulsos cortos de microaspersión o humedecer pasillos para elevar HR%.';
  } else {
    status = 'danger_high';
    statusLabel = 'Crítico: Cierre Estomático Severo (> 1.55 kPa)';
    recommendation = 'Riesgo crítico de aborto floral y Blossom End Rot (necrosis apical) en frutos. Sombrear malla y asegurar flujo de fertirriego inmediato.';
  }

  return {
    esAir: Number(esAir.toFixed(3)),
    eaAir: Number(eaAir.toFixed(3)),
    vpdAir: Number(vpdAir.toFixed(2)),
    vpdCanopy: Number(vpdCanopy.toFixed(2)),
    status,
    statusLabel,
    recommendation
  };
}
