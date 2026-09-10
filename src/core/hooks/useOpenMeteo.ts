import { useState, useEffect } from 'react';

export interface QuiborTelemetry {
  temperatureC: number;
  relativeHumidityPct: number;
  windSpeedKmH: number;
  windDirectionDeg: number;
  windGustsKmH: number;
  irradianceW2: number;
  windCompass: string;
  isLive: boolean;
  lastUpdated: string;
  vpdKpa: number;
}

// Valores de referencia Quíbor (Línea Base NASA MERRA-2 a 700 msnm)
const QUIBOR_FALLBACK: QuiborTelemetry = {
  temperatureC: 29.5,
  relativeHumidityPct: 62,
  windSpeedKmH: 9.4,
  windDirectionDeg: 88, // Este dominante (88%)
  windGustsKmH: 27.0, // Ráfaga de diseño según AGENTS.md
  irradianceW2: 780,
  windCompass: 'E',
  isLive: false,
  lastUpdated: 'Línea Base NASA MERRA-2',
  vpdKpa: 1.58,
};

function getCompassDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((deg % 360) / 22.5)) % 16;
  return directions[index];
}

function calculateTetensVpd(tempC: number, rhPct: number): number {
  const es = 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  const ea = es * (rhPct / 100);
  return Number(Math.max(0, es - ea).toFixed(2));
}

export function useOpenMeteo(lat = 9.888889, lon = -69.593056) {
  const [telemetry, setTelemetry] = useState<QuiborTelemetry>(QUIBOR_FALLBACK);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchWeatherData() {
      try {
        setLoading(true);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,direct_normal_irradiance&timezone=America%2FCaracas`;
        
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const current = data.current;

        if (current && isMounted) {
          const temp = current.temperature_2m ?? 29.5;
          const rh = current.relative_humidity_2m ?? 62;
          const windSpd = current.wind_speed_10m ?? 9.4;
          const windDir = current.wind_direction_10m ?? 88;
          const gusts = current.wind_gusts_10m ?? 27.0;
          const irr = current.direct_normal_irradiance ?? 750;

          setTelemetry({
            temperatureC: Number(temp.toFixed(1)),
            relativeHumidityPct: Math.round(rh),
            windSpeedKmH: Number(windSpd.toFixed(1)),
            windDirectionDeg: Math.round(windDir),
            windGustsKmH: Number(gusts.toFixed(1)),
            irradianceW2: Math.round(irr),
            windCompass: getCompassDirection(windDir),
            isLive: true,
            lastUpdated: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
            vpdKpa: calculateTetensVpd(temp, rh),
          });
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          // Mantener los valores de respaldo de Quíbor NASA MERRA-2
          setTelemetry(prev => ({ ...prev, isLive: false }));
          setError(err.message || 'Error al conectar con la estación meteorológica');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchWeatherData();

    // Actualización cada 10 minutos
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [lat, lon]);

  return { telemetry, loading, error };
}
