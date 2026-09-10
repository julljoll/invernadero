import { IrrigationStage } from '../types/agronomy';

export interface CropWaterRequirementParams {
  surfaceM2: number;
  totalPlants: number;
  et0MmDay: number;
  leachingFactor: number; // 1 + LF (ej. 1.25 para 25% de lavado)
  uniformityEfficiency: number; // Típicamente 0.90 para goteo
}

export function calculateFao56IrrigationStages(
  params: CropWaterRequirementParams
): IrrigationStage[] {
  const { totalPlants, et0MmDay, leachingFactor, uniformityEfficiency } = params;

  // Etapas estándar FAO-56 para pimentón / tomate en Quíbor
  const stageDefinitions = [
    { stageName: "01. Trasplante y Enraizamiento", weeks: "Sem 1 a 3", kc: 0.60 },
    { stageName: "02. Crecimiento Vegetativo Rápido", weeks: "Sem 4 a 6", kc: 0.80 },
    { stageName: "03. Floración & Primer Cuajado", weeks: "Sem 7 a 9", kc: 1.05 },
    { stageName: "04. Plena Cosecha (Pico de Calor)", weeks: "Sem 10 a 20", kc: 1.15 }
  ];

  return stageDefinitions.map(def => {
    const etcNetMmDay = et0MmDay * def.kc;
    // Lámina bruta considerando lavado y eficiencia de goteros
    const grossMmDay = (etcNetMmDay * leachingFactor) / uniformityEfficiency;

    // 1 mm en 1.000 m² = 1.000 Litros totales
    // Litros por planta por semana:
    const totalWeeklyLiters = (grossMmDay * params.surfaceM2 * 7);
    const litersPerPlantWeek = totalPlants > 0 ? (totalWeeklyLiters / totalPlants) : 0;

    return {
      stageName: def.stageName,
      weeks: def.weeks,
      kc: def.kc,
      grossMmDay: Number(grossMmDay.toFixed(2)),
      litersPerPlantWeek: Number(litersPerPlantWeek.toFixed(1))
    };
  });
}
