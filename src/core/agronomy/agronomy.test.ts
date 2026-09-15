import { describe, it, expect } from 'vitest';
import { calculateSaturationVaporPressure, calculateVpd } from './vpd';
import { calculateSalinityImpact } from './salinity';
import { calculateFao56IrrigationStages } from './fao56';
import { calculateVentilation } from '../engineering/ventilation';
import { calculateDailyGdd, calculatePhenologyGdd } from './gdd';
import { calculateCycleFinancials } from './finance';

describe('Cálculos Agronómicos de Precisión — Quíbor v3.0', () => {
  // =========================================================================
  // 1. PSICROMETRÍA Y VPD
  // =========================================================================
  describe('Motor Psicrométrico & VPD (Tetens)', () => {
    it('Debe calcular la presión de vapor de saturación correctamente según Tetens a 20°C', () => {
      const es20 = calculateSaturationVaporPressure(20);
      expect(es20).toBeCloseTo(2.338, 2);
    });

    it('Debe calcular la presión de vapor de saturación correctamente a 30°C', () => {
      const es30 = calculateSaturationVaporPressure(30);
      expect(es30).toBeCloseTo(4.243, 2);
    });

    it('Debe diagnosticar VPD en zona óptima a 26°C y 65% HR', () => {
      const vpdResult = calculateVpd(26, 65);
      expect(vpdResult.vpdAir).toBeGreaterThan(1.0);
      expect(vpdResult.vpdAir).toBeLessThan(1.3);
      expect(vpdResult.status).toBe('optimum');
    });

    it('Debe alertar sobrecalentamiento y estrés si VPD > 1.6 kPa en marzo', () => {
      const vpdResult = calculateVpd(32, 50);
      expect(vpdResult.vpdAir).toBeGreaterThan(2.0);
      expect(vpdResult.status).toBe('danger_high');
    });

    it('Debe alertar peligro por baja transpiración y riesgo de Botrytis si VPD < 0.4 kPa', () => {
      const vpdResult = calculateVpd(22, 90);
      expect(vpdResult.vpdAir).toBeLessThan(0.4);
      expect(vpdResult.status).toBe('danger_low');
    });
  });

  // =========================================================================
  // 2. SALINIDAD Y LIXIVIACIÓN
  // =========================================================================
  describe('Manejo de Salinidad y Lixiviación (Mass-Hoffman & FAO-56)', () => {
    it('Debe calcular fracción de lixiviación (LF) para agua salina de pozo 1.5 dS/m en pimentón', () => {
      const salinity = calculateSalinityImpact(1.5, 'pepper');
      expect(salinity.leachingFractionPct).toBe(25);
      expect(salinity.grossIrrigationFactor).toBeCloseTo(1.333, 2);
    });

    it('Debe calcular pérdida de rendimiento cero si CEw <= umbral de saturación', () => {
      const salinity = calculateSalinityImpact(1.0, 'pepper');
      expect(salinity.yieldLossPct).toBe(0);
      expect(salinity.riskLevel).toBe('optimum');
    });

    it('Debe alertar pérdida severa de rendimiento con CEw elevada (>2.5 dS/m)', () => {
      const salinity = calculateSalinityImpact(2.8, 'pepper');
      expect(salinity.yieldLossPct).toBeGreaterThan(10);
      expect(salinity.leachingFractionPct).toBeGreaterThan(30);
    });
  });

  // =========================================================================
  // 3. BALANCE HÍDRICO FAO-56
  // =========================================================================
  describe('Balance Hídrico FAO-56 y Lámina de Riego', () => {
    it('Debe generar las 4 etapas fenológicas con Kc ascendente', () => {
      const stages = calculateFao56IrrigationStages({
        surfaceM2: 1000,
        totalPlants: 2500,
        et0MmDay: 5.0,
        leachingFactor: 1.25,
        uniformityEfficiency: 0.90,
      });
      expect(stages).toHaveLength(4);
      expect(stages[0].kc).toBe(0.6);
      expect(stages[1].kc).toBe(0.8);
      expect(stages[2].kc).toBe(1.05);
      expect(stages[3].kc).toBe(1.15);
    });

    it('Debe calcular litros por planta coherentes con la densidad poblacional', () => {
      const stages = calculateFao56IrrigationStages({
        surfaceM2: 1000,
        totalPlants: 2500,
        et0MmDay: 5.0,
        leachingFactor: 1.25,
        uniformityEfficiency: 0.90,
      });
      expect(stages[2].litersPerPlantWeek).toBeGreaterThan(15);
      expect(stages[2].litersPerPlantWeek).toBeLessThan(25);
    });
  });

  // =========================================================================
  // 4. VENTILACIÓN Y RAH
  // =========================================================================
  describe('Ingeniería de Ventilación y Renovaciones de Aire (RAH)', () => {
    it('Debe calcular renovación de aire (RAH) según Ley de Hellmann y cumbrera a 5.5m', () => {
      const vent = calculateVentilation({
        ridgeHeightM: 5.5,
        lengthM: 50.0,
        widthM: 20.0,
        gutterHeightM: 3.0,
        baseWindSpeed10mKmH: 9.0,
        numWindTurbines: 8,
        turbineDiameterInches: 30,
      });

      expect(vent.airChangesPerHour).toBeGreaterThan(45);
      expect(vent.isAdequate).toBe(true);
    });

    it('Debe alertar ventilación deficiente en calma térmica (< 3 km/h de viento y sin extractores)', () => {
      const vent = calculateVentilation({
        ridgeHeightM: 4.0,
        lengthM: 50.0,
        widthM: 20.0,
        gutterHeightM: 3.0,
        baseWindSpeed10mKmH: 2.0,
        numWindTurbines: 0,
        turbineDiameterInches: 24,
      });
      expect(vent.airChangesPerHour).toBeLessThan(40);
      expect(vent.isAdequate).toBe(false);
    });
  });

  // =========================================================================
  // 5. GRADOS-DÍA DE DESARROLLO (GDD) Y FENOLOGÍA
  // =========================================================================
  describe('Motor Fenológico de Grados-Día (GDD)', () => {
    it('Debe calcular correctamente el GDD diario con base de 12°C para pimentón', () => {
      const dailyGdd = calculateDailyGdd(30, 18, 12, 34);
      expect(dailyGdd).toBe(12);
    });

    it('Debe respetar el cutoff superior para evitar acumulación errónea en calor extremo', () => {
      const dailyGdd = calculateDailyGdd(38, 20, 12, 34);
      expect(dailyGdd).toBe(15);
    });

    it('Debe proyectar etapa de establecimiento en primeros 10 días tras trasplante', () => {
      const pheno = calculatePhenologyGdd('pepper', 10);
      expect(pheno.currentStage).toBe('establishment');
      expect(pheno.stageProgressPct).toBeGreaterThan(0);
      expect(pheno.totalCycleProgressPct).toBeLessThan(20);
    });

    it('Debe situar el cultivo en floración a los 50 días en clima de Quíbor', () => {
      const pheno = calculatePhenologyGdd('pepper', 50);
      expect(pheno.currentStage).toBe('flowering');
      expect(pheno.daysToNextStage).toBeGreaterThan(0);
    });

    it('Debe proyectar maduración y cosecha a los 110 días', () => {
      const pheno = calculatePhenologyGdd('pepper', 110);
      expect(pheno.currentStage).toBe('harvest');
      expect(pheno.totalCycleProgressPct).toBeGreaterThan(70);
    });
  });

  // =========================================================================
  // 6. ANÁLISIS FINANCIERO Y ERRADICACIÓN DE MARAÑA
  // =========================================================================
  describe('Motor Financiero y Rentabilidad de Cestas', () => {
    it('Debe proyectar 88% de cesta grande a $14 USD en el sistema tecnificado', () => {
      const fin = calculateCycleFinancials('pepper', 2500, 5.2);
      expect(fin.technifiedSystem.largeBasketsCount).toBeGreaterThan(500);
      expect(fin.technifiedSystem.smallBasketsCount).toBe(0); // Cero maraña
    });

    it('Debe generar un incremento neto de más de $3.000 USD sobre el sistema tradicional', () => {
      const fin = calculateCycleFinancials('pepper', 2500, 5.2);
      expect(fin.netRevenueDifferenceUsd).toBeGreaterThan(3000);
      expect(fin.profitMultiplier).toBeGreaterThan(1.8);
    });

    it('Debe calcular punto de equilibrio (break-even) antes de la semana 12', () => {
      const fin = calculateCycleFinancials('pepper', 2500, 5.2);
      expect(fin.technifiedSystem.breakEvenWeek).toBeLessThanOrEqual(12);
    });

    it('Debe reflejar precio promedio por kilo mayor a $0.60 USD en sistema tecnificado', () => {
      const fin = calculateCycleFinancials('pepper', 2500, 5.2);
      expect(fin.technifiedSystem.avgPricePerKgUsd).toBeGreaterThan(0.60);
      expect(fin.traditionalSystem.avgPricePerKgUsd).toBeLessThan(0.55);
    });
  });
});
