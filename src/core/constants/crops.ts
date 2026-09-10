import { CropInfo, CropType } from '../types/agronomy';

export const CROPS_CATALOG: Record<CropType, CropInfo> = {
  pepper: {
    id: 'pepper',
    name: 'Pimentón (Cultivo Principal)',
    scientificName: 'Capsicum annuum',
    ecThreshold: 1.5,
    slopePercentPerDs: 14.0,
    recommendedGsm: '125-130 gsm',
    pesticideReduction: '75%',
    virosisRiskReduction: '98%',
    targetYieldTons: 12.5,
    avgPriceUsdPerKg: 0.90
  },
  tomato: {
    id: 'tomato',
    name: 'Tomate Indeterminado (Hilo Alto)',
    scientificName: 'Solanum lycopersicum',
    ecThreshold: 2.5,
    slopePercentPerDs: 9.9,
    recommendedGsm: '110 gsm',
    pesticideReduction: '70%',
    virosisRiskReduction: '95%',
    targetYieldTons: 18.7,
    avgPriceUsdPerKg: 0.80
  },
  cucumber: {
    id: 'cucumber',
    name: 'Pepino (Cultivo Terciario / Rotación Rápida)',
    scientificName: 'Cucumis sativus',
    ecThreshold: 2.5,
    slopePercentPerDs: 13.0,
    recommendedGsm: '110 gsm',
    pesticideReduction: '65%',
    virosisRiskReduction: '92%',
    targetYieldTons: 15.0,
    avgPriceUsdPerKg: 0.65
  }
};
