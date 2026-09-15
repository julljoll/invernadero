import { create } from 'zustand';
import { QUIBOR_CLIMATE_MONTHS } from '../../core/constants/climateData';
import { QUIBOR_CONFIG } from '../../core/constants/config';

export interface WeatherState {
  temperatureC: number;
  relativeHumidityPct: number;
  windSpeedKmH: number;
  solarRadiationWm2: number;
  isLiveLoading: boolean;
  isRealData: boolean;
  lastUpdated: string | null;
  error: string | null;

  // Acciones
  setManualWeather: (data: {
    temperatureC?: number;
    relativeHumidityPct?: number;
    windSpeedKmH?: number;
    solarRadiationWm2?: number;
  }) => void;
  resetToMonthlyAverage: (monthIndex?: number) => void;
  fetchLiveQuiborWeather: () => Promise<void>;
}

// Obtener el promedio del mes actual (0 = Enero, ..., 11 = Diciembre)
const currentMonthIdx = new Date().getMonth();
const defaultMonth = QUIBOR_CLIMATE_MONTHS[currentMonthIdx] || QUIBOR_CLIMATE_MONTHS[2]; // Marzo por defecto

export const useWeatherStore = create<WeatherState>((set) => ({
  temperatureC: defaultMonth.max,
  relativeHumidityPct: 62.0,
  windSpeedKmH: defaultMonth.viento,
  solarRadiationWm2: 650,
  isLiveLoading: false,
  isRealData: false,
  lastUpdated: null,
  error: null,

  setManualWeather: (data) =>
    set((state) => ({
      temperatureC: data.temperatureC !== undefined ? data.temperatureC : state.temperatureC,
      relativeHumidityPct: data.relativeHumidityPct !== undefined ? data.relativeHumidityPct : state.relativeHumidityPct,
      windSpeedKmH: data.windSpeedKmH !== undefined ? data.windSpeedKmH : state.windSpeedKmH,
      solarRadiationWm2: data.solarRadiationWm2 !== undefined ? data.solarRadiationWm2 : state.solarRadiationWm2,
      isRealData: false,
    })),

  resetToMonthlyAverage: (monthIndex) => {
    const idx = monthIndex !== undefined ? monthIndex : new Date().getMonth();
    const m = QUIBOR_CLIMATE_MONTHS[idx] || defaultMonth;
    set({
      temperatureC: m.max,
      relativeHumidityPct: 62.0,
      windSpeedKmH: m.viento,
      solarRadiationWm2: 680,
      isRealData: false,
      error: null,
    });
  },

  fetchLiveQuiborWeather: async () => {
    set({ isLiveLoading: true, error: null });
    try {
      const lat = QUIBOR_CONFIG.LOCATION.lat;
      const lng = QUIBOR_CONFIG.LOCATION.lng;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,direct_radiation&timezone=America%2FCaracas`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      
      if (data.current) {
        set({
          temperatureC: Number(data.current.temperature_2m.toFixed(1)),
          relativeHumidityPct: Number(data.current.relative_humidity_2m.toFixed(1)),
          windSpeedKmH: Number(data.current.wind_speed_10m.toFixed(1)),
          solarRadiationWm2: data.current.direct_radiation ? Number(data.current.direct_radiation.toFixed(0)) : 650,
          isLiveLoading: false,
          isRealData: true,
          lastUpdated: new Date().toLocaleTimeString('es-VE'),
          error: null,
        });
      } else {
        throw new Error('Sin datos en respuesta');
      }
    } catch (err: any) {
      // Fallback elegante a MERRA-2 sin romper la aplicación
      set({
        isLiveLoading: false,
        error: 'No se pudo conectar a Open-Meteo. Usando estación histórica NASA MERRA-2.',
      });
    }
  },
}));
