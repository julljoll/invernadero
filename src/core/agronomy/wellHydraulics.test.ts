import { describe, it, expect } from 'vitest';
import {
  calculateRadialInflow,
  calculateCooperJacob,
  calculateJacobDrawdown,
  calculateHMT,
  calculateFusteBuffer,
  calculateDailyWaterBalance,
  generatePumpingCurve,
  WellScenarioInput
} from './wellHydraulics';

describe('Motor de Cálculo Hidrogeológico — Valle de Quíbor v3.0', () => {
  const scenario60mInput: WellScenarioInput = {
    totalDepthM: 60,
    staticWaterLevelM: 49.5,
    boreholeRadiusM: 0.40,
    casingInnerRadiusM: 0.30,
    saturatedThicknessM: 10.0,
    hydraulicConductivityMs: 1e-3, // 10^-3 m/s en gravas aluviales limpias
    influenceRadiusM: 25.0,
    dailyDemandM3: 7.5,
    pumpFlowLs: 2.0
  };

  describe('1. Dupuit-Thiem (Aporte Radial al Fuste)', () => {
    it('Debe calcular un aporte radial teórico de ~33 L/s para grava limpia con 2.5m de abatimiento', () => {
      const result = calculateRadialInflow(scenario60mInput, 2.5);
      expect(result.qLs).toBeCloseTo(33.2, 0);
      expect(result.hwM).toBe(7.5);
      expect(result.drawdownM).toBe(2.5);
    });

    it('Debe recomendar un caudal operativo seguro (safe yield) de 2.0 L/s para pozo artesanal', () => {
      const result = calculateRadialInflow(scenario60mInput, 2.5);
      expect(result.safeYieldLs).toBe(2.0);
      expect(result.sichardtCriticalVelocityMs).toBeLessThanOrEqual(0.03);
    });
  });

  describe('2. Cooper-Jacob (Abatimiento Transitorio)', () => {
    it('Debe calcular transmisividad correcta (T = K * b) en gravas de Quíbor', () => {
      const T = 1e-3 * 10.0; // 0.01 m²/s = 864 m²/día
      const result = calculateCooperJacob({
        Q_m3s: 0.002,
        T_m2s: T,
        S: 0.05,
        r_m: 0.40,
        t_seconds: 3600
      });
      expect(result.transmissivityM2Day).toBe(864);
      expect(result.drawdownM).toBeGreaterThan(0.05);
      expect(result.drawdownM).toBeLessThan(0.5);
    });

    it('Debe retornar 0 si el tiempo de bombeo es 0 o parámetros inválidos', () => {
      const result = calculateCooperJacob({
        Q_m3s: 0.002,
        T_m2s: 0.01,
        S: 0.05,
        r_m: 0.40,
        t_seconds: 0
      });
      expect(result.drawdownM).toBe(0);
    });
  });

  describe('3. Pérdidas de Pozo según Jacob (s = BQ + CQ²)', () => {
    it('Debe calcular abatimiento estabilizado de ~3.5m a 1.5 L/s en pozo de 60m', () => {
      const s = calculateJacobDrawdown(1.5, '60m');
      expect(s).toBeGreaterThan(3.0);
      expect(s).toBeLessThan(4.0);
    });

    it('Debe calcular mayor abatimiento cuadrático a caudales superiores', () => {
      const s1 = calculateJacobDrawdown(1.0, '60m');
      const s2 = calculateJacobDrawdown(2.0, '60m');
      expect(s2).toBeGreaterThan(s1 * 2); // Efecto del término cuadrático C*Q²
    });
  });

  describe('4. Altura Manométrica Total (HMT) y Potencia de Bombeo', () => {
    it('Debe calcular HMT de ~69 mca para pozo de 60m con 52m de nivel dinámico', () => {
      const result = calculateHMT({
        dynamicLevelM: 52.0,
        elevationDiffM: 3.0,
        frictionLossM: 2.5,
        servicePressureM: 10.0,
        pumpFlowLs: 1.5
      });
      expect(result.hmtMca).toBe(67.5);
      expect(result.recommendedMotorHp).toBe(2.0); // Bomba de 2.0 HP recomendada
    });
  });

  describe('5. Vaso Buffer del Fuste Cilíndrico', () => {
    it('Debe calcular un buffer útil de ~2.970 L para camisa Ø60cm int y 10.5m de columna', () => {
      const buffer = calculateFusteBuffer(0.30, 10.5, 0.40);
      expect(buffer.usefulVolumeLiters).toBeCloseTo(2969, -1);
      expect(buffer.litersPerMeter).toBeCloseTo(282.7, 0);
      expect(buffer.totalExcavatedVolumeLiters).toBeGreaterThan(buffer.usefulVolumeLiters);
    });
  });

  describe('6. Balance Hídrico Diario Pozo ↔ Reservorio', () => {
    it('Debe satisfacer los 7.5 m³/día del invernadero en ~1.04 horas de bombeo a 2.0 L/s', () => {
      const balance = calculateDailyWaterBalance({
        pumpFlowLs: 2.0,
        dailyDemandM3: 7.5,
        reservoirCapacityM3: 80.0
      });
      expect(balance.pumpFlowM3H).toBe(7.2);
      expect(balance.pumpingHoursNeeded).toBeCloseTo(1.04, 1);
      expect(balance.restHoursPerDay).toBeGreaterThan(22.0);
      expect(balance.autonomyDays).toBeCloseTo(10.7, 0);
      expect(balance.utilizationPercent).toBeLessThan(10); // Menor al 10% del potencial 24h
    });
  });

  describe('7. Generador de Curva de Bombeo Q vs s', () => {
    it('Debe generar puntos continuos con categorización de zonas segura, advertencia y crítica', () => {
      const curve = generatePumpingCurve('60m', 1.5, 4.0, 10);
      expect(curve.length).toBe(11);
      expect(curve[0].qLs).toBe(0);
      expect(curve[0].drawdownM).toBe(0);
      
      const operatingPoint = curve.find(p => p.isOperatingPoint);
      expect(operatingPoint).toBeDefined();
      expect(operatingPoint?.zone).toBe('safe');

      const criticalPoint = curve[curve.length - 1];
      expect(criticalPoint.zone).toBe('critical');
    });
  });
});
