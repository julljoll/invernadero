/**
 * AGENTE ESPECIALISTA EN INVERNADEROS — LA CIGARRONERA (VALLE DE QUÍBOR)
 * Lógica de cálculo bioclimático, extractores eólicos, FAO-56 y visualizador Canvas
 * Versión: 2.0.0
 */

// ==========================================================================
// 0. CONFIGURACIÓN CENTRALIZADA Y CONSTANTES BIOCLIMÁTICAS DE QUÍBOR
// ==========================================================================
const CONFIG = Object.freeze({
  VERSION: "2.0.0",
  PROJECT_NAME: "LA CIGARRONERA",
  LOCATION: {
    name: "Valle de Quíbor",
    municipio: "Jiménez",
    estado: "Lara",
    pais: "Venezuela",
    lat: 9.888889,
    lng: -69.593056,
    cotaMsnm: 700,
    koppen: "BSh (Semiárido cálido / Bosque seco premontano)"
  },
  WIND: {
    dominantDirection: "ESTE",
    dominantFrequency: 0.88,
    designGustKmH: 27.0,
    safetyFactor: 1.5,
    hellmannAlpha: 0.16
  },
  GREENHOUSE: {
    defaultSurfaceM2: 1000,
    lengthM: 50.0,
    widthM: 20.0,
    minHeightGutterM: 3.0,
    optRidgeHeightM: 3.0,
    trellisHeightM: 2.0,
    pillarSpacingXM: 4.0,
    pillarSpacingZM: 2.94,
    totalPillarsDefault: 108,
    densityPlantM2: 2.2,
    totalPlantsDefault: 2200
  },
  MESH: {
    spec: "110 gsm, 50 mesh (50×25 hilos/pulgada) HDPE monofilamento virgen, Color Blanco",
    color: "Blanco / Cristal",
    weightGsm: 110,
    meshCount: "50 mesh (50×25)",
    benefits: "Máxima circulación convectiva de aire y difusión/opacidad solar reflectiva anti-sobrecalentamiento (>31.5 °C)",
    maxPoreMicrons: 192,
    pestExclusion: ["Bemisia tabaci", "Frankliniella occidentalis", "Myzus persicae", "Liriomyza spp.", "Tuta absoluta"]
  },
  AQUIFER: {
    transmissivityT: 180.0, // m²/día
    storativityS: 0.0025,
    conductivityK: 22.0,   // m/día
    influenceRadiusR0: 260.0 // m
  },
  CROPS: {
    tomato: {
      name: "Tomate Indeterminado",
      ecThreshold: 2.5,
      slopePercentPerDs: 9.9
    },
    pepper: {
      name: "Pimentón",
      ecThreshold: 1.5,
      slopePercentPerDs: 14.0
    }
  }
});
window.AGRO_CONFIG = CONFIG;


// ==========================================================================
// 1. BASE DE DATOS METEOROLÓGICA (RECONSTRUCCIÓN NASA MERRA-2 & POWER)
//    Geolocalización: 9°53'20.0"N, 69°35'35.0"W | Cota: 707 msnm | Valle de Quíbor
// ==========================================================================

// Línea base climatológica mensual (20 años 2001-2020 reanálisis nativo NASA MERRA-2)
const QUIBOR_CLIMATE_BASE = [
  { mes: "Enero", max: 30.1, min: 16.0, tmed: 23.8, lluvia: 18.9, viento: 7.7, bochorno: 16.0, rh: 69.2, rad: 18.7, eto: 5.4, dir: "88% ESTE" },
  { mes: "Febrero", max: 30.8, min: 16.0, tmed: 24.6, lluvia: 10.1, viento: 8.5, bochorno: 14.5, rh: 63.9, rad: 20.2, eto: 5.8, dir: "85% ESTE" },
  { mes: "Marzo", max: 31.5, min: 16.0, tmed: 25.4, lluvia: 23.9, viento: 8.6, bochorno: 18.6, rh: 62.2, rad: 19.2, eto: 6.4, dir: "84% ESTE", picoCalor: true },
  { mes: "Abril", max: 30.6, min: 17.5, tmed: 25.6, lluvia: 61.8, viento: 8.5, bochorno: 22.6, rh: 67.7, rad: 16.7, eto: 6.2, dir: "80% ESTE" },
  { mes: "Mayo", max: 29.8, min: 18.4, tmed: 25.1, lluvia: 99.8, viento: 8.8, bochorno: 28.1, rh: 73.8, rad: 16.5, eto: 5.6, dir: "78% ESTE", maxLluvia: true },
  { mes: "Junio", max: 28.6, min: 18.0, tmed: 24.2, lluvia: 99.0, viento: 9.5, bochorno: 27.6, rh: 77.9, rad: 16.2, eto: 5.2, dir: "82% ESTE", maxViento: true },
  { mes: "Julio", max: 28.2, min: 17.5, tmed: 23.8, lluvia: 99.8, viento: 9.1, bochorno: 28.0, rh: 79.5, rad: 17.2, eto: 4.8, dir: "85% ESTE", masFresco: true },
  { mes: "Agosto", max: 28.5, min: 17.9, tmed: 24.0, lluvia: 95.2, viento: 9.0, bochorno: 28.6, rh: 80.1, rad: 18.2, eto: 5.1, dir: "86% ESTE", picoBochorno: true },
  { mes: "Septiembre", max: 29.2, min: 18.1, tmed: 24.2, lluvia: 82.8, viento: 8.2, bochorno: 27.6, rh: 79.1, rad: 18.7, eto: 5.3, dir: "53% SUR (Excepción)" },
  { mes: "Octubre", max: 29.4, min: 16.7, tmed: 24.0, lluvia: 98.3, viento: 6.7, bochorno: 28.5, rh: 80.3, rad: 17.6, eto: 5.2, dir: "79% ESTE" },
  { mes: "Noviembre", max: 29.2, min: 17.6, tmed: 23.9, lluvia: 72.0, viento: 6.2, bochorno: 26.4, rh: 80.3, rad: 16.5, eto: 4.9, dir: "84% ESTE", masCalmado: true },
  { mes: "Diciembre", max: 29.4, min: 15.9, tmed: 23.7, lluvia: 41.2, viento: 7.2, bochorno: 22.0, rh: 75.1, rad: 17.3, eto: 5.0, dir: "87% ESTE" }
];

// Compatibilidad retroactiva con llamadas heredadas
const QUIBOR_CLIMATE = QUIBOR_CLIMATE_BASE;

// Escenarios Multianuales (Observados 2024-2025 y Proyecciones 2026-2030 según ENSO y CMIP6 SSP2-4.5)
const QUIBOR_YEAR_SCENARIOS = {
  "2024": {
    year: 2024,
    label: "2024 (Observado NASA POWER — Super El Niño)",
    fase: "Super El Niño (Cálido y Seco)",
    tagClass: "tag-enso-warm",
    deltaT: 2.1,      // +2.1 °C anomalía observada en Quíbor por NASA POWER
    deltaRain: -25,   // -25% precipitación (sequía acentuada)
    windFactor: 1.06, // vientos alisios y ráfagas +6%
    desc: "Datos reales registrados por NASA POWER en Quíbor. Marcada por El Niño global: sequía extrema en el primer cuatrimestre y calor récord en marzo (Tmax observada 37.4 °C en horas pico)."
  },
  "2025": {
    year: 2025,
    label: "2025 (Observado — Transición a Fase Neutra)",
    fase: "Transición Neutra",
    tagClass: "tag-enso-neutral",
    deltaT: 0.5,      // +0.5 °C sobre histórica
    deltaRain: 5,     // +5% lluvia
    windFactor: 1.01,
    desc: "Disipación del evento El Niño y retorno a condiciones neutras en el Centro-Occidente venezolano. Recuperación paulatina de la lámina pluviométrica estacional."
  },
  "2026": {
    year: 2026,
    label: "2026 (Año en Curso — Línea Calibrada NASA MERRA-2)",
    fase: "Año en Curso — Fase Neutra Calibrada",
    tagClass: "tag-enso-neutral",
    deltaT: 0.4,      // Tendencia global sostenida (+0.4 °C sobre climatología 2001-2020)
    deltaRain: 0,
    windFactor: 1.00,
    desc: "Línea base representativa calibrada con reanálisis MERRA-2 y NASA POWER. Condiciones óptimas para producción protegida en invernadero parral de 1.000 m² a 3.00 m con técnica de espaldar."
  },
  "2027": {
    year: 2027,
    label: "2027 (Proyección — Ciclo La Niña / Lluvias Convectivas)",
    fase: "La Niña Convectiva (Húmedo)",
    tagClass: "tag-enso-cool",
    deltaT: -0.2,     // Días ligeramente más frescos por nubosidad, mayor bochorno nocturno
    deltaRain: 22,    // +22% lluvia
    windFactor: 1.08, // Ráfagas convectivas por tormentas
    desc: "Proyección de fase La Niña: incremento de precipitación (+22%), mayor número de días bochornosos y ráfagas convectivas vespertinas. Exige ventilación perimetral fluida."
  },
  "2028": {
    year: 2028,
    label: "2028 (Proyección — Ciclo El Niño / Estrés Térmico)",
    fase: "El Niño Cálido (Estrés Térmico)",
    tagClass: "tag-enso-warm",
    deltaT: 1.2,      // +1.2 °C
    deltaRain: -20,   // -20% lluvia
    windFactor: 1.04,
    desc: "Retorno del ciclo cálido tropical: temperaturas máximas en marzo rozando los 36-37 °C a cielo abierto. El colchón térmico de 1.00 m del parral a 3.00 m es vital contra el aborto floral."
  },
  "2029": {
    year: 2029,
    label: "2029 (Proyección — Fase Neutra-Cálida)",
    fase: "Neutra con Sesgo Cálido",
    tagClass: "tag-enso-neutral",
    deltaT: 0.8,
    deltaRain: -5,
    windFactor: 1.02,
    desc: "Condiciones climatológicas medias con forzamiento radiativo regional. Evapotranspiración ETo sostenida de 5.5 a 6.6 mm/día que exige fertirriego diario ininterrumpido."
  },
  "2030": {
    year: 2030,
    label: "2030 (Horizonte Decenal — Modelo CMIP6 SSP2-4.5)",
    fase: "Horizonte Decenal 2030 (SSP2-4.5)",
    tagClass: "tag-enso-warm",
    deltaT: 1.3,      // +1.3 °C calentamiento regional decenal
    deltaRain: -8,    // Leve reducción y mayor torrencialidad
    windFactor: 1.05, // Mayor energía cinética y ráfagas
    desc: "Horizonte 2030 según proyecciones CMIP6 (SSP2-4.5): incremento térmico sostenido de +1.3 °C, aumento del 6.8% en la demanda hídrica y necesidad de fertirriego de alta precisión."
  }
};

/**
 * Calcula dinámicamente las variables meteorológicas de Quíbor para un año y mes específicos.
 * @param {string} yearStr - Año a evaluar ("2024" al "2030")
 * @param {number} monthIdx - Índice del mes (0 a 11)
 * @returns {Object} Objeto con las métricas climáticas calculadas y anomalías
 */
function getCalculatedClimate(yearStr, monthIdx) {
  const scenario = QUIBOR_YEAR_SCENARIOS[yearStr] || QUIBOR_YEAR_SCENARIOS["2026"];
  const base = QUIBOR_CLIMATE_BASE[monthIdx] || QUIBOR_CLIMATE_BASE[2];

  const max = Math.round((base.max + scenario.deltaT) * 10) / 10;
  const min = Math.round((base.min + scenario.deltaT * 0.7) * 10) / 10;
  const tmed = Math.round((base.tmed + scenario.deltaT * 0.85) * 10) / 10;

  const viento = Math.round((base.viento * scenario.windFactor) * 10) / 10;
  const rafaga = Math.round(viento * 2.8);

  const lluvia = Math.max(1, Math.round(base.lluvia * (1 + scenario.deltaRain / 100)));

  const deltaBochorno = scenario.deltaT > 0 ? scenario.deltaT * 1.5 : scenario.deltaT * 1.0;
  const bochorno = Math.min(31, Math.max(5, Math.round((base.bochorno + deltaBochorno) * 10) / 10));

  const rh = Math.min(95, Math.max(45, Math.round((base.rh - scenario.deltaT * 1.8 + scenario.deltaRain * 0.15) * 10) / 10));

  const factorEto = 1 + (scenario.deltaT * 0.035) + ((scenario.windFactor - 1) * 0.5);
  const eto = Math.round((base.eto * factorEto) * 100) / 100;

  return {
    mes: base.mes,
    year: scenario.year,
    scenarioLabel: scenario.label,
    fase: scenario.fase,
    tagClass: scenario.tagClass,
    deltaT: scenario.deltaT,
    deltaRain: scenario.deltaRain,
    scenarioDesc: scenario.desc,
    max,
    min,
    tmed,
    viento,
    rafaga,
    lluvia,
    bochorno,
    rh,
    rad: base.rad,
    eto,
    dir: base.dir,
    picoCalor: base.picoCalor,
    maxLluvia: base.maxLluvia,
    maxViento: base.maxViento,
    masFresco: base.masFresco,
    picoBochorno: base.picoBochorno,
    masCalmado: base.masCalmado
  };
}

// ==========================================================================
// 2. MATRIZ FITOSANITARIA COMPLETA
// ==========================================================================
const PEST_DATA = [
  {
    id: "mosca",
    nombre: "Mosca Blanca",
    cientifico: "Bemisia tabaci",
    estado: "retiene",
    estadoTexto: "Retenida 100% por Malla",
    dano: "Succiona savia, debilita la planta, secreta melaza (fumagina) y transmite virus graves como TYLCV (cuchara del tomate) y Begomovirus.",
    vuelo: "Vuelo activo débil (<2 m), pero es arrastrada por el viento a kilómetros. La malla 110 gsm 50 mesh blanca es la barrera indispensable.",
    quimico: "IRAC 4A (Imidacloprid), IRAC 7C (Piriproxifen - ovicida/larvicida), IRAC 23 (Spiromesifen). Rotar estrictamente.",
    biologico: "Parasitoides de ninfas: Eretmocerus mundus y Encarsia formosa.",
    malla: "Malla 110 gsm 50 mesh HDPE blanca (apertura ≤ 192 µm). Ventilación y opacidad solar reflectiva."
  },
  {
    id: "trips",
    nombre: "Trips Occidental de las Flores",
    cientifico: "Frankliniella occidentalis / spp.",
    estado: "retiene",
    estadoTexto: "Retenida 100% (Estándar Anti-Trips)",
    dano: "Raspado y picado de hojas, flores y frutos jóvenes. Plateado foliar y vector letal del Virus del Bronceado del Tomate (TSWV).",
    vuelo: "Insecto alargado de 1-2 mm, aprovecha corrientes de aire. Es la plaga más exigente en micraje de poro.",
    quimico: "IRAC 5 (Spinosad / Spinetoram), IRAC 6 (Abamectina), IRAC 1B (Acefato).",
    biologico: "Ácaros depredadores benéficos: Amblyseius swirskii y Orius laevigatus.",
    malla: "Malla 110 gsm 50 mesh HDPE blanca (≤ 192 micras). Estándar anti-trips y anti-calor."
  },
  {
    id: "pulgones",
    nombre: "Pulgones / Áfidos",
    cientifico: "Myzus persicae, Aphis gossypii",
    estado: "retiene",
    estadoTexto: "Retenida 100% por Malla",
    dano: "Deformación de brotes tiernos, amarillamiento, transmisión de virus CMV/PVY y secreción abundante de melaza.",
    vuelo: "Plancton aéreo: dispersión masiva arrastrada por turbulencias de viento.",
    quimico: "IRAC 1A (Pirimicarb específico), IRAC 29 (Flonicamid), IRAC 3A (Piretroides).",
    biologico: "Crisopas (Chrysoperla carnea) y coleópteros Coccinellidae (mariquitas).",
    malla: "Malla 110 gsm 50 mesh HDPE blanca."
  },
  {
    id: "acaros",
    nombre: "Ácaros: Araña Roja y Ácaro Blanco",
    cientifico: "Tetranychus urticae / Polyphagotarsonemus latus",
    estado: "pasa",
    estadoTexto: "NO RETENIDO — Pasa por la Malla",
    dano: "Decoloración y punteaduras cloróticas (araña roja) o abombamiento, deformación de hojas y bronceado vítreo (ácaro blanco).",
    vuelo: "No vuelan por alas: caminan, se transmiten en herramientas/ropa o como polvo flotante microscópico.",
    quimico: "IRAC 6 (Abamectina), IRAC 10A (Hexitiazox), IRAC 25A (Ciflumetofen), Azufre mojable micronizado.",
    biologico: "Phytoseiulus persimilis y Neoseiulus californicus. Elevar humedad relativa (HR > 60%).",
    malla: "NO APLICA. Ninguna malla comercial los frena. Su control es 100% fitosanitario y agronómico."
  },
  {
    id: "minador",
    nombre: "Minador de la Hoja",
    cientifico: "Liriomyza trifolii / spp.",
    estado: "retiene",
    estadoTexto: "Retenida 100% por Malla",
    dano: "Galerías sinuosas blancas en el interior de las hojas, reduciendo dramáticamente el área fotosintética.",
    vuelo: "Díptero pequeño que vuela a ras de planta; el viento lateral lo arrastra hacia las naves.",
    quimico: "IRAC 17 (Cyromazina, inhibidor de muda altamente selectivo), Abamectina.",
    biologico: "Avispilla parasitoide Diglyphus isaea.",
    malla: "Malla 110 gsm 50 mesh HDPE blanca."
  },
  {
    id: "lepidopteros",
    nombre: "Lepidópteros / Perforadores de Fruto",
    cientifico: "Spodoptera frugiperda, Helicoverpa zea, Tuta absoluta",
    estado: "retiene",
    estadoTexto: "Retenida 100% por Malla",
    dano: "Larvas perforan brotes apicales, hojas y taladran frutos de pimentón y tomate haciéndolos invendibles.",
    vuelo: "Polillas nocturnas de vuelo potente. Cualquier malla mosquitera de 1 mm ya las detiene.",
    quimico: "IRAC 11A (Bacillus thuringiensis kurstaki), IRAC 28 (Clorantraniliprol / Rynaxypyr).",
    biologico: "Trichogramma spp. (parasitoide de huevos), trampas con feromonas de confusión sexual.",
    malla: "Malla 110 gsm 50 mesh HDPE blanca."
  }
];

// ==========================================================================
// 3. NÚCLEO DE ESTADO REACTIVO CENTRALIZADO (FarmState)
// Unifica y sincroniza la fuente de agua, sectorización, nutrición y pozo
// ==========================================================================
const FarmState = {
  waterSource: 'pozo', // 'pozo' | 'yacambu'
  wellFlowLs: 2.5,
  wellDepthM: 120,
  wellLocation: 'ARTESANAL', // 'ARTESANAL' | 'A60' | 'A70' | 'B' | 'C'
  grossLitersPlantDay: 2.85,
  dailyDemandM3: 12.54,
  drillDiamInches: 12.25,
  casingDiamInches: 6.0,
  screenType: 'johnson',
  activeSector: '1', // '1', '2', '3', 'all'
  fertilizerRegime: 'aifa', // 'aifa' | 'granulado' | 'hibrido'
  prodStageIdx: 3,
  sunlightMode: false,

  // Precios dinámicos mercado venezolano 2026 (Quíbor / MERCABAR)
  priceAifaBag25kg: 68.0,
  priceGranulatedBag50kg: 42.0,
  priceTomatoCesta20kg: 22.0,

  listeners: [],
  subscribe(fn) {
    this.listeners.push(fn);
  },
  notify(changed) {
    this.listeners.forEach(fn => {
      try { fn(this, changed); } catch (e) { console.error("Error FarmState listener:", e); }
    });
    this.persist();
  },
  setState(updates) {
    let changed = false;
    for (const [k, v] of Object.entries(updates)) {
      if (this[k] !== v) {
        this[k] = v;
        changed = true;
      }
    }
    if (changed) this.notify(updates);
  },
  persist() {
    try {
      localStorage.setItem("agroquibor_state_v1", JSON.stringify({
        waterSource: this.waterSource,
        wellFlowLs: this.wellFlowLs,
        wellDepthM: this.wellDepthM,
        wellLocation: this.wellLocation,
        fertilizerRegime: this.fertilizerRegime,
        sunlightMode: false,
        priceAifaBag25kg: this.priceAifaBag25kg,
        priceGranulatedBag50kg: this.priceGranulatedBag50kg,
        priceTomatoCesta20kg: this.priceTomatoCesta20kg
      }));
    } catch (e) {}
  },
  loadPersisted() {
    try {
      const saved = localStorage.getItem("agroquibor_state_v1");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.waterSource) this.waterSource = p.waterSource;
        if (p.wellFlowLs) this.wellFlowLs = Number(p.wellFlowLs);
        if (p.wellDepthM) this.wellDepthM = Number(p.wellDepthM);
        if (p.wellLocation) this.wellLocation = p.wellLocation;
        if (p.fertilizerRegime) this.fertilizerRegime = p.fertilizerRegime;
        this.sunlightMode = false;
        if (p.priceAifaBag25kg) this.priceAifaBag25kg = p.priceAifaBag25kg === 65.0 ? 68.0 : Number(p.priceAifaBag25kg);
        if (p.priceGranulatedBag50kg) this.priceGranulatedBag50kg = p.priceGranulatedBag50kg === 38.0 ? 42.0 : Number(p.priceGranulatedBag50kg);
        if (p.priceTomatoCesta20kg) this.priceTomatoCesta20kg = p.priceTomatoCesta20kg === 18.0 ? 22.0 : Number(p.priceTomatoCesta20kg);
      }
    } catch (e) {}
  }
};

// ==========================================================================
// 4. INICIALIZACIÓN Y MANEJO DE PESTAÑAS (TABS)
// ==========================================================================
function initApp() {
  const hideLoader = () => {
    const loader = document.getElementById("app-loader");
    if (loader) {
      loader.classList.add("hidden");
      setTimeout(() => { loader.style.display = "none"; }, 350);
    }
  };
  setTimeout(hideLoader, 150);

  try { FarmState.loadPersisted(); } catch (e) { console.error(e); }
  try { initPwaOffline(); } catch (e) { console.error(e); }
  try { initDarkTheme(); } catch (e) { console.error(e); }
  try { initSidebar(); } catch (e) { console.error(e); }
  try { initHydraulicCircuit(); } catch (e) { console.error(e); }
  try { initShiftExport(); } catch (e) { console.error(e); }
  try { initEconomicSimulator(); } catch (e) { console.error(e); }
  try { initTooltips(); } catch (e) { console.error(e); }
  try { initClimateTab(); } catch (e) { console.error(e); }
  try { initVentilationCalculator(); } catch (e) { console.error(e); }
  try { initIrrigationCalculator(); } catch (e) { console.error(e); }
  try { initWellValidationCalculator(); } catch (e) { console.error(e); }
  try { initWellDrillingCalculator(); } catch (e) { console.error(e); }
  try { initPestMatrix(); } catch (e) { console.error(e); }
  try { initCanvasVisualizer(); } catch (e) { console.error(e); }
  try { initBlueprintViewers(); } catch (e) { console.error(e); }
  try { initProductionTab(); } catch (e) { console.error(e); }

  hideLoader();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

let threeJsLoadingPromise = null;
function ensureThreeJsLoaded() {
  if (window.THREE && window.Greenhouse3DViewer) {
    return Promise.resolve();
  }
  if (threeJsLoadingPromise) return threeJsLoadingPromise;

  threeJsLoadingPromise = new Promise((resolve) => {
    function loadScript(src) {
      return new Promise((res) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = res;
        s.onerror = (err) => {
          console.warn(`[LazyLoader] Error loading ${src}:`, err);
          res();
        };
        document.head.appendChild(s);
      });
    }

    loadScript("lib/three.min.js")
      .then(() => loadScript("lib/OrbitControls.js"))
      .then(() => loadScript("greenhouse-3d.js"))
      .then(() => resolve());
  });
  return threeJsLoadingPromise;
}

function init3DViewerInstance() {
  const canvasBox = document.getElementById("greenhouse-3d-container");
  if (!canvasBox) return;

  ensureThreeJsLoaded().then(() => {
    if (window.Greenhouse3DViewer && !window.greenhouse3dViewer) {
      try {
        window.greenhouse3dViewer = new window.Greenhouse3DViewer("greenhouse-3d-container");
      } catch (err) {
        console.warn("[3D Viewer] Error inicializando Three.js viewer:", err);
      }
    }

    if (window.greenhouse3dViewer) {
      const viewer = window.greenhouse3dViewer;

      // Presets de Vistas Rápidas
      const viewButtons = [
        { id: "btn-v3d-iso", preset: "iso" },
        { id: "btn-v3d-front", preset: "front" },
        { id: "btn-v3d-side", preset: "side" },
        { id: "btn-v3d-top", preset: "top" },
        { id: "btn-v3d-walk", preset: "walk" }
      ];

      viewButtons.forEach(({ id, preset }) => {
        const btn = document.getElementById(id);
        if (btn) {
          btn.addEventListener("click", () => {
            viewButtons.forEach(b => {
              const el = document.getElementById(b.id);
              if (el) el.classList.remove("active");
            });
            btn.classList.add("active");
            viewer.setCameraPreset(preset, true);
          });
        }
      });

      // Auto-rotación 360° Turntable
      const btnAutoRotate = document.getElementById("btn-3d-autorotate");
      if (btnAutoRotate) {
        btnAutoRotate.addEventListener("click", () => {
          viewer.toggleAutoRotate();
        });
      }

      // Modos de Sombreado
      const shadeSolid = document.getElementById("btn-v3d-shade-solid");
      const shadeWire = document.getElementById("btn-v3d-shade-wire");
      const shadeXray = document.getElementById("btn-v3d-shade-xray");

      const shadeBtns = [shadeSolid, shadeWire, shadeXray].filter(Boolean);

      if (shadeSolid) {
        shadeSolid.addEventListener("click", () => {
          shadeBtns.forEach(b => b.classList.remove("active"));
          shadeSolid.classList.add("active");
          viewer.setShadingMode("solid");
        });
      }

      if (shadeWire) {
        shadeWire.addEventListener("click", () => {
          shadeBtns.forEach(b => b.classList.remove("active"));
          shadeWire.classList.add("active");
          viewer.setShadingMode("wireframe");
        });
      }

      if (shadeXray) {
        shadeXray.addEventListener("click", () => {
          shadeBtns.forEach(b => b.classList.remove("active"));
          shadeXray.classList.add("active");
          viewer.setShadingMode("xray");
        });
      }

      // Captura HD y Pantalla Completa
      const btnScreenshot = document.getElementById("btn-v3d-screenshot");
      if (btnScreenshot) {
        btnScreenshot.addEventListener("click", () => viewer.takeScreenshot());
      }

      const btnFullscreen = document.getElementById("btn-v3d-fullscreen");
      if (btnFullscreen) {
        btnFullscreen.addEventListener("click", () => viewer.toggleFullscreen());
      }

      // Capas de Inspección Estructural
      const layerBindings = [
        { id: "layer-chk-pillars", layer: "pillars" },
        { id: "layer-chk-cables", layer: "cables" },
        { id: "layer-chk-mesh", layer: "mesh" },
        { id: "layer-chk-crop", layer: "crop" },
        { id: "layer-chk-dims", layer: "dims" },
        { id: "layer-chk-wind", layer: "wind" }
      ];

      layerBindings.forEach(({ id, layer }) => {
        const chk = document.getElementById(id);
        if (chk) {
          chk.addEventListener("change", (e) => {
            viewer.toggleLayer(layer, e.target.checked);
          });
        }
      });

      // Deslizador de Opacidad de Malla 50×25
      const sliderMesh = document.getElementById("layer-slider-mesh-opacity");
      if (sliderMesh) {
        sliderMesh.addEventListener("input", (e) => {
          viewer.setMeshOpacity(parseFloat(e.target.value));
        });
      }

      setTimeout(() => viewer.onResize(), 60);
    }
  });
}

