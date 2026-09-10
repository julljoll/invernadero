import React, { useState } from 'react';
import { Slider } from '../../../../shared/components/Slider';

type BudgetCategory = 'all' | 'seed' | 'nutrition' | 'structure' | 'irrigation' | 'mesh';

export const InvestmentCalculatorSection: React.FC = () => {
  // Estados de simulación comercial
  const [sellingPricePerKg, setSellingPricePerKg] = useState<number>(0.70); // $14.0 USD / cesta de 20 kg
  const [targetYieldKg, setTargetYieldKg] = useState<number>(13000); // 13.0 Ton = 650 cestas (2.500 pl × 5.20 kg)
  const [activeCategory, setActiveCategory] = useState<BudgetCategory>('all');
  const [showTimelineDetails, setShowTimelineDetails] = useState<boolean>(false);

  // =========================================================================
  // DESGLOSE TÉCNICO EXHAUSTIVO DEL GASTO DE PRODUCCIÓN Y ADECUACIÓN (15 RUBROS)
  // =========================================================================
  // 1. Semillero, Germinación & Labranza ($860 USD)
  const costSeedMagistral = 450;        // Semilla híbrida certificada Magistral F1 (3 sobres de 1.000 semillas)
  const costGermination = 150;          // Gasto de germinación en bandejas 128 celdas + Peat Moss
  const costLandPrep = 180;             // Preparación de tierra: pase de tractor, rastra y conformación de 10 camellones
  const costTransplantLabor = 80;       // Mano de obra para siembra y trasplante de 2.500 plántulas
  const subtotalSeed = costSeedMagistral + costGermination + costLandPrep + costTransplantLabor; // $860 USD

  // 2. Nutrición, Agua & Protección Fitosanitaria ($2.940 USD)
  const costFertilizerAifa = 1380;      // Nutrición 100% hidrosoluble AIFA (20 semanas, Tanques A y B)
  const costPhRegulator = 220;          // Regulador de pH: Ácido Nítrico Técnico 60% (224 L / ciclo)
  const costPesticidesFungicides = 540;  // Venenos plagas y hongos (Plan Fitosanitario anti-trips, acaricidas, preventivos)
  const costWaterCisterns = 800;        // Cisternas de agua dulce 10.000L ($20/viaje × 40 viajes = 400.000 L)
  const subtotalNutrition = costFertilizerAifa + costPhRegulator + costPesticidesFungicides + costWaterCisterns; // $2.940 USD

  // 3. Reacondicionamiento Estructural & Mano de Obra ($375 USD)
  const costPaintWhitePrimer = 75;      // 1 cuñete de fondo blanco anticorrosivo para herrería Sch 40
  const costPaintLabor = 120;           // Mano de obra para lijar y pintar los 108 pilares y vigas
  const costMeshInstallLabor = 180;     // Mano de obra para colocar, coser con hilo UV y tensar la Malla 50 Mesh
  const subtotalStructure = costPaintWhitePrimer + costPaintLabor + costMeshInstallLabor; // $375 USD

  // 4. Sistema de Riego & Cabezal de Fertirriego ($580 USD)
  const costDripMainHose = 120;         // Tubería matriz y submatrices PEAD de 1" a 1.5"
  const costDripTapeRoll = 180;         // Cinta de goteo rollo 1.000m para 2.500 plantas a 40cm (goteros PC/AS)
  const costDripInitialConnectors = 60; // Conectores iniciales con válvula individual y gomas grommet anti-fuga
  const cost3FertigationTanks = 220;    // 3 tanques para fertirriego (Tanque A 500L, Tanque B 500L, Tanque C 200L)
  const subtotalIrrigation = costDripMainHose + costDripTapeRoll + costDripInitialConnectors + cost3FertigationTanks; // $580 USD

  // Gasto total de producción y adecuación (15 rubros por defecto): $4.755 USD
  const defaultProductionCost = subtotalSeed + subtotalNutrition + subtotalStructure + subtotalIrrigation;

  // Estado editable para el Gasto de Producción ingresado manualmente por el usuario
  const [productionCost, setProductionCost] = useState<number>(defaultProductionCost);

  // Materiales Físicos de Cubierta y Tutorado (Capex Materiales 1.000 m²)
  const costMesh4Rolls = 560 * 4; // 4 rollos de Malla 50 Mesh 130 gsm ($560 USD c/u en efectivo = $2.240 USD)
  const costTrellisHortomalla = 380; // 500m Hortomalla 15x15 cm soporte cajón + alambres Cal 12-14
  const structuralCapex = costMesh4Rolls + costTrellisHortomalla; // $2.620 USD

  // Deducciones Totales en el 1er Ciclo (Reactivación + Producción)
  const effectiveProductionCost = Number.isNaN(productionCost) ? 0 : productionCost;
  const totalDeductions = structuralCapex + effectiveProductionCost;

  // Proyecciones económicas
  const grossRevenue = targetYieldKg * sellingPricePerKg;
  const netProfit = grossRevenue - totalDeductions;
  const roiPct = totalDeductions > 0 ? (netProfit / totalDeductions) * 100 : 0;
  const numCestas = Math.round(targetYieldKg / 20);
  const costPerKg = targetYieldKg > 0 ? totalDeductions / targetYieldKg : 0;
  const costPerCesta = costPerKg * 20;

  // Margen operativo a partir del 2do ciclo en adelante (Malla, estructura, tanques y pintura ya amortizados)
  const recurringOpex = subtotalSeed + subtotalNutrition; // $3.800 USD recurrente
  const netProfit2ndCycle = grossRevenue - recurringOpex;
  const roi2ndCycle = recurringOpex > 0 ? (netProfit2ndCycle / recurringOpex) * 100 : 0;

  // Escenarios predefinidos de mercado
  const setMarketScenario = (pricePerCesta: number) => {
    setSellingPricePerKg(pricePerCesta / 20);
  };

  const resetToDefaultProductionCost = () => {
    setProductionCost(defaultProductionCost);
  };

  // Porcentajes para la barra de distribución del ingreso
  const pctOpex = grossRevenue > 0 ? Math.min(100, (effectiveProductionCost / grossRevenue) * 100) : 0;
  const pctCapex = grossRevenue > 0 ? Math.min(100 - pctOpex, (structuralCapex / grossRevenue) * 100) : 0;
  const pctNetProfit = grossRevenue > 0 ? Math.max(0, 100 - pctOpex - pctCapex) : 0;

  const waMessage = encodeURIComponent(
    `Hola Agrovenecua, coticé la Reactivación Llave en Mano de Pimentón Grande con Semilla Magistral F1 (2.500 plantas / 1.000 m²):\n` +
    `• Duración del Ciclo: 20 Semanas (140 días / 5 meses)\n` +
    `• Precio de Venta: $${sellingPricePerKg.toFixed(2)} USD/kg ($${(sellingPricePerKg * 20).toFixed(1)}/cesta)\n` +
    `• Meta Cosecha Magistral F1: ${targetYieldKg.toLocaleString()} kg (${numCestas} cestas · ${(targetYieldKg / 2500).toFixed(2)} kg/pl)\n` +
    `• Gasto Producción y Adecuación (15 rubros): $${effectiveProductionCost.toLocaleString()} USD\n` +
    `• Cubierta Malla de 130 gsm 50 mesh (4 rollos @ $560 efectivo) + Hortomalla: $${structuralCapex.toLocaleString()} USD\n` +
    `• Deducción Total 1er Ciclo: $${totalDeductions.toLocaleString()} USD\n` +
    `• Ingreso Bruto: $${grossRevenue.toLocaleString()} USD\n` +
    `• Utilidad Neta Libre (1er Ciclo): $${netProfit.toLocaleString()} USD (+${roiPct.toFixed(0)}% ROI)\n` +
    `• Utilidad Proyectada 2do Ciclo en adelante: $${netProfit2ndCycle.toLocaleString()} USD/ciclo (+${roi2ndCycle.toFixed(0)}% ROI)\n` +
    `Deseo coordinar la visita técnica y ejecución del proyecto.`
  );

  return (
    <section id="calculadora-reactivacion" className="py-5 py-lg-6 section-agro-white">
      <div className="container-xl">
        {/* Cabecera Principal de la Sección */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <span className="section-kicker mb-2">
            <span className="material-symbols-outlined ms-sm">calculate</span>
            MÓDULO 05 · CALCULADORA FINANCIERA &amp; RENTABILIDAD EN VIVO
          </span>
          <h2 className="display-6 fw-bold text-dark mb-2">
            Calculadora de Inversión y Rentabilidad en Pimentón (2.500 Plantas)
          </h2>
          <p className="text-secondary small mb-3">
            Simula en tiempo real la viabilidad financiera de tu nave de 1.000 m². Deduce de forma transparente el gasto de producción (15 rubros) y la reactivación física con Malla de 130 gsm 50 mesh.
          </p>

          {/* Selector de Escenarios Rápidos de Mercado */}
          <div className="d-inline-flex flex-wrap align-items-center justify-content-center gap-2 p-1.5 bg-light rounded-pill border border-secondary-subtle">
            <span className="text-secondary text-2xs fw-bold text-uppercase px-2 font-monospace">
              Precios Quíbor:
            </span>
            <button
              type="button"
              onClick={() => setMarketScenario(11)}
              className={`btn btn-sm rounded-pill font-monospace text-xs py-1 px-3 border-0 transition-all ${
                Math.abs(sellingPricePerKg * 20 - 11) < 0.2
                  ? 'bg-warning text-dark fw-bold shadow-xs'
                  : 'bg-transparent text-secondary'
              }`}
            >
              Conservador ($11 / Cesta)
            </button>
            <button
              type="button"
              onClick={() => setMarketScenario(14)}
              className={`btn btn-sm rounded-pill font-monospace text-xs py-1 px-3 border-0 transition-all ${
                Math.abs(sellingPricePerKg * 20 - 14) < 0.2
                  ? 'bg-success text-white fw-bold shadow-xs'
                  : 'bg-transparent text-secondary'
              }`}
            >
              Actual ($14 / Cesta · Magistral F1)
            </button>
            <button
              type="button"
              onClick={() => setMarketScenario(16)}
              className={`btn btn-sm rounded-pill font-monospace text-xs py-1 px-3 border-0 transition-all ${
                Math.abs(sellingPricePerKg * 20 - 16) < 0.2
                  ? 'bg-info text-white fw-bold shadow-xs'
                  : 'bg-transparent text-secondary'
              }`}
            >
              Óptimo ($16 / Cesta)
            </button>
          </div>
        </div>

        {/* 1. KPIs Ejecutivos Principales (Escaneo Visual en 3 Segundos) */}
        <div className="row g-3 mb-4">
          {/* KPI 1: Inversión Inicial */}
          <div className="col-12 col-md-4">
            <div className="card card-agro p-3 p-lg-4 h-100 shadow-sm border-secondary-subtle">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-secondary text-xs fw-bold text-uppercase font-sans d-flex align-items-center gap-1">
                  <span className="material-symbols-outlined text-danger ms-sm">payments</span>
                  <span>Inversión Inicial Total</span>
                </span>
                <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill font-monospace text-2xs">
                  1er Ciclo
                </span>
              </div>
              <div className="display-6 fw-bold font-mono text-dark lh-1 mb-1">
                ${totalDeductions.toLocaleString()} <span className="fs-6 text-secondary font-sans fw-normal">USD</span>
              </div>
              <div className="text-secondary text-xs font-sans">
                Coste unitario: <strong className="text-dark font-mono">${costPerCesta.toFixed(1)} USD/cesta</strong> (${costPerKg.toFixed(2)}/kg)
              </div>
              <div className="mt-2 pt-2 border-top border-secondary-subtle text-2xs text-secondary d-flex justify-content-between font-monospace">
                <span>Operativo: ${effectiveProductionCost.toLocaleString()}</span>
                <span>Malla 130 gsm 50 mesh: ${structuralCapex.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* KPI 2: Ingreso Bruto */}
          <div className="col-12 col-md-4">
            <div className="card card-agro p-3 p-lg-4 h-100 shadow-sm border-secondary-subtle">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-secondary text-xs fw-bold text-uppercase font-sans d-flex align-items-center gap-1">
                  <span className="material-symbols-outlined text-success ms-sm">trending_up</span>
                  <span>Ingreso Bruto de Venta</span>
                </span>
                <span className="badge bg-success bg-opacity-10 text-success rounded-pill font-monospace text-2xs">
                  650 Cestas
                </span>
              </div>
              <div className="display-6 fw-bold font-mono text-dark lh-1 mb-1">
                ${grossRevenue.toLocaleString()} <span className="fs-6 text-secondary font-sans fw-normal">USD</span>
              </div>
              <div className="text-secondary text-xs font-sans">
                Liquidación: <strong className="text-success font-mono">${(sellingPricePerKg * 20).toFixed(1)} USD / cesta</strong> (100% Cesta Grande)
              </div>
              <div className="mt-2 pt-2 border-top border-secondary-subtle text-2xs text-secondary d-flex justify-content-between font-monospace">
                <span>13.000 kg</span>
                <span className="text-success fw-bold">88% Grande · 0% Maraña</span>
              </div>
            </div>
          </div>

          {/* KPI 3: Ganancia Neta Libre */}
          <div className="col-12 col-md-4">
            <div className={`card card-agro p-3 p-lg-4 h-100 shadow-sm border-2 ${
              netProfit >= 0 ? 'border-success bg-agro-success-soft' : 'border-danger bg-agro-danger-soft'
            }`}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-success text-xs fw-bold text-uppercase font-sans d-flex align-items-center gap-1">
                  <span className="material-symbols-outlined text-success ms-sm">savings</span>
                  <span>Utilidad Neta Libre (1er Ciclo)</span>
                </span>
                <span className={`badge rounded-pill font-monospace text-2xs ${
                  netProfit >= 0 ? 'bg-success text-white' : 'bg-danger text-white'
                }`}>
                  +{roiPct.toFixed(0)}% ROI
                </span>
              </div>
              <div className={`display-6 fw-bold font-mono lh-1 mb-1 ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                ${netProfit.toLocaleString()} <span className="fs-6 text-secondary font-sans fw-normal">USD</span>
              </div>
              <div className="text-secondary text-xs font-sans">
                Margen libre absorbiendo el 100% de la malla, pintura, tanques e insumos.
              </div>
              <div className="mt-2 pt-2 border-top border-success border-opacity-25 text-2xs text-dark font-sans d-flex justify-content-between align-items-center">
                <span>A partir del 2do Ciclo:</span>
                <strong className="text-success font-mono fs-6">+${netProfit2ndCycle.toLocaleString()} USD / ciclo</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Barra de Flujo del Dinero (Waterflow Visual de Reparto del Ingreso) */}
        <div className="card card-agro p-3 p-md-4 mb-4 shadow-sm border-secondary-subtle bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-2">
            <div className="d-flex align-items-center gap-1.5">
              <span className="material-symbols-outlined text-success ms-sm">donut_large</span>
              <span className="fw-bold text-dark text-sm">¿Cómo se Distribuye Cada Dólar de la Cosecha (${grossRevenue.toLocaleString()} USD)?</span>
            </div>
            <div className="text-xs text-secondary font-monospace">
              Meta: 13.000 kg @ ${(sellingPricePerKg * 20).toFixed(1)}/cesta
            </div>
          </div>

          {/* Barra segmentada */}
          <div className="progress" style={{ height: '24px', borderRadius: '12px' }}>
            <div
              className="progress-bar bg-secondary"
              role="progressbar"
              style={{ width: `${pctOpex}%` }}
              title={`Gasto Producción: $${effectiveProductionCost.toLocaleString()} USD (${pctOpex.toFixed(1)}%)`}
            >
              <span className="font-monospace text-2xs text-nowrap px-2">Gasto Prod. {pctOpex.toFixed(0)}%</span>
            </div>
            <div
              className="progress-bar bg-info"
              role="progressbar"
              style={{ width: `${pctCapex}%` }}
              title={`Cubierta & Malla de 130 gsm 50 mesh: $${structuralCapex.toLocaleString()} USD (${pctCapex.toFixed(1)}%)`}
            >
              <span className="font-monospace text-2xs text-nowrap px-2">Malla 130 gsm 50 mesh {pctCapex.toFixed(0)}%</span>
            </div>
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${pctNetProfit}%` }}
              title={`Utilidad Neta Libre: $${netProfit.toLocaleString()} USD (${pctNetProfit.toFixed(1)}%)`}
            >
              <span className="font-monospace text-2xs fw-bold text-nowrap px-2">Ganancia Libre {pctNetProfit.toFixed(0)}%</span>
            </div>
          </div>

          {/* Leyenda de la barra */}
          <div className="row g-2 text-xs text-secondary mt-2 pt-1 border-top border-secondary-subtle font-sans">
            <div className="col-12 col-md-4 d-flex align-items-center gap-2">
              <span className="badge rounded-circle p-1 bg-secondary"> </span>
              <span><strong>Gasto Producción:</strong> ${effectiveProductionCost.toLocaleString()} USD ({pctOpex.toFixed(1)}%)</span>
            </div>
            <div className="col-12 col-md-4 d-flex align-items-center gap-2">
              <span className="badge rounded-circle p-1 bg-info"> </span>
              <span><strong>Malla de 130 gsm 50 mesh &amp; Hortomalla:</strong> ${structuralCapex.toLocaleString()} USD ({pctCapex.toFixed(1)}%)</span>
            </div>
            <div className="col-12 col-md-4 d-flex align-items-center gap-2">
              <span className="badge rounded-circle p-1 bg-success"> </span>
              <span><strong className="text-success">Ganancia Neta en Bolsillo:</strong> +${netProfit.toLocaleString()} USD ({pctNetProfit.toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        {/* 3. Cronograma Fenológico Plegable (Duración de 20 Semanas) */}
        <div className="card card-agro p-3 p-md-4 mb-4 shadow-sm border-success border-opacity-25 bg-white">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-success ms-md">schedule</span>
              <div>
                <h3 className="fs-6 fw-bold text-dark mb-0">
                  Duración Total del Ciclo: <span className="text-success font-mono">20 Semanas</span> <span className="text-secondary fw-normal fs-7 font-sans">(140 Días · ~5.0 Meses)</span>
                </h3>
                <span className="text-secondary text-xs">
                  Payback estimado en la <strong>Semana 15</strong> con los primeros cortes de pimentón grande.
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace px-3 py-1.5 text-xs">
                2.4 Ciclos / Año
              </span>
              <button
                type="button"
                onClick={() => setShowTimelineDetails(!showTimelineDetails)}
                className="btn btn-outline-secondary btn-sm rounded-pill text-xs d-flex align-items-center gap-1"
              >
                <span>{showTimelineDetails ? 'Ocultar Fases' : 'Ver 3 Fases'}</span>
                <span className="material-symbols-outlined ms-sm">
                  {showTimelineDetails ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>
          </div>

          {/* Stepper detallado colapsable */}
          {showTimelineDetails && (
            <div className="row g-3 text-xs mt-3 pt-3 border-top border-secondary-subtle">
              <div className="col-12 col-md-4">
                <div className="p-3 bg-light rounded-3 border border-secondary-subtle h-100">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="badge bg-success bg-opacity-10 text-success fw-bold">Fase 1: Semanas 1 a 6</span>
                    <span className="text-secondary font-mono">40 Días</span>
                  </div>
                  <div className="fw-bold text-dark mb-1">Trasplante &amp; Crecimiento Vegetativo</div>
                  <div className="text-secondary">Enraizamiento profundo, primeras bifurcaciones en "Y" y encause dentro de la malla espaldera Hortomalla.</div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="p-3 bg-light rounded-3 border border-secondary-subtle h-100">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="badge bg-warning bg-opacity-10 text-warning fw-bold">Fase 2: Semanas 7 a 9</span>
                    <span className="text-secondary font-mono">20 Días</span>
                  </div>
                  <div className="fw-bold text-dark mb-1">Floración &amp; Cuajado Masivo</div>
                  <div className="text-secondary">Dosis de Boro y Calcio soluble AIFA para garantizar cuajado de frutos de 4 lóbulos y erradicar necrosis apical.</div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="p-3 bg-light rounded-3 border border-secondary-subtle h-100">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="badge bg-info bg-opacity-10 text-info fw-bold">Fase 3: Semanas 10 a 20</span>
                    <span className="text-secondary font-mono">80 Días (11 sem)</span>
                  </div>
                  <div className="fw-bold text-dark mb-1">Cosecha Escalonada Continua</div>
                  <div className="text-secondary">Cortes semanales ininterrumpidos de pimentón grande Magistral F1 hasta totalizar las 13.0 Toneladas (650 cestas).</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Módulo Interactivo de 2 Columnas (Controles vs Resultados) */}
        <div className="row g-4 align-items-start">
          {/* Columna Izquierda: Parámetros y Presupuesto por Categorías */}
          <div className="col-12 col-lg-6">
            <div className="card card-agro p-4 shadow-sm border-secondary-subtle h-100">
              {/* Sección 4.1: Controles de Mercado */}
              <div className="mb-4 pb-3 border-bottom border-secondary-subtle">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h3 className="fs-5 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-success ms-md">tune</span>
                    <span>Variables de Mercado (Ajustables)</span>
                  </h3>
                  <span className="badge bg-light text-secondary border border-secondary-subtle font-monospace text-2xs">
                    2.500 Plantas
                  </span>
                </div>

                <Slider
                  label="Precio de Venta Cesta Grande (Primera):"
                  value={sellingPricePerKg}
                  min={0.50}
                  max={1.50}
                  step={0.05}
                  formatValue={(v) => `$${v.toFixed(2)} USD / kg ($${(v * 20).toFixed(1)} USD / cesta)`}
                  accentColor="success"
                  iconName="sell"
                  onChange={setSellingPricePerKg}
                />
                <div className="text-2xs text-secondary mt-n2 mb-3 font-sans">
                  *Referencia Quíbor: <strong>Grande ($14 USD)</strong>, <strong>Mediana ($8 USD)</strong>, <strong>Maraña ($3.5 USD)</strong>. Con semilla Magistral y AIFA se proyecta 88% Grande y 0% Maraña.
                </div>

                <Slider
                  label="Meta de Cosecha Total (kg):"
                  value={targetYieldKg}
                  min={9000}
                  max={15000}
                  step={500}
                  formatValue={(v) => `${v.toLocaleString()} kg (${Math.round(v / 20)} cestas · ${(v / 2500).toFixed(2)} kg/planta)`}
                  accentColor="info"
                  iconName="agriculture"
                  onChange={setTargetYieldKg}
                />
              </div>

              {/* Sección 4.2: Campo Editable para el Gasto de Producción */}
              <div className="mb-4 pb-3 border-bottom border-secondary-subtle">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label htmlFor="productionCostInput" className="fw-bold text-dark text-xs text-uppercase d-flex align-items-center gap-1 mb-0">
                    <span className="material-symbols-outlined text-success ms-sm">edit_note</span>
                    <span>Gasto de Producción y Adecuación:</span>
                  </label>
                  <button
                    type="button"
                    onClick={resetToDefaultProductionCost}
                    className="btn btn-outline-secondary btn-sm py-0.5 px-2.5 text-xs rounded-pill font-monospace"
                    title="Restablecer al valor técnico calculado ($4.755 USD)"
                  >
                    Restablecer (${defaultProductionCost.toLocaleString()})
                  </button>
                </div>

                <div className="input-group mb-2">
                  <span className="input-group-text bg-light text-dark fw-bold font-mono">$</span>
                  <input
                    id="productionCostInput"
                    type="number"
                    min="0"
                    max="15000"
                    step="50"
                    value={Number.isNaN(productionCost) ? '' : productionCost}
                    onChange={(e) => setProductionCost(parseFloat(e.target.value) || 0)}
                    className="form-control font-mono fw-bold text-dark fs-6"
                    placeholder="4755"
                  />
                  <span className="input-group-text bg-light text-secondary small">USD / ciclo</span>
                </div>
                <div className="text-2xs text-secondary font-sans">
                  Puedes modificar este monto manualmente si posees inventario propio de insumos o mano de obra familiar.
                </div>
              </div>

              {/* Sección 4.3: Explorador Temático de Rubros (Agri-UX Tabs) */}
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold text-dark text-xs text-uppercase d-flex align-items-center gap-1">
                    <span className="material-symbols-outlined text-success ms-sm">list_alt</span>
                    <span>Desglose por Centro de Costos:</span>
                  </span>
                  <span className="text-secondary text-2xs font-monospace">15 Rubros + Cubierta</span>
                </div>

                {/* Pestañas de Filtro Rápido */}
                <div className="d-flex flex-wrap gap-1 mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className={`btn btn-sm rounded-pill text-2xs py-1 px-2.5 font-sans border-0 ${
                      activeCategory === 'all' ? 'btn-dark text-white fw-bold' : 'btn-light text-secondary'
                    }`}
                  >
                    Todos (15)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('seed')}
                    className={`btn btn-sm rounded-pill text-2xs py-1 px-2.5 font-sans border-0 ${
                      activeCategory === 'seed' ? 'btn-success text-white fw-bold' : 'btn-light text-secondary'
                    }`}
                  >
                    🌿 Siembra (${subtotalSeed})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('nutrition')}
                    className={`btn btn-sm rounded-pill text-2xs py-1 px-2.5 font-sans border-0 ${
                      activeCategory === 'nutrition' ? 'btn-success text-white fw-bold' : 'btn-light text-secondary'
                    }`}
                  >
                    💧 Nutrición (${subtotalNutrition})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('structure')}
                    className={`btn btn-sm rounded-pill text-2xs py-1 px-2.5 font-sans border-0 ${
                      activeCategory === 'structure' ? 'btn-success text-white fw-bold' : 'btn-light text-secondary'
                    }`}
                  >
                    🏗️ Estructura (${subtotalStructure})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('irrigation')}
                    className={`btn btn-sm rounded-pill text-2xs py-1 px-2.5 font-sans border-0 ${
                      activeCategory === 'irrigation' ? 'btn-success text-white fw-bold' : 'btn-light text-secondary'
                    }`}
                  >
                    🚿 Riego (${subtotalIrrigation})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('mesh')}
                    className={`btn btn-sm rounded-pill text-2xs py-1 px-2.5 font-sans border-0 ${
                      activeCategory === 'mesh' ? 'btn-info text-white fw-bold' : 'btn-light text-secondary'
                    }`}
                  >
                    🛡️ Malla de 130 gsm 50 mesh (${structuralCapex})
                  </button>
                </div>

                {/* Lista de Ítems según Categoría */}
                <div className="bg-light p-3 rounded-3 border border-secondary-subtle font-monospace text-xs text-secondary">
                  {/* Categoría 1: Semillero & Siembra */}
                  {(activeCategory === 'all' || activeCategory === 'seed') && (
                    <div className="mb-3">
                      <div className="fw-bold text-dark font-sans mb-1 pb-0.5 border-bottom border-secondary-subtle d-flex justify-content-between align-items-center">
                        <span className="d-flex align-items-center gap-1">
                          <span className="material-symbols-outlined text-success ms-sm">psychiatry</span>
                          <span>1. Semillero, Labranza &amp; Siembra</span>
                        </span>
                        <span className="text-dark font-mono">${subtotalSeed} USD</span>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                        <span className="text-truncate">• Semilla Magistral F1 (3 sobres 1.000 sem):</span>
                        <strong className="text-dark font-mono ms-2">${costSeedMagistral} USD</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                        <span className="text-truncate">• Germinación en bandejas 128 + Peat Moss:</span>
                        <strong className="text-dark font-mono ms-2">${costGermination} USD</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                        <span className="text-truncate">• Preparación tierra (rastra + camellones):</span>
                        <strong className="text-dark font-mono ms-2">${costLandPrep} USD</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-truncate">• Mano de obra siembra (2.500 plantas):</span>
                        <strong className="text-dark font-mono ms-2">${costTransplantLabor} USD</strong>
                      </div>
                    </div>
                  )}

                  {/* Categoría 2: Nutrición, Agua & Protección */}
                  {(activeCategory === 'all' || activeCategory === 'nutrition') && (
                    <div className="mb-3">
                      <div className="fw-bold text-dark font-sans mb-1 pb-0.5 border-bottom border-secondary-subtle d-flex justify-content-between align-items-center">
                        <span className="d-flex align-items-center gap-1">
                          <span className="material-symbols-outlined text-success ms-sm">science</span>
                          <span>2. Nutrición, Agua &amp; Protección Fitosanitaria</span>
                        </span>
                        <span className="text-dark font-mono">${subtotalNutrition} USD</span>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                        <span className="text-truncate">• Abonos AIFA solubles (20 sem · Tanques A y B):</span>
                        <strong className="text-dark font-mono ms-2">${costFertilizerAifa} USD</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                        <span className="text-truncate">• Regulador pH (Ácido Nítrico 60% 224L):</span>
                        <strong className="text-dark font-mono ms-2">${costPhRegulator} USD</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                        <span className="text-truncate">• Venenos para plagas y hongos (Plan Fito):</span>
                        <strong className="text-dark font-mono ms-2">${costPesticidesFungicides} USD</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-truncate">• Cisternas agua ($20/viaje × 40 viajes):</span>
                        <strong className="text-dark font-mono ms-2">${costWaterCisterns} USD</strong>
                      </div>
                    </div>
                  )}

                  {/* Categoría 3: Reacondicionamiento Estructural */}
                  {(activeCategory === 'all' || activeCategory === 'structure') && (
                    <div className="mb-3">
                      <div className="fw-bold text-dark font-sans mb-1 pb-0.5 border-bottom border-secondary-subtle d-flex justify-content-between align-items-center">
                        <span className="d-flex align-items-center gap-1">
                          <span className="material-symbols-outlined text-success ms-sm">format_paint</span>
                          <span>3. Reacondicionamiento Estructural Sch 40</span>
                        </span>
                        <span className="text-dark font-mono">${subtotalStructure} USD</span>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                        <span className="text-truncate">• Fondo blanco anticorrosivo (1 cuñete):</span>
                        <strong className="text-dark font-mono ms-2">${costPaintWhitePrimer} USD</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                        <span className="text-truncate">• Mano de obra pintar estructura metálica:</span>
                        <strong className="text-dark font-mono ms-2">${costPaintLabor} USD</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-truncate">• Mano de obra colocar Malla de 130 gsm 50 mesh:</span>
                        <strong className="text-dark font-mono ms-2">${costMeshInstallLabor} USD</strong>
                      </div>
                    </div>
                  )}

                  {/* Categoría 4: Sistema de Riego */}
                  {(activeCategory === 'all' || activeCategory === 'irrigation') && (
                    <div className="mb-3">
                      <div className="fw-bold text-dark font-sans mb-1 pb-0.5 border-bottom border-secondary-subtle d-flex justify-content-between align-items-center">
                        <span className="d-flex align-items-center gap-1">
                          <span className="material-symbols-outlined text-success ms-sm">water_drop</span>
                          <span>4. Sistema de Riego &amp; 3 Tanques</span>
                        </span>
                        <span className="text-dark font-mono">${subtotalIrrigation} USD</span>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                        <span className="text-truncate">• Manguera matriz PEAD conexión cinta:</span>
                        <strong className="text-dark font-mono ms-2">${costDripMainHose} USD</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                        <span className="text-truncate">• Cinta de goteo rollo 2.500 pl a 40cm (1.000m):</span>
                        <strong className="text-dark font-mono ms-2">${costDripTapeRoll} USD</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                        <span className="text-truncate">• Conectores iniciales con válvula y gomas:</span>
                        <strong className="text-dark font-mono ms-2">${costDripInitialConnectors} USD</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-truncate">• 3 tanques agua para fertirriego (A, B, C):</span>
                        <strong className="text-dark font-mono ms-2">${cost3FertigationTanks} USD</strong>
                      </div>
                    </div>
                  )}

                  {/* Categoría 5: Cubierta Malla de 130 gsm 50 mesh & Tutorado */}
                  {(activeCategory === 'all' || activeCategory === 'mesh') && (
                    <div>
                      <div className="fw-bold text-dark font-sans mb-1 pb-0.5 border-bottom border-secondary-subtle d-flex justify-content-between align-items-center">
                        <span className="d-flex align-items-center gap-1">
                          <span className="material-symbols-outlined text-info ms-sm">shield</span>
                          <span>5. Cubierta Malla de 130 gsm 50 mesh &amp; Hortomalla</span>
                        </span>
                        <span className="text-info font-mono">${structuralCapex} USD</span>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                        <span className="text-truncate">• Malla de 130 gsm 50 mesh (4 rollos @ $560 efectivo):</span>
                        <strong className="text-dark font-mono ms-2">${costMesh4Rolls.toLocaleString()} USD</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-truncate">• Hortomalla 15×15 cm (500m) + alambres Cal 12-14:</span>
                        <strong className="text-dark font-mono ms-2">${costTrellisHortomalla} USD</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Balance de Rentabilidad y Retorno por Ciclos */}
          <div className="col-12 col-lg-6">
            <div className="card card-agro border-success border-opacity-50 p-4 shadow-sm h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace">
                    Balance Financiero Consolidado
                  </span>
                  <span className="badge bg-light text-dark border border-secondary-subtle font-monospace">
                    20 Semanas
                  </span>
                </div>

                {/* Desglose Matemático de Liquidación */}
                <div className="p-3.5 bg-light rounded-3 border border-secondary-subtle font-monospace text-xs text-secondary mb-3">
                  <div className="d-flex justify-content-between py-1.5 border-bottom border-secondary-subtle">
                    <span>(+) Ingreso Bruto de Cosecha ({targetYieldKg.toLocaleString()} kg @ ${(sellingPricePerKg * 20).toFixed(1)}/cesta):</span>
                    <strong className="text-dark font-mono fs-6">+${grossRevenue.toLocaleString()} USD</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1.5 border-bottom border-secondary-subtle text-danger">
                    <span>(-) Gasto de Producción y Adecuación (15 rubros):</span>
                    <strong className="font-mono fs-6">-${effectiveProductionCost.toLocaleString()} USD</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1.5 border-bottom border-secondary-subtle text-danger">
                    <span>(-) Malla de 130 gsm 50 mesh ($2.240) + Hortomalla ($380):</span>
                    <strong className="font-mono fs-6">-${structuralCapex.toLocaleString()} USD</strong>
                  </div>
                  <div className="d-flex justify-content-between pt-2 text-dark font-sans fw-bold">
                    <span>(=) Margen Agrícola Pre-Cubierta:</span>
                    <span className="text-info font-mono fs-6">+${(grossRevenue - effectiveProductionCost).toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Comparativa Cara a Cara: 1er Ciclo vs 2do Ciclo */}
                <div className="card border border-success border-opacity-25 p-3 rounded-3 mb-3 bg-white">
                  <div className="text-xs fw-bold text-dark font-sans text-uppercase mb-2 d-flex align-items-center gap-1">
                    <span className="material-symbols-outlined text-success ms-sm">compare_arrows</span>
                    <span>Evolución de Rentabilidad por Ciclo:</span>
                  </div>

                  <div className="row g-2 text-xs">
                    {/* Tarjeta 1er Ciclo */}
                    <div className="col-6">
                      <div className="p-2.5 bg-light rounded-2 border border-secondary-subtle h-100">
                        <div className="text-secondary text-2xs text-uppercase font-bold">1er Ciclo (Reactivación)</div>
                        <div className="fs-5 fw-bold font-mono text-success my-0.5">
                          +${netProfit.toLocaleString()} <span className="fs-7 text-secondary">USD</span>
                        </div>
                        <div className="badge bg-success bg-opacity-15 text-success rounded-pill font-mono text-2xs mb-1">
                          +{roiPct.toFixed(0)}% ROI
                        </div>
                        <div className="text-secondary text-2xs font-sans">
                          Absorbe 100% de la malla, pintura, tanques e insumos.
                        </div>
                      </div>
                    </div>

                    {/* Tarjeta 2do Ciclo en adelante */}
                    <div className="col-6">
                      <div className="p-2.5 bg-agro-success-soft rounded-2 border border-success border-opacity-50 h-100">
                        <div className="text-success text-2xs text-uppercase font-bold">2do Ciclo en Adelante</div>
                        <div className="fs-5 fw-bold font-mono text-success my-0.5">
                          +${netProfit2ndCycle.toLocaleString()} <span className="fs-7 text-secondary">USD</span>
                        </div>
                        <div className="badge bg-success text-white rounded-pill font-mono text-2xs mb-1">
                          +{roi2ndCycle.toFixed(0)}% ROI
                        </div>
                        <div className="text-secondary text-2xs font-sans">
                          Sin volver a comprar malla ni tanques ni pintar.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumen Final de Garantía y Recuperación */}
                <div className="p-3 bg-light rounded-3 border border-secondary-subtle text-xs text-secondary mb-3 font-sans">
                  <div className="d-flex align-items-start gap-2">
                    <span className="material-symbols-outlined text-success ms-sm mt-0.5">verified</span>
                    <div>
                      <strong className="text-dark">Amortización Segura:</strong> Los 4 rollos de Malla de 130 gsm 50 mesh ($2.240 USD) y el sistema de tutorado quedan completamente pagados en el primer corte. A partir del segundo ciclo, el costo de producción baja a <strong>$3.800 USD</strong>, triplicando el margen líquido en el bolsillo del productor.
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón CTA a WhatsApp */}
              <div>
                <a
                  href={`https://wa.me/584120000000?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success btn-lg w-100 rounded-pill fw-bold py-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined ms-sm">chat</span>
                  <span>Contactar Asesor Agronómico vía WhatsApp</span>
                </a>
                <div className="text-center text-secondary text-xs mt-2 font-sans">
                  *Cálculo técnico para 2.500 plantas en Finca La Cigarronera (Valle de Quíbor, 700 msnm) bajo protocolo FAO-56.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentCalculatorSection;
