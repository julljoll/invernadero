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

  // Etapas Fenológicas Agrupadas con Esquema de Pulsos y Logística de Cisternas (Quíbor)
  const stagesSummary = [
    {
      id: '1',
      name: '01. Enraizamiento & Asentamiento',
      weeks: 'Semanas 1 a 3',
      kc: '0.45 – 0.60',
      waterPlWeek: '7.2 – 9.0 L/pl',
      dailyVolGreenhouse: '2.83 m³/día (2 cisternas 10m³/sem)',
      pulses: '3 pulsos de 10 min (08:00, 11:30, 15:00)',
      notes: 'Riegos ultracortos para evitar saturación superficial y evaporación acelerada. Estimulante radicular e hidrosoluble fraccionado.',
      accent: 'border-info text-info',
    },
    {
      id: '2',
      name: '02. Crecimiento Vegetativo',
      weeks: 'Semanas 4 a 7',
      kc: '0.70 – 0.85',
      waterPlWeek: '12.0 – 15.0 L/pl',
      dailyVolGreenhouse: '4.71 m³/día (3.3 cisternas 10m³/sem)',
      pulses: '4 pulsos de 12 min (08:00, 11:00, 13:30, 16:00)',
      notes: 'Inyección de Nitrógeno y Potasio hidrosoluble al 100% de los pulsos para absorción activa sin percolación profunda.',
      accent: 'border-primary text-primary',
    },
    {
      id: '3',
      name: '03. Floración & Cuajado',
      weeks: 'Semanas 8 a 11',
      kc: '0.95 – 1.05',
      waterPlWeek: '15.5 – 19.4 L/pl',
      dailyVolGreenhouse: '6.09 m³/día (4.3 cisternas 10m³/sem)',
      pulses: '5 pulsos de 14 min (08:00, 10:00, 12:00, 14:00, 16:00)',
      notes: 'Frecuencia intensificada en horas pico de calor/insolación. Mantiene conductividad eléctrica estable y previene aborto y blossom-end rot.',
      accent: 'border-warning text-warning',
    },
    {
      id: '4',
      name: '04. Cosecha Pico & Fructificación',
      weeks: 'Semanas 12 a 22',
      kc: '1.15 sostenido',
      waterPlWeek: '18.5 – 23.1 L/pl',
      dailyVolGreenhouse: '7.26 – 9.25 m³/día (5–6.5 cisternas 10m³/sem)',
      pulses: '6 pulsos de 14 min (07:30 a 16:30 cada 1.8h)',
      notes: 'Micro-dosis constantes en horas de máxima evapotranspiración. Aporte continuo de Calcio y Potasio asimilable sin saturar el suelo.',
      accent: 'border-success text-success',
    },
    {
      id: '5',
      name: '05. Cierre & Desmonte',
      weeks: 'Semanas 23 a 24',
      kc: '0.80 – 0.70',
      waterPlWeek: '11.0 – 13.8 L/pl',
      dailyVolGreenhouse: '4.33 m³/día (3 cisternas 10m³/sem)',
      pulses: '3 pulsos de 12 min (08:30, 12:30, 15:30)',
      notes: 'Maduración final homogénea. Se restringen pulsos tardíos para evitar rajado de fruto antes del desmonte sanitario.',
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
