import { CropInfo, CropType } from '../types/agronomy';
import dbExport from './database.json';

export const CROPS_CATALOG: Record<CropType, CropInfo> = (dbExport.crops as unknown as Record<CropType, CropInfo>) || {
  pepper: {
    id: 'pepper',
    name: 'Pimentón (Cultivo Único y Exclusivo)',
    scientificName: 'Capsicum annuum',
    ecThreshold: 1.5,
    slopePercentPerDs: 14.0,
    recommendedGsm: '125-130 gsm',
    pesticideReduction: '75%',
    virosisRiskReduction: '98%',
    targetYieldTons: 12.5,
    avgPriceUsdPerKg: 0.90
  }
};
