import { CropType } from '../types/agronomy';

export interface BasketDistribution {
  largePct: number;   // % Cesta Grande (>220g / Jumbo)
  mediumPct: number;  // % Cesta Mediana (140-180g)
  smallPct: number;   // % Maraña (<120g o deforme)
}

export interface BasketPricesUsd {
  largeBasketUsd: number;   // $14.00
  mediumBasketUsd: number;  // $8.00
  smallBasketUsd: number;   // $3.50
  kgPerBasket: number;      // 20 kg estándar venezolano
}

export const DEFAULT_BASKET_PRICES: BasketPricesUsd = {
  largeBasketUsd: 14.0,
  mediumBasketUsd: 8.0,
  smallBasketUsd: 3.5,
  kgPerBasket: 20.0,
};

export const FRUIT_WEIGHT_G = 350;
export const FRUITS_PER_BASKET = 57;

export interface SystemFinancialComparison {
  totalKgHarvested: number;
  totalBaskets: number;
  grossRevenueUsd: number;
  operatingCostsUsd: number;
  netRevenueUsd: number;
  avgPricePerKgUsd: number;
  marginPerPlantUsd: number;
  roiPct: number;
  breakEvenWeek: number;
  largeBasketsCount: number;
  mediumBasketsCount: number;
  smallBasketsCount: number;
}

export interface CycleFinancialAnalysis {
  crop: CropType;
  totalPlants: number;
  yieldKgPerPlant: number;
  totalCycleWeeks: number;
  traditionalSystem: SystemFinancialComparison;
  technifiedSystem: SystemFinancialComparison;
  netRevenueDifferenceUsd: number;
  profitMultiplier: number;
}

/**
 * Calcula el análisis financiero comparativo de la cosecha:
 * Sistema Tradicional (Suelo + Abono Granulado + Alta Maraña) vs.
 * Sistema Agrovenecua (Malla 50 Mesh + AIFA Hidrosoluble + Goteros PC/AS)
 */
