import { describe, it, expect } from 'vitest';
import { calculateSaturationVaporPressure, calculateVpd } from './vpd';
import { calculateSalinityImpact } from './salinity';
import { calculateVentilation } from '../engineering/ventilation';

describe('Cálculos Agronómicos de Precisión — Quíbor', () => {
  it('Debe calcular la presión de vapor de saturación correctamente según Tetens', () => {
    // A 20 °C, es ≈ 2.338 kPa
    const es20 = calculateSaturationVaporPressure(20);
    expect(es20).toBeCloseTo(2.338, 2);

    // A 30 °C, es ≈ 4.243 kPa
    const es30 = calculateSaturationVaporPressure(30);
    expect(es30).toBeCloseTo(4.243, 2);
  });

  it('Debe diagnosticar VPD en zona de confort a 26 °C y 65% HR', () => {
    const vpdResult = calculateVpd(26, 65);
    expect(vpdResult.vpdAir).toBeGreaterThan(1.0);
    expect(vpdResult.vpdAir).toBeLessThan(1.3);
    expect(vpdResult.status).toBe('optimum');
  });

  it('Debe alertar sobrecalentamiento y estrés si VPD > 1.6 kPa en marzo', () => {
    // Pico de calor en Quíbor: 32 °C y 50% HR
    const vpdResult = calculateVpd(32, 50);
    expect(vpdResult.vpdAir).toBeGreaterThan(2.0);
    expect(vpdResult.status).toBe('danger_high');
  });

  it('Debe calcular fracción de lixiviación (LF) para agua salina de pozo en Quíbor', () => {
    // Agua de pozo moderada 1.5 dS/m para pimentón (umbral 1.5)
    // Denominador = 5 * 1.5 - 1.5 = 6.0
    // LF = 1.5 / 6.0 = 0.25 (25%)
    const salinity = calculateSalinityImpact(1.5, 'pepper');
    expect(salinity.leachingFractionPct).toBe(25);
    expect(salinity.grossIrrigationFactor).toBeCloseTo(1.333, 2);
  });

  it('Debe calcular renovación de aire (RAH) según Ley de Hellmann y cumbrera a 5.5m', () => {
    const vent = calculateVentilation({
      ridgeHeightM: 5.5,
      lengthM: 50.0,
      widthM: 20.0,
      gutterHeightM: 3.0,
      baseWindSpeed10mKmH: 9.0,
      numWindTurbines: 8,
      turbineDiameterInches: 30
    });

    expect(vent.airChangesPerHour).toBeGreaterThan(45);
    expect(vent.isAdequate).toBe(true);
  });
});
