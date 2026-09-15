import React, { useState } from 'react';
import { useAgroStore } from '../../../shared/store/useAgroStore';
import { calculateSalinityImpact } from '../../../core/agronomy/salinity';
import { GoogleSheetsSyncModal } from '../../../shared/components/GoogleSheetsSyncModal';

import { SalinityPanel } from './fertirriego/SalinityPanel';
import { PlantingFrame } from './fertirriego/PlantingFrame';
import { IrrigationSchedule } from './fertirriego/IrrigationSchedule';
import { WaterBalanceChart } from './fertirriego/WaterBalanceChart';
import { NutritionTanks } from './fertirriego/NutritionTanks';

export const Module03Fertirriego: React.FC = () => {
  const {
    selectedCrop,
    waterEcDsM,
    setWaterParams,
    greenhouseLengthM,
    greenhouseWidthM,
  } = useAgroStore();

  const [showGoogleSheetsModal, setShowGoogleSheetsModal] = useState<boolean>(false);
  const [targetSheetId, setTargetSheetId] = useState<string>('02_Plan_Riego_FAO56');

  const salinityResult = calculateSalinityImpact(waterEcDsM, selectedCrop);

  // Dimensiones y marco de siembra
  const length = greenhouseLengthM || 50;
  const width = greenhouseWidthM || 20;
  const areaM2 = length * width;

  // Parámetros de Marco de Siembra (Línea Base Quíbor 1.000 m²)
  const camellonesCount = Math.max(1, Math.round(width / 2.0));
  const densityPlM2 = 2.50;
  const totalPlants = Math.round(areaM2 * densityPlM2);

  // Sistema de riego por goteo autocompensante PC
  const totalMetersTape = camellonesCount * 2 * length;
  const spacingDrippersM = 0.40;
  const totalDrippers = Math.round(totalMetersTape / spacingDrippersM);
  const dripperFlowLh = 1.60;
  const totalFlowM3h = (totalDrippers * dripperFlowLh) / 1000;
  const sectorsCount = 2;
  const sectorFlowM3h = totalFlowM3h / sectorsCount;

  // Etapas Fenológicas Agrupadas
  const stagesSummary = [
    {
      id: '1',
      name: '01. Enraizamiento & Asentamiento',
      weeks: 'Semanas 1 a 3',
      kc: '0.45 – 0.60',
      waterPlWeek: '7.2 – 9.0 L/pl',
      dailyVolGreenhouse: '2.83 m³/día',
      pulses: '2 turnos de 12 min',
      notes: 'Raíz superficial exploratoria (0-15 cm). Prohibido saturar para inducir enraizamiento y evitar asfixia.',
      accent: 'border-info text-info',
    },
    {
      id: '2',
      name: '02. Crecimiento Vegetativo',
      weeks: 'Semanas 4 a 7',
      kc: '0.70 – 0.85',
      waterPlWeek: '12.0 – 15.0 L/pl',
      dailyVolGreenhouse: '4.71 m³/día',
      pulses: '2 turnos de 18 min',
      notes: 'Desarrollo de biomasa foliar y bifurcaciones. Guiado en Hortomalla 15x15 cm sin ataduras.',
      accent: 'border-primary text-primary',
    },
    {
      id: '3',
      name: '03. Floración & Cuajado',
      weeks: 'Semanas 8 a 11',
      kc: '0.95 – 1.05',
      waterPlWeek: '15.5 – 19.4 L/pl',
      dailyVolGreenhouse: '6.09 m³/día',
      pulses: '2 turnos de 23 min',
      notes: 'Etapa más crítica en Quíbor. Estrés hídrico o salino >32°C detona aborto floral irreversible.',
      accent: 'border-warning text-warning',
    },
    {
      id: '4',
      name: '04. Cosecha Pico & Fructificación',
      weeks: 'Semanas 12 a 22',
      kc: '1.15 sostenido',
      waterPlWeek: '18.5 – 23.1 L/pl',
      dailyVolGreenhouse: '7.26 – 9.25 m³/día',
      pulses: '2 turnos de 28 min',
      notes: 'Demanda pico en meses cálidos (marzo-abril). División en micropulsos para mitigar salinidad.',
      accent: 'border-success text-success',
    },
    {
      id: '5',
      name: '05. Cierre & Desmonte',
      weeks: 'Semanas 23 a 24',
      kc: '0.80 – 0.70',
      waterPlWeek: '11.0 – 13.8 L/pl',
      dailyVolGreenhouse: '4.33 m³/día',
      pulses: '2 turnos de 15 min',
      notes: 'Maduración de últimos frutos. Despunte apical ya realizado y cierre sanitario del ciclo.',
      accent: 'border-secondary text-secondary',
    },
  ];

  const handleOpenSheetsModal = (sheetId: string) => {
    setTargetSheetId(sheetId);
    setShowGoogleSheetsModal(true);
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* 1. Salinidad del Pozo & Lixiviación Mass-Hoffman */}
      <SalinityPanel
        waterEcDsM={waterEcDsM}
        selectedCrop={selectedCrop}
        onEcChange={(val) => setWaterParams({ waterEcDsM: val })}
      />

      {/* 2. Marco de Siembra & Diseño de Goteo */}
      <PlantingFrame
        areaM2={areaM2}
        totalPlants={totalPlants}
        camellonesCount={camellonesCount}
        totalDrippers={totalDrippers}
        totalMetersTape={totalMetersTape}
        dripperFlowLh={dripperFlowLh}
        totalFlowM3h={totalFlowM3h}
        sectorsCount={sectorsCount}
        sectorFlowM3h={sectorFlowM3h}
      />

      {/* 3. Programa de Riego FAO-56 por Etapas & Calendario Semanal */}
      <IrrigationSchedule
        stagesSummary={stagesSummary}
        areaM2={areaM2}
        totalPlants={totalPlants}
        grossFactor={salinityResult.grossIrrigationFactor}
        onOpenSheetsModal={handleOpenSheetsModal}
      />

      {/* 4. Gráfico Anual de Balance Hídrico Quíbor */}
      <WaterBalanceChart grossFactor={salinityResult.grossIrrigationFactor} />

      {/* 5. Tanques de Nutrición A, B y C (AIFA) */}
      <NutritionTanks />

      {/* Modal de Sincronización con Google Sheets */}
      <GoogleSheetsSyncModal
        show={showGoogleSheetsModal}
        onHide={() => setShowGoogleSheetsModal(false)}
        initialSheetId={targetSheetId}
      />
    </div>
  );
};
