import { CropInfo, CropType } from '../types/agronomy';
import dbExport from './database.json';

const defaultCrops: Record<CropType, CropInfo> = {
  pepper: {
    id: 'pepper',
    name: 'Pimentón Híbrido F1 (Magistral / Nathalie)',
    scientificName: 'Capsicum annuum',
    ecThreshold: 1.5,
    slopePercentPerDs: 14.0,
    recommendedGsm: '110-130 gsm Blanco',
    pesticideReduction: '75%',
    virosisRiskReduction: '98%',
    targetYieldTons: 12.5,
    avgPriceUsdPerKg: 0.90,
  },
  tomato: {
    id: 'tomato',
    name: 'Tomate Indeterminado Hilo Alto',
    scientificName: 'Solanum lycopersicum',
    ecThreshold: 2.5,
    slopePercentPerDs: 9.9,
    recommendedGsm: '110 gsm Blanco',
    pesticideReduction: '70%',
    virosisRiskReduction: '95%',
    targetYieldTons: 18.7,
    avgPriceUsdPerKg: 0.85,
  },
  cucumber: {
    id: 'cucumber',
    name: 'Pepino Europeo / Holandés Partenocárpico',
    scientificName: 'Cucumis sativus',
    ecThreshold: 2.5,
    slopePercentPerDs: 13.0,
    recommendedGsm: '110 gsm Blanco',
    pesticideReduction: '65%',
    virosisRiskReduction: '90%',
    targetYieldTons: 22.0,
    avgPriceUsdPerKg: 0.60,
  },
};

const rawCrops = (dbExport.crops as unknown as Record<string, CropInfo>) || {};

export const CROPS_CATALOG: Record<CropType, CropInfo> = {
  pepper: rawCrops.pepper || defaultCrops.pepper,
  tomato: rawCrops.tomato || defaultCrops.tomato,
  cucumber: rawCrops.cucumber || defaultCrops.cucumber,
};
