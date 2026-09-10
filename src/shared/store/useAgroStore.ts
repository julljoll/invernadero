import { create } from 'zustand';
import { CropType } from '../../core/types/agronomy';
import { QUIBOR_CONFIG } from '../../core/constants/config';

interface AgroState {
  // Cultivo Seleccionado
  selectedCrop: CropType;
  setSelectedCrop: (crop: CropType) => void;

  // Parámetros Estructurales de la Casa de Malla
  greenhouseLengthM: number;
  greenhouseWidthM: number;
  gutterHeightM: number;
  ridgeHeightM: number;
  numWindTurbines: number;
  meshGsmVariant: '110' | '130';
  setGreenhouseDimensions: (dimensions: {
    lengthM?: number;
    widthM?: number;
    gutterHeightM?: number;
    ridgeHeightM?: number;
    numWindTurbines?: number;
    meshGsmVariant?: '110' | '130';
  }) => void;

  // Parámetros Hídricos y Salinidad del Pozo
  wellStaticLevelM: number;
  wellPumpingFlowLs: number;
  waterEcDsM: number; // Conductividad eléctrica (dS/m)
  setWaterParams: (params: {
    wellStaticLevelM?: number;
    wellPumpingFlowLs?: number;
    waterEcDsM?: number;
  }) => void;

  // Telemetría en vivo
  liveTemperatureC: number | null;
  liveRelativeHumidityPct: number | null;
  liveWindSpeedKmH: number | null;
  setLiveWeather: (weather: {
    temperatureC: number;
    relativeHumidityPct: number;
    windSpeedKmH: number;
  }) => void;
}

export const useAgroStore = create<AgroState>((set) => ({
  selectedCrop: 'pepper',
  setSelectedCrop: (crop) => set({ selectedCrop: crop }),

  greenhouseLengthM: QUIBOR_CONFIG.GREENHOUSE.lengthM,
  greenhouseWidthM: QUIBOR_CONFIG.GREENHOUSE.widthM,
  gutterHeightM: QUIBOR_CONFIG.GREENHOUSE.minHeightGutterM,
  ridgeHeightM: QUIBOR_CONFIG.GREENHOUSE.optRidgeHeightM,
  numWindTurbines: 8,
  meshGsmVariant: '110',
  setGreenhouseDimensions: (dims) =>
    set((state) => ({
      greenhouseLengthM: dims.lengthM ?? state.greenhouseLengthM,
      greenhouseWidthM: dims.widthM ?? state.greenhouseWidthM,
      gutterHeightM: dims.gutterHeightM ?? state.gutterHeightM,
      ridgeHeightM: dims.ridgeHeightM ?? state.ridgeHeightM,
      numWindTurbines: dims.numWindTurbines ?? state.numWindTurbines,
      meshGsmVariant: dims.meshGsmVariant ?? state.meshGsmVariant,
    })),

  wellStaticLevelM: 49.5,
  wellPumpingFlowLs: 2.5,
  waterEcDsM: 1.65, // Salinidad promedio de pozo en Cuara
  setWaterParams: (params) =>
    set((state) => ({
      wellStaticLevelM: params.wellStaticLevelM ?? state.wellStaticLevelM,
      wellPumpingFlowLs: params.wellPumpingFlowLs ?? state.wellPumpingFlowLs,
      waterEcDsM: params.waterEcDsM ?? state.waterEcDsM,
    })),

  liveTemperatureC: 28.5,
  liveRelativeHumidityPct: 62.0,
  liveWindSpeedKmH: 8.8,
  setLiveWeather: (weather) =>
    set({
      liveTemperatureC: weather.temperatureC,
      liveRelativeHumidityPct: weather.relativeHumidityPct,
      liveWindSpeedKmH: weather.windSpeedKmH,
    }),
}));