function initBlueprintViewers() {
  const container3D = document.getElementById("container-viewport-3d");
  const container2D = document.getElementById("container-planos-2d");
  const btnMode3D = document.getElementById("btn-mode-3d-interactive");
  const btnMode2D = document.getElementById("btn-mode-2d-blueprints");

  // Alternancia de Modo Principal (3D Interactivo vs 2D Técnicos)
  if (btnMode3D && btnMode2D && container3D && container2D) {
    btnMode3D.addEventListener("click", () => {
      btnMode3D.classList.add("active");
      btnMode2D.classList.remove("active");
      container3D.style.display = "flex";
      container2D.style.display = "none";
      if (window.greenhouse3dViewer) {
        setTimeout(() => window.greenhouse3dViewer.onResize(), 50);
      } else {
        init3DViewerInstance();
      }
    });

    btnMode2D.addEventListener("click", () => {
      btnMode2D.classList.add("active");
      btnMode3D.classList.remove("active");
      container2D.style.display = "block";
      container3D.style.display = "none";
    });
  }

  // Sub-pestañas dentro del contenedor 2D
  const btnSub2D = document.getElementById("btn-sub-plano2d");
  const btnSub3D = document.getElementById("btn-sub-plano3d");
  const btnSubCross = document.getElementById("btn-sub-cross-section");
  const subView2D = document.getElementById("subview-plano2d");
  const subView3D = document.getElementById("subview-plano3d");
  const subViewCross = document.getElementById("subview-cross-section");

  const subBtns = [btnSub2D, btnSub3D, btnSubCross].filter(Boolean);
  const subViews = [subView2D, subView3D, subViewCross].filter(Boolean);

  if (btnSub2D && subView2D) {
    btnSub2D.addEventListener("click", () => {
      subBtns.forEach(b => b.classList.remove("active"));
      subViews.forEach(v => v.style.display = "none");
      btnSub2D.classList.add("active");
      subView2D.style.display = "block";
    });
  }

  if (btnSub3D && subView3D) {
    btnSub3D.addEventListener("click", () => {
      subBtns.forEach(b => b.classList.remove("active"));
      subViews.forEach(v => v.style.display = "none");
      btnSub3D.classList.add("active");
      subView3D.style.display = "block";
    });
  }

  if (btnSubCross && subViewCross) {
    btnSubCross.addEventListener("click", () => {
      subBtns.forEach(b => b.classList.remove("active"));
      subViews.forEach(v => v.style.display = "none");
      btnSubCross.classList.add("active");
      subViewCross.style.display = "block";
      requestAnimationFrame(() => drawGreenhouseStructure());
    });
  }
}

const STAGE_MODULE_MAP = {
  "tab-clima": { stage: "Etapa 1: Bioclima & Emplazamiento", module: "Climatología & Viento (MERRA-2)" },
  "tab-ventilacion": { stage: "Etapa 1: Bioclima & Emplazamiento", module: "Ventilación Convectiva & Extractores" },
  "tab-estructura": { stage: "Etapa 2: Estructura & Fitosanidad", module: "Estructura Parral 1.000 m² (Visor 3D & Planos)" },
  "tab-plagas": { stage: "Etapa 2: Estructura & Fitosanidad", module: "Matriz de Plagas (110gsm 50mesh Blanca)" },
  "tab-riego": { stage: "Etapa 3: Acuífero & Hidrogeología", module: "Riego FAO-56 & Salinidad" },
  "tab-produccion": { stage: "Etapa 4: Operación & Producción", module: "Plan Maestro de Producción Tomate" },
};

/**
 * Activa un módulo o pestaña y sincroniza el menú lateral,
 * la miga de pan en la Topbar y el desplazamiento a subsecciones.
 */
function activateTab(targetTabId, scrollTargetId = null) {
  const navItems = document.querySelectorAll(".nav-item");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const breadcrumbStage = document.getElementById("breadcrumb-stage");
  const breadcrumbModule = document.getElementById("breadcrumb-module");

  // Sincronizar item activo en el menú lateral y accesibilidad ARIA (Paso 6.1)
  navItems.forEach(item => {
    const itemTab = item.getAttribute("data-tab");
    const itemScroll = item.getAttribute("data-scroll");

    let isActive = false;
    if (itemTab === targetTabId) {
      if (scrollTargetId && itemScroll === scrollTargetId) {
        isActive = true;
      } else if (!scrollTargetId && !itemScroll) {
        isActive = true;
      }
    }

    if (isActive) {
      item.classList.add("active");
      item.setAttribute("aria-selected", "true");
    } else {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    }
  });

  // Activar panel de contenido y actualizar aria-hidden
  tabPanes.forEach(p => {
    if (p.id === targetTabId) {
      p.classList.add("active");
      p.setAttribute("aria-hidden", "false");
      if (targetTabId === "tab-estructura") {
        const btnMode3D = document.getElementById("btn-mode-3d-interactive");
        const btnMode2D = document.getElementById("btn-mode-2d-blueprints");
        const container3D = document.getElementById("container-viewport-3d");
        const container2D = document.getElementById("container-planos-2d");

        if (scrollTargetId === "container-planos-2d") {
          if (btnMode2D && btnMode3D && container2D && container3D) {
            btnMode2D.classList.add("active");
            btnMode3D.classList.remove("active");
            container2D.style.display = "block";
            container3D.style.display = "none";
          }
        } else {
          if (btnMode3D && btnMode2D && container3D && container2D) {
            btnMode3D.classList.add("active");
            btnMode2D.classList.remove("active");
            container3D.style.display = "flex";
            container2D.style.display = "none";
          }
          if (window.greenhouse3dViewer) {
            setTimeout(() => window.greenhouse3dViewer.onResize(), 60);
          } else {
            init3DViewerInstance();
          }
        }
        requestAnimationFrame(() => drawGreenhouseStructure());
      }
    } else {
      p.classList.remove("active");
      p.setAttribute("aria-hidden", "true");
    }
  });

  // Actualizar Miga de Pan en la Topbar
  if (STAGE_MODULE_MAP[targetTabId]) {
    if (breadcrumbStage) breadcrumbStage.textContent = STAGE_MODULE_MAP[targetTabId].stage;
    if (breadcrumbModule) {
      if (scrollTargetId === "well-drilling-section") {
        breadcrumbModule.textContent = "Perforación Pozo 120 m (CIDIAT)";
      } else if (scrollTargetId === "hydraulic-section") {
        breadcrumbModule.textContent = "Cadena Hidráulica & Bomba 1.5 HP";
      } else if (scrollTargetId === "field-action-sheet") {
        breadcrumbModule.textContent = "Ficha de Turno Diario (WhatsApp)";
      } else if (scrollTargetId === "economic-simulator-section") {
        breadcrumbModule.textContent = "Simulador Económico AIFA";
      } else if (scrollTargetId === "container-planos-2d") {
        breadcrumbModule.textContent = "Planos Constructivos & Cortes (SVG / 2D)";
      } else {
        breadcrumbModule.textContent = STAGE_MODULE_MAP[targetTabId].module;
      }
    }
  }

  // Desplazamiento suave si se seleccionó una subsección específica
  if (scrollTargetId) {
    setTimeout(() => {
      const el = document.getElementById(scrollTargetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  }

  // Cerrar drawer móvil si está abierto
  document.body.classList.remove("sidebar-open");
}

function initSidebar() {
  const layout = document.getElementById("app-layout");
  const btnCollapse = document.getElementById("btn-collapse-sidebar");
  const btnHamburger = document.getElementById("btn-toggle-sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const navItems = document.querySelectorAll(".nav-item");
  const btnTopbarExport = document.getElementById("btn-topbar-export");

  // Cargar estado colapsado guardado para escritorio
  const savedCollapsed = localStorage.getItem("agroquibor_sidebar_collapsed") === "true";
  if (savedCollapsed && layout && window.innerWidth > 1024) {
    layout.classList.add("sidebar-collapsed");
  }

  // Alternar colapso en escritorio
  if (btnCollapse) {
    btnCollapse.addEventListener("click", () => {
      if (!layout) return;
      const isCollapsed = layout.classList.toggle("sidebar-collapsed");
      localStorage.setItem("agroquibor_sidebar_collapsed", isCollapsed);
      requestAnimationFrame(drawGreenhouseStructure);
    });
  }

  // Alternar menú en móvil (hamburguesa)
  if (btnHamburger) {
    btnHamburger.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-open");
    });
  }

  // Cerrar menú al tocar el backdrop en móvil
  if (backdrop) {
    backdrop.addEventListener("click", () => {
      document.body.classList.remove("sidebar-open");
    });
  }

  // Enlaces de navegación del menú lateral
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetTab = item.getAttribute("data-tab");
      const scrollId = item.getAttribute("data-scroll");
      activateTab(targetTab, scrollId);
    });
  });

  // Botón de exportación rápida en la Topbar
  if (btnTopbarExport) {
    btnTopbarExport.addEventListener("click", () => {
      const btnExport = document.getElementById("btn-export-shift");
      if (btnExport) {
        btnExport.click();
      } else {
        activateTab("tab-produccion", "field-action-sheet");
      }
    });
  }

  // Modo Oscuro Permanente (Cockpit Agro Dark con Verde Manzana)
  document.documentElement.setAttribute("data-bs-theme", "dark");
  document.body.classList.remove("sunlight-mode", "light-theme");
  document.body.classList.add("dark-theme");

  // Atajos de teclado Pro: [M] o [B] alterna el menú lateral
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "m" || e.key === "M" || e.key === "b" || e.key === "B") {
      if (window.innerWidth <= 1024) {
        document.body.classList.toggle("sidebar-open");
      } else if (layout) {
        const isCollapsed = layout.classList.toggle("sidebar-collapsed");
        localStorage.setItem("agroquibor_sidebar_collapsed", isCollapsed);
        requestAnimationFrame(drawGreenhouseStructure);
      }
    }
  });
}

/**
 * Notificaciones flotantes Toast para acciones de campo
 */
function showToast(message, icon = "check_circle", duration = 3200) {
  const toast = document.getElementById("agro-toast");
  const msg = document.getElementById("agro-toast-msg");
  if (!toast || !msg) return;
  const iconEl = toast.querySelector(".agro-toast-icon");
  if (iconEl) {
    if (/^[a-z0-9_]+$/.test(icon)) {
      iconEl.innerHTML = `<span class="material-symbols-outlined" style="font-size:22px; color:var(--emerald-light); vertical-align:middle;">${icon}</span>`;
    } else {
      iconEl.textContent = icon;
    }
  }
  msg.textContent = message;
  toast.classList.add("show");
  if (window._agroToastTimer) clearTimeout(window._agroToastTimer);
  window._agroToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

/**
 * Esquema Interactivo de la Cadena Hidráulica:
 * Simulación de ruta del caudal (Laguna ➔ Pichincha ➔ Bomba ➔ Filtro ➔ Matriz ➔ Sector)
 * y actualización en vivo de telemetría y resaltado de la Ficha de Turno Diario.
 */
function initHydraulicCircuit() {
  const circuitButtons = document.querySelectorAll(".circuit-btn");
  const nodeTargetTitle = document.getElementById("node-target-title");
  const nodeTargetSub = document.getElementById("node-target-sub");
  const telemSector = document.getElementById("telem-sector-name");
  const telemRows = document.getElementById("telem-sector-rows");
  const telemFlow = document.getElementById("telem-flow-rate");
  const telemFlowLmin = document.getElementById("telem-flow-lmin");
  const telemEmitters = document.getElementById("telem-emitter-qty");
  const telemPlants = document.getElementById("telem-plants-served");
  const telemPulse = document.getElementById("telem-pulse-duration");
  const telemPressure = document.getElementById("telem-pressure");

  const actionBoxes = {
    "1": document.getElementById("action-box-sec1"),
    "2": document.getElementById("action-box-sec2"),
    "3": document.getElementById("action-box-sec3")
  };

  const sectorConfigs = {
    "1": {
      name: "Sector 1 (Camellones 1 al 5)",
      rows: "10 Hileras de Tomate (50 m)",
      flow: "2.00 m³/h",
      lmin: "33.3 L/minuto",
      emitters: "1.250 Goteros PC (40 cm)",
      plants: "1.100 Plantas (1.60 L/h)",
      pulse: "28 Minutos (Turno 1: 06:00-06:28)",
      pressure: "2.5 a 2.8 bar (Cabezal)",
      targetTitle: "Sector 1 Activo",
      targetSub: "1.250 goteros PC 40cm"
    },
    "2": {
      name: "Sector 2 (Camellones 6 al 10)",
      rows: "10 Hileras de Tomate (50 m)",
      flow: "2.00 m³/h",
      lmin: "33.3 L/minuto",
      emitters: "1.250 Goteros PC (40 cm)",
      plants: "1.100 Plantas (1.60 L/h)",
      pulse: "28 Minutos (Turno 2: 06:35-07:03)",
      pressure: "2.5 a 2.8 bar (Cabezal)",
      targetTitle: "Sector 2 Activo",
      targetSub: "1.250 goteros PC 40cm"
    },
    "3": {
      name: "Sector 2 (Camellones 6 al 10)",
      rows: "10 Hileras de Tomate (50 m)",
      flow: "2.00 m³/h",
      lmin: "33.3 L/minuto",
      emitters: "1.250 Goteros PC (40 cm)",
      plants: "1.100 Plantas (1.60 L/h)",
      pulse: "28 Minutos (Turno 2: 06:35-07:03)",
      pressure: "2.5 a 2.8 bar (Cabezal)",
      targetTitle: "Sector 2 Activo",
      targetSub: "1.250 goteros PC 40cm"
    },
    "all": {
      name: "Ciclo Completo (2 Sectores)",
      rows: "20 Hileras Totales (1.000 m²)",
      flow: "2.00 m³/h (Rotativo)",
      lmin: "Total Nave: 4.0 m³/h",
      emitters: "2.500 Goteros PC Totales",
      plants: "2.200 Plantas Productivas",
      pulse: "56 Minutos Total (2×28m)",
      pressure: "Auto-compensación Activa",
      targetTitle: "Tren Secuencial 1➔2",
      targetSub: "56 min de bombeo diario"
    }
  };

  circuitButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      circuitButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const secKey = btn.getAttribute("data-circuit-sector");
      const cfg = sectorConfigs[secKey];
      if (!cfg) return;

      FarmState.setState({ activeSector: secKey });

      if (nodeTargetTitle) nodeTargetTitle.textContent = cfg.targetTitle;
      if (nodeTargetSub) nodeTargetSub.textContent = cfg.targetSub;
      if (telemSector) telemSector.textContent = cfg.name;
      if (telemRows) telemRows.textContent = cfg.rows;
      if (telemFlow) telemFlow.textContent = cfg.flow;
      if (telemFlowLmin) telemFlowLmin.textContent = cfg.lmin;
      if (telemEmitters) telemEmitters.textContent = cfg.emitters;
      if (telemPlants) telemPlants.textContent = cfg.plants;
      if (telemPulse) telemPulse.textContent = cfg.pulse;
      if (telemPressure) telemPressure.textContent = cfg.pressure;

      // Resaltar en la Ficha de Turno Diario
      Object.keys(actionBoxes).forEach(k => {
        const box = actionBoxes[k];
        if (!box) return;
        if (secKey === "all" || secKey === k) {
          box.classList.add("sector-current");
        } else {
          box.classList.remove("sector-current");
        }
      });
    });
  });
}

// ==========================================================================
// 4.1 PWA OFFLINE MANAGER & SERVICE WORKER
// ==========================================================================
function initPwaOffline() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(() => {
      const badge = document.getElementById('pwa-status-badge');
      if (badge) {
        badge.style.display = 'inline-flex';
        badge.textContent = '🟢 Offline Listo (PWA)';
      }
    }).catch(() => {
      const badge = document.getElementById('pwa-status-badge');
      if (badge) badge.style.display = 'none';
    });
  }
}

// ==========================================================================
// 4.2 MODO OSCURO INTEGRAL (COCKPIT AGRO & VERDE MANZANA)
// ==========================================================================
function initDarkTheme() {
  document.documentElement.setAttribute('data-bs-theme', 'dark');
  document.body.classList.remove('sunlight-mode', 'light-theme');
  document.body.classList.add('dark-theme');
  if (window.greenhouse3dViewer) {
    window.greenhouse3dViewer.setThemeMode(false);
  }
}

