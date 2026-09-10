import { ClimateMonth } from '../types/agronomy';

export const QUIBOR_CLIMATE_MONTHS: ClimateMonth[] = [
  { mes: "Enero", max: 30.1, min: 16.0, tmed: 23.8, lluvia: 18.9, viento: 7.7, bochorno: 16.0, rh: 69.2, rad: 18.7, eto: 5.4, dir: "88% ESTE" },
  { mes: "Febrero", max: 30.8, min: 16.0, tmed: 24.6, lluvia: 11.2, viento: 8.5, bochorno: 14.5, rh: 63.9, rad: 20.2, eto: 5.8, dir: "85% ESTE" },
  { mes: "Marzo", max: 31.0, min: 16.0, tmed: 25.4, lluvia: 23.9, viento: 8.6, bochorno: 18.6, rh: 62.2, rad: 19.2, eto: 6.4, dir: "84% ESTE", picoCalor: true },
  { mes: "Abril", max: 30.6, min: 17.5, tmed: 25.6, lluvia: 61.8, viento: 8.5, bochorno: 22.6, rh: 67.7, rad: 16.7, eto: 6.2, dir: "80% ESTE" },
  { mes: "Mayo", max: 29.8, min: 18.4, tmed: 25.1, lluvia: 104.0, viento: 8.8, bochorno: 28.1, rh: 73.8, rad: 16.5, eto: 5.6, dir: "78% ESTE", maxLluvia: true },
  { mes: "Junio", max: 28.6, min: 18.0, tmed: 24.2, lluvia: 99.0, viento: 10.4, bochorno: 27.6, rh: 77.9, rad: 16.2, eto: 5.2, dir: "82% ESTE", maxViento: true },
  { mes: "Julio", max: 28.0, min: 19.0, tmed: 23.8, lluvia: 99.8, viento: 9.1, bochorno: 28.0, rh: 79.5, rad: 17.2, eto: 4.8, dir: "85% ESTE", masFresco: true },
  { mes: "Agosto", max: 28.5, min: 17.9, tmed: 24.0, lluvia: 95.2, viento: 9.0, bochorno: 28.6, rh: 80.1, rad: 18.2, eto: 5.1, dir: "86% ESTE", picoBochorno: true },
  { mes: "Septiembre", max: 29.2, min: 18.1, tmed: 24.2, lluvia: 82.8, viento: 8.2, bochorno: 27.6, rh: 79.1, rad: 18.7, eto: 5.3, dir: "53% SUR (Excepción)" },
  { mes: "Octubre", max: 29.4, min: 16.7, tmed: 24.0, lluvia: 98.3, viento: 6.7, bochorno: 28.5, rh: 80.3, rad: 17.6, eto: 4.6, dir: "79% ESTE" },
  { mes: "Noviembre", max: 29.2, min: 17.6, tmed: 23.9, lluvia: 72.0, viento: 7.0, bochorno: 26.4, rh: 80.3, rad: 16.5, eto: 4.9, dir: "84% ESTE", masCalmado: true },
  { mes: "Diciembre", max: 29.4, min: 15.9, tmed: 23.7, lluvia: 28.0, viento: 7.2, bochorno: 22.0, rh: 75.1, rad: 17.3, eto: 5.0, dir: "87% ESTE" }
];