export function calculateCycleFinancials(
  crop: CropType = 'pepper',
  totalPlants: number = 3500,
  yieldKgPerPlantTechnified: number = 5.0, // 5.0 kg/pl para Magistral F1 tecnificado
  customPrices: Partial<BasketPricesUsd> = {},
  customTechnifiedCostsUsd: number = 2277 // Costo operativo insumos ciclo 1000m2
): CycleFinancialAnalysis {
  const prices: BasketPricesUsd = { ...DEFAULT_BASKET_PRICES, ...customPrices };
  const cycleWeeks = crop === 'tomato' ? 24 : 20;

  // 1. SISTEMA TECNIFICADO (AGROVENECUA)
  // Distribución calibrada: 75% Cesta Grande, 25% Mediana, 0% Maraña
  const techDist: BasketDistribution = {
    largePct: 75,
    mediumPct: 25,
    smallPct: 0,
  };

  const techTotalKg = totalPlants * yieldKgPerPlantTechnified;
  const techTotalBaskets = Math.round(techTotalKg / prices.kgPerBasket);

  const techLargeBaskets = Math.round((techTotalBaskets * techDist.largePct) / 100);
  const techMediumBaskets = Math.round((techTotalBaskets * techDist.mediumPct) / 100);
  const techSmallBaskets = techTotalBaskets - techLargeBaskets - techMediumBaskets;

  const techGrossRevenue =
    techLargeBaskets * prices.largeBasketUsd +
    techMediumBaskets * prices.mediumBasketUsd +
    techSmallBaskets * prices.smallBasketUsd;

  const techNetRevenue = techGrossRevenue - customTechnifiedCostsUsd;
  const techRoi = (techNetRevenue / customTechnifiedCostsUsd) * 100;
  const techAvgPricePerKg = techGrossRevenue / techTotalKg;
  const techMarginPerPlant = techNetRevenue / totalPlants;
  const techBreakEvenWeek = Math.min(cycleWeeks, Math.round(cycleWeeks * (customTechnifiedCostsUsd / techGrossRevenue)));

  // 2. SISTEMA TRADICIONAL (A CAMPO ABIERTO / SUELO)
  // Mismo volumen de referencia (o menor rendimiento típico de 2.0 - 2.5 kg/pl a campo abierto,
  // pero para comparar estrictamente la pérdida de valor por maraña se evalúa la misma biomasa o base típica)
  const tradDist: BasketDistribution = {
    largePct: 25,
    mediumPct: 45,
    smallPct: 30, // 30% de maraña arrugada o dañada
  };

  const tradYieldKgPerPlant = crop === 'pepper' ? 3.5 : 4.0; // Menor rendimiento y calidad
  const tradTotalKg = totalPlants * tradYieldKgPerPlant;
  const tradTotalBaskets = Math.round(tradTotalKg / prices.kgPerBasket);

  const tradLargeBaskets = Math.round((tradTotalBaskets * tradDist.largePct) / 100);
  const tradMediumBaskets = Math.round((tradTotalBaskets * tradDist.mediumPct) / 100);
  const tradSmallBaskets = tradTotalBaskets - tradLargeBaskets - tradMediumBaskets;

  const tradCostsUsd = 1850; // Costo típico de campo abierto (agroquímicos curativos excesivos)
  const tradGrossRevenue =
    tradLargeBaskets * prices.largeBasketUsd +
    tradMediumBaskets * prices.mediumBasketUsd +
    tradSmallBaskets * prices.smallBasketUsd;

  const tradNetRevenue = Math.max(0, tradGrossRevenue - tradCostsUsd);
  const tradRoi = tradCostsUsd > 0 ? (tradNetRevenue / tradCostsUsd) * 100 : 0;
  const tradAvgPricePerKg = tradTotalKg > 0 ? tradGrossRevenue / tradTotalKg : 0;
  const tradMarginPerPlant = tradNetRevenue / totalPlants;
  const tradBreakEvenWeek = Math.min(cycleWeeks, Math.round(cycleWeeks * (tradCostsUsd / (tradGrossRevenue || 1))));

  const netDiff = techNetRevenue - tradNetRevenue;
  const profitMultiplier = tradNetRevenue > 0 ? Number((techNetRevenue / tradNetRevenue).toFixed(2)) : 2.5;

  return {
    crop,
    totalPlants,
    yieldKgPerPlant: yieldKgPerPlantTechnified,
    totalCycleWeeks: cycleWeeks,
    traditionalSystem: {
      totalKgHarvested: tradTotalKg,
      totalBaskets: tradTotalBaskets,
      grossRevenueUsd: Number(tradGrossRevenue.toFixed(2)),
      operatingCostsUsd: tradCostsUsd,
      netRevenueUsd: Number(tradNetRevenue.toFixed(2)),
      avgPricePerKgUsd: Number(tradAvgPricePerKg.toFixed(2)),
      marginPerPlantUsd: Number(tradMarginPerPlant.toFixed(2)),
      roiPct: Number(tradRoi.toFixed(1)),
      breakEvenWeek: tradBreakEvenWeek,
      largeBasketsCount: tradLargeBaskets,
      mediumBasketsCount: tradMediumBaskets,
      smallBasketsCount: tradSmallBaskets,
    },
    technifiedSystem: {
      totalKgHarvested: techTotalKg,
      totalBaskets: techTotalBaskets,
      grossRevenueUsd: Number(techGrossRevenue.toFixed(2)),
      operatingCostsUsd: customTechnifiedCostsUsd,
      netRevenueUsd: Number(techNetRevenue.toFixed(2)),
      avgPricePerKgUsd: Number(techAvgPricePerKg.toFixed(2)),
      marginPerPlantUsd: Number(techMarginPerPlant.toFixed(2)),
      roiPct: Number(techRoi.toFixed(1)),
      breakEvenWeek: techBreakEvenWeek,
      largeBasketsCount: techLargeBaskets,
      mediumBasketsCount: techMediumBaskets,
      smallBasketsCount: techSmallBaskets,
    },
    netRevenueDifferenceUsd: Number(netDiff.toFixed(2)),
    profitMultiplier,
  };
}