// ==========================================================================
// 4.3 EXPORTADOR DE FICHA DE TURNO DIARIO (WHATSAPP / IMPRIMIR)
// ==========================================================================
function initShiftExport() {
  const btn = document.getElementById('btn-export-shift');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isYacambu = FarmState.waterSource === 'yacambu';
    const fertRegime = FarmState.fertilizerRegime;
    const stageName = PROD_STAGES[FarmState.prodStageIdx] ? PROD_STAGES[FarmState.prodStageIdx].name : "Fructificación y Cosecha";

    let fertText = "";
    if (fertRegime === 'granulado') {
      fertText = "• Régimen: Abono Granulado Manual NPK 12-12-17 SOP (32 g/planta cada 20 días en banda a 15 cm del tallo).\n• Tanque A: Fe-EDDHA (6%) 0.55 kg/sem.\n• Tanque B: Microelementos 0.30 kg + Ácido Bórico 0.15 kg/sem.";
    } else if (fertRegime === 'hibrido') {
      fertText = "• Régimen: Estrategia Híbrida (Fondo granulado + AIFA en goteo).\n• Tanque A: Nitrato de Calcio AIFA 12.5 kg + KNO3 6.0 kg + Fe-EDDHA 0.50 kg/sem.\n• Tanque B: AIFA 12-6-36 17.5 kg + MKP 3.0 kg + SOP 7.0 kg + MgSO4 5.0 kg/sem.";
    } else {
      fertText = "• Régimen: 100% AIFA Hidrosoluble.\n• Tanque A: Nitrato de Calcio AIFA 18.0 kg + KNO3 7.5 kg + Fe-EDDHA 0.55 kg/sem.\n• Tanque B: KNO3 15.0 kg + MKP 5.0 kg + K2SO4 12.0 kg + MgSO4 8.0 kg + Micro 0.30 kg/sem.";
    }

    const acidText = isYacambu ? "• Tanque C: ~4.0 L/sem Ácido Nítrico 60% (Agua dulce Yacambú CE 0.5 dS/m)" : "• Tanque C: ~12.5 L/sem Ácido Nítrico 60% (Pozo salino CE 1.4 dS/m - Bicarbonatos altos)";

    const now = new Date();
    const dateStr = now.toLocaleDateString("es-VE", { year: 'numeric', month: 'long', day: 'numeric' });

    const pauta = `📋 PAUTA DIARIA DE RIEGO Y FERTILIZACIÓN — CASA DE MALLA QUÍBOR (1.000 m²)
📅 Fecha: ${dateStr}
🌱 Etapa: ${stageName} (2.200 Plantas)
💧 Fuente de Agua: ${isYacambu ? "Trasvase Yacambú (CE 0.5 dS/m | LF 6.5%)" : "Pozo Profundo Abatido (CE 1.4 dS/m | LF 20%)"}
⚡ Equipo de Bombeo: Motor 1.5 HP 220V + Filtro Discos 120 Mesh

⏰ TURNOS SECUENCIALES OBLIGATORIOS (BOMBA 1.5 HP):
1️⃣ SECTOR 1 (Camellones 1 al 5 | 1.100 pl):
   • Horario: 06:00 – 06:28 AM (28 minutos)
   • Válvula 1 ABIERTA (Válvula 2 CERRADA)
   • Caudal: 2.00 m³/h | Presión: 2.5 a 2.8 bar

2️⃣ SECTOR 2 (Camellones 6 al 10 | 1.100 pl):
   • Horario: 06:35 – 07:03 AM (28 minutos)
   • Válvula 2 ABIERTA (Válvula 1 CERRADA)
   • Caudal: 2.00 m³/h | Presión: 2.5 a 2.8 bar

🧪 NUTRICIÓN & FERTIRRIEGO:
${fertText}
${acidText}

⚠️ REGLAS DE ORO DE SEGURIDAD:
1. NUNCA abrir dos válvulas a la vez (colapsaría la presión de la bomba 1.5 HP).
2. Purgar filtro de discos al iniciar. Lavar anillos si ΔP > 0.5 bar.
3. Al manipular ácido nítrico: verter ÁCIDO SOBRE EL AGUA, jamás agua al ácido.
4. Desinfección de manos con leche descremada al 10% en esclusa (antiviral ToBRFV).

— Generado por Asistente Agronómico Quíbor (9°53'20.0"N, 69°35'35.0"W)`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pauta).then(() => {
        showToast("¡Ficha copiada al portapapeles! Abriendo WhatsApp...", "send_to_mobile", 3500);
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(pauta)}`;
        setTimeout(() => window.open(whatsappUrl, '_blank'), 300);
      }).catch(() => {
        showToast("Abriendo WhatsApp con la ficha...", "send_to_mobile", 3000);
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(pauta)}`;
        window.open(whatsappUrl, '_blank');
      });
    } else {
      showToast("Abriendo WhatsApp con la ficha...", "send_to_mobile", 3000);
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(pauta)}`;
      window.open(whatsappUrl, '_blank');
    }
  });
}

// ==========================================================================
// 4.4 SIMULADOR ECONÓMICO DINÁMICO (AIFA VS GRANULADO VS HÍBRIDO)
// ==========================================================================
function initEconomicSimulator() {
  const inputAifa = document.getElementById('input-price-aifa');
  const inputGran = document.getElementById('input-price-granulado');
  const inputCesta = document.getElementById('input-price-cesta');

  const btnAifaMinus = document.getElementById('btn-aifa-minus');
  const btnAifaPlus = document.getElementById('btn-aifa-plus');
  const btnGranMinus = document.getElementById('btn-gran-minus');
  const btnGranPlus = document.getElementById('btn-gran-plus');
  const btnCestaMinus = document.getElementById('btn-cesta-minus');
  const btnCestaPlus = document.getElementById('btn-cesta-plus');

  if (!inputAifa || !inputGran || !inputCesta) return;

  // Cargar valores iniciales desde FarmState
  inputAifa.value = FarmState.priceAifaBag25kg;
  inputGran.value = FarmState.priceGranulatedBag50kg;
  inputCesta.value = FarmState.priceTomatoCesta20kg;

  function calculateAndRenderEcon() {
    const pAifa = Math.max(10, parseFloat(inputAifa.value) || 68);
    const pGran = Math.max(10, parseFloat(inputGran.value) || 42);
    const pCesta = Math.max(1, parseFloat(inputCesta.value) || 22);
    const pKg = pCesta / 20.0;

    FarmState.setState({
      priceAifaBag25kg: pAifa,
      priceGranulatedBag50kg: pGran,
      priceTomatoCesta20kg: pCesta
    });

    const elPriceKg = document.getElementById('disp-price-kg');
    if (elPriceKg) elPriceKg.textContent = `$${pKg.toFixed(2)} USD/kg`;

    // Sincronizar estado visual de los botones de preset de cesta
    const presetBtns = document.querySelectorAll('.btn-cesta-preset');
    presetBtns.forEach(btn => {
      const pVal = parseFloat(btn.getAttribute('data-price'));
      if (Math.abs(pVal - pCesta) < 0.1) {
        btn.classList.add('active');
        btn.style.borderColor = '#34d399';
        btn.style.color = '#34d399';
      } else {
        btn.classList.remove('active');
        btn.style.borderColor = '';
        btn.style.color = '';
      }
    });

    // 1. AIFA 100% Hidrosoluble (OPCIÓN RECOMENDADA)
    // 17.6 Ton = 880 cestas, 21 sacos 25kg, 0 jornales extra (inyección automatizada por cabezal)
    const yieldAifaKg = 17600;
    const cestasAifa = 880;
    const bagsAifa = 21;
    const grossAifa = cestasAifa * pCesta;
    const costAifa = bagsAifa * pAifa;
    const netAifa = grossAifa - costAifa;
    const unitCostAifa = costAifa / yieldAifaKg;

    // 2. Estrategia Híbrida (16.75 Ton = 838 cestas, 8 sacos gran 50kg + 12 sacos aifa 25kg + 1 jornal $15)
    const yieldHibridoKg = 16750;
    const cestasHibrido = 838;
    const laborHibrido = 15; // 1 jornal de fondo manual (Quíbor 2026)
    const grossHibrido = cestasHibrido * pCesta;
    const costHibrido = (8 * pGran) + (12 * pAifa) + laborHibrido;
    const netHibrido = grossHibrido - costHibrido;
    const unitCostHibrido = costHibrido / yieldHibridoKg;

    // 3. Granulado Manual (13.5 Ton = 675 cestas, 19 sacos gran 50kg + 4.5 jornales ciclo $65)
    const yieldGranKg = 13500;
    const cestasGran = 675;
    const bagsGran = 19;
    const laborGran = 65; // 4.5 jornales manuales de abonado en banda ($14.4/jornal Quíbor 2026)
    const grossGran = cestasGran * pCesta;
    const costGran = (bagsGran * pGran) + laborGran;
    const netGran = grossGran - costGran;
    const unitCostGran = costGran / yieldGranKg;

    // Diferencial AIFA vs Granulado
    const diffNet = netAifa - netGran;
    const extraInvest = costAifa - costGran;
    const extraCestas = cestasAifa - cestasGran; // 205 cestas

    // Actualizar UI AIFA
    const dispGrossAifa = document.getElementById('disp-econ-gross-aifa');
    const dispCostAifa = document.getElementById('disp-econ-cost-aifa');
    const dispUnitCostAifa = document.getElementById('disp-econ-unitcost-aifa');
    const dispNetAifa = document.getElementById('disp-econ-net-aifa');

    if (dispGrossAifa) dispGrossAifa.textContent = `$${Math.round(grossAifa).toLocaleString('en-US')} USD`;
    if (dispCostAifa) dispCostAifa.textContent = `$${Math.round(costAifa).toLocaleString('en-US')} USD`;
    if (dispUnitCostAifa) dispUnitCostAifa.textContent = `$${unitCostAifa.toFixed(3)} USD/kg`;
    if (dispNetAifa) dispNetAifa.textContent = `$${Math.round(netAifa).toLocaleString('en-US')} USD`;

    // Actualizar UI Híbrido
    const dispGrossHib = document.getElementById('disp-econ-gross-hibrido');
    const dispCostHib = document.getElementById('disp-econ-cost-hibrido');
    const dispUnitCostHib = document.getElementById('disp-econ-unitcost-hibrido');
    const dispNetHib = document.getElementById('disp-econ-net-hibrido');

    if (dispGrossHib) dispGrossHib.textContent = `$${Math.round(grossHibrido).toLocaleString('en-US')} USD`;
    if (dispCostHib) dispCostHib.textContent = `$${Math.round(costHibrido).toLocaleString('en-US')} USD`;
    if (dispUnitCostHib) dispUnitCostHib.textContent = `$${unitCostHibrido.toFixed(3)} USD/kg`;
    if (dispNetHib) dispNetHib.textContent = `$${Math.round(netHibrido).toLocaleString('en-US')} USD`;

    // Actualizar UI Granulado
    const dispGrossGran = document.getElementById('disp-econ-gross-granulado');
    const dispCostGran = document.getElementById('disp-econ-cost-granulado');
    const dispUnitCostGran = document.getElementById('disp-econ-unitcost-granulado');
    const dispNetGran = document.getElementById('disp-econ-net-granulado');

    if (dispGrossGran) dispGrossGran.textContent = `$${Math.round(grossGran).toLocaleString('en-US')} USD`;
    if (dispCostGran) dispCostGran.textContent = `$${Math.round(costGran).toLocaleString('en-US')} USD`;
    if (dispUnitCostGran) dispUnitCostGran.textContent = `$${unitCostGran.toFixed(3)} USD/kg`;
    if (dispNetGran) dispNetGran.textContent = `$${Math.round(netGran).toLocaleString('en-US')} USD`;

    // Conclusión financiera dinámica
    const dispConclusion = document.getElementById('disp-econ-conclusion');
    if (dispConclusion) {
      if (diffNet > 0) {
        const roiMultiplier = extraInvest > 0 ? (diffNet / extraInvest).toFixed(1) : '5.3';
        dispConclusion.innerHTML = `<strong>Veredicto Agronómico & Financiero en Quíbor:</strong> La nutrición <strong>100% AIFA Hidrosoluble</strong> es la <span style="color:#34d399; font-weight:800;">OPCIÓN RECOMENDADA TÉCNICAMENTE</span>. Aunque requiere $${Math.round(Math.abs(extraInvest)).toLocaleString('en-US')} USD adicionales de inversión en insumos frente al granulado edáfico, genera <strong>+$${Math.round(diffNet).toLocaleString('en-US')} USD netos de ganancia adicional</strong> por ciclo (+${extraCestas} cestas de tomate). Cada $1.00 USD extra invertido retorna <strong>+$${roiMultiplier} USD en ganancia neta</strong>, garantizando 78% de fruta de Primera calidad, 0 jornales extra de abonado y blindando los goteros a 40 cm con 0% de obstrucción.`;
      } else {
        dispConclusion.innerHTML = `<strong>Veredicto de Mercado Bajo:</strong> A precios reducidos de tomate, la <strong>Estrategia Híbrida</strong> minimiza el riesgo financiero inicial asegurando un margen de $${Math.round(netHibrido).toLocaleString('en-US')} USD.`;
      }
    }
  }

  // Event Listeners Inputs
  inputAifa.addEventListener('input', calculateAndRenderEcon);
  inputGran.addEventListener('input', calculateAndRenderEcon);
  inputCesta.addEventListener('input', calculateAndRenderEcon);

  // Steppers
  if (btnAifaMinus) btnAifaMinus.addEventListener('click', () => { inputAifa.value = Math.max(10, parseFloat(inputAifa.value) - 1); calculateAndRenderEcon(); });
  if (btnAifaPlus) btnAifaPlus.addEventListener('click', () => { inputAifa.value = parseFloat(inputAifa.value) + 1; calculateAndRenderEcon(); });

  if (btnGranMinus) btnGranMinus.addEventListener('click', () => { inputGran.value = Math.max(10, parseFloat(inputGran.value) - 1); calculateAndRenderEcon(); });
  if (btnGranPlus) btnGranPlus.addEventListener('click', () => { inputGran.value = parseFloat(inputGran.value) + 1; calculateAndRenderEcon(); });

  if (btnCestaMinus) btnCestaMinus.addEventListener('click', () => { inputCesta.value = Math.max(1, (parseFloat(inputCesta.value) - 0.5).toFixed(1)); calculateAndRenderEcon(); });
  if (btnCestaPlus) btnCestaPlus.addEventListener('click', () => { inputCesta.value = (parseFloat(inputCesta.value) + 0.5).toFixed(1); calculateAndRenderEcon(); });

  // Event Listeners para Presets Rápidos de Mercado
  const presetBtns = document.querySelectorAll('.btn-cesta-preset');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pVal = parseFloat(btn.getAttribute('data-price'));
      if (pVal) {
        inputCesta.value = pVal;
        calculateAndRenderEcon();
      }
    });
  });

  calculateAndRenderEcon();
}

/**
 * Micro-Glosario Agronómico Interactivo:
 * Soporte para pantallas táctiles en campo (smartphones/tablets).
 */
function initTooltips() {
  const tooltips = document.querySelectorAll(".tooltip-term");
  tooltips.forEach(tt => {
    tt.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = tt.classList.contains("is-open");
      tooltips.forEach(t => t.classList.remove("is-open"));
      if (!isOpen) {
        tt.classList.add("is-open");
      }
    });
  });

  document.addEventListener("click", () => {
    tooltips.forEach(t => t.classList.remove("is-open"));
  });
}

// ==========================================================================
// 5. SERVICIO DE TELEMETRÍA EN TIEMPO REAL & TAB 1: CLIMA & CAPA LÍMITE
//    API Abierta: Open-Meteo | Quíbor: 9°53'20.0"N, 69°35'35.0"W | 707 msnm
// ==========================================================================

const RealTimeWeatherService = {
  LAT: 9.8889,
  LON: -69.5931,
  ELEVATION: 707,
  TIMEZONE: "America/Caracas",
  CACHE_KEY: "quibor_live_weather_v1",
  CACHE_TTL_MS: 10 * 60 * 1000, // 10 minutos
  currentMode: "live", // "live" | "historical"
  lastData: null,
  isFetching: false,

  // Mapeo WMO OMM para horticultura y fitosanidad en Quíbor
  WMO_CODES: {
    0: { label: "Cielo Despejado", icon: "☀️", class: "clear", isRain: false },
    1: { label: "Principalmente Despejado", icon: "🌤️", class: "mostly-clear", isRain: false },
    2: { label: "Parcialmente Nublado", icon: "⛅", class: "partly-cloudy", isRain: false },
    3: { label: "Nublado / Convectivo", icon: "☁️", class: "cloudy", isRain: false },
    45: { label: "Neblina / Bochorno", icon: "🌫️", class: "fog", isRain: false },
    48: { label: "Niebla con Escarcha", icon: "🌫️", class: "fog", isRain: false },
    51: { label: "Llovizna Ligera", icon: "🌦️", class: "drizzle", isRain: true },
    53: { label: "Llovizna Moderada", icon: "🌦️", class: "drizzle", isRain: true },
    55: { label: "Llovizna Densa", icon: "🌧️", class: "drizzle", isRain: true },
    61: { label: "Lluvia Ligera", icon: "🌧️", class: "rain", isRain: true },
    63: { label: "Lluvia Moderada", icon: "🌧️", class: "rain", isRain: true },
    65: { label: "Lluvia Fuerte Continua", icon: "🌧️", class: "heavy-rain", isRain: true },
    80: { label: "Chubascos Dispersos", icon: "🌦️", class: "showers", isRain: true },
    81: { label: "Chubascos Moderados", icon: "🌧️", class: "showers", isRain: true },
    82: { label: "Chubascos Violentos", icon: "⛈️", class: "heavy-showers", isRain: true },
    95: { label: "Tormenta Eléctrica", icon: "⛈️", class: "thunderstorm", isRain: true },
    96: { label: "Tormenta con Granizo", icon: "⛈️", class: "thunderstorm", isRain: true },
    99: { label: "Tormenta Severa con Granizo", icon: "⛈️", class: "severe-thunderstorm", isRain: true }
  },

  getCardinal(deg) {
    if (deg == null) return "ESTE";
    const d = (deg % 360 + 360) % 360;
    if (d >= 337.5 || d < 22.5) return "NORTE";
    if (d >= 22.5 && d < 67.5) return "NORESTE (NE)";
    if (d >= 67.5 && d < 112.5) return "ESTE (Alisio Dominante)";
    if (d >= 112.5 && d < 157.5) return "SURESTE (SE)";
    if (d >= 157.5 && d < 202.5) return "SUR (S)";
    if (d >= 202.5 && d < 247.5) return "SUROESTE (SW)";
    if (d >= 247.5 && d < 292.5) return "OESTE (W)";
    return "NOROESTE (NW)";
  },

  getWmoInfo(code) {
    return this.WMO_CODES[code] || { label: "Condición Variable", icon: "⛅", class: "cloudy", isRain: false };
  },

  getLiveEto() {
    if (this.lastData && this.lastData.daily && this.lastData.daily.et0_fao_evapotranspiration) {
      return this.lastData.daily.et0_fao_evapotranspiration[0] || 6.36;
    }
    return 6.36;
  },

  getLiveTemp() {
    return this.lastData && this.lastData.current ? this.lastData.current.temperature_2m : 25.0;
  },

  getLiveWind() {
    return this.lastData && this.lastData.current ? this.lastData.current.wind_speed_10m : 8.6;
  },

  async fetchData(forceRefresh = false) {
    if (this.isFetching) return;
    this.isFetching = true;
    this.setLoadingState(true);

    // 1. Revisar caché si no es forzado
    if (!forceRefresh) {
      try {
        const rawCache = localStorage.getItem(this.CACHE_KEY);
        if (rawCache) {
          const cached = JSON.parse(rawCache);
          if (Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
            this.lastData = cached.data;
            this.updateUI(cached.data, false, cached.timestamp);
            this.setLoadingState(false);
            this.isFetching = false;
            return;
          }
        }
      } catch (e) {
        console.warn("Error leyendo caché meteorológica:", e);
      }
    }

    // 2. Consulta API Open-Meteo directa para el predio en Quíbor
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.LAT}&longitude=${this.LON}&elevation=${this.ELEVATION}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration,shortwave_radiation_sum&timezone=${encodeURIComponent(this.TIMEZONE)}&forecast_days=3`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP Error ${resp.status}`);
      const data = await resp.json();

      this.lastData = data;
      const nowTs = Date.now();

      try {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify({ timestamp: nowTs, data }));
      } catch (e) {
        console.warn("No se pudo guardar en localStorage:", e);
      }

      this.updateUI(data, true, nowTs);
    } catch (err) {
      console.warn("Fallo al conectar con Open-Meteo, intentando usar último caché:", err);
      try {
        const rawCache = localStorage.getItem(this.CACHE_KEY);
        if (rawCache) {
          const cached = JSON.parse(rawCache);
          this.lastData = cached.data;
          this.updateUI(cached.data, false, cached.timestamp, true);
        } else {
          this.setOfflineFallbackUI();
        }
      } catch (e) {
        this.setOfflineFallbackUI();
      }
    } finally {
      this.setLoadingState(false);
      this.isFetching = false;
    }
  },

  setLoadingState(loading) {
    const icon = document.getElementById("icon-refresh-weather");
    if (icon) {
      if (loading) icon.classList.add("spin-icon");
      else icon.classList.remove("spin-icon");
    }
  },

  updateUI(data, isLive, timestamp, isErrorOffline = false) {
    if (!data || !data.current || !data.daily) return;
    const cur = data.current;
    const daily = data.daily;
    const wmo = this.getWmoInfo(cur.weather_code);
    const cardinal = this.getCardinal(cur.wind_direction_10m);

    const tMax = daily.temperature_2m_max ? daily.temperature_2m_max[0] : cur.temperature_2m;
    const tMin = daily.temperature_2m_min ? daily.temperature_2m_min[0] : cur.temperature_2m;
    const pSum = daily.precipitation_sum ? daily.precipitation_sum[0] : cur.precipitation;
    const pProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;
    const et0 = daily.et0_fao_evapotranspiration ? daily.et0_fao_evapotranspiration[0] : 6.36;
    const rad = daily.shortwave_radiation_sum ? daily.shortwave_radiation_sum[0] : 20.0;

    // Formatear hora de lectura local Venezuela
    const dateObj = new Date(timestamp || Date.now());
    const timeStr = dateObj.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", hour12: true });

    // 1. Topbar Telemetry
    const topbarText = document.getElementById("topbar-live-text");
    if (topbarText) {
      const rainIcon = cur.precipitation > 0 ? "🌧️" : (wmo.icon || "☀️");
      topbarText.innerHTML = `${rainIcon} ${cur.temperature_2m.toFixed(1)}°C | 💨 ${cur.wind_speed_10m.toFixed(0)} km/h | 🌧️ ${pSum.toFixed(1)} mm`;
    }

    const topbarDot = document.getElementById("topbar-radar-dot");
    const panelDot = document.getElementById("live-panel-radar-dot");
    const modeDot = document.getElementById("dot-mode-live");
    [topbarDot, panelDot, modeDot].forEach(dot => {
      if (!dot) return;
      dot.className = "radar-pulse-dot";
      if (cur.temperature_2m >= 31.5) dot.classList.add("dot-alert");
      else if (cur.precipitation > 0 || pSum > 2) dot.classList.add("dot-rain");
    });

    // 2. Header de Panel en Vivo
    const statusText = document.getElementById("live-station-status-text");
    if (statusText) {
      statusText.textContent = isErrorOffline 
        ? "Caché Offline (Sin conexión a satélite)"
        : (isLive ? "Estación Satelital Open-Meteo Activa" : "Lectura Satelital en Caché");
    }

    const timeElem = document.getElementById("live-update-timestamp");
    if (timeElem) timeElem.textContent = `Actualizado: ${timeStr}`;

    // 3. Panel en Vivo Principal
    const liveIcon = document.getElementById("live-weather-icon");
    if (liveIcon) liveIcon.textContent = wmo.icon;

    const liveTemp = document.getElementById("live-temp-val");
    if (liveTemp) liveTemp.textContent = `${cur.temperature_2m.toFixed(1)} °C`;

    const liveCond = document.getElementById("live-condition-lbl");
    if (liveCond) {
      liveCond.textContent = `${wmo.label} (${cur.relative_humidity_2m}% HR)`;
    }

    const liveSub = document.getElementById("live-temp-sub");
    if (liveSub) {
      liveSub.textContent = `Sensación: ${cur.apparent_temperature.toFixed(1)} °C | Mín: ${tMin.toFixed(1)} °C / Máx: ${tMax.toFixed(1)} °C`;
    }

    // Quick Metrics
    const mRain = document.getElementById("live-metric-rain");
    if (mRain) {
      mRain.textContent = cur.precipitation > 0 ? `${cur.precipitation.toFixed(1)} mm/h` : `${pSum.toFixed(1)} mm`;
    }
    const mRainSub = document.getElementById("live-metric-rain-sub");
    if (mRainSub) {
      mRainSub.textContent = cur.precipitation > 0 ? `Lloviendo ahora | Hoy: ${pSum.toFixed(1)} mm` : `Hoy: ${pSum.toFixed(1)} mm (Prob. ${pProb}%)`;
    }

    const mWind = document.getElementById("live-metric-wind");
    if (mWind) mWind.textContent = `${cur.wind_speed_10m.toFixed(1)} km/h`;
    const mWindSub = document.getElementById("live-metric-wind-sub");
    if (mWindSub) mWindSub.textContent = `${cardinal} | Ráfaga: ${cur.wind_gusts_10m.toFixed(1)} km/h`;

    const mEto = document.getElementById("live-metric-eto");
    if (mEto) mEto.textContent = `${et0.toFixed(2)} mm/d`;
    const mEtoSub = document.getElementById("live-metric-eto-sub");
    if (mEtoSub) mEtoSub.textContent = `Rad: ${rad.toFixed(1)} MJ/m²·d`;

    // 4. Renderizar Tira Horaria
    this.renderForecastStrip(data.hourly);

    // 5. Actualizar la opción de ETo en vivo en Riego
    const optEto = document.getElementById("opt-live-et0");
    if (optEto) {
      optEto.textContent = `🔴 Hoy en Vivo (Open-Meteo FAO-56: ${et0.toFixed(2)} mm/d)`;
    }

    // 6. Si el modo activo es "live", actualizar las 6 métricas y la alerta principal
    if (this.currentMode === "live") {
      this.applyLiveToMainDashboard(data);
    }
  },

  renderForecastStrip(hourly) {
    const container = document.getElementById("forecast-strip-container");
    if (!container || !hourly || !hourly.time) return;

    // Buscar el índice de la hora actual
    const nowIso = new Date().toISOString().slice(0, 13);
    let startIdx = 0;
    for (let i = 0; i < hourly.time.length; i++) {
      if (hourly.time[i].startsWith(nowIso)) {
        startIdx = i;
        break;
      }
    }

    let html = "";
    const count = Math.min(12, hourly.time.length - startIdx);
    for (let i = 0; i < count; i++) {
      const idx = startIdx + i;
      const timeStr = hourly.time[idx];
      const hourPart = timeStr.split("T")[1] || "";
      const temp = hourly.temperature_2m[idx];
      const prob = hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0;
      const rainMm = hourly.precipitation ? hourly.precipitation[idx] : 0;
      const code = hourly.weather_code[idx];
      const wind = hourly.wind_speed_10m[idx];
      const wmo = this.getWmoInfo(code);

      const isNow = i === 0;
      const cardClass = isNow ? "forecast-card now-card" : "forecast-card";
      const hourLabel = isNow ? "Ahora" : hourPart;

      html += `
        <div class="${cardClass}" title="${wmo.label} a las ${hourPart} (${rainMm} mm)">
          <span class="f-hour">${hourLabel}</span>
          <span class="f-icon">${wmo.icon}</span>
          <span class="f-temp">${temp.toFixed(1)}°</span>
          <span class="f-rain" title="Probabilidad de lluvia ${prob}% | ${rainMm} mm">
            ${prob > 0 ? `💧 ${prob}%` : `0%`}
          </span>
          <span class="f-wind">💨 ${wind.toFixed(0)}k</span>
        </div>
      `;
    }
    container.innerHTML = html;
  },

  applyLiveToMainDashboard(data) {
    if (!data || !data.current || !data.daily) return;
    const cur = data.current;
    const daily = data.daily;
    const cardinal = this.getCardinal(cur.wind_direction_10m);

    const tMax = daily.temperature_2m_max ? daily.temperature_2m_max[0] : cur.temperature_2m;
    const tMin = daily.temperature_2m_min ? daily.temperature_2m_min[0] : cur.temperature_2m;
    const pSum = daily.precipitation_sum ? daily.precipitation_sum[0] : cur.precipitation;
    const pProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;
    const et0 = daily.et0_fao_evapotranspiration ? daily.et0_fao_evapotranspiration[0] : 6.36;
    const rad = daily.shortwave_radiation_sum ? daily.shortwave_radiation_sum[0] : 20.0;

    // 1. Métricas Principales (6 cards)
    const dispMax = document.getElementById("disp-temp-max");
    if (dispMax) dispMax.textContent = `${tMax.toFixed(1)} °C`;

    const dispMin = document.getElementById("disp-temp-min");
    if (dispMin) dispMin.textContent = `Mín: ${tMin.toFixed(1)} °C | Actual: ${cur.temperature_2m.toFixed(1)} °C`;

    const dispWind = document.getElementById("disp-wind-speed");
    if (dispWind) dispWind.textContent = `${cur.wind_speed_10m.toFixed(1)} km/h`;

    const dispWindDir = document.getElementById("disp-wind-dir");
    if (dispWindDir) dispWindDir.textContent = `Dir: ${cardinal} | Ráfaga: ${cur.wind_gusts_10m.toFixed(1)} km/h`;

    const dispRain = document.getElementById("disp-rain");
    if (dispRain) dispRain.textContent = `${pSum.toFixed(1)} mm`;

    const dispRainDesc = document.getElementById("disp-rain-desc");
    if (dispRainDesc) {
      dispRainDesc.textContent = cur.precipitation > 0 
        ? `Lloviendo ahora (${cur.precipitation.toFixed(1)} mm/h)` 
        : `Prob. lluvia hoy: ${pProb}%`;
    }

    const dispMuggy = document.getElementById("disp-muggy");
    if (dispMuggy) {
      const isMuggyNow = cur.relative_humidity_2m > 70 && cur.temperature_2m > 26;
      dispMuggy.textContent = isMuggyNow ? "Activo" : "Normal";
    }

    const dispMuggyRh = document.getElementById("disp-muggy-rh");
    if (dispMuggyRh) {
      dispMuggyRh.textContent = `HR actual: ${cur.relative_humidity_2m.toFixed(1)}% (${cur.relative_humidity_2m > 75 ? "bochorno húmedo" : "ambiente seco"})`;
    }

    const dispEto = document.getElementById("disp-eto");
    if (dispEto) dispEto.textContent = `${et0.toFixed(2)} mm/d`;

    const dispEtoVol = document.getElementById("disp-eto-vol");
    if (dispEtoVol) {
      const vol = (et0 * 1000) / 1000;
      dispEtoVol.textContent = `${vol.toFixed(1)} m³/d (1.000 m²)`;
    }

    const dispRad = document.getElementById("disp-solar-rad");
    if (dispRad) dispRad.textContent = `${rad.toFixed(1)} MJ/m²·d`;

    const dispSolarSub = document.getElementById("disp-solar-sub");
    if (dispSolarSub) {
      dispSolarSub.textContent = `${(rad / 3.6).toFixed(2)} kWh/m²·d (Open-Meteo Hoy)`;
    }

    // 2. Alerta Agroclimática en Tiempo Real
    const alertBox = document.getElementById("box-clima-alert");
    if (alertBox) {
      if (cur.temperature_2m >= 31.5 || tMax >= 32.0) {
        alertBox.className = "alert-box alert-warning";
        alertBox.innerHTML = `
          <div class="alert-icon">🔥</div>
          <div class="alert-content">
            <strong>🔴 ALERTA EN VIVO — Estrés Térmico en Quíbor (Actual ${cur.temperature_2m.toFixed(1)} °C | Máx prevista ${tMax.toFixed(1)} °C):</strong>
            La radiación acumulada (${rad.toFixed(1)} MJ/m²·d) y las altas temperaturas superan el umbral crítico (>31.5 °C). En tomate indeterminado existe riesgo inminente de aborto floral y deshidratación del polen. El parral a 3.00 m (con 1.00 m de colchón térmico sobre espaldera) drena el aire caliente lateralmente; mantenga pulsos de riego matutinos para sostener la turgencia foliar.
          </div>`;
      } else if (cur.precipitation > 0 || pSum >= 3.0 || pProb >= 40) {
        alertBox.className = "alert-box alert-success";
        alertBox.innerHTML = `
          <div class="alert-icon">🌧️</div>
          <div class="alert-content">
            <strong>🌧️ ALERTA EN VIVO — Previsión de Lluvias & Humedad en Quíbor (${cur.precipitation > 0 ? `${cur.precipitation.toFixed(1)} mm/h en curso` : `${pSum.toFixed(1)} mm previstos hoy, ${pProb}% prob.`}):</strong>
            La humedad relativa actual (${cur.relative_humidity_2m}%) eleva drásticamente el riesgo de <em>Botrytis cinerea</em> (moho gris) y tizón temprano (<em>Alternaria solani</em>). Se recomienda máxima ventilación convectiva a lo largo de las paredes laterales de 100 m para evacuar humedad acumulada y reducir temporalmente la lámina de riego.
          </div>`;
      } else if (cur.wind_gusts_10m >= 25.0) {
        alertBox.className = "alert-box alert-warning";
        alertBox.innerHTML = `
          <div class="alert-icon">💨</div>
          <div class="alert-content">
            <strong>💨 ALERTA EN VIVO — Ráfagas Eólicas Intensas en Quíbor (${cur.wind_speed_10m.toFixed(1)} km/h, ráfagas de ${cur.wind_gusts_10m.toFixed(1)} km/h desde ${cardinal}):</strong>
            Viento procedente del sector Este solicita la fachada barlovento de 20.00 m. Verifique la tensión de los 18 tirantes de guaya galvanizada de 3/8" y los anclajes de concreto ciclópeo a 45°.
          </div>`;
      } else {
        alertBox.className = "alert-box alert-warning";
        alertBox.innerHTML = `
          <div class="alert-icon">ℹ️</div>
          <div class="alert-content">
            <strong>🔴 CONDICIONES EN VIVO — Valle de Quíbor:</strong> Temperatura actual ${cur.temperature_2m.toFixed(1)} °C, viento ${cur.wind_speed_10m.toFixed(1)} km/h (${cardinal}), humedad ${cur.relative_humidity_2m}% y evapotranspiración FAO-56 de hoy de ${et0.toFixed(2)} mm/d (${(et0*1.0).toFixed(1)} m³/d en 1.000 m²). Condiciones óptimas para fotosíntesis protegida bajo malla 110 gsm.
          </div>`;
      }
    }

    // 3. Sincronizar Capa Límite de Hellmann con el viento en vivo
    const sliderHeight = document.getElementById("input-wind-height");
    if (sliderHeight) {
      updateBoundaryLayerDisplays(parseFloat(sliderHeight.value));
    }
  },

  setOfflineFallbackUI() {
    const statusText = document.getElementById("live-station-status-text");
    if (statusText) statusText.textContent = "Estación en Modo Desconectado";
    const topbarText = document.getElementById("topbar-live-text");
    if (topbarText) topbarText.textContent = "📡 Quíbor (Sin Red)";
  },

  syncAllToModules() {
    if (!this.lastData || !this.lastData.current) {
      alert("Aún no se han recibido datos de la estación satelital. Conéctese a internet o pulse Actualizar.");
      return;
    }
    const cur = this.lastData.current;
    const daily = this.lastData.daily;
    const et0 = daily && daily.et0_fao_evapotranspiration ? daily.et0_fao_evapotranspiration[0] : 6.36;

    // 1. Sincronizar Ventilación
    const inputExtTemp = document.getElementById("input-ext-temp");
    if (inputExtTemp) inputExtTemp.value = cur.temperature_2m.toFixed(1);
    const inputExtWind = document.getElementById("input-ext-wind");
    if (inputExtWind) inputExtWind.value = cur.wind_speed_10m.toFixed(1);

    if (typeof calculateVentilation === "function") {
      try { calculateVentilation(); } catch (e) { console.error(e); }
    }

    // 2. Sincronizar Riego
    const selectMonthEto = document.getElementById("select-month-et0");
    if (selectMonthEto) {
      selectMonthEto.value = "live";
    }

    if (typeof calculateIrrigation === "function") {
      try { calculateIrrigation(); } catch (e) { console.error(e); }
    }

    alert(`✅ Telemetría en vivo sincronizada con éxito:\n\n• Temp. Ambiente: ${cur.temperature_2m.toFixed(1)} °C\n• Viento a 10m: ${cur.wind_speed_10m.toFixed(1)} km/h\n• Demanda FAO-56 ETo: ${et0.toFixed(2)} mm/día\n\nLas calculadoras de Ventilación y Fertirriego han sido actualizadas.`);
  }
};
window.RealTimeWeatherService = RealTimeWeatherService;

// ==========================================================================
// 5. TAB 1: CLIMA & CAPA LÍMITE (MOTOR MULTIANUAL NASA POWER/MERRA-2 2024-2030)
// ==========================================================================
function initClimateTab() {
  const btnModeLive = document.getElementById("btn-mode-live");
  const btnModeHist = document.getElementById("btn-mode-hist");
  const panelLive = document.getElementById("box-clima-live-panel");
  const boxControls = document.getElementById("box-climate-controls");
  const boxPhase = document.getElementById("box-climate-phase");

  function setClimateMode(mode) {
    RealTimeWeatherService.currentMode = mode;
    if (mode === "live") {
      if (btnModeLive) btnModeLive.classList.add("active");
      if (btnModeHist) btnModeHist.classList.remove("active");
      if (panelLive) panelLive.style.display = "block";
      if (boxControls) boxControls.style.display = "none";
      if (boxPhase) boxPhase.style.display = "none";
      if (RealTimeWeatherService.lastData) {
        RealTimeWeatherService.applyLiveToMainDashboard(RealTimeWeatherService.lastData);
      } else {
        RealTimeWeatherService.fetchData();
      }
    } else {
      if (btnModeLive) btnModeLive.classList.remove("active");
      if (btnModeHist) btnModeHist.classList.add("active");
      if (panelLive) panelLive.style.display = "none";
      if (boxControls) boxControls.style.display = "grid";
      if (boxPhase) boxPhase.style.display = "block";
      const selectMonth = document.getElementById("select-month");
      const mIdx = selectMonth ? parseInt(selectMonth.value, 10) : 2;
      updateClimateDisplays(mIdx);
    }
  }

  if (btnModeLive) btnModeLive.addEventListener("click", () => setClimateMode("live"));
  if (btnModeHist) btnModeHist.addEventListener("click", () => setClimateMode("historical"));

  const btnRefresh = document.getElementById("btn-refresh-weather");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
      RealTimeWeatherService.fetchData(true);
    });
  }

  const btnSyncAll = document.getElementById("btn-sync-telemetry-all");
  if (btnSyncAll) {
    btnSyncAll.addEventListener("click", () => {
      RealTimeWeatherService.syncAllToModules();
    });
  }

  const topbarLive = document.getElementById("topbar-live-weather");
  if (topbarLive) {
    topbarLive.addEventListener("click", () => {
      const tabClimaBtn = document.getElementById("nav-item-clima");
      if (tabClimaBtn) tabClimaBtn.click();
      RealTimeWeatherService.fetchData(true);
    });
  }

  // Multianual Controls
  const selectYear = document.getElementById("select-climate-year");
  const selectMonth = document.getElementById("select-month");
  const sliderHeight = document.getElementById("input-wind-height");

  if (selectYear) {
    selectYear.addEventListener("change", () => {
      if (RealTimeWeatherService.currentMode === "historical") {
        const mIdx = selectMonth ? parseInt(selectMonth.value, 10) : 2;
        updateClimateDisplays(mIdx);
      }
    });
  }
  
  if (selectMonth) {
    selectMonth.addEventListener("change", () => {
      if (RealTimeWeatherService.currentMode === "historical") {
        updateClimateDisplays(parseInt(selectMonth.value, 10));
      }
    });
  }

  if (sliderHeight) {
    sliderHeight.addEventListener("input", () => {
      updateBoundaryLayerDisplays(parseFloat(sliderHeight.value));
    });
  }

  // Inicializar en modo En Vivo e iniciar lectura
  setClimateMode("live");
  RealTimeWeatherService.fetchData();

  // Polling automático cada 10 minutos
  setInterval(() => {
    RealTimeWeatherService.fetchData(false);
  }, 10 * 60 * 1000);
}

function updateClimateDisplays(monthIndex) {
  const selectYear = document.getElementById("select-climate-year");
  const yearStr = selectYear ? selectYear.value : "2026";
  const data = getCalculatedClimate(yearStr, monthIndex);
  if (!data) return;

  // 1. Actualizar Tarjetas de Métricas Principales (6 métricas bioclimáticas)
  const dispMax = document.getElementById("disp-temp-max");
  if (dispMax) dispMax.textContent = `${data.max.toFixed(1)} °C`;

  const dispMin = document.getElementById("disp-temp-min");
  if (dispMin) dispMin.textContent = `Mín: ${data.min.toFixed(1)} °C | Media: ${data.tmed.toFixed(1)} °C`;

  const dispWind = document.getElementById("disp-wind-speed");
  if (dispWind) dispWind.textContent = `${data.viento.toFixed(1)} km/h`;

  const dispWindDir = document.getElementById("disp-wind-dir");
  if (dispWindDir) dispWindDir.textContent = `Dir: ${data.dir} | Ráfaga: ${data.rafaga} km/h`;

  const dispRain = document.getElementById("disp-rain");
  if (dispRain) dispRain.textContent = `${data.lluvia} mm`;

  const dispRainDesc = document.getElementById("disp-rain-desc");
  if (dispRainDesc) {
    const diffSign = data.deltaRain >= 0 ? "+" : "";
    dispRainDesc.textContent = `${diffSign}${data.deltaRain}% vs media histórica`;
  }

  const dispMuggy = document.getElementById("disp-muggy");
  if (dispMuggy) dispMuggy.textContent = `${data.bochorno.toFixed(1)} d`;

  const dispMuggyRh = document.getElementById("disp-muggy-rh");
  if (dispMuggyRh) dispMuggyRh.textContent = `HR media: ${data.rh.toFixed(1)}% (${data.rh > 75 ? "bochorno" : "seco"})`;

  const dispEto = document.getElementById("disp-eto");
  if (dispEto) dispEto.textContent = `${data.eto.toFixed(2)} mm/d`;

  const dispEtoVol = document.getElementById("disp-eto-vol");
  if (dispEtoVol) {
    const volDia = (data.eto * 1000) / 1000;
    dispEtoVol.textContent = `${volDia.toFixed(1)} m³/d (1.000 m²)`;
  }

  const dispRad = document.getElementById("disp-solar-rad");
  if (dispRad) dispRad.textContent = `${data.rad.toFixed(1)} MJ/m²·d`;

  const dispSolarSub = document.getElementById("disp-solar-sub");
  if (dispSolarSub) {
    const kwh = (data.rad / 3.6).toFixed(2);
    dispSolarSub.textContent = `${kwh} kWh/m²·d (NASA POWER)`;
  }

  // 2. Banner de Fase Climática / ENSO
  const tagPhase = document.getElementById("tag-climate-phase");
  if (tagPhase) {
    tagPhase.className = `tag ${data.tagClass}`;
    tagPhase.textContent = `Año ${data.year}: ${data.fase}`;
  }

  const tagAnomaly = document.getElementById("tag-climate-anomaly");
  if (tagAnomaly) {
    const signT = data.deltaT >= 0 ? "+" : "";
    const signP = data.deltaRain >= 0 ? "+" : "";
    tagAnomaly.textContent = `ΔT: ${signT}${data.deltaT.toFixed(1)} °C | ΔP: ${signP}${data.deltaRain}%`;
  }

  const descPhase = document.getElementById("desc-climate-phase");
  if (descPhase) {
    descPhase.textContent = data.scenarioDesc;
  }

  // 3. Alerta Agroclimática Dinámica y Contextualizada
  const alertBox = document.getElementById("box-clima-alert");
  if (alertBox) {
    if (data.max >= 32.0 || (data.picoCalor && data.deltaT >= 0)) {
      alertBox.className = "alert-box alert-warning";
      alertBox.innerHTML = `
        <div class="alert-icon">🔥</div>
        <div class="alert-content">
          <strong>${data.mes} ${data.year} (Estrés Térmico — T.Máx ${data.max.toFixed(1)} °C):</strong> Máxima radiación (${data.rad} MJ/m²·d) y baja humedad (${data.rh}%). En estructuras bajas (&lt;2.5 m) el interior superará los 35-37 °C provocando aborto floral en tomate y esterilidad de polen. El parral a 3.00 m (con 1.00 m de colchón térmico libre sobre espaldar a 2.00 m) y pulsos de riego matutinos amortiguan el calentamiento en el dosel.
        </div>`;
    } else if (data.lluvia >= 90 || data.maxLluvia) {
      alertBox.className = "alert-box alert-success";
      alertBox.innerHTML = `
        <div class="alert-icon">🌧️</div>
        <div class="alert-content">
          <strong>${data.mes} ${data.year} (Pico de Lluvias — ${data.lluvia} mm acumulados):</strong> El bochorno alcanza ${data.bochorno} días/mes con HR de ${data.rh}%. La alta humedad relativa dentro del cultivo exige máxima ventilación convectiva a lo largo de las paredes laterales de 100 m para evitar brotes de <em>Botrytis cinerea</em> y tizón tardío.
        </div>`;
    } else if (data.viento >= 9.5 || data.maxViento) {
      alertBox.className = "alert-box alert-warning";
      alertBox.innerHTML = `
        <div class="alert-icon">💨</div>
        <div class="alert-content">
          <strong>${data.mes} ${data.year} (Pico Eólico — Viento ${data.viento.toFixed(1)} km/h, Ráfagas ${data.rafaga} km/h):</strong> Flujo sostenido del Este. Verifique la tensión de los 34 tirantes perimetrales a 45° y la sujeción de la malla 110 gsm 50 mesh blanca en la fachada barlovento Este de 20.00 m.
        </div>`;
    } else {
      alertBox.className = "alert-box alert-warning";
      alertBox.innerHTML = `
        <div class="alert-icon">ℹ️</div>
        <div class="alert-content">
          <strong>Condiciones ${data.mes} ${data.year}:</strong> Temperatura media de ${data.tmed.toFixed(1)} °C, viento de ${data.viento.toFixed(1)} km/h (${data.dir}) y evapotranspiración de ${data.eto.toFixed(2)} mm/d (${(data.eto * 1).toFixed(1)} m³/d en 1.000 m²). Mantenga la fracción de lavado LF por salinidad del pozo.
        </div>`;
    }
  }

  // 4. Sincronizar Capa Límite de Hellmann con el viento activo del año
  const sliderHeight = document.getElementById("input-wind-height");
  if (sliderHeight) {
    updateBoundaryLayerDisplays(parseFloat(sliderHeight.value));
  }
}

/**
 * Calcula la velocidad del viento corregida a una altura z aplicando el exponente de Hellmann (0.16 para terreno semiárido).
 * @param {number} v10 - Velocidad del viento medida a 10 metros de altura (km/h)
 * @param {number} z - Altura objetivo de evaluación o cumbrera (m)
 * @returns {number} Velocidad estimada del viento a la cota z (km/h)
 */
function getWindAtHeight(v10, z) {
  return v10 * Math.pow(z / 10.0, 0.16);
}

function updateBoundaryLayerDisplays(userHeight) {
  let v10 = 8.6;
  if (RealTimeWeatherService.currentMode === "live" && RealTimeWeatherService.lastData && RealTimeWeatherService.lastData.current) {
    v10 = RealTimeWeatherService.lastData.current.wind_speed_10m;
  } else {
    const selectYear = document.getElementById("select-climate-year");
    const selectMonth = document.getElementById("select-month");
    const yearStr = selectYear ? selectYear.value : "2026";
    const monthIdx = selectMonth ? parseInt(selectMonth.value, 10) : 2;
    const currentClimate = getCalculatedClimate(yearStr, monthIdx);
    v10 = currentClimate.viento;
  }

  // Cota de espaldar según planos actuales (2.00 m) y altura evaluada (por defecto 3.00 m techo parral)
  const v20 = getWindAtHeight(v10, 2.0);
  const vUser = getWindAtHeight(v10, userHeight);

  const valWind = document.getElementById("val-wind-height");
  if (valWind) valWind.textContent = `${userHeight.toFixed(1)} m`;

  const speed25m = document.getElementById("speed-25m");
  if (speed25m) speed25m.textContent = `${v20.toFixed(1)} km/h`;

  const diff22m = document.getElementById("diff-22m");
  if (diff22m) {
    const diff20Percent = ((v20 - v10) / v10) * 100;
    diff22m.textContent = `${diff20Percent.toFixed(1)}% respecto a 10m`;
  }

  const labelUser = document.getElementById("label-user-height");
  if (labelUser) {
    if (Math.abs(userHeight - 3.0) < 0.08) {
      labelUser.textContent = `A 3.00 m (Techo Parral Plano)`;
    } else if (Math.abs(userHeight - 2.0) < 0.08) {
      labelUser.textContent = `A 2.00 m (Espaldar Hortomalla)`;
    } else if (Math.abs(userHeight - 5.5) < 0.08) {
      labelUser.textContent = `A 5.50 m (Cumbrera Referencial)`;
    } else {
      labelUser.textContent = `A ${userHeight.toFixed(1)} m (Evaluación)`;
    }
  }

  const speedUser = document.getElementById("speed-user-height");
  if (speedUser) speedUser.textContent = `${vUser.toFixed(1)} km/h`;

  const speed10 = document.getElementById("speed-10m");
  if (speed10) speed10.textContent = `${v10.toFixed(1)} km/h`;

  const diffPercent = ((vUser - v10) / v10) * 100;
  const diffElem = document.getElementById("diff-user-height");
  if (diffElem) {
    diffElem.textContent = `${diffPercent > 0 ? "+" : ""}${diffPercent.toFixed(1)}% respecto a 10m`;
    diffElem.className = diffPercent < -15 ? "comp-diff danger" : "comp-diff success";
  }

  const noteUser = document.getElementById("note-user-height");
  if (noteUser) {
    if (Math.abs(userHeight - 3.0) < 0.08) {
      noteUser.textContent = "Colchón térmico superior: 1.00 m libre";
    } else if (userHeight <= 2.0) {
      noteUser.textContent = "Zona follaje y fruto (espaldera)";
    } else if (userHeight > 2.0 && userHeight < 3.0) {
      noteUser.textContent = `En colchón térmico (+${(userHeight - 2.0).toFixed(1)} m sobre espaldar)`;
    } else {
      noteUser.textContent = `Cota exterior (+${(userHeight - 3.0).toFixed(1)} m sobre techo)`;
    }
  }
}

// ==========================================================================
// 6. TAB 2: CALCULADORA EXTRACTORES EÓLICOS & VENTILACIÓN
// ==========================================================================
function initVentilationCalculator() {
  const inputs = [
    "input-ext-height",
    "input-ext-wind",
    "input-ext-grad",
    "input-ext-temp",
    "select-ext-diam",
    "input-ext-qty"
  ];

  inputs.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener("input", calculateVentilation);
      elem.addEventListener("change", calculateVentilation);
    }
  });

  const btnSyncVent = document.getElementById("btn-sync-vent-live");
  if (btnSyncVent) {
    btnSyncVent.addEventListener("click", () => {
      const liveTemp = (window.RealTimeWeatherService && window.RealTimeWeatherService.getLiveTemp()) || 25.0;
      const liveWind = (window.RealTimeWeatherService && window.RealTimeWeatherService.getLiveWind()) || 8.6;
      const elTemp = document.getElementById("input-ext-temp");
      const elWind = document.getElementById("input-ext-wind");
      if (elTemp) elTemp.value = liveTemp.toFixed(1);
      if (elWind) elWind.value = liveWind.toFixed(1);
      calculateVentilation();
    });
  }

  calculateVentilation();
}

/**
 * Dimensiona la tasa de extracción eólica unitaria y colectiva según la ecuación
 * termomecánica empírica oficial TurboExtractor (17" a 36") y calcula las RAH resultantes.
 */
function calculateVentilation() {
  const A = parseFloat(document.getElementById("input-ext-height").value) || 5.5;
  const V10 = parseFloat(document.getElementById("input-ext-wind").value) || 9.0;
  const G = parseFloat(document.getElementById("input-ext-grad").value) || 5.0;
  const T = parseFloat(document.getElementById("input-ext-temp").value) || 23.5;
  const diamFactor = parseFloat(document.getElementById("select-ext-diam").value) || 1.0;
  const qty = parseInt(document.getElementById("input-ext-qty").value, 10) || 8;

  // 1. Viento efectivo a la altura de montaje
  const Veff = getWindAtHeight(V10, A);

  // 2. Caudal unitario según fórmula oficial TurboExtractor 420mm (17")
  // Q = (0.818 + 0.0303 * A) * (121.5 + 103.4 * V + 11.6 * G + 5.6 * T)
  const factorAltura = 0.818 + 0.0303 * A;
  const parentesisTermomecanico = 121.5 + (103.4 * Veff) + (11.6 * G) + (5.6 * T);
  const qBase17 = factorAltura * parentesisTermomecanico;

  // Escalamiento por diámetro (24" = factor 2.0; 30" = 2.8; 36" = 4.5)
  const qUnit = qBase17 * diamFactor;
  const qTotal = qUnit * qty;

  // 3. RAH en volumen de 1.000 m² (suponiendo volumen promedio 5.500 m³ para cumbrera de 5.5m o proporcional a la altura)
  const volumenEstimado = 1000 * ((A + 2.5) / 2); // altura media
  const rahAlcanzado = qTotal / volumenEstimado;

  // 4. Unidades necesarias para alcanzar 60 RAH (330.000 m³/h sobre 5.500 m³)
  const qObjetivo60 = 5500 * 60; // 330.000 m³/h
  const unitsNeeded = Math.ceil(qObjetivo60 / qUnit);

  // Actualizar UI
  document.getElementById("res-wind-eff").textContent = `${Veff.toFixed(2)} km/h`;
  document.getElementById("res-q-unit").textContent = `${Math.round(qUnit).toLocaleString("es-ES")} m³/h`;
  document.getElementById("res-qty-label").textContent = qty;
  document.getElementById("res-q-total").textContent = `${Math.round(qTotal).toLocaleString("es-ES")} m³/h`;
  document.getElementById("res-rah-actual").textContent = `${rahAlcanzado.toFixed(2)} RAH`;
  document.getElementById("res-needed-units").textContent = `~${unitsNeeded} u.`;
}

// ==========================================================================
// 7. TAB 3: CALCULADORA FAO-56 & SALINIDAD (MERRA-2 & QUÍBOR CALIBRADO)
// ==========================================================================
// Evapotranspiración de Referencia ETo mensual NASA MERRA-2 (Valle de Quíbor 695 msnm)
const QUIBOR_MONTHLY_ETO = [
  5.4, // Enero
  5.8, // Febrero
  6.4, // Marzo (Pico de Calor y Radiación)
  6.2, // Abril
  5.6, // Mayo
  5.2, // Junio
  4.8, // Julio (Mínimo de demanda)
  5.1, // Agosto
  5.3, // Septiembre
  5.2, // Octubre
  4.9, // Noviembre
  5.0  // Diciembre
];

// Coeficientes Kc FAO-56 para Suelo Descubierto vs Acolchado Plástico Bicolor (Mulch)
// El mulch suprime el 75% del componente Ke de evaporación directa del suelo.
const FAO_STAGES_DATA = [
  {
    nombre: "Trasplante / Establecimiento",
    kcBare: 0.60,
    kcMulch: 0.45,
    desc: "0-3 semanas. Raíz superficial (<15 cm). Alta evaporación en suelo desnudo."
  },
  {
    nombre: "Crecimiento Vegetativo",
    kcBare: 0.80,
    kcMulch: 0.70,
    desc: "3-6 semanas. Crecimiento activo de tallo y hojas."
  },
  {
    nombre: "Floración - Cuajado",
    kcBare: 1.10,
    kcMulch: 0.98,
    desc: "6-10 semanas. Crítico: déficit hídrico aborta flores."
  },
  {
    nombre: "Fructificación - Cosecha",
    kcBare: 1.05,
    kcMulch: 0.95,
    desc: "Carga plena. Máxima transpiración del dosel vegetal."
  },
  {
    nombre: "Fin de Ciclo / Senescencia",
    kcBare: 0.90,
    kcMulch: 0.80,
    desc: "Maduración final y deshoje progresivo."
  }
];

function initIrrigationCalculator() {
  const inputs = [
    "select-crop",
    "select-stage",
    "select-month-et0",
    "select-soil-cover",
    "input-well-ec",
    "input-plant-density",
    "input-surface-m2",
    "input-bicarb-water",
    "input-bicarb-target"
  ];

  inputs.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener("change", calculateIrrigation);
      elem.addEventListener("input", calculateIrrigation);
    }
  });

  // Botones de ajuste rápido de fuente de agua
  const btnYacambu = document.getElementById("btn-quick-yacambu");
  const btnWell = document.getElementById("btn-quick-well");
  const inputEc = document.getElementById("input-well-ec");

  if (btnYacambu && inputEc) {
    btnYacambu.addEventListener("click", () => {
      inputEc.value = "0.5";
      calculateIrrigation();
    });
  }

  if (btnWell && inputEc) {
    btnWell.addEventListener("click", () => {
      inputEc.value = "1.4";
      calculateIrrigation();
    });
  }

  const btnExportCsv = document.getElementById("btn-export-fao-csv");
  if (btnExportCsv) {
    btnExportCsv.addEventListener("click", exportFAOCsv);
  }

  calculateIrrigation();
}

/**
 * Calcula la demanda hídrica fenológica FAO-56 ajustada por cobertura de suelo (mulch),
 * la fracción de lixiviación (LF) según conductividad eléctrica del pozo y la neutralización
 * química de bicarbonatos con ácido nítrico 60%.
 */
function calculateIrrigation() {
  const elCrop = document.getElementById("select-crop");
  const elStage = document.getElementById("select-stage");
  const elMonth = document.getElementById("select-month-et0");
  const elCover = document.getElementById("select-soil-cover");
  const elEcW = document.getElementById("input-well-ec");
  const elDensity = document.getElementById("input-plant-density");
  const elBicarb = document.getElementById("input-bicarb-water");
  const elBicarbTarget = document.getElementById("input-bicarb-target");

  if (!elCrop || !elStage) return;

  const crop = elCrop.value;
  const stageIdx = parseInt(elStage.value, 10) || 0;
  const monthIdx = elMonth ? parseInt(elMonth.value, 10) || 2 : 2;
  const hasMulch = elCover ? elCover.value === "mulch" : true;
  const ecW = elEcW ? parseFloat(elEcW.value) || 1.4 : 1.4;
  const density = elDensity ? parseFloat(elDensity.value) || 2.2 : 2.2;
  const bicarbWater = elBicarb ? parseFloat(elBicarb.value) || 4.2 : 4.2;
  const bicarbTarget = elBicarbTarget ? parseFloat(elBicarbTarget.value) || 0.5 : 0.5;

  // 1. Evapotranspiración base: En vivo Open-Meteo o mensual NASA MERRA-2
  let et0 = QUIBOR_MONTHLY_ETO[monthIdx] || 6.4;
  if (elMonth && elMonth.value === "live") {
    et0 = (window.RealTimeWeatherService && window.RealTimeWeatherService.getLiveEto()) || 6.36;
  }

  // 2. Coeficiente Kc corregido por cobertura
  const stageData = FAO_STAGES_DATA[stageIdx] || FAO_STAGES_DATA[3];
  const kc = hasMulch ? stageData.kcMulch : stageData.kcBare;

  // 3. Demanda neta de cultivo (ETc)
  const etcMmDay = et0 * kc;
  // Litros netos por planta y día = (ETc mm/día) / (pl/m²)
  const netLitersPlantDay = etcMmDay / density;
  const netLitersPlantWeek = netLitersPlantDay * 7.0;

  // 4. Umbral de tolerancia a salinidad según FAO-29 / Maas-Hoffman
  // Pimentón: ECe umbral = 1.5 dS/m (pendiente pérdida b = 14.0% por dS/m)
  // Tomate: ECe umbral = 2.5 dS/m (pendiente pérdida b = 9.9% por dS/m)
  const isPepper = crop === "pimenton";
  const ecE = isPepper ? 1.5 : 2.5;
  const slopeB = isPepper ? 14.0 : 9.9;

  // Fracción de lixiviación (Rhoades / FAO): LF = ECw / [5(ECe) - ECw]
  let lf = ecW / (5.0 * ecE - ecW);
  if (lf < 0.05) lf = 0.05;
  if (lf > 0.40) lf = 0.40; // Tope agronómico razonable

  // Riesgo de merma si no se aplica fracción de lavado (Maas-Hoffman)
  // Salinidad del suelo sin lavado saturante alcanza ~1.5 * ECw
  const projectedECe = ecW * 1.5;
  let yieldLossNoLeach = 0;
  if (projectedECe > ecE) {
    yieldLossNoLeach = (projectedECe - ecE) * slopeB;
  }

  // 5. Lámina bruta por planta (L/semana y L/día)
  const grossLitersPlantWeek = netLitersPlantWeek / (1.0 - lf);
  const grossLitersPlantDay = grossLitersPlantWeek / 7.0;

  // Demanda diaria total módulo configurable (por defecto 1.000 m²)
  const elSurface = document.getElementById("input-surface-m2");
  const surfaceM2 = elSurface ? parseFloat(elSurface.value) || 1000.0 : 1000.0;
  const totalPlants = surfaceM2 * density;
  const dailyM3Total = (grossLitersPlantDay * totalPlants) / 1000.0;

  // Actualizar estado centralizado para sincronizar con validación de pozo
  FarmState.grossLitersPlantDay = grossLitersPlantDay;
  FarmState.dailyDemandM3 = dailyM3Total;
  if (typeof calculateWellValidation === "function" && document.getElementById("well-test-flow")) {
    calculateWellValidation();
  }

  // 6. Neutralización Química de Bicarbonatos (HNO3 comercial 60%, densidad 1.35 kg/L)
  // Fórmula: Dose (L/m³) = (HCO3_agua - HCO3_obj) * 63.01 / (0.60 * 1.35 * 1000)
  const deltaBicarb = Math.max(0, bicarbWater - bicarbTarget);
  const acidDoseLPerM3 = deltaBicarb * 0.07779;
  const acidDailyLiters = acidDoseLPerM3 * dailyM3Total;
  // Aporte de Nitrógeno: meq/L * 14.007 = ppm N-NO3
  const nitrogenPpm = deltaBicarb * 14.007;

  // 7. Programación de Pulsos Diarios (Goteros PC 1.6 L/h por planta)
  // Tiempo total de riego necesario al día (minutos)
  const totalIrrigationHours = grossLitersPlantDay / 1.6; // 1.6 L/h
  const totalIrrigationMinutes = Math.round(totalIrrigationHours * 60);

  // Distribución circadiana en 4 pulsos (P1: 25%, P2: 28%, P3: 27%, P4: 20%)
  const p1 = Math.round(totalIrrigationMinutes * 0.25);
  const p2 = Math.round(totalIrrigationMinutes * 0.28);
  const p3 = Math.round(totalIrrigationMinutes * 0.27);
  const p4 = Math.max(10, totalIrrigationMinutes - (p1 + p2 + p3));

  // 8. Actualizar Interfaz de Usuario
  const elResEto = document.getElementById("res-fao-eto");
  const elResKc = document.getElementById("res-fao-kc");
  const elResEtc = document.getElementById("res-fao-etc");
  const elResLf = document.getElementById("res-fao-lf");
  const elResGrossPlant = document.getElementById("res-fao-liters-plant");
  const elResDailyM3 = document.getElementById("res-fao-daily-m3");
  const elResYieldRisk = document.getElementById("res-fao-yield-risk");

  if (elResEto) {
    const isLive = elMonth && elMonth.value === "live";
    elResEto.innerHTML = `${et0.toFixed(2)} mm/día ${isLive ? '<span class="tag" style="background:rgba(132,204,22,0.15); color:var(--apple-green-light); font-size:0.68rem; margin-left:0.3rem;">🔴 En Vivo</span>' : ''}`;
  }
  if (elResKc) elResKc.textContent = `${kc.toFixed(2)} ${hasMulch ? '(con Mulch)' : '(Suelo Desnudo)'}`;
  if (elResEtc) elResEtc.textContent = `${etcMmDay.toFixed(2)} mm/día (~${netLitersPlantWeek.toFixed(1)} L/pl/sem neto)`;
  if (elResLf) elResLf.textContent = `${(lf * 100).toFixed(1)} % de sobre-riego`;
  if (elResGrossPlant) elResGrossPlant.textContent = `${grossLitersPlantWeek.toFixed(1)} L / planta / semana`;
  if (elResDailyM3) elResDailyM3.textContent = `${dailyM3Total.toFixed(2)} m³ / día`;

  if (elResYieldRisk) {
    if (yieldLossNoLeach > 0) {
      elResYieldRisk.textContent = `-${yieldLossNoLeach.toFixed(1)}% si NO se lava`;
      elResYieldRisk.style.color = "#f87171";
    } else {
      elResYieldRisk.textContent = `0.0% (Dentro de tolerancia)`;
      elResYieldRisk.style.color = "#34d399";
    }
  }

  // Actualizar tarjeta de ácido nítrico
  const elAcidDose = document.getElementById("res-acid-dose-m3");
  const elAcidDaily = document.getElementById("res-acid-daily-liters");
  const elAcidN = document.getElementById("res-acid-n-ppm");

  if (elAcidDose) elAcidDose.textContent = `${acidDoseLPerM3.toFixed(3)} L / m³ agua`;
  if (elAcidDaily) elAcidDaily.textContent = `${acidDailyLiters.toFixed(2)} L / día HNO₃`;
  if (elAcidN) elAcidN.textContent = `${nitrogenPpm.toFixed(1)} ppm N-NO₃⁻`;

  // Actualizar pulsos
  const elP1 = document.getElementById("pulse-1-time");
  const elP2 = document.getElementById("pulse-2-time");
  const elP3 = document.getElementById("pulse-3-time");
  const elP4 = document.getElementById("pulse-4-time");
  const elTotMin = document.getElementById("res-total-irrigation-minutes");
  const elTotPlantDay = document.getElementById("res-total-daily-liters-plant");

  if (elP1) elP1.textContent = `${p1} min`;
  if (elP2) elP2.textContent = `${p2} min`;
  if (elP3) elP3.textContent = `${p3} min`;
  if (elP4) elP4.textContent = `${p4} min`;
  if (elTotMin) elTotMin.textContent = `${totalIrrigationMinutes} min (${(totalIrrigationMinutes / 60).toFixed(2)} h)`;
  if (elTotPlantDay) elTotPlantDay.textContent = `${grossLitersPlantDay.toFixed(2)} L / pl / día`;

  // Advertencia agronómica
  const adviceText = document.getElementById("salinity-advice-text");
  if (adviceText) {
    if (isPepper) {
      if (ecW >= 1.5) {
        adviceText.innerHTML = `<strong>⚠️ ALERTA DE SALINIDAD ALTA EN PIMENTÓN:</strong> El agua (${ecW} dS/m) supera el umbral crítico ($1.5\\text{ dS/m}$). Requiere obligatoriamente un <strong>${(lf * 100).toFixed(0)}% de sobre-riego de lavado</strong>. Si no se aplica, la merma productiva alcanzará el <strong>-${yieldLossNoLeach.toFixed(1)}%</strong> por quemado apical y necrosis radicular. Fraccione en los 4 pulsos calculados.`;
      } else {
        adviceText.innerHTML = `Para agua de pozo de <strong>${ecW} dS/m</strong> en pimentón, aplique un <strong>${(lf * 100).toFixed(0)}% extra de lavado</strong>. El suelo franco-arcilloso de Quíbor mantendrá las sales por debajo de los 40 cm activos mediante los 4 pulsos circadianos.`;
      }
    } else {
      if (ecW > 2.5) {
        adviceText.innerHTML = `<strong>⚠️ ALERTA TOMATE:</strong> Con agua de ${ecW} dS/m se excede el umbral de 2.5 dS/m. Requiere un <strong>${(lf * 100).toFixed(1)}% de lavado</strong> para evitar pudrición apical (*blossom-end rot*) por interferencia de calcio.`;
      } else {
        adviceText.innerHTML = `El tomate tolera hasta 2.5 dS/m con alto vigor. Con su agua de ${ecW} dS/m, la fracción de lavado es de <strong>${(lf * 100).toFixed(1)}%</strong>. Esta ligera conductividad controlada concentra azúcares y eleva los grados Brix (°Bx) sin mermar calibre.`;
      }
    }
  }

  // 9. Renderizar Tabla Resumen 12 Meses & Gráfico Canvas
  render12MonthFAO(density, surfaceM2, kc, hasMulch, lf, stageData);
}

/**
 * Genera la proyección mensual completa (12 meses) de demanda hídrica
 * y actualiza la tabla de datos y el gráfico Canvas 2D
 */
function render12MonthFAO(density, surfaceM2, kc, hasMulch, lf, stageData) {
  const months = [
    { name: "Enero", et0: 5.4, days: 31 },
    { name: "Febrero", et0: 5.8, days: 28 },
    { name: "Marzo", et0: 6.4, days: 31, peak: true },
    { name: "Abril", et0: 6.2, days: 30 },
    { name: "Mayo", et0: 5.6, days: 31 },
    { name: "Junio", et0: 5.2, days: 30 },
    { name: "Julio", et0: 4.8, days: 31, min: true },
    { name: "Agosto", et0: 5.1, days: 31 },
    { name: "Septiembre", et0: 5.3, days: 30 },
    { name: "Octubre", et0: 5.2, days: 31 },
    { name: "Noviembre", et0: 4.9, days: 30 },
    { name: "Diciembre", et0: 5.0, days: 31 }
  ];

  const totalPlants = surfaceM2 * density;
  const rowsData = [];

  const tbody = document.getElementById("tbody-fao-12months");
  if (tbody) tbody.innerHTML = "";

  months.forEach((m) => {
    const etc = m.et0 * kc;
    const netLitersDay = etc / density;
    const grossLitersDay = netLitersDay / (1.0 - lf);
    const m3Day = (grossLitersDay * totalPlants) / 1000.0;
    const m3Month = m3Day * m.days;

    rowsData.push({
      mes: m.name,
      et0: m.et0,
      kc: kc,
      etc: etc,
      grossLitersDay: grossLitersDay,
      m3Day: m3Day,
      m3Month: m3Month,
      peak: m.peak,
      min: m.min
    });

    if (tbody) {
      const tr = document.createElement("tr");
      if (m.peak) tr.style.backgroundColor = "rgba(239,68,68,0.12)";
      else if (m.min) tr.style.backgroundColor = "rgba(16,185,129,0.08)";
      
      tr.innerHTML = `
        <td><strong>${m.name}</strong> ${m.peak ? '🔥' : (m.min ? '❄️' : '')}</td>
        <td>${m.et0.toFixed(1)}</td>
        <td>${etc.toFixed(2)}</td>
        <td style="color:var(--emerald-light); font-weight:600;">${grossLitersDay.toFixed(2)} L</td>
        <td style="color:var(--cyan-light); font-weight:700;">${m3Day.toFixed(2)} m³</td>
        <td style="color:var(--amber-main); font-weight:700;">${m3Month.toFixed(0)} m³</td>
      `;
      tbody.appendChild(tr);
    }
  });

  // Guardar datos en FarmState para exportar a CSV
  FarmState.faoMonthlyData = rowsData;

  // Renderizar gráfico Canvas 2D
  drawFAOChart(rowsData);
}

/**
 * Dibuja un gráfico de barras mensual con Canvas 2D puro
 */
function drawFAOChart(rowsData) {
  const canvas = document.getElementById("canvas-fao-monthly");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 30;
  const chartW = w - paddingLeft - paddingRight;
  const chartH = h - paddingTop - paddingBottom;

  const maxVal = Math.max(...rowsData.map(r => r.m3Month)) * 1.18;

  // Líneas horizontales de cuadrícula
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";

  const numGrid = 4;
  for (let i = 0; i <= numGrid; i++) {
    const yVal = (maxVal / numGrid) * i;
    const y = paddingTop + chartH - (i / numGrid) * chartH;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(w - paddingRight, y);
    ctx.stroke();
    ctx.fillText(`${Math.round(yVal)}`, paddingLeft - 6, y + 3);
  }

  // Dibujar barras
  const n = rowsData.length;
  const barWidth = (chartW / n) * 0.65;
  const step = chartW / n;

  ctx.textAlign = "center";
  ctx.font = "9px 'Plus Jakarta Sans', sans-serif";

  rowsData.forEach((r, i) => {
    const barH = (r.m3Month / maxVal) * chartH;
    const x = paddingLeft + i * step + (step - barWidth) / 2;
    const y = paddingTop + chartH - barH;

    // Gradiente de color según consumo
    let grad = ctx.createLinearGradient(0, y, 0, y + barH);
    if (r.m3Month > 450 || r.peak) {
      grad.addColorStop(0, "#ef4444");
      grad.addColorStop(1, "#b91c1c");
    } else if (r.m3Month > 360) {
      grad.addColorStop(0, "#f59e0b");
      grad.addColorStop(1, "#d97706");
    } else {
      grad.addColorStop(0, "#10b981");
      grad.addColorStop(1, "#047857");
    }

    ctx.fillStyle = grad;
    if (typeof ctx.roundRect === "function") {
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
      ctx.fill();
    } else {
      ctx.fillRect(x, y, barWidth, barH);
    }

    // Etiqueta numérica sobre la barra
    ctx.fillStyle = "#f8fafc";
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.fillText(`${Math.round(r.m3Month)}`, x + barWidth / 2, y - 4);

    // Etiqueta del mes
    ctx.fillStyle = "#94a3b8";
    ctx.font = "9px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(r.mes.slice(0, 3), x + barWidth / 2, h - 12);
  });
}

/**
 * Exporta los datos de la proyección mensual FAO-56 a un archivo CSV
 */
function exportFAOCsv() {
  const data = FarmState.faoMonthlyData;
  if (!data || !data.length) return;

  const headers = [
    "Mes",
    "ETo_mm_dia",
    "Kc",
    "ETc_mm_dia",
    "Lamina_Bruta_L_pl_dia",
    "Demanda_Diaria_m3_dia",
    "Demanda_Mensual_m3_mes"
  ];
  const rows = data.map(d => [
    d.mes,
    d.et0.toFixed(2),
    d.kc.toFixed(2),
    d.etc.toFixed(2),
    d.grossLitersDay.toFixed(2),
    d.m3Day.toFixed(2),
    d.m3Month.toFixed(2)
  ]);

  let csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `demanda_hidrica_fao56_quibor.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================================================
