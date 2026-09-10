import { VentilationResult } from '../types/agronomy';

export interface VentilationParams {
  ridgeHeightM: number;       // Altura a cumbrera (m)
  lengthM: number;            // Longitud de la nave (m)
  widthM: number;             // Ancho de la nave (m)
  gutterHeightM: number;      // Altura al alero (m)
  baseWindSpeed10mKmH: number;// Velocidad del viento de estación a 10m (km/h)
  numWindTurbines: number;    // Cantidad de extractores eólicos en cumbrera
  turbineDiameterInches: 24 | 30 | 36;
}

/**
 * Calcula la ventilación convectiva natural y la tasa de renovación de aire (RAH)
 * para casas de malla en el Valle de Quíbor
 */
export function calculateVentilation(params: VentilationParams): VentilationResult {
  const {
    ridgeHeightM,
    lengthM,
    widthM,
    gutterHeightM,
    baseWindSpeed10mKmH,
    numWindTurbines,
    turbineDiameterInches
  } = params;

  // 1. Velocidad del viento a la altura de cumbrera por Ley de Hellmann (exponente 0.16 en terreno llano)
  const zClamped = Math.max(1.0, ridgeHeightM);
  const hellmannFactor = Math.pow(zClamped / 10.0, 0.16);
  const windSpeedRidgeKmH = baseWindSpeed10mKmH * hellmannFactor;
  const windSpeedRidgeMS = windSpeedRidgeKmH / 3.6;

  // 2. Volumen interno de la casa de malla (prisma cuadrangular + prisma triangular de techo)
  const baseVolume = lengthM * widthM * gutterHeightM;
  const roofVolume = lengthM * widthM * ((ridgeHeightM - gutterHeightM) / 2);
  const totalVolumeM3 = Math.max(100, baseVolume + Math.max(0, roofVolume));

  // 3. Área de ventilación perimetral efectiva de malla 50 mesh
  // Fachada Este (orientada al viento dominante) + franjas laterales
  const perimeterAreaM2 = 2 * (lengthM + widthM) * gutterHeightM;
  const ventAreaEffectiveM2 = perimeterAreaM2 * 0.40; // 40% área expuesta efectiva normal al viento

  // Coeficiente de descarga aerodinámica Cd de malla 50 mesh (110 gsm)
  const cdMesh = 0.24;

  // Caudal convectivo natural Qvent (m³/h)
  const convectiveFlowM3H = cdMesh * ventAreaEffectiveM2 * windSpeedRidgeMS * 3600;

  // 4. Caudal aportado por extractores eólicos de cumbrera
  // Rendimiento empírico de caudal según diámetro y velocidad de viento
  let turbineFlowUnitM3H = 0;
  if (turbineDiameterInches === 24) {
    turbineFlowUnitM3H = 2200 * (windSpeedRidgeKmH / 8.5);
  } else if (turbineDiameterInches === 30) {
    turbineFlowUnitM3H = 3300 * (windSpeedRidgeKmH / 8.5);
  } else {
    turbineFlowUnitM3H = 4800 * (windSpeedRidgeKmH / 8.5);
  }

  const ridgeFansFlowM3H = numWindTurbines * Math.max(500, turbineFlowUnitM3H);
  const totalFlowM3H = convectiveFlowM3H + ridgeFansFlowM3H;

  // 5. Renovaciones de aire por hora (RAH)
  const airChangesPerHour = totalFlowM3H / totalVolumeM3;
  const isAdequate = airChangesPerHour >= 45.0; // Umbral de seguridad contra sobrecalentamiento (>31.5 °C)

  // Gradiente térmico estimado interior vs exterior:
  // Mayor RAH disipa el calor reduciendo el delta T
  const deltaT = Math.max(0.8, 5.0 - (airChangesPerHour / 15.0));

  return {
    windSpeedAtRidgeKmH: Number(windSpeedRidgeKmH.toFixed(1)),
    convectiveFlowM3H: Math.round(convectiveFlowM3H),
    ridgeFansFlowM3H: Math.round(ridgeFansFlowM3H),
    totalFlowM3H: Math.round(totalFlowM3H),
    airChangesPerHour: Number(airChangesPerHour.toFixed(1)),
    isAdequate,
    thermalGradientDeltaT: Number(deltaT.toFixed(1))
  };
}