// 8. TAB 4: MATRIZ DE PLAGAS Y FILTRADO
// ==========================================================================
function initPestMatrix() {
  const container = document.getElementById("pest-cards-container");
  if (!container) return;

  renderPestCards("all");

  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      renderPestCards(filter);
    });
  });
}

function renderPestCards(filter) {
  const container = document.getElementById("pest-cards-container");
  container.innerHTML = "";

  const filteredPests = PEST_DATA.filter(pest => {
    if (filter === "all") return true;
    return pest.estado === filter;
  });

  filteredPests.forEach(pest => {
    const card = document.createElement("div");
    card.className = "pest-card";

    const isRetained = pest.estado === "retiene";
    const badgeClass = isRetained ? "status-retiene" : "status-pasa";

    card.innerHTML = `
      <div class="pest-card-top">
        <div>
          <div class="pest-title">${pest.nombre}</div>
          <div class="pest-latin">${pest.cientifico}</div>
        </div>
        <span class="pest-status ${badgeClass}">${pest.estadoTexto}</span>
      </div>
      <div class="pest-damage">${pest.dano}</div>
      <div class="pest-section">
        <div class="pest-section-title">Comportamiento y Dispersión:</div>
        <div class="pest-control-text">${pest.vuelo}</div>
      </div>
      <div class="pest-section">
        <div class="pest-section-title">Malla Requerida:</div>
        <div class="pest-control-text highlight-cyan">${pest.malla}</div>
      </div>
      <div class="pest-section">
        <div class="pest-section-title">Control Químico (IRAC):</div>
        <div class="pest-control-text">${pest.quimico}</div>
      </div>
      <div class="pest-section">
        <div class="pest-section-title">Control Biológico (Fauna Auxiliar):</div>
        <div class="pest-control-text highlight-green">${pest.biologico}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ==========================================================================
// 9. TAB 5: VISUALIZADOR ESTRUCTURAL INTERACTIVO (CANVAS 2D/3D)
// ==========================================================================
function initCanvasVisualizer() {
  const canvas = document.getElementById("canvas-structure");
  if (!canvas) return;

  const checkboxes = [
    "chk-show-crop",
    "chk-trellis-mesh",
    "chk-show-wind",
    "chk-show-dims",
    "chk-show-tensores"
  ];

  checkboxes.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener("change", () => drawGreenhouseStructure());
    }
  });

  // Animación suave de los extractores girando
  let turbineAngle = 0;
  function animate() {
    turbineAngle += 0.05;
    drawGreenhouseStructure(turbineAngle);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

function drawGreenhouseStructure(angle = 0) {
  const canvas = document.getElementById("canvas-structure");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  const isSunlight = false;

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Background gradient (Obsidiana Vegetal Dark Agro)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, "#070c09");
  bgGrad.addColorStop(0.7, "#0c1510");
  bgGrad.addColorStop(1, "#111f17");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Toggles
  const showCrop = document.getElementById("chk-show-crop") ? document.getElementById("chk-show-crop").checked : true;
  const showTrellisMesh = document.getElementById("chk-trellis-mesh") ? document.getElementById("chk-trellis-mesh").checked : true;
  const showWind = document.getElementById("chk-show-wind") ? document.getElementById("chk-show-wind").checked : true;
  const showDims = document.getElementById("chk-show-dims") ? document.getElementById("chk-show-dims").checked : true;
  const showTensores = document.getElementById("chk-show-tensores") ? document.getElementById("chk-show-tensores").checked : true;

  // Ground level
  const groundY = h - 60;
  ctx.strokeStyle = isSunlight ? "#000000" : "#334155";
  ctx.lineWidth = isSunlight ? 3 : 2;
  ctx.beginPath();
  ctx.moveTo(30, groundY);
  ctx.lineTo(w - 30, groundY);
  ctx.stroke();

  // Soil hatching
  ctx.strokeStyle = isSunlight ? "rgba(0, 0, 0, 0.4)" : "rgba(71, 85, 105, 0.3)";
  ctx.lineWidth = 1;
  for (let x = 40; x < w - 40; x += 15) {
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x - 8, groundY + 12);
    ctx.stroke();
  }

  // 5 Naves Geometría (40m total)
  const startX = 130;
  const totalWidth = w - 240; // ~560px
  const numNaves = 5;
  const naveW = totalWidth / numNaves; // ~112px por nave (8m escala)

  // Escala vertical: 1 metro = 40 píxeles aprox.
  const scaleY = 40;
  const techoY = groundY - (3.00 * scaleY);
  const tutorY = groundY - (2.00 * scaleY);

  // Malla semitransparente que envuelve el techo de guayas y paredes
  ctx.fillStyle = isSunlight ? "rgba(6, 95, 70, 0.08)" : "rgba(16, 185, 129, 0.05)";
  ctx.beginPath();
  ctx.moveTo(startX, groundY);
  ctx.lineTo(startX, techoY);
  ctx.lineTo(startX + totalWidth, techoY);
  ctx.lineTo(startX + totalWidth, groundY);
  ctx.closePath();
  ctx.fill();

  // Pilares verticales tubulares (ÚNICOS TUBOS EN LA ESTRUCTURA - CERO TUBOS EN TECHO)
  ctx.strokeStyle = isSunlight ? "#000000" : "#94a3b8";
  ctx.lineWidth = isSunlight ? 3.5 : 3;
  for (let i = 0; i <= numNaves; i++) {
    const px = startX + i * naveW;
    ctx.beginPath();
    ctx.moveTo(px, groundY);
    ctx.lineTo(px, techoY);
    ctx.stroke();

    // Capitel pasacables en tope de pilar
    ctx.fillStyle = isSunlight ? "#0284c7" : "#38bdf8";
    ctx.fillRect(px - 4, techoY - 3, 8, 4);

    // Dados de concreto cimentación
    ctx.fillStyle = isSunlight ? "#cbd5e1" : "rgba(148, 163, 184, 0.25)";
    ctx.fillRect(px - 6, groundY, 12, 16);
    ctx.strokeStyle = isSunlight ? "#000000" : "rgba(148, 163, 184, 0.5)";
    ctx.strokeRect(px - 6, groundY, 12, 16);
  }

  // GUAYAS MAESTRAS DE TECHO (Cable de acero galvanizado 3/8" tensado - CERO ARCOS)
  ctx.strokeStyle = isSunlight ? "#0284c7" : "#38bdf8";
  ctx.lineWidth = isSunlight ? 3 : 2.5;
  ctx.beginPath();
  ctx.moveTo(startX, techoY);
  ctx.lineTo(startX + totalWidth, techoY);
  ctx.stroke();

  // Malla 50x25 HDPE cosida a las guayas (representada con línea segmentada verde)
  ctx.strokeStyle = isSunlight ? "#047857" : "#10b981";
  ctx.lineWidth = isSunlight ? 2 : 1.5;
  ctx.setLineDash([4, 2]);
  ctx.beginPath();
  ctx.moveTo(startX, techoY - 2);
  ctx.lineTo(startX + totalWidth, techoY - 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Tirantes verticales de soporte del tutorado que bajan de las guayas de techo
  ctx.strokeStyle = isSunlight ? "rgba(154, 52, 18, 0.7)" : "rgba(245, 158, 11, 0.4)";
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  for (let i = 0; i < numNaves; i++) {
    const cx = startX + i * naveW + naveW / 2;
    ctx.beginPath();
    ctx.moveTo(cx, techoY);
    ctx.lineTo(cx, tutorY);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Alambre tutorado español a 2.2m
  if (showCrop) {
    ctx.strokeStyle = isSunlight ? "rgba(154, 52, 18, 0.9)" : "rgba(245, 158, 11, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(startX, tutorY);
    ctx.lineTo(startX + totalWidth, tutorY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Plantas de tomate tutoradas (Malla Espaldera vs Hilo)
    drawTomatoPlants(ctx, startX, totalWidth, groundY, tutorY, showTrellisMesh, isSunlight);
  }

  // Tensores a tierra en la fachada ESTE (lado derecho del gráfico)
  if (showTensores) {
    const eastX = startX + totalWidth;
    const anchorX = eastX + 60;
    const anchorY = groundY + 10;

    // Guaya a 45°
    ctx.strokeStyle = isSunlight ? "#991b1b" : "#f43f5e";
    ctx.lineWidth = isSunlight ? 3 : 2.5;
    ctx.beginPath();
    ctx.moveTo(eastX, techoY);
    ctx.lineTo(anchorX, groundY);
    ctx.stroke();

    // Muerto de concreto subterráneo
    ctx.fillStyle = isSunlight ? "rgba(153, 27, 27, 0.2)" : "rgba(244, 63, 94, 0.3)";
    ctx.fillRect(anchorX - 10, groundY, 20, 24);
    ctx.strokeStyle = isSunlight ? "#991b1b" : "#f43f5e";
    ctx.strokeRect(anchorX - 10, groundY, 20, 24);

    // Etiqueta tensor
    ctx.fillStyle = isSunlight ? "#7f1d1d" : "#fda4af";
    ctx.font = "bold 10px var(--font-sans)";
    ctx.fillText("Guaya 3/8\" a 45° + Tensor 5/8\"", anchorX - 50, groundY - 10);
  }

  // Vector Viento Este (sopla de derecha a izquierda)
  if (showWind) {
    drawWindArrows(ctx, startX + totalWidth + 70, groundY - 100, isSunlight);
  }

  // Cotas y dimensiones
  if (showDims) {
    drawDimensions(ctx, startX, totalWidth, groundY, techoY, tutorY, isSunlight);
  }
}

function drawTurbine(ctx, x, y, angle) {
  ctx.save();
  ctx.translate(x, y - 8);

  // Base del extractor
  ctx.fillStyle = "#64748b";
  ctx.fillRect(-6, 2, 12, 6);

  // Cúpula esférica
  ctx.fillStyle = "#cbd5e1";
  ctx.beginPath();
  ctx.arc(0, -3, 9, 0, Math.PI * 2);
  ctx.fill();

  // Aspas giratorias con gradiente
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 1.5;
  const numAlabes = 6;
  for (let a = 0; a < numAlabes; a++) {
    const currentAngle = angle + (a * (Math.PI * 2 / numAlabes));
    const ax = Math.cos(currentAngle) * 8;
    const ay = Math.sin(currentAngle) * 4;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(ax, -3 + ay);
    ctx.stroke();
  }
  ctx.restore();
}

function drawTomatoPlants(ctx, startX, totalWidth, groundY, tutorY, showTrellisMesh = true, isSunlight = false) {
  // Si la Malla Espaldera está activa, dibujamos la cuadrícula de polipropileno continua (15×15 cm)
  if (showTrellisMesh) {
    const lowerWireY = groundY - 8; // Alambre guía inferior a 0.20 m
    
    // Alambre guía inferior (0.20 m)
    ctx.strokeStyle = isSunlight ? "rgba(0, 0, 0, 0.6)" : "rgba(148, 163, 184, 0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, lowerWireY);
    ctx.lineTo(startX + totalWidth, lowerWireY);
    ctx.stroke();

    // Líneas horizontales de la malla espaldera (cada 15 cm a escala ~6px)
    ctx.strokeStyle = isSunlight ? "rgba(154, 52, 18, 0.5)" : "rgba(245, 158, 11, 0.35)";
    ctx.lineWidth = 0.8;
    for (let gy = lowerWireY - 8; gy >= tutorY; gy -= 10) {
      ctx.beginPath();
      ctx.moveTo(startX, gy);
      ctx.lineTo(startX + totalWidth, gy);
      ctx.stroke();
    }

    // Líneas verticales de la malla espaldera cada 15 cm (escala ~11px)
    for (let gx = startX; gx <= startX + totalWidth; gx += 11) {
      ctx.beginPath();
      ctx.moveTo(gx, lowerWireY);
      ctx.lineTo(gx, tutorY);
      ctx.stroke();
    }

    // Badge visual en el lienzo canvas
    ctx.save();
    ctx.fillStyle = isSunlight ? "#ffffff" : "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = isSunlight ? "#000000" : "#10b981";
    ctx.lineWidth = isSunlight ? 2 : 1;
    ctx.fillRect(startX + 10, tutorY - 22, 330, 18);
    ctx.strokeRect(startX + 10, tutorY - 22, 330, 18);
    ctx.fillStyle = isSunlight ? "#047857" : "#34d399";
    ctx.font = "bold 9.5px sans-serif";
    ctx.fillText("MALLA ESPALDERA BIORIENTADA 15×15 cm (-88% MANO DE OBRA)", startX + 16, tutorY - 9);
    ctx.restore();
  }

  const step = 22;
  for (let px = startX + 15; px < startX + totalWidth; px += step) {
    if (!showTrellisMesh) {
      // Hilo tradicional de rafia individual (si el usuario apaga la malla tutora)
      ctx.strokeStyle = isSunlight ? "rgba(0, 0, 0, 0.5)" : "rgba(203, 213, 225, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, groundY);
      ctx.lineTo(px, tutorY);
      ctx.stroke();
    }

    // Follaje de la planta (verde esmeralda) entrelazado naturalmente en los cuadros
    ctx.fillStyle = isSunlight ? "rgba(6, 95, 70, 0.85)" : "rgba(16, 185, 129, 0.75)";
    for (let py = groundY - 10; py > tutorY + 8; py -= 18) {
      ctx.beginPath();
      ctx.ellipse(px - 4, py, 7, 4.5, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(px + 4, py - 6, 7, 4.5, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Frutos de tomate (rojo) apoyados por gravedad sobre la cuadrícula
    ctx.fillStyle = isSunlight ? "#991b1b" : "#f43f5e";
    ctx.beginPath();
    ctx.arc(px + 5, groundY - 35, 3.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px - 4, groundY - 45, 3.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWindArrows(ctx, x, y, isSunlight = false) {
  ctx.save();
  ctx.strokeStyle = isSunlight ? "#0284c7" : "#38bdf8";
  ctx.fillStyle = isSunlight ? "#0284c7" : "#38bdf8";
  ctx.lineWidth = 2;

  // Flechas del viento Este
  for (let i = 0; i < 3; i++) {
    const arrowY = y + i * 28;
    ctx.beginPath();
    ctx.moveTo(x, arrowY);
    ctx.lineTo(x - 50, arrowY);
    ctx.stroke();

    // Punta de flecha
    ctx.beginPath();
    ctx.moveTo(x - 50, arrowY);
    ctx.lineTo(x - 42, arrowY - 5);
    ctx.lineTo(x - 42, arrowY + 5);
    ctx.closePath();
    ctx.fill();
  }

  ctx.font = "bold 11px var(--font-sans)";
  ctx.fillStyle = isSunlight ? "#000000" : "#38bdf8";
  ctx.fillText("VIENTO DEL ESTE (Dominante)", x - 55, y - 12);
  ctx.font = "bold 10px var(--font-sans)";
  ctx.fillStyle = isSunlight ? "#1f2937" : "#94a3b8";
  ctx.fillText("88% horas / Ráfagas 27 km/h", x - 55, y + 95);
  ctx.restore();
}

function drawDimensions(ctx, startX, totalWidth, groundY, techoY, tutorY, isSunlight = false) {
  ctx.save();
  ctx.strokeStyle = isSunlight ? "#000000" : "#64748b";
  ctx.fillStyle = isSunlight ? "#000000" : "#94a3b8";
  ctx.font = "bold 10px var(--font-mono)";
  ctx.lineWidth = 1;

  // Cota de Ancho Total (20.00 m)
  const dimY = groundY + 38;
  ctx.beginPath();
  ctx.moveTo(startX, dimY);
  ctx.lineTo(startX + totalWidth, dimY);
  ctx.stroke();
  // Flechas
  ctx.strokeRect(startX, dimY - 4, 1, 8);
  ctx.strokeRect(startX + totalWidth, dimY - 4, 1, 8);
  ctx.fillText("20.00 m ANCHO (5 Franjas de 4.00 m) × 50.00 m LARGO (1.000 m²)", startX + totalWidth / 2 - 165, dimY - 6);

  // Cotas de Altura (Izquierda)
  const dimX = startX - 45;

  // Cota Techo de Guayas 3.00 m
  ctx.beginPath();
  ctx.moveTo(dimX, groundY);
  ctx.lineTo(dimX, techoY);
  ctx.stroke();
  ctx.strokeRect(dimX - 4, groundY, 8, 1);
  ctx.strokeRect(dimX - 4, techoY, 8, 1);
  ctx.fillText("Techo Guayas: 3.00 m", dimX - 110, (groundY + techoY) / 2);

  // Cota Espaldar 2.00 m
  ctx.fillStyle = isSunlight ? "#9a3412" : "#f59e0b";
  ctx.fillText("Espaldar Hortomalla: 2.00 m (Colchón 1.00 m)", startX + 10, tutorY - 5);

  ctx.restore();
}

// ==========================================================================
// 10. TAB 6: PLAN MAESTRO DE PRODUCCIÓN AGRONÓMICA (1.000 m² / 2.200 PLANTAS)
// ==========================================================================
const PROD_STAGES = [
  {
    idx: 0,
    nombre: "1. Enraizamiento / Establecimiento (Sem 1 a 3)",
    grossLiters: 11.1,
    netLiters: 9.4,
    lf: 15,
    dailyM3: 3.50,
    pulses: 3,
    pulseTime: 18,
    schedule: "08:00 | 11:30 | 15:00 (Sectores 1 y 2 en secuencia)",
    ec: "1.9 dS/m",
    ph: "5.8 - 6.0 (Relación N:K 1:1.3)",
    tankA: {
      total: "11.23 kg/sem",
      detail: "Nitrato de Calcio: 6.0 kg | Nitrato de Potasio: 5.0 kg | Fe-EDDHA: 0.23 kg"
    },
    tankB: {
      total: "7.64 kg/sem",
      detail: "MKP (0-52-34): 3.0 kg | K₂SO₄: 2.0 kg | MgSO₄: 2.5 kg | Boro: 0.04 kg | Micro: 0.10 kg"
    },
    tankC: {
      total: "~3.5 L/sem",
      detail: "Ácido Nítrico 60% (regula pH de gotero a 5.8 y neutraliza bicarbonatos)"
    }
  },
  {
    idx: 1,
    nombre: "2. Crecimiento Vegetativo (Sem 4 a 7)",
    grossLiters: 15.8,
    netLiters: 13.0,
    lf: 18,
    dailyM3: 4.98,
    pulses: 4,
    pulseTime: 19,
    schedule: "08:00 | 10:30 | 13:00 | 15:30 (Sectores 1 y 2 en secuencia)",
    ec: "2.2 dS/m",
    ph: "5.8 - 6.2 (Relación N:K 1:1.5)",
    tankA: {
      total: "21.35 kg/sem",
      detail: "AIFA Nitrato de Calcio: 11.0 kg | AIFA Nitrato de Potasio: 10.0 kg | Fe-EDDHA: 0.35 kg"
    },
    tankB: {
      total: "13.75 kg/sem",
      detail: "AIFA MKP: 4.0 kg | K₂SO₄: 5.0 kg | AIFA MgSO₄: 4.5 kg | Boro: 0.08 kg | Micro: 0.17 kg"
    },
    tankC: {
      total: "~7.0 L/sem",
      detail: "Ácido Nítrico 60% (neutraliza bicarbonatos de Quíbor a pH 5.9)"
    }
  },
  {
    idx: 2,
    nombre: "3. Floración y Cuajado (Sem 8 a 11)",
    grossLiters: 23.6,
    netLiters: 18.9,
    lf: 20,
    dailyM3: 7.42,
    pulses: 5,
    pulseTime: 22,
    schedule: "07:30 | 09:30 | 11:30 | 13:30 | 15:30 (Sectores 1 y 2 en secuencia)",
    ec: "2.5 dS/m",
    ph: "5.8 - 6.2 (Relación N:K 1:1.9)",
    tankA: {
      total: "33.95 kg/sem",
      detail: "AIFA Nitrato de Calcio: 16.0 kg | AIFA Nitrato de Potasio: 17.5 kg | Fe-EDDHA: 0.45 kg"
    },
    tankB: {
      total: "22.38 kg/sem",
      detail: "AIFA MKP: 6.0 kg | K₂SO₄: 9.0 kg | AIFA MgSO₄: 7.0 kg | Boro: 0.13 kg | Micro: 0.25 kg"
    },
    tankC: {
      total: "~10.0 L/sem",
      detail: "Ácido Nítrico 60% (neutraliza agua alcalina de pozo)"
    }
  },
  {
    idx: 3,
    nombre: "4. Fructificación Masiva y Cosecha (Sem 12 a 22)",
    grossLiters: 27.2,
    netLiters: 21.8,
    lf: 20,
    dailyM3: 8.55,
    pulses: 5,
    pulseTime: 28,
    schedule: "07:00 | 09:30 | 11:45 | 14:00 | 16:00 (Sectores 1 y 2 en secuencia)",
    ec: "2.7 dS/m",
    ph: "5.8 - 6.2 (Relación N:K 1:2.2)",
    tankA: {
      total: "26.05 kg/sem",
      detail: "AIFA Nitrato de Calcio: 18.0 kg | AIFA Nitrato de Potasio: 7.5 kg | Fe-EDDHA (6%): 0.55 kg"
    },
    tankB: {
      total: "40.45 kg/sem",
      detail: "AIFA Fructificación 12-6-36: 25.0 kg | AIFA MKP: 4.0 kg | K₂SO₄: 10.0 kg | AIFA MgSO₄: 8.0 kg | Boro: 0.15 kg"
    },
    tankC: {
      total: "~12.5 L/sem",
      detail: "Ácido Nítrico 60% (neutraliza bicarbonatos de Quíbor y aporta nitrógeno nítrico)"
    }
  },
  {
    idx: 4,
    nombre: "5. Fin de Ciclo / Cierre (Sem 23 a 24)",
    grossLiters: 18.8,
    netLiters: 16.0,
    lf: 15,
    dailyM3: 5.90,
    pulses: 4,
    pulseTime: 22,
    schedule: "08:00 | 11:00 | 13:30 | 15:30 (Sectores 1 y 2 en secuencia)",
    ec: "2.3 dS/m",
    ph: "5.8 - 6.2 (Relación N:K 2.0)",
    tankA: {
      total: "16.30 kg/sem",
      detail: "AIFA Nitrato de Calcio: 10.0 kg | Nitrato de Potasio: 6.0 kg | Fe-EDDHA: 0.30 kg"
    },
    tankB: {
      total: "21.15 kg/sem",
      detail: "AIFA 12-6-36: 12.5 kg | AIFA MKP: 3.0 kg | K₂SO₄: 5.0 kg | AIFA MgSO₄: 4.5 kg"
    },
    tankC: {
      total: "~8.0 L/sem",
      detail: "Ácido Nítrico 60% (limpieza y desincrustación de goteros)"
    }
  }
];

const SPRAY_MATRIX = [
  // =========================================================================
  // 1. PROGRAMA PREVENTIVO BIOLÓGICO & BIORACIONAL (RECOMENDADO POR DEFECTO)
  // =========================================================================
  {
    plan: "biologico",
    categoria: "acaros",
    blanco: "Araña Roja (Tetranychus urticae)",
    enfoque: "Acaristático Multisitio",
    activo: "Azufre Micronizado Elemental 80% WP",
    comercial: "Kumulus DF / Microthiol Special",
    distribuidor: "Agrotodo / Disagro",
    grupo: "FRAC M02",
    dosis100: "200 – 250 g",
    dosis20: "40 – 50 g / mochila",
    modo: "Preventivo de contacto al envés foliar. Aplicar en horas frescas (<28 °C). Cero riesgo de resistencia.",
    pc: "0 días",
    pcDias: 0
  },
  {
    plan: "biologico",
    categoria: "acaros",
    blanco: "Ácaros y Oídio (Derribo Rápido)",
    enfoque: "Bioracional Desecante",
    activo: "Extracto de Canela (Cinnamaldehído 70%)",
    comercial: "Cinnacure / E-Canela / Botánico",
    distribuidor: "Casas Agrícolas Quíbor",
    grupo: "Extracto Botánico",
    dosis100: "150 – 200 mL",
    dosis20: "30 – 40 mL / mochila",
    modo: "Deshidrata la cutícula de ácaros y micelio de oídio al contacto físico. Inocuo para la fauna benéfica.",
    pc: "0 días",
    pcDias: 0
  },
  {
    plan: "biologico",
    categoria: "acaros",
    blanco: "Limpieza de Melazas y Cutículas",
    enfoque: "Tensioactivo Limpiador",
    activo: "Sales Potásicas de Ácidos Grasos 50%",
    comercial: "Bioclean / Jabón Potásico Quíbor",
    distribuidor: "Agroquímicas Lara",
    grupo: "Jabón Potásico",
    dosis100: "300 – 400 mL",
    dosis20: "60 – 80 mL / mochila",
    modo: "Disuelve la capa cerosa de ninfas de mosca y ácaros y lava la fumagina. Facilita la acción de entomopatógenos.",
    pc: "0 días",
    pcDias: 0
  },
  {
    plan: "biologico",
    categoria: "vectores",
    blanco: "Mosca Blanca, Trips y Pulgones",
    enfoque: "Hongo Entomopatógeno",
    activo: "Beauveria bassiana (Cepa autóctona)",
    comercial: "Botanigard / Beauveril / Biostat UCLA",
    distribuidor: "FUSAGRI / UCLA / Agrotodo",
    grupo: "Microbiológico",
    dosis100: "150 – 200 g",
    dosis20: "30 – 40 g / mochila",
    modo: "Conidias parasitan ninfas y adultos. Aplicar al atardecer (>16:30 h) para evitar degradación solar UV.",
    pc: "0 días",
    pcDias: 0
  },
  {
    plan: "biologico",
    categoria: "vectores",
    blanco: "Repelencia y Supresión de Muda",
    enfoque: "Regulador Natural (Limonoide)",
    activo: "Extracto Puro de Neem (Azadiractina 1%)",
    comercial: "Neem-X / NeemAzal / BioNeem",
    distribuidor: "Agrotodo / Disagro",
    grupo: "Botánico Bioracional",
    dosis100: "150 – 200 mL",
    dosis20: "30 – 40 mL / mochila",
    modo: "Inhibidor de ecdisona (muda) y repelente de ovipostura. Aplicar perimetralmente en cortinas de malla.",
    pc: "0 días",
    pcDias: 0
  },
  {
    plan: "biologico",
    categoria: "lepidopteros",
    blanco: "Gusano Perforador y Cogollero",
    enfoque: "Bacteria Entomopatógena",
    activo: "Bacillus thuringiensis (kurstaki / aizawai)",
    comercial: "Dipel 2X / Thuricide / Bactospeine",
    distribuidor: "Disagro / Agrotodo",
    grupo: "IRAC 11A",
    dosis100: "100 – 150 g",
    dosis20: "20 – 30 g / mochila",
    modo: "Cristal endotoxina paraliza el tracto digestivo de orugas al alimentarse. Inocuo para abejas y fauna útil.",
    pc: "0 días",
    pcDias: 0
  },
  {
    plan: "biologico",
    categoria: "hongos",
    blanco: "Enfermedades Radiculares (Fusarium/Pythium)",
    enfoque: "Antagonista Fúngico de Suelo",
    activo: "Trichoderma harzianum / asperellum",
    comercial: "Trichosan / Tusal / FUSAGRI",
    distribuidor: "FUSAGRI / Agrotodo",
    grupo: "Fungicida Biológico",
    dosis100: "150 g en drench",
    dosis20: "30 g / mochila (cuello)",
    modo: "Micoparasitismo y competencia de espacio en el bulbo húmedo. Inocular en fertirriego cada 21 días.",
    pc: "0 días",
    pcDias: 0
  },
  {
    plan: "biologico",
    categoria: "hongos",
    blanco: "Oídio / Cenicilla (Leveillula)",
    enfoque: "Fungistático de Contacto",
    activo: "Bicarbonato de Potasio / Azufre Preventivo",
    comercial: "Kumulus DF / Bicarbonato Técnico",
    distribuidor: "Agroquímicas Quíbor",
    grupo: "FRAC M02",
    dosis100: "250 – 300 g",
    dosis20: "50 – 60 g / mochila",
    modo: "Altera el pH en la superficie de la hoja impidiendo la penetración de haustorios del oídio.",
    pc: "0 días",
    pcDias: 0
  },
  {
    plan: "biologico",
    categoria: "virus",
    blanco: "Virus Rugoso (ToBRFV) y Mosaico (TMV)",
    enfoque: "Inactivador Capsídico en Esclusa",
    activo: "Leche en Polvo Descremada al 10%",
    comercial: "Leche Descremada Comercial",
    distribuidor: "Distribución Local",
    grupo: "Bioseguridad",
    dosis100: "100 g / L agua",
    dosis20: "Batea de esclusa",
    modo: "Inmersión obligatoria de manos antes de ingresar. Las proteínas lácteas neutralizan la cápside viral.",
    pc: "Exento",
    pcDias: 0
  },
  {
    plan: "biologico",
    categoria: "virus",
    blanco: "Desinfección de Tijeras y Pediluvios",
    enfoque: "Viricida / Bactericida de Contacto",
    activo: "Virkon S al 1% / Amonio Cuaternario",
    comercial: "Virkon S / Saniquat 500",
    distribuidor: "Disagro / Agrotodo",
    grupo: "Bioseguridad",
    dosis100: "10 g / L agua",
    dosis20: "Pediluvio y tijeras",
    modo: "Desinfección de tijeras entre camellones de tomate y bandejas de calzado en la doble puerta.",
    pc: "Exento",
    pcDias: 0
  },

  // =========================================================================
  // 2. PROGRAMA QUÍMICO DE CHOQUE & RESCATE ROTACIONAL (IRAC / FRAC)
  // =========================================================================
  {
    plan: "quimico",
    categoria: "acaros",
    blanco: "Araña Roja y Ácaro Blanco (Choque)",
    enfoque: "Acaricida Translaminar",
    activo: "Abamectina 1.8% EC",
    comercial: "Vertimec / Acaramik / Agrimec",
    distribuidor: "Syngenta / Agrotodo",
    grupo: "IRAC 6",
    dosis100: "75 – 100 mL",
    dosis20: "15 – 20 mL / mochila",
    modo: "Translaminar. Parálisis muscular del ácaro. Dirigir rigurosamente al envés de la hoja.",
    pc: "3 días",
    pcDias: 3
  },
  {
    plan: "quimico",
    categoria: "acaros",
    blanco: "Huevos y Ninfas de Ácaro",
    enfoque: "Ovicida-Larvicida Químico",
    activo: "Hexitiazox 10% WP",
    comercial: "Caesar / Nissorun",
    distribuidor: "Arysta / UPL / Disagro",
    grupo: "IRAC 10A",
    dosis100: "50 – 60 g",
    dosis20: "10 – 12 g / mochila",
    modo: "Inhibidor de la muda. Corta el relevo generacional. Rotar estrictamente con IRAC 6.",
    pc: "7 días",
    pcDias: 7
  },
  {
    plan: "quimico",
    categoria: "acaros",
    blanco: "Ácaro Blanco y Mosca Blanca (Ninfas)",
    enfoque: "Inhibidor Síntesis de Lípidos",
    activo: "Spiromesifen 24% SC",
    comercial: "Oberon",
    distribuidor: "Bayer CropScience / Disagro",
    grupo: "IRAC 23",
    dosis100: "60 – 80 mL",
    dosis20: "12 – 16 mL / mochila",
    modo: "Bloquea síntesis de ácidos grasos (LBI). Larga residualidad curativa y ovicida.",
    pc: "3 días",
    pcDias: 3
  },
  {
    plan: "quimico",
    categoria: "vectores",
    blanco: "Trips Occidental (Frankliniella)",
    enfoque: "Modulador Receptor Nicotínico",
    activo: "Spinosad 48% SC / Spinetoram 6% SC",
    comercial: "Tracer / Delegate",
    distribuidor: "Corteva / Agrotodo",
    grupo: "IRAC 5",
    dosis100: "20 – 25 mL",
    dosis20: "4 – 5 mL / mochila",
    modo: "Activador alostérico nicotínico GABA. Aplicar al atardecer fresco en floración.",
    pc: "1 día",
    pcDias: 1
  },
  {
    plan: "quimico",
    categoria: "vectores",
    blanco: "Mosca Blanca y Pulgones Adultos",
    enfoque: "Neonicotinoide Sistémico",
    activo: "Acetamiprid 20% SP",
    comercial: "Mospilan",
    distribuidor: "UPL / Disagro",
    grupo: "IRAC 4A",
    dosis100: "35 – 50 g",
    dosis20: "7 – 10 g / mochila",
    modo: "Sistémico acropétalo de choque. Rotar con IRAC 29 para evitar tolerancia de mosca.",
    pc: "3 días",
    pcDias: 3
  },
  {
    plan: "quimico",
    categoria: "vectores",
    blanco: "Pulgones / Áfidos y Mosca",
    enfoque: "Bloqueador Selectivo de Estilete",
    activo: "Flonicamid 50% WG",
    comercial: "Teppeki / Beleaf",
    distribuidor: "ISK / Belchim / Disagro",
    grupo: "IRAC 29",
    dosis100: "15 – 20 g",
    dosis20: "3 – 4 g / mochila",
    modo: "Inhibe la alimentación en 30 minutos sin matar depredadores ni abejas.",
    pc: "1 día",
    pcDias: 1
  },
  {
    plan: "quimico",
    categoria: "lepidopteros",
    blanco: "Gusano Perforador del Fruto",
    enfoque: "Modulador Receptor Rianodina",
    activo: "Clorantraniliprol 20% SC",
    comercial: "Coragen / Rynaxypyr",
    distribuidor: "FMC / Agrotodo",
    grupo: "IRAC 28",
    dosis100: "15 – 20 mL",
    dosis20: "3 – 4 mL / mochila",
    modo: "Ovi-larvicida de alta potencia. Protege racimos florales y frutos en desarrollo.",
    pc: "1 día",
    pcDias: 1
  },
  {
    plan: "quimico",
    categoria: "hongos",
    blanco: "Oídio y Tizón Temprano",
    enfoque: "Triazol Sistémico Curativo",
    activo: "Difenoconazol 25% EC",
    comercial: "Score",
    distribuidor: "Syngenta / Agrotodo",
    grupo: "FRAC 3",
    dosis100: "40 – 50 mL",
    dosis20: "8 – 10 mL / mochila",
    modo: "Inhibidor de la desmetilación (DMI). Frena el avance de manchas necróticas.",
    pc: "7 días",
    pcDias: 7
  },
  {
    plan: "quimico",
    categoria: "hongos",
    blanco: "Tizón Temprano (Alternaria solani)",
    enfoque: "Fungicida Multisitio Protector",
    activo: "Clorotalonil 72% SC",
    comercial: "Daconil / Bravo",
    distribuidor: "Syngenta / Disagro",
    grupo: "FRAC M05",
    dosis100: "200 – 250 mL",
    dosis20: "40 – 50 mL / mochila",
    modo: "Bloquea la germinación de conidias. Excelente adherencia foliar ante rocío.",
    pc: "3 días",
    pcDias: 3
  },
  {
    plan: "quimico",
    categoria: "hongos",
    blanco: "Moho Gris (Botrytis cinerea)",
    enfoque: "Inhibidor Respiratorio SDHI",
    activo: "Boscalid 50% WG",
    comercial: "Cantus",
    distribuidor: "BASF / Agrotodo",
    grupo: "FRAC 7",
    dosis100: "50 – 60 g",
    dosis20: "10 – 12 g / mochila",
    modo: "Inhibidor complejo II mitocondrial. Clave en floración y heridas de despunte apical.",
    pc: "3 días",
    pcDias: 3
  },
  {
    plan: "quimico",
    categoria: "hongos",
    blanco: "Bacteriosis (Xanthomonas / Clavibacter)",
    enfoque: "Bactericida y Fungicida Protector",
    activo: "Oxicloruro de Cobre + Mancozeb",
    comercial: "Cobrethane / Cupravit",
    distribuidor: "Disagro / Agrotodo",
    grupo: "FRAC M01+M03",
    dosis100: "250 g + 200 g",
    dosis20: "50 g + 40 g / mochila",
    modo: "Barrera protectora de iones Cu++ tras deschuponado y deshoje basal.",
    pc: "7 días",
    pcDias: 7
  }
];

function initProductionTab() {
  const selectStage = document.getElementById("select-prod-stage");
  const selectWater = document.getElementById("select-water-source");
  const selectFertilizer = document.getElementById("select-fertilizer-source");

  // Sincronizar selectores con FarmState
  if (selectStage) selectStage.value = String(FarmState.prodStageIdx);
  if (selectWater) selectWater.value = FarmState.waterSource;
  if (selectFertilizer) selectFertilizer.value = FarmState.fertilizerRegime;

  if (selectStage) {
    selectStage.addEventListener("change", (e) => {
      FarmState.setState({ prodStageIdx: parseInt(e.target.value, 10) });
      updateProductionStage();
    });
  }

  if (selectWater) {
    selectWater.addEventListener("change", (e) => {
      FarmState.setState({ waterSource: e.target.value });
      updateProductionStage();
    });
  }

  if (selectFertilizer) {
    selectFertilizer.addEventListener("change", (e) => {
      FarmState.setState({ fertilizerRegime: e.target.value });
      updateProductionStage();
    });
  }

  // Suscribir recálculo reactivo
  FarmState.subscribe((state, changed) => {
    if (changed && (changed.prodStageIdx !== undefined || changed.waterSource !== undefined || changed.fertilizerRegime !== undefined)) {
      if (selectStage && selectStage.value !== String(state.prodStageIdx)) selectStage.value = String(state.prodStageIdx);
      if (selectWater && selectWater.value !== state.waterSource) selectWater.value = state.waterSource;
      if (selectFertilizer && selectFertilizer.value !== state.fertilizerRegime) selectFertilizer.value = state.fertilizerRegime;
      updateProductionStage();
    }
  });

  updateProductionStage();
  initSprayPlanControls();
  initSprayFilterButtons();
  updateSprayPlanBanner();
  renderSprayMatrix();
}

function updateProductionStage() {
  const stageIdx = FarmState.prodStageIdx;
  const data = PROD_STAGES[stageIdx] || PROD_STAGES[3];
  const isYacambu = FarmState.waterSource === "yacambu";

  // Water source adjustment
  const lfPercent = isYacambu ? 6.5 : data.lf;
  const lfFactor = lfPercent / 100.0;
  const grossLiters = data.netLiters / (1.0 - lfFactor);
  const dailyM3 = (grossLiters * 2200) / 7.0 / 1000.0;
  const pulseQty = isYacambu ? Math.max(3, data.pulses - 1) : data.pulses;
  const pulseTime = isYacambu ? data.pulseTime - 2 : data.pulseTime;

  // Acid calculation
  let acidText = data.tankC.total;
  let acidDetail = data.tankC.detail;
  if (isYacambu) {
    const rawVal = parseFloat(data.tankC.total.replace("~", "").replace(" L/sem", "")) || 12.5;
    const reducedAcid = Math.max(2, Math.round(rawVal * 0.36));
    acidText = `~${reducedAcid}.0 L/sem (-64% gasto)`;
    acidDetail = "Ácido Nítrico 60% reducido (agua dulce Yacambú con bajos bicarbonatos, CE = 0.5 dS/m)";
  }

  // Fertilizer source handling & recipes
  let tankATotal = data.tankA.total;
  let tankADetail = data.tankA.detail;
  let tankBTotal = data.tankB.total;
  let tankBDetail = data.tankB.detail;

  const fertAlertBox = document.getElementById("fertilizer-source-alert");
  const fertAlertText = document.getElementById("fertilizer-source-alert-text");
  const fertAlertIcon = document.getElementById("fertilizer-source-alert-icon");
  const elKpiYield = document.getElementById("disp-kpi-yield");
  const elKpiYieldSub = document.getElementById("disp-kpi-yield-sub");
  const elKpiYieldTag = document.getElementById("disp-kpi-yield-tag");

  if (FarmState.fertilizerRegime === "granulado") {
    if (elKpiYield) elKpiYield.textContent = "12.1 – 15.0 Ton";
    if (elKpiYieldSub) elKpiYieldSub.textContent = "5.5 a 6.8 kg/planta (605 – 750 cajas | 60-65% 1ª)";
    if (elKpiYieldTag) elKpiYieldTag.textContent = "Meta: 12.1 a 15.0 Ton (Granulado)";

    if (fertAlertBox && fertAlertText) {
      fertAlertBox.className = "alert-box alert-caution";
      if (fertAlertIcon) fertAlertIcon.textContent = "⚠️";
      fertAlertText.innerHTML = `<strong>Abonado Granulado Manual Edáfico (NPK 12-12-17 SOP + Sulfato de Potasio Granular):</strong> Aplicación manual a suelo descubierto cada 20 días en banda a 15 cm del tallo (32 g/planta = 70.4 kg/abonada = 1.5 sacos de 50 kg). Costo por saco 45% menor, pero causa <strong>merma productiva del 20-25% (12.1 a 15.0 Ton)</strong> por picos osmóticos de salinidad y absorción discontinua.`;
    }

    if (stageIdx === 3) {
      tankATotal = "0.55 kg/sem (Solo Quelato Fe)";
      tankADetail = "Fe-EDDHA (6%): 0.55 kg inyectado en goteo | Calcio y Potasio aportados al suelo vía Nitrato de Calcio granular y Sulfato de Potasio (SOP) granulado comercial.";
      tankBTotal = "1.50 kg/sem (Solo Foliar / B-Micro)";
      tankBDetail = "Microelementos quelatados: 0.30 kg | Ácido Bórico: 0.15 kg | Fósforo, Magnesio y K de fondo en suelo vía NPK 12-12-17+2MgO SOP.";
    }
  } else if (FarmState.fertilizerRegime === "hibrido") {
    if (elKpiYield) elKpiYield.textContent = "15.8 – 17.8 Ton";
    if (elKpiYieldSub) elKpiYieldSub.textContent = "7.1 a 8.0 kg/planta (790 – 890 cajas | 72-76% 1ª)";
    if (elKpiYieldTag) elKpiYieldTag.textContent = "Meta: 15.8 a 17.8 Ton (Híbrido)";

    if (fertAlertBox && fertAlertText) {
      fertAlertBox.className = "alert-box alert-success";
      if (fertAlertIcon) fertAlertIcon.textContent = "💡";
      fertAlertText.innerHTML = `<strong>Estrategia Híbrida Óptima para Quíbor:</strong> Fondo granulado al preparar el camellón (NPK 12-12-17 SOP a 30 g/m lin) + Fertirriego hidrosoluble AIFA en floración y cosecha. Proyecta <strong>15.8 a 17.8 Ton (7.1 a 8.0 kg/pl)</strong> con excelente relación costo/beneficio en Venezuela.`;
    }

    if (stageIdx === 3) {
      tankATotal = "19.00 kg/sem";
      tankADetail = "AIFA Nitrato de Calcio: 12.5 kg | AIFA Nitrato de Potasio: 6.0 kg | Fe-EDDHA (6%): 0.50 kg (complementa reserva de fondo en suelo).";
      tankBTotal = "27.50 kg/sem";
      tankBDetail = "AIFA Fructificación 12-6-36: 17.5 kg | AIFA MKP: 3.0 kg | K₂SO₄ soluble: 7.0 kg | AIFA MgSO₄: 5.0 kg.";
    }
  } else {
    // "aifa" (100% hidrosoluble)
    if (elKpiYield) elKpiYield.textContent = "16.5 – 18.7 Ton";
    if (elKpiYieldSub) elKpiYieldSub.textContent = "7.5 a 8.5 kg/planta (825 – 935 cajas | 75-80% 1ª)";
    if (elKpiYieldTag) elKpiYieldTag.textContent = "Meta: 16.5 a 18.7 Ton (AIFA Hidrosoluble)";

    if (fertAlertBox && fertAlertText) {
      fertAlertBox.className = "alert-box alert-success";
      if (fertAlertIcon) fertAlertIcon.textContent = "✨";
      fertAlertText.innerHTML = `<strong>Línea AIFA Hidrosoluble (Venezuela):</strong> Inyección continua y dosificada por cinta a 40 cm en 2 sectores (AIFA Fructificación 12-6-36 + Nitrato de Calcio AIFA + MKP AIFA). Eficiencia del 85-90% sin picos salinos. Proyecta <strong>7.5 a 8.5 kg/planta (16.5 a 18.7 Ton)</strong> con 75-80% fruta de Primera calidad.`;
    }
  }

  // UI elements
  const elGross = document.getElementById("prod-gross-liters");
  const elNet = document.getElementById("prod-net-liters");
  const elDaily = document.getElementById("prod-daily-m3");
  const elPulseQty = document.getElementById("prod-pulse-qty");
  const elPulseTime = document.getElementById("prod-pulse-time");
  const elTargetEc = document.getElementById("prod-target-ec");
  const elTargetPh = document.getElementById("prod-target-ph");
  const elSchedule = document.getElementById("prod-pulse-schedule");

  const elTankATotal = document.getElementById("prod-tank-a-total");
  const elTankADetail = document.getElementById("prod-tank-a-detail");
  const elTankBTotal = document.getElementById("prod-tank-b-total");
  const elTankBDetail = document.getElementById("prod-tank-b-detail");
  const elTankCTotal = document.getElementById("prod-tank-c-total");
  const elTankCDetail = document.getElementById("prod-tank-c-detail");

  const alertBox = document.getElementById("water-source-alert");
  const alertText = document.getElementById("water-source-alert-text");

  if (elGross) elGross.textContent = `${grossLiters.toFixed(1)} L/sem`;
  if (elNet) elNet.textContent = `Neto: ${data.netLiters.toFixed(1)} L + ${lfPercent.toFixed(1)}% Lavado`;
  if (elDaily) elDaily.textContent = `${dailyM3.toFixed(2)} m³/día`;
  if (elPulseQty) elPulseQty.textContent = `${pulseQty} pulsos / sector`;
  if (elPulseTime) elPulseTime.textContent = `Duración: ${pulseTime} min / sector (3 bloques)`;
  if (elTargetEc) elTargetEc.textContent = isYacambu ? `${(parseFloat(data.ec) - 0.4).toFixed(1)} dS/m (Yacambú Dulce)` : data.ec;
  if (elTargetPh) elTargetPh.textContent = `pH ${data.ph}`;
  if (elSchedule) elSchedule.textContent = isYacambu ? "07:30 | 09:30 | 11:30 | 13:30 | 15:30 (Sectores en secuencia)" : data.schedule;

  if (elTankATotal) elTankATotal.textContent = tankATotal;
  if (elTankADetail) elTankADetail.textContent = tankADetail;
  if (elTankBTotal) elTankBTotal.textContent = tankBTotal;
  if (elTankBDetail) elTankBDetail.textContent = tankBDetail;
  if (elTankCTotal) elTankCTotal.textContent = acidText;
  if (elTankCDetail) elTankCDetail.textContent = acidDetail;

  if (alertBox && alertText) {
    if (isYacambu) {
      alertBox.className = "alert-box alert-success";
      alertText.innerHTML = `<strong>Escenario Yacambú / Recarga Artificial (1 m³/s):</strong> Agua andina dulce (ECw = 0.5 dS/m). Fracción de lavado reducida a <strong>6.5% (consumo de ${dailyM3.toFixed(2)} m³/día, ahorro de ${(14.53 - dailyM3).toFixed(2)} m³/día)</strong> y ahorro del <strong>64% en ácido nítrico</strong>.`;
    } else {
      alertBox.className = "alert-box alert-caution";
      alertText.innerHTML = `<strong>Escenario Pozo Abatido (Actual CIDIAT-ULA):</strong> Cono a 546 msnm con sobreexplotación del 29%. Requiere <strong>20% de lavado salino (${dailyM3.toFixed(2)} m³/día)</strong> y ${acidText} de ácido para neutralizar bicarbonatos.`;
    }
  }
}

let currentSprayPlan = "biologico"; // 'biologico' (Recomendado) | 'quimico' | 'mip'
let currentSprayCategory = "all";

function initSprayPlanControls() {
  const planButtons = document.querySelectorAll("[data-spray-plan]");
  planButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      planButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSprayPlan = btn.getAttribute("data-spray-plan");
      updateSprayPlanBanner();
      renderSprayMatrix();
    });
  });
}

function updateSprayPlanBanner() {
  const banner = document.getElementById("spray-plan-banner");
  if (!banner) return;

  banner.className = "spray-plan-banner";

  if (currentSprayPlan === "biologico") {
    banner.classList.add("banner-bio");
    banner.innerHTML = `
      <div style="flex:1; min-width:280px;">
        <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap; margin-bottom:0.3rem;">
          <span class="tag" style="background:rgba(16,185,129,0.25); color:#34d399; font-weight:800; font-size:0.75rem;">⭐ PLAN PREVENTIVO RECOMENDADO (Base IPM)</span>
          <span style="font-size:0.85rem; color:#f8fafc; font-weight:700;">Blindaje Fitosanitario Permanente en Casa de Malla 50 Mesh</span>
        </div>
        <p style="font-size:0.8rem; color:#cbd5e1; margin:0 0 0.45rem 0; line-height:1.45;">
          Al retener físicamente al 98% de trips, moscas y polillas, la casa de malla permite operar con <strong>cero residuos químicos</strong>, preservando los ácaros depredadores naturales (<em>Phytoseiulus persimilis</em> y <em>Amblyseius swirskii</em>). La base se sustenta en hongos entomopatógenos, azufres protectores, jabones potásicos y extractos botánicos con <strong>0 días de carencia</strong> (cosecha diaria continua).
        </p>
        <div style="display:flex; gap:0.4rem; flex-wrap:wrap; font-size:0.72rem;">
          <span class="tag" style="background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.3);">⏱️ Carencia Promedio: 0 Días</span>
          <span class="tag" style="background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3);">🐝 Inocuo para Polinizadores</span>
          <span class="tag" style="background:rgba(168,85,247,0.15); color:#c084fc; border:1px solid rgba(168,85,247,0.3);">🛡️ Cero Riesgo de Resistencia</span>
        </div>
      </div>
    `;
  } else if (currentSprayPlan === "quimico") {
    banner.classList.add("banner-chem");
    banner.innerHTML = `
      <div style="flex:1; min-width:280px;">
        <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap; margin-bottom:0.3rem;">
          <span class="tag" style="background:rgba(245,158,11,0.25); color:#fbbf24; font-weight:800; font-size:0.75rem;">⚡ PROTOCOLO DE RESCATE QUÍMICO (IRAC / FRAC)</span>
          <span style="font-size:0.85rem; color:#f8fafc; font-weight:700;">Rotación Estricta por Modo de Acción contra Resistencia en Quíbor</span>
        </div>
        <p style="font-size:0.8rem; color:#cbd5e1; margin:0 0 0.45rem 0; line-height:1.45;">
          Intervención curativa de choque que se activa <strong>únicamente si el monitoreo supera los umbrales económicos de daño</strong> (ej. focos de ácaros &gt;5 ind/hoja). Prohibido aplicar el mismo grupo IRAC más de 2 veces consecutivas en el ciclo. Respete estrictamente los <strong>períodos de carencia (1 a 7 días)</strong> antes del corte comercial.
        </p>
        <div style="display:flex; gap:0.4rem; flex-wrap:wrap; font-size:0.72rem;">
          <span class="tag" style="background:rgba(244,63,94,0.15); color:#f43f5e; border:1px solid rgba(244,63,94,0.3);">⚠️ Respetar Carencia (1 a 7 días)</span>
          <span class="tag" style="background:rgba(245,158,11,0.15); color:#f59e0b; border:1px solid rgba(245,158,11,0.3);">🔄 Rotar 7 Familias Químicas</span>
          <span class="tag" style="background:rgba(239,68,68,0.15); color:#f87171; border:1px solid rgba(239,68,68,0.3);">🥽 Equipo de Protección Obligatorio</span>
        </div>
      </div>
    `;
  } else {
    banner.classList.add("banner-mip");
    banner.innerHTML = `
      <div style="flex:1; min-width:280px;">
        <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap; margin-bottom:0.3rem;">
          <span class="tag" style="background:rgba(56,189,248,0.25); color:#38bdf8; font-weight:800; font-size:0.75rem;">🔄 MANEJO INTEGRADO DE PLAGAS (MIP Completo)</span>
          <span style="font-size:0.85rem; color:#f8fafc; font-weight:700;">Visión Integral: Barrera de Malla + Base Biológica + Rescate Químico Rotacional</span>
        </div>
        <p style="font-size:0.8rem; color:#cbd5e1; margin:0 0 0.45rem 0; line-height:1.45;">
          Muestra la matriz completa de 21 herramientas fitosanitarias disponibles en Venezuela para el ciclo de 2.200 plantas de tomate en Quíbor. Prioriza siempre el control biológico y activa el químico solo ante contingencias puntuales.
        </p>
        <div style="display:flex; gap:0.4rem; flex-wrap:wrap; font-size:0.72rem;">
          <span class="tag" style="background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.3);">🌿 10 Herramientas Biológicas</span>
          <span class="tag" style="background:rgba(245,158,11,0.15); color:#f59e0b; border:1px solid rgba(245,158,11,0.3);">⚡ 11 Rescates Químicos</span>
          <span class="tag" style="background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3);">🛡️ Bioseguridad ToBRFV</span>
        </div>
      </div>
    `;
  }
}

function initSprayFilterButtons() {
  const buttons = document.querySelectorAll("[data-spray-filter]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSprayCategory = btn.getAttribute("data-spray-filter");
      renderSprayMatrix();
    });
  });
}

function renderSprayMatrix() {
  const tbody = document.getElementById("spray-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  // 1. Filtrar por Plan
  let filtered = SPRAY_MATRIX.filter(item => {
    if (currentSprayPlan === "mip") return true;
    if (currentSprayPlan === "biologico") {
      return item.plan === "biologico" || item.plan === "bioseguridad";
    }
    if (currentSprayPlan === "quimico") {
      return item.plan === "quimico" || item.plan === "bioseguridad";
    }
    return true;
  });

  // 2. Filtrar por Categoría
  if (currentSprayCategory !== "all") {
    filtered = filtered.filter(item => item.categoria === currentSprayCategory);
  }

  if (filtered.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="8" style="text-align:center; padding:1.5rem; color:#94a3b8;">No se encontraron registros para este filtro bajo el plan seleccionado.</td>`;
    tbody.appendChild(tr);
    return;
  }

  filtered.forEach(item => {
    const tr = document.createElement("tr");

    // Badge Enfoque
    let planBadge = `<span class="tag" style="background:rgba(16,185,129,0.2); color:#34d399; font-weight:700; font-size:0.7rem;">Biológico</span>`;
    if (item.plan === "quimico") {
      planBadge = `<span class="tag" style="background:rgba(245,158,11,0.2); color:#fbbf24; font-weight:700; font-size:0.7rem;">Químico Choque</span>`;
    } else if (item.plan === "bioseguridad" || item.categoria === "virus") {
      planBadge = `<span class="tag" style="background:rgba(56,189,248,0.2); color:#38bdf8; font-weight:700; font-size:0.7rem;">Bioseguridad</span>`;
    }

    // Badge Carencia
    let pcBadge = `<span class="status-badge" style="background:rgba(16,185,129,0.2); color:#34d399; font-weight:700; border:1px solid rgba(16,185,129,0.3);">${item.pc}</span>`;
    if (item.pcDias >= 7) {
      pcBadge = `<span class="status-badge" style="background:rgba(244,63,94,0.2); color:#f43f5e; font-weight:700; border:1px solid rgba(244,63,94,0.4);">${item.pc}</span>`;
    } else if (item.pcDias > 0) {
      pcBadge = `<span class="status-badge" style="background:rgba(245,158,11,0.2); color:#fbbf24; font-weight:700; border:1px solid rgba(245,158,11,0.3);">${item.pc}</span>`;
    }

    // Grupo IRAC / FRAC color
    let groupBadge = `<span class="tag" style="background:rgba(255,255,255,0.06); color:#cbd5e1; font-size:0.72rem; padding:0.15rem 0.45rem; border:1px solid rgba(255,255,255,0.1);">${item.grupo}</span>`;
    if (item.grupo.includes("IRAC")) {
      groupBadge = `<span class="tag" style="background:rgba(168,85,247,0.2); color:#c084fc; border:1px solid rgba(168,85,247,0.35); font-size:0.72rem; font-weight:700;">${item.grupo}</span>`;
    } else if (item.grupo.includes("FRAC")) {
      groupBadge = `<span class="tag" style="background:rgba(56,189,248,0.2); color:#38bdf8; border:1px solid rgba(56,189,248,0.35); font-size:0.72rem; font-weight:700;">${item.grupo}</span>`;
    }

    tr.innerHTML = `
      <td>
        <strong style="color:#ffffff; font-size:0.85rem;">${item.blanco}</strong>
        <div style="font-size:0.72rem; color:#94a3b8; margin-top:0.2rem;">${item.enfoque || ''}</div>
      </td>
      <td>${planBadge}</td>
      <td style="font-size:0.8rem; color:#f1f5f9;">${item.activo}</td>
      <td>
        <strong style="color:#38bdf8; font-size:0.82rem;">${item.comercial}</strong>
        <div style="font-size:0.68rem; color:#64748b; margin-top:0.15rem;">${item.distribuidor || 'Disponible en Lara'}</div>
      </td>
      <td>${groupBadge}</td>
      <td>
        <span class="spray-dose-badge">${item.dosis100}</span>
        <span class="spray-dose-backpack">${item.dosis20}</span>
      </td>
      <td style="font-size:0.78rem; color:#cbd5e1; max-width:240px; line-height:1.35;">${item.modo}</td>
      <td>${pcBadge}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ==========================================================================
// 11. PROTOCOLO DE VALIDACIÓN Y CERTIFICACIÓN DE POZO PROFUNDO
// ==========================================================================
function initWellValidationCalculator() {
  const inputs = [
    "well-test-flow",
    "well-test-nd",
    "well-test-res-vol",
    "well-test-lf"
  ];

  inputs.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener("input", calculateWellValidation);
      elem.addEventListener("change", calculateWellValidation);
    }
  });

  calculateWellValidation();
}

/**
 * Valida la suficiencia técnica y operativa del pozo profundo frente a la demanda hídrica
 * máxima calculada por el módulo FAO-56, evaluando horas de bombeo, HMT, potencia sugerida y días de reserva.
 */
function calculateWellValidation() {
  const flowLs = parseFloat(document.getElementById("well-test-flow")?.value) || 2.5;
  const nd = parseFloat(document.getElementById("well-test-nd")?.value) || 87.0;
  const resVol = parseFloat(document.getElementById("well-test-res-vol")?.value) || 80.0;
  const lfPercent = parseFloat(document.getElementById("well-test-lf")?.value) || 20.0;

  FarmState.setState({ wellFlowLs: flowLs });

  // 1. Demanda diaria pico para 2.200 plantas de tomate
  // Neta: 18.5 L/planta/semana = 2.643 L/planta/día
  const lfFrac = Math.min(Math.max(lfPercent / 100.0, 0.05), 0.40);
  const grossLitersPlantDay = FarmState.grossLitersPlantDay || (2.642857 / (1.0 - lfFrac));
  const dailyDemandM3 = FarmState.dailyDemandM3 || ((2200 * grossLitersPlantDay) / 1000.0);

  // 2. Caudal horario del pozo (m³/h)
  const flowM3h = flowLs * 3.6;

  // 3. Horas de bombeo diario
  const pumpHours = dailyDemandM3 / flowM3h;

  // 4. Altura Manométrica Total (HMT)
  // ND + 3.5m elevación + 4.5m fricción + 5.0m presión residual (0.5 bar)
  const hmt = nd + 13.0;
  const psi = hmt * 1.4223;
  const bar = hmt * 0.0980665;

  // 5. Potencia Teórica y Comercial Bomba (HP)
  // HP = (Q [L/s] * HMT [m]) / (75 * 0.62)
  const hpTheor = (flowLs * hmt) / (75.0 * 0.62);
  let hpSuggested = "3.0 a 5.0 HP";
  if (hpTheor > 7.5) {
    hpSuggested = "10.0 a 15.0 HP";
  } else if (hpTheor > 5.2) {
    hpSuggested = "7.5 a 10.0 HP";
  } else if (hpTheor > 3.5) {
    hpSuggested = "5.5 a 7.5 HP";
  }

  // 6. Autonomía del Reservorio (Días)
  const autonomyDays = resVol / dailyDemandM3;

  // 7. Actualizar UI
  const elDemand = document.getElementById("well-calc-daily-demand");
  const elHours = document.getElementById("well-calc-pump-hours");
  const elRate = document.getElementById("well-calc-pump-rate");
  const elHmt = document.getElementById("well-calc-hmt");
  const elPsi = document.getElementById("well-calc-psi");
  const elHp = document.getElementById("well-calc-hp");
  const elAutonomy = document.getElementById("well-calc-autonomy");

  if (elDemand) elDemand.textContent = `${dailyDemandM3.toFixed(2)} m³/día`;
  if (elHours) elHours.textContent = `${pumpHours.toFixed(2)} h / día`;
  if (elRate) elRate.textContent = `Caudal: ${flowM3h.toFixed(1)} m³/h (${flowLs.toFixed(2)} L/s)`;
  if (elHmt) elHmt.textContent = `${hmt.toFixed(1)} mca`;
  if (elPsi) elPsi.textContent = `~${Math.round(psi)} PSI | ~${bar.toFixed(1)} bar`;
  if (elHp) elHp.textContent = hpSuggested;
  if (elAutonomy) elAutonomy.textContent = `${autonomyDays.toFixed(1)} Días Continuos`;

  // Veredicto del Pozo
  const boxVerdict = document.getElementById("well-verdict-box");
  const iconVerdict = document.getElementById("well-verdict-icon");
  const titleVerdict = document.getElementById("well-verdict-title");
  const descVerdict = document.getElementById("well-verdict-desc");

  if (boxVerdict && iconVerdict && titleVerdict && descVerdict) {
    if (flowLs >= 2.0 && autonomyDays >= 3.0) {
      boxVerdict.className = "alert-box alert-success";
      iconVerdict.textContent = "✅";
      titleVerdict.textContent = "Pozo Aprobado para Casa de Malla (1.000 m²)";
      descVerdict.textContent = `El caudal de ${flowLs.toFixed(2)} L/s repone la demanda pico (${dailyDemandM3.toFixed(2)} m³/día) en apenas ${pumpHours.toFixed(2)} horas al día, con ${autonomyDays.toFixed(1)} días de reserva protegida en reservorio.`;
    } else if (flowLs >= 1.2) {
      boxVerdict.className = "alert-box alert-warning";
      iconVerdict.textContent = "⚠️";
      titleVerdict.textContent = "Pozo Aprobado Condicionado (Caudal Ajustado)";
      descVerdict.textContent = `El pozo requiere bombear ${pumpHours.toFixed(2)} horas/día. Se recomienda ampliar el reservorio a ≥ 80 m³ para blindar la operación ante contingencias eléctricas.`;
    } else {
      boxVerdict.className = "alert-box alert-danger";
      iconVerdict.textContent = "❌";
      titleVerdict.textContent = "Caudal Insuficiente / Alerta Crítica";
      descVerdict.textContent = `El caudal de ${flowLs.toFixed(2)} L/s exigiría ${pumpHours.toFixed(2)} horas de bombeo continuo diario, sobreexplotando el acuífero local con alto riesgo de agotamiento estival en marzo.`;
    }
  }
}

// ==========================================================================
// 12. MÓDULO DE CÁLCULO Y PROYECTO DE PERFORACIÓN DE POZO PROFUNDO
// ==========================================================================
// Parámetros hidrogeológicos calibrados Visual MODFLOW 4.1 (CIDIAT-ULA / SHYQ Quíbor)
const QUIBOR_AQUIFER = {
  transmissivityT: 180.0,    // m²/día (2.08e-3 m²/s)
  storativityS: 0.0025,      // Adimensional (confinado / semiconfinado)
  conductivityK: 22.0,       // m/día
  testFlowQ: 2.5,            // L/s (216 m³/día)
  r0Radius: 260.0            // Radio de influencia teórico a 24h bombeo
};

const WELL_LOCATIONS = {
  ARTESANAL: {
    name: "Pozo Artesanal a Pico Ø 80 cm (Bomba Sumergible 5.5 HP — Tandas al Achique)",
    cota: 700,
    depthDefault: 60,
    neBase: 52.0,
    ndBase: 57.0,
    drawdownBase: 5.0,
    ecW: 1.4,
    lf: 23.0,
    adductionCost: 0,
    adductionDesc: "Aducción directa 0 m al reservorio de 80 m³",
    pumpHp: "5.5 HP (Sumergible Industrial 120m — Tandas al Achique)",
    pumpDepth: 58,
    hmtBase: 65.0,
    isArtesanal: true,
    layers: [
      { depth: "0 – 15 m", desc: "Brocal y fuste superior excavado a pico Ø 80 cm encofrado con formaletas de 3 m", comp: "Formaletas 3m", cls: "layer-sanitary" },
      { depth: "15 – 50 m", desc: "Fuste excavado a pico Ø 80 cm encofrado en concreto y arena (Nivel actual 50 m)", comp: "Fuste Existente", cls: "layer-confining" },
      { depth: "50 – 55 m", desc: "<strong>Primer contacto freático (húmedo / recarga lateral 0.8-1.2 L/s)</strong> | NE ≈ 52 m", comp: "Afloramiento Somero", cls: "layer-aquifer-1" },
      { depth: "55 – 60 m", desc: "<strong>Profundización proyectada a pico (+10 m) en gravillas</strong> | Bomba 5.5 HP a 58 m con sondas", comp: "Profundización 10m", cls: "layer-aquifer-main" }
    ]
  },
  A60: {
    name: "Opción A1: Predio In Situ (Freático 60 m - Recarga Flanco Sur)",
    cota: 700,
    depthDefault: 120,
    neBase: 60.0,
    ndBase: 78.0,
    drawdownBase: 18.0,
    ecW: 1.4,
    lf: 23.0,
    adductionCost: 0,
    adductionDesc: "Aducción directa 0 m al reservorio (Ahorro energético con bomba 5.5 HP)",
    pumpHp: "5.5 HP",
    pumpDepth: 90,
    hmtBase: 91.0,
    layers: [
      { depth: "0 – 15 m", desc: "Arcillas limosas impermeables | <strong>Sello Sanitario Cemento-Bentonita Tremie</strong>", comp: "Sello 15 m", cls: "layer-sanitary" },
      { depth: "15 – 58 m", desc: "Arenas medias secas y arcillas grisáceas compactas", comp: "Tubo Ciego ASTM A53", cls: "layer-confining" },
      { depth: "58 – 78 m", desc: "<strong>Acuífero Superior / Lente de Grava y Arena</strong> | Nivel Estático NE = 60 m", comp: "Filtro Johnson 14 m", cls: "layer-aquifer-1" },
      { depth: "78 – 86 m", desc: "Estrato limo-arcilloso firme (Separador) | <em>Posición Bomba Sumergible 5.5 HP a 90 m</em>", comp: "Zona Bomba 5.5 HP", cls: "layer-confining" },
      { depth: "86 – 112 m", desc: "<strong>Acuífero Principal Quíbor-Atarigua: Gravas de Cuarzo y Lidita Limpias</strong>", comp: "Filtro Johnson 24 m", cls: "layer-aquifer-main" },
      { depth: "112 – 116 m", desc: "Arenas finas limosas transicionales", comp: "Tubo Ciego ASTM A53", cls: "layer-confining" },
      { depth: "116 – 120 m", desc: "Lutitas terciarias (Basamento Formación Morán) | <strong>Tubo Decantador + Tapón Cónico</strong>", comp: "Decantador 4 m", cls: "layer-bedrock" }
    ]
  },
  A70: {
    name: "Opción A2: Predio In Situ (Freático 70 m - Línea Base Estival)",
    cota: 700,
    depthDefault: 120,
    neBase: 70.0,
    ndBase: 88.0,
    drawdownBase: 18.0,
    ecW: 1.4,
    lf: 23.0,
    adductionCost: 0,
    adductionDesc: "Aducción directa 0 m al reservorio",
    pumpHp: "7.5 HP",
    pumpDepth: 98,
    hmtBase: 100.5,
    layers: [
      { depth: "0 – 15 m", desc: "Arcillas limosas impermeables | <strong>Sello Sanitario Cemento-Bentonita Tremie</strong>", comp: "Sello 15 m", cls: "layer-sanitary" },
      { depth: "15 – 68 m", desc: "Arenas medias secas y arcillas plásticas grisáceas compactas", comp: "Tubo Ciego ASTM A53", cls: "layer-confining" },
      { depth: "68 – 82 m", desc: "<strong>Lente de Grava Fina y Arena Cuarzosa</strong> | Nivel Estático NE = 70 m", comp: "Filtro Johnson 12 m", cls: "layer-aquifer-1" },
      { depth: "82 – 86 m", desc: "Arcilla limosa arenosa firme (Separador) | <em>Posición Bomba Sumergible a 98 m</em>", comp: "Zona Bomba 7.5 HP", cls: "layer-confining" },
      { depth: "86 – 112 m", desc: "<strong>Acuífero Principal Quíbor: Gravas de Cuarzo y Arenas Gruesas Limpias</strong>", comp: "Filtro Johnson 26 m", cls: "layer-aquifer-main" },
      { depth: "112 – 116 m", desc: "Arenas finas limosas transicionales", comp: "Tubo Ciego ASTM A53", cls: "layer-confining" },
      { depth: "116 – 120 m", desc: "Lutitas terciarias (Basamento Formación Morán) | <strong>Tubo Decantador + Tapón Cónico</strong>", comp: "Decantador 4 m", cls: "layer-bedrock" }
    ]
  },
  A: {
    // Alias para compatibilidad hacia atrás
    name: "Opción A1: Predio In Situ (Freático 60 m - Recarga Flanco Sur)",
    cota: 700,
    depthDefault: 120,
    neBase: 60.0,
    ndBase: 78.0,
    drawdownBase: 18.0,
    ecW: 1.4,
    lf: 23.0,
    adductionCost: 0,
    adductionDesc: "Aducción directa 0 m al reservorio",
    pumpHp: "5.5 HP",
    pumpDepth: 90,
    hmtBase: 91.0,
    layers: [
      { depth: "0 – 15 m", desc: "Arcillas limosas impermeables | <strong>Sello Sanitario Cemento-Bentonita Tremie</strong>", comp: "Sello 15 m", cls: "layer-sanitary" },
      { depth: "15 – 58 m", desc: "Arenas medias secas y arcillas grisáceas compactas", comp: "Tubo Ciego ASTM A53", cls: "layer-confining" },
      { depth: "58 – 78 m", desc: "<strong>Acuífero Superior / Lente de Grava y Arena</strong> | Nivel Estático NE = 60 m", comp: "Filtro Johnson 14 m", cls: "layer-aquifer-1" },
      { depth: "78 – 86 m", desc: "Estrato limo-arcilloso firme | <em>Posición Bomba Sumergible 5.5 HP a 90 m</em>", comp: "Zona Bomba 5.5 HP", cls: "layer-confining" },
      { depth: "86 – 112 m", desc: "<strong>Acuífero Principal Quíbor-Atarigua: Gravas de Cuarzo y Lidita Limpias</strong>", comp: "Filtro Johnson 24 m", cls: "layer-aquifer-main" },
      { depth: "112 – 116 m", desc: "Arenas finas limosas transicionales", comp: "Tubo Ciego ASTM A53", cls: "layer-confining" },
      { depth: "116 – 120 m", desc: "Lutitas terciarias (Basamento Formación Morán) | <strong>Tubo Decantador + Tapón Cónico</strong>", comp: "Decantador 4 m", cls: "layer-bedrock" }
    ]
  },
  B: {
    name: "Opción B: Piedemonte Sur (+3.0 km Sur)",
    cota: 750,
    depthDefault: 100,
    neBase: 50.0,
    ndBase: 68.0,
    drawdownBase: 18.0,
    ecW: 0.9,
    lf: 11.0,
    adductionCost: 17100, // 3.000 m PEAD 75mm PN10 ($13.500) + Booster intermedio ($3.600)
    adductionDesc: "Aducción 3.000 m PEAD 75mm PN10 + Booster intermedio + Servidumbre",
    pumpHp: "5.5 HP",
    pumpDepth: 78,
    hmtBase: 81.0,
    layers: [
      { depth: "0 – 15 m", desc: "Suelos aluviales permeables de piedemonte | <strong>Sello Sanitario Cemento Tremie</strong>", comp: "Sello 15 m", cls: "layer-sanitary" },
      { depth: "15 – 48 m", desc: "Conglomerados y arenas gruesas secas", comp: "Tubo Ciego ASTM A53", cls: "layer-confining" },
      { depth: "48 – 62 m", desc: "<strong>Acuífero Somero de Recarga Atarigua</strong> | Nivel Estático NE = 50 m", comp: "Filtro Johnson 14 m", cls: "layer-aquifer-1" },
      { depth: "62 – 70 m", desc: "Estrato limo-arenoso consolidado | <em>Posición Bomba Sumergible a 78 m</em>", comp: "Zona Bomba 5.5 HP", cls: "layer-confining" },
      { depth: "70 – 96 m", desc: "<strong>Acuífero de Piedemonte: Gravas gruesas limpias de alta permeabilidad</strong>", comp: "Filtro Johnson 26 m", cls: "layer-aquifer-main" },
      { depth: "96 – 100 m", desc: "Contacto Formación Morán | <strong>Tubo Decantador + Tapón</strong>", comp: "Decantador 4 m", cls: "layer-bedrock" }
    ]
  },
  C: {
    name: "Opción C: Centro Valle (+2.5 km N, Guadalupe)",
    cota: 660,
    depthDefault: 140,
    neBase: 98.0,
    ndBase: 122.0,
    drawdownBase: 24.0,
    ecW: 2.4,
    lf: 35.0,
    adductionCost: 1200,
    adductionDesc: "Conexión a red local secundaria (Requiere lavado salino 35%)",
    pumpHp: "12.5 HP",
    pumpDepth: 128,
    hmtBase: 138.0,
    layers: [
      { depth: "0 – 20 m", desc: "Limos arcillosos salinos y rellenos aluviales | <strong>Sello Sanitario Reforzado 20 m</strong>", comp: "Sello 20 m", cls: "layer-sanitary" },
      { depth: "20 – 96 m", desc: "Arenas medias desaturadas por sobreexplotación (Cono de abatimiento regional)", comp: "Tubo Ciego ASTM A53", cls: "layer-confining" },
      { depth: "96 – 108 m", desc: "<strong>Acuífero Deprimido Guadalupe</strong> | Nivel Estático NE = 98 m", comp: "Filtro Johnson 12 m", cls: "layer-aquifer-1" },
      { depth: "108 – 114 m", desc: "Lente arcilloso denso | <em>Posición Bomba de Alta Carga 12.5 HP a 128 m</em>", comp: "Zona Bomba 12.5 HP", cls: "layer-confining" },
      { depth: "114 – 136 m", desc: "<strong>Acuífero Profundo Centro-Valle (Sulfatado Cálcico)</strong>", comp: "Filtro Johnson 22 m", cls: "layer-aquifer-main" },
      { depth: "136 – 140 m", desc: "Lutitas negras Formación Paují/Morán | <strong>Tubo Decantador 4 m</strong>", comp: "Decantador 4 m", cls: "layer-bedrock" }
    ]
  }
};

function initWellDrillingCalculator() {
  const selLocation = document.getElementById("select-drill-location");
  const selDepth = document.getElementById("select-drill-depth");
  const selDrillDiam = document.getElementById("select-drill-diameter");
  const selCasingDiam = document.getElementById("select-casing-diameter");
  const selScreenType = document.getElementById("select-screen-type");
  const sliderDistance = document.getElementById("input-well-distance-slider");
  const numDistance = document.getElementById("input-well-distance");

  if (!selDepth || !selDrillDiam || !selCasingDiam || !selScreenType) return;

  // Sincronizar control deslizante e input numérico de distancia a pozo vecino
  if (sliderDistance && numDistance) {
    sliderDistance.addEventListener("input", (e) => {
      numDistance.value = e.target.value;
      recalculateDrillMetrics();
    });
    numDistance.addEventListener("input", (e) => {
      sliderDistance.value = e.target.value;
      recalculateDrillMetrics();
    });
  }

  // Tarjetas interactivas de ubicación y filas de la tabla comparativa
  const cardOptArtesanal = document.getElementById("loc-card-optArtesanal");
  const cardOptA60 = document.getElementById("loc-card-optA60");
  const cardOptA70 = document.getElementById("loc-card-optA70");
  const cardOptB = document.getElementById("loc-card-optB");
  const cardOptC = document.getElementById("loc-card-optC");
  const boxArtesanal = document.getElementById("artesanal-diagnosis-box");
  const boxShaft = document.getElementById("artesanal-shaft-box");

  function selectLocationCard(locKey) {
    if (selLocation) selLocation.value = locKey;
    [cardOptArtesanal, cardOptA60, cardOptA70, cardOptB, cardOptC].forEach(c => {
      if (c) {
        c.classList.remove("active");
        c.style.borderColor = "";
        c.style.background = "";
      }
    });

    let activeCard = cardOptArtesanal;
    if (locKey === "ARTESANAL") {
      activeCard = cardOptArtesanal;
    } else if (locKey === "A60" || locKey === "A") {
      activeCard = cardOptA60;
    } else if (locKey === "A70") {
      activeCard = cardOptA70;
    } else if (locKey === "B") {
      activeCard = cardOptB;
    } else if (locKey === "C") {
      activeCard = cardOptC;
    }

    if (activeCard) {
      activeCard.classList.add("active");
    }

    // Sincronizar filas de la tabla comparativa
    const compRows = document.querySelectorAll(".well-comparison-row");
    compRows.forEach(row => {
      const rLoc = row.getAttribute("data-loc");
      if (rLoc === locKey || (locKey === "A" && rLoc === "A60")) {
        row.classList.add("active");
      } else {
        row.classList.remove("active");
      }
    });

    // Mostrar/ocultar caja de diagnóstico y esquema visual del pozo artesanal
    const isArtesanal = (locKey === "ARTESANAL");
    if (boxArtesanal) {
      boxArtesanal.style.display = isArtesanal ? "block" : "none";
    }
    if (boxShaft) {
      boxShaft.style.display = isArtesanal ? "block" : "none";
    }

    // Deshabilitar/habilitar selectores industriales para el pozo artesanal (Paso 5.3)
    if (selDrillDiam) {
      selDrillDiam.disabled = isArtesanal;
      selDrillDiam.style.opacity = isArtesanal ? "0.55" : "1";
      selDrillDiam.title = isArtesanal ? "Fuste manual a pico Ø 80 cm (no aplica broca rotaria)" : "";
    }
    if (selCasingDiam) {
      selCasingDiam.disabled = isArtesanal;
      selCasingDiam.style.opacity = isArtesanal ? "0.55" : "1";
      selCasingDiam.title = isArtesanal ? "Fuste de Ø 80 cm encofrado con formaletas de 3 m (concreto + arena)" : "";
    }
    if (selScreenType) {
      selScreenType.disabled = isArtesanal;
      selScreenType.style.opacity = isArtesanal ? "0.55" : "1";
      selScreenType.title = isArtesanal ? "Fondo filtrante artesanal con tapón de grava cuarzosa 1/4\"" : "";
    }

    // Actualizar profundidad sugerida según ubicación
    const locData = WELL_LOCATIONS[locKey] || WELL_LOCATIONS.ARTESANAL;
    if (locData && selDepth) {
      selDepth.value = String(locData.depthDefault);
    }

    recalculateDrillMetrics();
  }

  // Click listeners para tarjetas
  if (cardOptArtesanal) cardOptArtesanal.addEventListener("click", () => selectLocationCard("ARTESANAL"));
  if (cardOptA60) cardOptA60.addEventListener("click", () => selectLocationCard("A60"));
  if (cardOptA70) cardOptA70.addEventListener("click", () => selectLocationCard("A70"));
  if (cardOptB) cardOptB.addEventListener("click", () => selectLocationCard("B"));
  if (cardOptC) cardOptC.addEventListener("click", () => selectLocationCard("C"));

  // Click listeners para filas de la tabla comparativa (Paso 5.1)
  const compRows = document.querySelectorAll(".well-comparison-row");
  compRows.forEach(row => {
    row.addEventListener("click", () => {
      const loc = row.getAttribute("data-loc");
      if (loc) selectLocationCard(loc);
    });
  });

  if (selLocation) {
    selLocation.addEventListener("change", (e) => {
      selectLocationCard(e.target.value);
    });
  }

  /**
   * Recalcula metrajes de tubería, empaque granular, sello sanitario, interferencia
   * de pozos vecinos (modelo Cooper-Jacob) y presupuesto itemizado para la modalidad seleccionada.
   */
  function recalculateDrillMetrics() {
    const locKey = selLocation ? selLocation.value : "ARTESANAL";
    const locData = WELL_LOCATIONS[locKey] || WELL_LOCATIONS.ARTESANAL;
    const depth = parseFloat(selDepth.value) || locData.depthDefault;
    const drillDiamInches = parseFloat(selDrillDiam.value) || 12.25;
    const casingDiamInches = parseFloat(selCasingDiam.value) || 6.0;
    const screenType = selScreenType.value || "johnson";
    const distanceM = numDistance ? parseFloat(numDistance.value) || 250.0 : 250.0;

    FarmState.setState({
      wellLocation: locKey,
      wellDepthM: depth,
      drillDiamInches: drillDiamInches,
      casingDiamInches: casingDiamInches,
      screenType: screenType
    });

    // 1. Cálculo de Interferencia de Pozos Vecinos (Cooper-Jacob)
    let deltaInterf = 0.0;
    const T = QUIBOR_AQUIFER.transmissivityT;
    const S = QUIBOR_AQUIFER.storativityS;
    const Q = 216.0; // m³/día (2.5 L/s)
    const t = 1.0;   // día

    if (distanceM < QUIBOR_AQUIFER.r0Radius) {
      const argLog = (2.25 * T * t) / (distanceM * distanceM * S);
      if (argLog > 1.0) {
        deltaInterf = (Q / (4.0 * Math.PI * T)) * Math.log(argLog);
      }
    }
    if (deltaInterf < 0) deltaInterf = 0;

    // Niveles hidrostáticos corregidos
    const correctedND = locData.ndBase + deltaInterf;
    const correctedHMT = correctedND + (locKey === "ARTESANAL" ? 6.5 : 13.0); // 6.5 mca para artesanal, 13 mca para perforado

    // Actualizar elementos de interferencia en UI
    const elInterfDrawdown = document.getElementById("disp-interf-drawdown");
    const elInterfSub = document.getElementById("disp-interf-sub");
    const elCorrectedNd = document.getElementById("disp-corrected-nd");
    const elCorrectedHmt = document.getElementById("disp-corrected-hmt");
    const elInterfStatus = document.getElementById("disp-interf-status");
    const elInterfStatusSub = document.getElementById("disp-interf-status-sub");

    const interfPsi = correctedHMT * 1.4223;
    if (elInterfDrawdown) elInterfDrawdown.textContent = `+${deltaInterf.toFixed(2)} m`;
    if (elInterfSub) elInterfSub.textContent = `A ${distanceM.toFixed(0)} m de pozo a 2.5 L/s`;
    if (elCorrectedNd) elCorrectedNd.textContent = `${correctedND.toFixed(2)} m`;
    if (elCorrectedHmt) elCorrectedHmt.textContent = `HMT = ${correctedHMT.toFixed(1)} mca (~${Math.round(interfPsi)} PSI)`;

    if (elInterfStatus && elInterfStatusSub) {
      if (distanceM < 120) {
        elInterfStatus.textContent = "⚠️ Alerta Crítica (Solapamiento)";
        elInterfStatus.style.color = "#f87171";
        elInterfStatusSub.textContent = "Solapamiento severo de conos de depresión. Riesgo de arrastre de arena.";
      } else if (distanceM < 250) {
        elInterfStatus.textContent = "⚠️ Interferencia Moderada";
        elInterfStatus.style.color = "#f59e0b";
        elInterfStatusSub.textContent = "Conos se intersectan. Se recomienda alternar bombeos.";
      } else {
        elInterfStatus.textContent = "✅ Distancia Segura";
        elInterfStatus.style.color = "#34d399";
        elInterfStatusSub.textContent = "Separación ≥ Radio de Influencia (R₀ ≈ 260 m).";
      }
    }

    // 2. Metraje de tubería, filtros y empaque
    let casingLen = 0;
    let screenLen = 0;
    let gravelVol = 0;
    let gravelTons = 0;
    let gravelBags = 0;
    let sealVol = 0;
    let subtotal = 0;
    let totalCost = 0;

    if (locKey === "ARTESANAL") {
      casingLen = 50.0; // Fuste excavado existente
      screenLen = 10.0; // Tramo a profundizar (+10 m)
      gravelVol = 1.50; // Gravilla de fondo de 1/4" para evitar arrastre de arenas
      gravelTons = 2.40;
      gravelBags = 48;
      sealVol = 0.50;

      // Presupuesto artesanal: excavación a pico a $100/m + formaletas 3m a $40 ($13.33/m) + electrobomba 5.5 HP (120m) + VFD + PEAD 2"
      const costDeepening = 10.0 * 100.0; // $1.000 (excavación manual a pico Ø 80 cm a $100/m)
      const costLining = (10.0 / 3.0) * 40.0; // ~$133.33 (encofrado formaletas 3m: $40 c/u entre concreto y arena)
      const costPumpArtesanal = 1950.0;  // Electrobomba sumergible industrial 5.5 HP trifásica 220V/440V (idéntica a Opción A1 120m)
      const costVfdArtesanal = 950.0;    // Tablero con Variador de Frecuencia (VFD), doble sonda de pozo (alta/baja) y corte por marcha en seco
      const costColumnArtesanal = 55.0 * 12.0; // Tubería de columna PEAD 2" PN16 reforzada ($660.00)
      const costAirliftArtesanal = 350.0;// Limpieza y desarenado con compresor de aire (Air-Lift artesanal)
      const costGravelArtesanal = 1.5 * 65.0; // Tapón de fondo gravilla cuarzosa 1/4" ($97.50)
      subtotal = costDeepening + costLining + costPumpArtesanal + costVfdArtesanal + costColumnArtesanal + costAirliftArtesanal + costGravelArtesanal;
      const contingencies = subtotal * 0.05;
      totalCost = subtotal + contingencies; // ~$5.345 USD
    } else {
      // Perforación industrial mecanizada con máquina Ø 300 mm: $70/m con grava y entubado incluidos
      if (depth <= 90) {
        screenLen = 24.0;
      } else if (depth <= 100) {
        screenLen = 28.0;
      } else if (depth <= 105) {
        screenLen = 30.0;
      } else if (depth >= 140) {
        screenLen = 42.0;
      } else {
        screenLen = 38.0;
      }
      casingLen = depth - screenLen;

      // Empaque de grava y entubado 300 mm (12")
      const dDrillM = 0.300; // 300 mm broca / barreno
      const dCasingM = (casingDiamInches === 8 ? 8.625 : 6.625) * 0.0254;
      const anularArea = (Math.PI / 4) * Math.max(0.001, (dDrillM * dDrillM - dCasingM * dCasingM));
      const sealDepthM = locKey === "C" ? 20.0 : 15.0;
      const gravelLen = Math.max(10, depth - sealDepthM);
      gravelVol = anularArea * gravelLen * 1.25;
      gravelTons = gravelVol * 1.60;
      gravelBags = Math.round((gravelTons * 1000) / 50);

      // Sello sanitario cemento-bentonita
      const dConductorM = 14.0 * 0.0254;
      const sealArea = (Math.PI / 4) * Math.max(0.001, (dConductorM * dConductorM - dCasingM * dCasingM));
      sealVol = sealArea * sealDepthM * 1.20;

      // Presupuesto de obra rotaria: paquete perforación mecanizada Ø 300 mm @ $70/m llave en mano (incluye grava y entubado)
      const costMobilization = 1500.0;
      const costConductor = 18.0 * 95.0;
      const costSeal = sealDepthM * 45.0;
      const costDrillingPackage = depth * 70.0; // $70/m (incluye perforación rotaria, entubado y empaque de grava)
      const costLogging = 600.0;
      const screenUnitPrice = screenType === "johnson" ? 75.0 : 35.0; // Suplemento especial por filtro Johnson AISI 304 ranura continua
      const costScreens = screenLen * screenUnitPrice;
      const costAirlift = 24.0 * 55.0;
      const costPumpingTest = 1200.0;
      const costLab = 220.0;

      let costPump = 2450.0;
      let costVfd = 1150.0;
      if (locKey === "C" || correctedHMT > 120) {
        costPump = 3900.0;
        costVfd = 1750.0;
      } else if (locKey === "A60" || locKey === "A" || locData.pumpHp === "5.5 HP") {
        costPump = 1950.0;
        costVfd = 950.0;
      } else if (casingDiamInches === 8) {
        costPump = 2850.0;
      }
      const costColumn = (locData.pumpDepth - 5.0) * 22.0;
      const costWellhead = 450.0;
      const costExternal = locData.adductionCost;

      subtotal = costMobilization + costConductor + costSeal + costDrillingPackage + costLogging +
                 costScreens + costAirlift + costPumpingTest +
                 costLab + costPump + costColumn + costVfd + costWellhead + costExternal;
      const contingencies = subtotal * 0.05;
      totalCost = subtotal + contingencies;
    }

    // Actualizar métricas en UI
    const elCasing = document.getElementById("disp-drill-casing");
    const elScreen = document.getElementById("disp-drill-screen");
    const elScreenSub = document.getElementById("disp-drill-screen-sub");
    const elGravel = document.getElementById("disp-drill-gravel");
    const elGravelSub = document.getElementById("disp-drill-gravel-sub");
    const elSeal = document.getElementById("disp-drill-seal");
    const elPressure = document.getElementById("disp-drill-pressure");
    const elPressureSub = document.getElementById("disp-drill-pressure-sub");
    const elPump = document.getElementById("disp-drill-pump");
    const elPumpSub = document.getElementById("disp-drill-pump-sub");
    const elCost = document.getElementById("disp-drill-cost");
    const elTotalCost = document.getElementById("drill-summary-total");
    const elSummaryDesc = document.getElementById("drill-summary-desc");
    const elBadgeLoc = document.getElementById("badge-selected-location");

    if (elBadgeLoc) elBadgeLoc.textContent = locData.name;
    if (elCasing) elCasing.textContent = locKey === "ARTESANAL" ? "50.0 m (Existente)" : `${casingLen.toFixed(1)} m`;
    if (elScreen) elScreen.textContent = locKey === "ARTESANAL" ? "10.0 m (A profund.)" : `${screenLen.toFixed(1)} m`;
    if (elScreenSub) {
      elScreenSub.textContent = locKey === "ARTESANAL"
        ? "Fondo filtrante artesanal Ø 80 cm con gravilla cuarzosa"
        : (screenType === "johnson" 
          ? "Inox AISI 304 (Ve = 0.0007 m/s ≤ 0.03)" 
          : "Ranurada Puente (Ve = 0.0018 m/s ≤ 0.03)");
    }
    if (elGravel) elGravel.textContent = `${gravelVol.toFixed(2)} m³`;
    if (elGravelSub) elGravelSub.textContent = `${gravelTons.toFixed(1)} Ton (~${gravelBags} sacos 50kg)`;
    if (elSeal) elSeal.textContent = `${sealVol.toFixed(2)} m³`;

    if (elPressure) elPressure.textContent = `${correctedHMT.toFixed(1)} mca`;
    if (elPressureSub) {
      const psiVal = correctedHMT * 1.4223;
      const barVal = correctedHMT * 0.0980665;
      elPressureSub.textContent = `${psiVal.toFixed(1)} PSI | ${barVal.toFixed(2)} bar`;
    }

    if (elPump) elPump.textContent = locData.pumpHp;
    if (elPumpSub) {
      let pipeClass = "PEAD PN16 o Sch 40";
      if (locKey === "ARTESANAL") {
        pipeClass = "PEAD 2\" PN16 (a 55 m) - Tandas al Achique con Sondas";
      } else if (correctedHMT > 100) {
        pipeClass = `Acero Sch 40 o PEAD PN16 (a ${locData.pumpDepth} m)`;
      } else {
        pipeClass = `PEAD PN16 o Sch 40 (a ${locData.pumpDepth} m)`;
      }
      elPumpSub.textContent = pipeClass;
    }

    if (elCost) elCost.textContent = `$${Math.round(totalCost).toLocaleString("es-ES")} USD`;
    if (elTotalCost) elTotalCost.textContent = `$${totalCost.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    if (elSummaryDesc) {
      if (locKey === "ARTESANAL") {
        elSummaryDesc.textContent = `Profundización manual a pico de 50 m a 60 m (+10 m a $100/m) en fuste Ø 80 cm, encofrado con formaletas de 3 m ($40 c/u). Equipada con la MISMA electrobomba sumergible industrial de 5.5 HP (descarga 2", 150 L/min) proyectada para el pozo de 120 m, operando en RÉGIMEN DE TANDAS AL ACHIQUE: extrae ~2.200 L en 15 minutos achicando la columna activa hasta la sonda de nivel baja (protección contra marcha en seco en el VFD); el estrato aluvial se recarga lateralmente en 40-50 min (0.8 - 1.2 L/s). Con 8 a 10 tandas al día cosecha 18 a 22 m³/día hacia el reservorio regulador de 80 m³ (duplica el consumo pico de 9.25 m³/día de la nave de 1.000 m²), con un Capex de solo ~$5.350 USD y 100% de reutilización del equipo para el futuro pozo de 120 m.`;
      } else {
        elSummaryDesc.textContent = `Perforación con máquina Ø 300 mm a $70/metro lineal (incluye perforación, entubado y empaque de grava), más ${screenLen}m filtros ${screenType === "johnson" ? "Johnson AISI 304" : "Puente"}, sello tremie, perfilaje SP/Res, air-lift, bomba ${locData.pumpHp} y ${locData.adductionDesc}.`;
      }
    }

    // Actualizar columna estratigráfica interactiva
    const stratTitle = document.getElementById("strat-column-title");
    const stratDesc = document.getElementById("strat-column-desc");
    const stratContainer = document.getElementById("drill-layers-list");

    if (stratTitle) stratTitle.textContent = `Corte Litoestratigráfico Pronosticado (0 - ${depth} m)`;
    if (stratDesc) {
      stratDesc.textContent = `Estratigrafía calibrada para ${locData.name} (Cota ${locData.cota} msnm, NE = ${locData.neBase} m, ND = ${locData.ndBase} m):`;
    }

    if (stratContainer && locData.layers) {
      stratContainer.innerHTML = locData.layers.map(layer => `
        <div class="drill-layer ${layer.cls}">
          <span class="drill-layer-depth">${layer.depth}</span>
          <span class="drill-layer-desc">${layer.desc}</span>
          <span class="drill-layer-component badge-${layer.cls.includes('screen') ? 'screen' : (layer.cls.includes('seal') ? 'seal' : 'casing')}">${layer.comp}</span>
        </div>
      `).join("");
    }

    // Renderizar desglose itemizado de partidas presupuestarias (Paso 5.2)
    const tbodyBudget = document.getElementById("tbody-itemized-budget");
    const budgetTitle = document.getElementById("itemized-budget-title");
    const budgetBadge = document.getElementById("itemized-budget-badge");

    if (tbodyBudget) {
      tbodyBudget.innerHTML = "";
      let budgetItems = [];

      if (locKey === "ARTESANAL") {
        if (budgetTitle) budgetTitle.textContent = "📋 Presupuesto Itemizado: Pozo Artesanal a Pico Ø 80 cm (+10 m con Bomba Industrial 5.5 HP)";
        if (budgetBadge) budgetBadge.textContent = "Bomba 5.5 HP 100% Transferible a 120m | Ahorro ~$19.530 USD";

        budgetItems = [
          { num: "01", desc: "Profundización manual de fuste a pico (+10 m) a Ø 80 cm en gravillas y arenas aluviales con torno de izado", qty: "10 m", pu: 100.00, total: 1000.00 },
          { num: "02", desc: "Encofrado de fuste con formaletas de 3 metros (concreto y arena vaciado in situ a $40 c/u)", qty: "10 m (3.3 u)", pu: 13.33, total: 133.33 },
          { num: "03", desc: "Electrobomba sumergible industrial 5.5 HP trifásica 220V/440V (idéntica a Opción A1 120m, descarga 2\", 150 L/min a 65-90 mca)", qty: "1 u.", pu: 1950.00, total: 1950.00 },
          { num: "04", desc: "Tablero de control con Variador de Frecuencia (VFD), doble sonda de nivel (alta/baja) y protección contra marcha en seco", qty: "1 u.", pu: 950.00, total: 950.00 },
          { num: "05", desc: "Tubería de columna de impulsión PEAD 2\" PN16 (55 m) con uniones reforzadas, válvula check y codos a reservorio", qty: "55 m", pu: 12.00, total: 660.00 },
          { num: "06", desc: "Limpieza y purga inicial con compresor de aire (Air-Lift artesanal), desarenado y aforo volumétrico", qty: "1 gl.", pu: 350.00, total: 350.00 },
          { num: "07", desc: "Empaque de fondo con gravilla cuarzosa lavada 1/4\" (tapón de fondo anti-arenamiento)", qty: "1.5 m³", pu: 65.00, total: 97.50 }
        ];
      } else {
        if (budgetTitle) budgetTitle.textContent = `📋 Presupuesto de Obra: ${locData.name}`;
        if (budgetBadge) budgetBadge.textContent = `Máquina Ø 300 mm ($70/m con grava y entubado)`;

        budgetItems = [
          { num: "01", desc: "Movilización, desmovilización y montaje de taladro rotario industrial", qty: "1 gl.", pu: 1500.00, total: 1500.00 },
          { num: "02", desc: "Tubería conductora de superficie 14\" acero ASTM A53 (0 a 18 m)", qty: "18 m", pu: 95.00, total: 1710.00 },
          { num: "03", desc: `Sello sanitario tremie cemento-bentonita (0 a ${locKey === "C" ? 20 : 15} m)`, qty: `${locKey === "C" ? 20 : 15} m`, pu: 45.00, total: (locKey === "C" ? 20 : 15) * 45 },
          { num: "04", desc: `Perforación mecanizada con máquina Ø 300 mm (12") con entubado y empaque de grava incluidos`, qty: `${Math.round(depth)} m`, pu: 70.00, total: Math.round(depth) * 70.00 },
          { num: "05", desc: "Perfilaje geofísico eléctrico continuo (Potencial Espontáneo SP + Resistividad 16\"/64\")", qty: "1 serv.", pu: 600.00, total: 600.00 },
          { num: "06", desc: `Filtros de captación continuos ${screenType === "johnson" ? "Johnson AISI 304 ranura 0.030\"" : "Ranurados tipo puente"}`, qty: `${screenLen.toFixed(1)} m`, pu: screenType === "johnson" ? 75.00 : 35.00, total: screenLen * (screenType === "johnson" ? 75.00 : 35.00) },
          { num: "07", desc: "Desarrollo y desarenado con doble columna Air-Lift a 200 PSI (24 horas continuas)", qty: "24 h", pu: 55.00, total: 1320.00 },
          { num: "08", desc: "Prueba de bombeo escalonada Jacob (4 escalones) y recuperación Theis 24h", qty: "1 serv.", pu: 1200.00, total: 1200.00 },
          { num: "09", desc: "Análisis fisicoquímico certificado de laboratorio (ECw, RAS, SAR, HCO₃⁻, Boro)", qty: "1 mues.", pu: 220.00, total: 220.00 },
          { num: "10", desc: `Electrobomba sumergible industrial (${locData.pumpHp}) + motor trifásico`, qty: "1 u.", pu: (locKey === "C" || correctedHMT > 120) ? 3900.00 : (locData.pumpHp === "5.5 HP" ? 1950.00 : 2450.00), total: (locKey === "C" || correctedHMT > 120) ? 3900.00 : (locData.pumpHp === "5.5 HP" ? 1950.00 : 2450.00) },
          { num: "11", desc: `Tubería de columna de impulsión acero roscado 2½\" (hasta ${locData.pumpDepth} m)`, qty: `${locData.pumpDepth - 5} m`, pu: 22.00, total: (locData.pumpDepth - 5) * 22 },
          { num: "12", desc: `Tablero de control electromecánico con Variador de Frecuencia (VFD) y telemetría`, qty: "1 u.", pu: (locKey === "C" || correctedHMT > 120) ? 1750.00 : (locData.pumpHp === "5.5 HP" ? 950.00 : 1150.00), total: (locKey === "C" || correctedHMT > 120) ? 1750.00 : (locData.pumpHp === "5.5 HP" ? 950.00 : 1150.00) },
          { num: "13", desc: "Cabezal de pozo sanitario, manómetro glicerina, válvula retención y compuerta", qty: "1 gl.", pu: 450.00, total: 450.00 }
        ];

        if (locData.adductionCost > 0) {
          budgetItems.push({
            num: "14",
            desc: `Aducción externa de conducción (${locData.adductionDesc})`,
            qty: "1 gl.",
            pu: locData.adductionCost,
            total: locData.adductionCost
          });
        }
      }

      let runningSubtotal = 0;
      budgetItems.forEach(item => {
        runningSubtotal += item.total;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="font-family:var(--font-mono); color:var(--text-secondary);">${item.num}</td>
          <td>${item.desc}</td>
          <td style="text-align:right; font-family:var(--font-mono);">${item.qty}</td>
          <td style="text-align:right; font-family:var(--font-mono);">$${item.pu.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="text-align:right; font-weight:700; font-family:var(--font-mono); color:var(--cyan-light);">$${item.total.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        `;
        tbodyBudget.appendChild(tr);
      });

      const contingencyVal = runningSubtotal * 0.05;
      const runningFinal = runningSubtotal + contingencyVal;

      // Fila de contingencias
      const trCont = document.createElement("tr");
      trCont.style.color = "var(--text-secondary)";
      trCont.innerHTML = `
        <td style="font-family:var(--font-mono);">--</td>
        <td><em>Imprevistos, transporte local y contingencias de obra (5%)</em></td>
        <td style="text-align:right; font-family:var(--font-mono);">5%</td>
        <td style="text-align:right; font-family:var(--font-mono);">$${contingencyVal.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align:right; font-weight:600; font-family:var(--font-mono); color:var(--amber-main);">$${contingencyVal.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      `;
      tbodyBudget.appendChild(trCont);

      // Fila de Total
      const trTotal = document.createElement("tr");
      trTotal.className = "itemized-budget-total-row";
      trTotal.innerHTML = `
        <td colspan="4" style="text-align:right; font-weight:800; text-transform:uppercase;">Inversión Total Estimada:</td>
        <td style="text-align:right; font-weight:800; font-family:var(--font-mono);">$${runningFinal.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</td>
      `;
      tbodyBudget.appendChild(trTotal);
    }
  }

  selDepth.addEventListener("change", recalculateDrillMetrics);
  selDrillDiam.addEventListener("change", recalculateDrillMetrics);
  selCasingDiam.addEventListener("change", recalculateDrillMetrics);
  selScreenType.addEventListener("change", recalculateDrillMetrics);

  // Inicializar en la opción seleccionada (respetando FarmState persistido)
  const initialLoc = FarmState.wellLocation || (selLocation ? selLocation.value : "ARTESANAL");
  if (selLocation) selLocation.value = initialLoc;
  selectLocationCard(initialLoc);
}


