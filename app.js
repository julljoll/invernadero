/**
 * AGENTE ESPECIALISTA EN INVERNADEROS — VALLE DE QUÍBOR
 * Lógica de cálculo bioclimático, extractores eólicos, FAO-56 y visualizador Canvas
 */

// ==========================================================================
// 1. BASE DE DATOS METEOROLÓGICA (NASA MERRA-2 QUÍBOR 695 MSNM)
// ==========================================================================
const QUIBOR_CLIMATE = [
  { mes: "Enero", max: 30, min: 19, lluvia: 11, viento: 8.5, bochorno: 16.0, dir: "88% ESTE" },
  { mes: "Febrero", max: 30, min: 20, lluvia: 14, viento: 8.9, bochorno: 14.5, dir: "85% ESTE" },
  { mes: "Marzo", max: 31, min: 20, lluvia: 26, viento: 9.0, bochorno: 18.6, dir: "84% ESTE", picoCalor: true },
  { mes: "Abril", max: 30, min: 20, lluvia: 73, viento: 8.9, bochorno: 22.6, dir: "80% ESTE" },
  { mes: "Mayo", max: 29, min: 20, lluvia: 104, viento: 9.4, bochorno: 28.1, dir: "78% ESTE", maxLluvia: true },
  { mes: "Junio", max: 28, min: 20, lluvia: 96, viento: 10.4, bochorno: 27.6, dir: "82% ESTE", maxViento: true },
  { mes: "Julio", max: 28, min: 19, lluvia: 95, viento: 10.2, bochorno: 28.0, dir: "85% ESTE", masFresco: true },
  { mes: "Agosto", max: 28, min: 19, lluvia: 91, viento: 9.5, bochorno: 28.6, dir: "86% ESTE", picoBochorno: true },
  { mes: "Septiembre", max: 29, min: 19, lluvia: 94, viento: 8.4, bochorno: 27.6, dir: "53% SUR (Excepción)" },
  { mes: "Octubre", max: 29, min: 20, lluvia: 93, viento: 7.1, bochorno: 28.5, dir: "79% ESTE" },
  { mes: "Noviembre", max: 29, min: 20, lluvia: 64, viento: 7.0, bochorno: 26.4, dir: "84% ESTE", masCalmado: true },
  { mes: "Diciembre", max: 29, min: 19, lluvia: 28, viento: 7.9, bochorno: 22.0, dir: "87% ESTE" }
];

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
    vuelo: "Vuelo activo débil (<2 m), pero es arrastrada por el viento a kilómetros. La malla 50×25 es la barrera indispensable.",
    quimico: "IRAC 4A (Imidacloprid), IRAC 7C (Piriproxifen - ovicida/larvicida), IRAC 23 (Spiromesifen). Rotar estrictamente.",
    biologico: "Parasitoides de ninfas: Eretmocerus mundus y Encarsia formosa.",
    malla: "Malla 50×25 HDPE monofilamento (apertura ≤ 192 µm)."
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
    malla: "Malla 50×25 HDPE (≤ 192 micras). Mallas inferiores permiten su colado."
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
    malla: "Malla 50×25 HDPE."
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
    malla: "Malla 50×25 HDPE."
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
    malla: "Malla 50×25 HDPE."
  }
];

// ==========================================================================
// 2.5 NÚCLEO DE ESTADO REACTIVO CENTRALIZADO (FarmState)
// Unifica y sincroniza la fuente de agua, sectorización, nutrición y pozo
// ==========================================================================
const FarmState = {
  waterSource: 'pozo', // 'pozo' | 'yacambu'
  wellFlowLs: 2.5,
  wellDepthM: 120,
  drillDiamInches: 12.25,
  casingDiamInches: 6.0,
  screenType: 'johnson',
  activeSector: '1', // '1', '2', '3', 'all'
  fertilizerRegime: 'aifa', // 'aifa' | 'granulado' | 'hibrido'
  prodStageIdx: 3,
  sunlightMode: false,

  // Precios dinámicos mercado venezolano
  priceAifaBag25kg: 65.0,
  priceGranulatedBag50kg: 38.0,
  priceTomatoCesta20kg: 18.0,

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
        fertilizerRegime: this.fertilizerRegime,
        sunlightMode: this.sunlightMode,
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
        if (p.fertilizerRegime) this.fertilizerRegime = p.fertilizerRegime;
        if (typeof p.sunlightMode === "boolean") this.sunlightMode = p.sunlightMode;
        if (p.priceAifaBag25kg) this.priceAifaBag25kg = Number(p.priceAifaBag25kg);
        if (p.priceGranulatedBag50kg) this.priceGranulatedBag50kg = Number(p.priceGranulatedBag50kg);
        if (p.priceTomatoCesta20kg) this.priceTomatoCesta20kg = Number(p.priceTomatoCesta20kg);
      }
    } catch (e) {}
  }
};

// ==========================================================================
// 3. INICIALIZACIÓN Y MANEJO DE PESTAÑAS (TABS)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  FarmState.loadPersisted();
  initPwaOffline();
  initSunlightMode();
  initTabs();
  initFarmPipeline();
  initHydraulicCircuit();
  initShiftExport();
  initEconomicSimulator();
  initTooltips();
  initClimateTab();
  initVentilationCalculator();
  initIrrigationCalculator();
  initWellValidationCalculator();
  initWellDrillingCalculator();
  initPestMatrix();
  initCanvasVisualizer();
  initBlueprintViewers();
  initProductionTab();
});

function initBlueprintViewers() {
  const btn3D = document.getElementById("btn-show-plano3d");
  const btn2D = document.getElementById("btn-show-plano2d");
  const c3D = document.getElementById("container-plano3d");
  const c2D = document.getElementById("container-plano2d");

  if (btn3D && btn2D && c3D && c2D) {
    btn3D.addEventListener("click", () => {
      btn3D.classList.add("active");
      btn2D.classList.remove("active");
      c3D.style.display = "block";
      c2D.style.display = "none";
    });

    btn2D.addEventListener("click", () => {
      btn2D.classList.add("active");
      btn3D.classList.remove("active");
      c2D.style.display = "block";
      c3D.style.display = "none";
    });
  }
}

/**
 * Activa una pestaña y sincroniza tanto los botones superiores
 * como los pasos de la barra del Pipeline Agrícola.
 */
function activateTab(targetTabId, scrollTargetId = null) {
  const tabButtons = document.querySelectorAll(".nav-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const pipelineSteps = document.querySelectorAll(".pipeline-step");

  tabButtons.forEach(b => {
    if (b.getAttribute("data-tab") === targetTabId) {
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });

  tabPanes.forEach(p => {
    if (p.id === targetTabId) {
      p.classList.add("active");
      if (targetTabId === "tab-estructura") {
        requestAnimationFrame(drawGreenhouseStructure);
      }
    } else {
      p.classList.remove("active");
    }
  });

  // Sincronizar paso del pipeline
  pipelineSteps.forEach(s => {
    const pTab = s.getAttribute("data-pipeline-tab");
    const pScroll = s.getAttribute("data-pipeline-scroll");

    if (pTab === targetTabId) {
      if (scrollTargetId && pScroll === scrollTargetId) {
        s.classList.add("active");
      } else if (!scrollTargetId && !pScroll) {
        s.classList.add("active");
      } else if (!scrollTargetId && pScroll) {
        s.classList.remove("active");
      } else {
        s.classList.remove("active");
      }
    } else {
      s.classList.remove("active");
    }
  });

  if (scrollTargetId) {
    setTimeout(() => {
      const el = document.getElementById(scrollTargetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  }
}

function initTabs() {
  const tabButtons = document.querySelectorAll(".nav-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTabId = btn.getAttribute("data-tab");
      activateTab(targetTabId);
    });
  });
}

function initFarmPipeline() {
  const pipelineSteps = document.querySelectorAll(".pipeline-step");
  pipelineSteps.forEach(step => {
    step.addEventListener("click", () => {
      const targetTabId = step.getAttribute("data-pipeline-tab");
      const scrollId = step.getAttribute("data-pipeline-scroll");
      activateTab(targetTabId, scrollId);
    });
  });
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
      name: "Sector 1 (Camellones 1 al 3)",
      rows: "8 Hileras de Tomate (100 m)",
      flow: "2.40 m³/h",
      lmin: "40.0 L/minuto",
      emitters: "1.500 Goteros PC (40 cm)",
      plants: "1.320 Plantas (1.60 L/h)",
      pulse: "28 Minutos (Turno 1: 06:00-06:28)",
      pressure: "2.8 a 3.2 bar (Cabezal)",
      targetTitle: "Sector 1 Activo",
      targetSub: "1.500 goteros PC 40cm"
    },
    "2": {
      name: "Sector 2 (Camellones 4 al 7)",
      rows: "8 Hileras de Tomate (100 m)",
      flow: "3.20 m³/h",
      lmin: "53.3 L/minuto",
      emitters: "2.000 Goteros PC (40 cm)",
      plants: "1.760 Plantas (1.60 L/h)",
      pulse: "28 Minutos (Turno 2: 06:35-07:03)",
      pressure: "2.5 a 2.9 bar (Cabezal)",
      targetTitle: "Sector 2 Activo",
      targetSub: "2.000 goteros PC 40cm"
    },
    "3": {
      name: "Sector 3 (Camellones 8 al 10)",
      rows: "8 Hileras de Tomate (100 m)",
      flow: "2.40 m³/h",
      lmin: "40.0 L/minuto",
      emitters: "1.500 Goteros PC (40 cm)",
      plants: "1.320 Plantas (1.60 L/h)",
      pulse: "28 Minutos (Turno 3: 07:10-07:38)",
      pressure: "2.8 a 3.2 bar (Cabezal)",
      targetTitle: "Sector 3 Activo",
      targetSub: "1.500 goteros PC 40cm"
    },
    "all": {
      name: "Ciclo Completo (3 Sectores)",
      rows: "24 Hileras Totales (2.000 m²)",
      flow: "2.4 a 3.2 m³/h (Rotativo)",
      lmin: "Total Nave: 8.0 m³/h",
      emitters: "5.000 Goteros PC Totales",
      plants: "4.400 Plantas Productivas",
      pulse: "84 Minutos Total (3×28m)",
      pressure: "Auto-compensación Activa",
      targetTitle: "Tren Secuencial 1➔2➔3",
      targetSub: "84 min de bombeo diario"
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
// 3.1 PWA OFFLINE MANAGER & SERVICE WORKER
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
// 3.2 MODO SOL DIRECTO (AGRI-UX-UI ALTO CONTRASTE EXTERIOR)
// ==========================================================================
function initSunlightMode() {
  const btn = document.getElementById('btn-toggle-sunlight');
  const btnText = document.getElementById('sunlight-btn-text');
  if (!btn) return;

  function applyMode(active) {
    if (active) {
      document.body.classList.add('sunlight-mode');
      if (btnText) btnText.textContent = 'Modo Noche / Estándar';
      btn.style.background = '#000000';
      btn.style.color = '#fef08a';
      btn.style.borderColor = '#000000';
    } else {
      document.body.classList.remove('sunlight-mode');
      if (btnText) btnText.textContent = 'Modo Sol Directo';
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }
  }

  if (FarmState.sunlightMode) {
    applyMode(true);
  }

  btn.addEventListener('click', () => {
    const nextState = !document.body.classList.contains('sunlight-mode');
    applyMode(nextState);
    FarmState.setState({ sunlightMode: nextState });
  });
}

// ==========================================================================
// 3.3 EXPORTADOR DE FICHA DE TURNO DIARIO (WHATSAPP / IMPRIMIR)
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
      fertText = "• Régimen: Abono Granulado Manual NPK 12-12-17 SOP (32 g/planta cada 20 días en banda a 15 cm del tallo).\n• Tanque A: Fe-EDDHA (6%) 1.10 kg/sem.\n• Tanque B: Microelementos 0.60 kg + Ácido Bórico 0.30 kg/sem.";
    } else if (fertRegime === 'hibrido') {
      fertText = "• Régimen: Estrategia Híbrida (Fondo granulado + AIFA en goteo).\n• Tanque A: Nitrato de Calcio AIFA 25 kg + KNO3 12 kg + Fe-EDDHA 1 kg/sem.\n• Tanque B: AIFA 12-6-36 35 kg + MKP 6 kg + SOP 14 kg + MgSO4 10 kg/sem.";
    } else {
      fertText = "• Régimen: 100% AIFA Hidrosoluble.\n• Tanque A: Nitrato de Calcio AIFA 36 kg + KNO3 15 kg + Fe-EDDHA 1.1 kg/sem.\n• Tanque B: KNO3 30 kg + MKP 10 kg + K2SO4 24 kg + MgSO4 16 kg + Micro 0.6 kg/sem.";
    }

    const acidText = isYacambu ? "• Tanque C: ~8.0 L/sem Ácido Nítrico 60% (Agua dulce Yacambú CE 0.5 dS/m)" : "• Tanque C: ~22.0 L/sem Ácido Nítrico 60% (Pozo salino CE 1.4 dS/m - Bicarbonatos altos)";

    const now = new Date();
    const dateStr = now.toLocaleDateString("es-VE", { year: 'numeric', month: 'long', day: 'numeric' });

    const pauta = `📋 PAUTA DIARIA DE RIEGO Y FERTILIZACIÓN — CASA DE MALLA QUÍBOR (2.000 m²)
📅 Fecha: ${dateStr}
🌱 Etapa: ${stageName} (4.400 Plantas)
💧 Fuente de Agua: ${isYacambu ? "Trasvase Yacambú (CE 0.5 dS/m | LF 6.5%)" : "Pozo Profundo Abatido (CE 1.4 dS/m | LF 20%)"}
⚡ Equipo de Bombeo: Motor 1.5 HP 220V + Filtro Discos 120 Mesh

⏰ TURNOS SECUENCIALES OBLIGATORIOS (BOMBA 1.5 HP):
1️⃣ SECTOR 1 (Camellones 1 al 3 | 1.320 pl):
   • Horario: 06:00 – 06:28 AM (28 minutos)
   • Válvula 1 ABIERTA (2 y 3 CERRADAS)
   • Caudal: 2.40 m³/h | Presión: 2.8 a 3.2 bar

2️⃣ SECTOR 2 (Camellones 4 al 7 | 1.760 pl):
   • Horario: 06:35 – 07:03 AM (28 minutos)
   • Válvula 2 ABIERTA (1 y 3 CERRADAS)
   • Caudal: 3.20 m³/h | Presión: 2.5 a 2.9 bar

3️⃣ SECTOR 3 (Camellones 8 al 10 | 1.320 pl):
   • Horario: 07:10 – 07:38 AM (28 minutos)
   • Válvula 3 ABIERTA (1 y 2 CERRADAS)
   • Caudal: 2.40 m³/h | Presión: 2.8 a 3.2 bar

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
        alert("✅ Pauta de riego copiada al portapapeles.\n\nSe abrirá WhatsApp para que puedas enviarla directamente a tu regador o mayordomo.");
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(pauta)}`;
        window.open(whatsappUrl, '_blank');
      }).catch(() => {
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(pauta)}`;
        window.open(whatsappUrl, '_blank');
      });
    } else {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(pauta)}`;
      window.open(whatsappUrl, '_blank');
    }
  });
}

// ==========================================================================
// 3.4 SIMULADOR ECONÓMICO DINÁMICO (AIFA VS GRANULADO VS HÍBRIDO)
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
    const pAifa = Math.max(10, parseFloat(inputAifa.value) || 65);
    const pGran = Math.max(10, parseFloat(inputGran.value) || 38);
    const pCesta = Math.max(1, parseFloat(inputCesta.value) || 18);
    const pKg = pCesta / 20.0;

    FarmState.setState({
      priceAifaBag25kg: pAifa,
      priceGranulatedBag50kg: pGran,
      priceTomatoCesta20kg: pCesta
    });

    const elPriceKg = document.getElementById('disp-price-kg');
    if (elPriceKg) elPriceKg.textContent = `$${pKg.toFixed(2)} USD/kg`;

    // 1. AIFA 100% Hidrosoluble (35.2 Ton = 1.760 cestas, 42 sacos 25kg)
    const yieldAifaKg = 35200;
    const cestasAifa = 1760;
    const bagsAifa = 42;
    const grossAifa = cestasAifa * pCesta;
    const costAifa = bagsAifa * pAifa;
    const netAifa = grossAifa - costAifa;
    const unitCostAifa = costAifa / yieldAifaKg;

    // 2. Estrategia Híbrida (33.5 Ton = 1.675 cestas, 16 sacos gran 50kg + 23 sacos aifa 25kg)
    const yieldHibridoKg = 33500;
    const cestasHibrido = 1675;
    const grossHibrido = cestasHibrido * pCesta;
    const costHibrido = (16 * pGran) + (23 * pAifa);
    const netHibrido = grossHibrido - costHibrido;
    const unitCostHibrido = costHibrido / yieldHibridoKg;

    // 3. Granulado Manual (27.0 Ton = 1.350 cestas, 38 sacos gran 50kg)
    const yieldGranKg = 27000;
    const cestasGran = 1350;
    const bagsGran = 38;
    const grossGran = cestasGran * pCesta;
    const costGran = bagsGran * pGran;
    const netGran = grossGran - costGran;
    const unitCostGran = costGran / yieldGranKg;

    // Diferencial AIFA vs Granulado
    const diffNet = netAifa - netGran;
    const extraInvest = costAifa - costGran;

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

    // Conclusión financiera
    const dispConclusion = document.getElementById('disp-econ-conclusion');
    if (dispConclusion) {
      if (diffNet > 0) {
        dispConclusion.innerHTML = `<strong>Veredicto Económico para el Productor en Quíbor:</strong> Aunque el abono hidrosoluble AIFA requiere $${Math.round(extraInvest).toLocaleString('en-US')} USD adicionales de inversión inicial frente al granulado, genera <strong>+$${Math.round(diffNet).toLocaleString('en-US')} USD netos adicionales de ganancia</strong> por ciclo productivo, gracias a su mayor cuajado, menor aborto floral y 75% de frutos de Primera calidad.`;
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
// 4. TAB 1: CLIMA & CAPA LÍMITE
// ==========================================================================
function initClimateTab() {
  const selectMonth = document.getElementById("select-month");
  const sliderHeight = document.getElementById("input-wind-height");
  
  if (selectMonth) {
    selectMonth.addEventListener("change", () => {
      updateClimateDisplays(parseInt(selectMonth.value, 10));
    });
    updateClimateDisplays(parseInt(selectMonth.value, 10));
  }

  if (sliderHeight) {
    sliderHeight.addEventListener("input", () => {
      updateBoundaryLayerDisplays(parseFloat(sliderHeight.value));
    });
    updateBoundaryLayerDisplays(parseFloat(sliderHeight.value));
  }
}

function updateClimateDisplays(monthIndex) {
  const data = QUIBOR_CLIMATE[monthIndex];
  if (!data) return;

  document.getElementById("disp-temp-max").textContent = `${data.max} °C`;
  document.getElementById("disp-temp-min").textContent = `Mínima: ${data.min} °C`;
  document.getElementById("disp-wind-speed").textContent = `${data.viento} km/h`;
  document.getElementById("disp-wind-dir").textContent = `Dirección: ${data.dir}`;
  document.getElementById("disp-rain").textContent = `${data.lluvia} mm`;
  document.getElementById("disp-muggy").textContent = `${data.bochorno} d`;

  // Dynamic alert
  const alertBox = document.getElementById("box-clima-alert");
  if (data.picoCalor) {
    alertBox.className = "alert-box alert-warning";
    alertBox.innerHTML = `
      <div class="alert-icon">🔥</div>
      <div class="alert-content">
        <strong>Marzo (Pico Térmico Anual - 31 °C):</strong> Máxima insolación y sequedad. En casas de 2.5 m el aire interior alcanza 34-37 °C provocando aborto floral en tomate y esterilidad de polen. Altura recomendada: 5.5 m.
      </div>`;
  } else if (data.maxLluvia) {
    alertBox.className = "alert-box alert-success";
    alertBox.innerHTML = `
      <div class="alert-icon">🌧️</div>
      <div class="alert-content">
        <strong>Mayo (Mes más lluvioso - 104 mm):</strong> El bochorno salta a 28.1 días/mes. La alta humedad ambiental exige ventilación perimetral fluida para evitar Botrytis y quemaduras apicales.
      </div>`;
  } else if (data.maxViento) {
    alertBox.className = "alert-box alert-warning";
    alertBox.innerHTML = `
      <div class="alert-icon">💨</div>
      <div class="alert-content">
        <strong>Junio (Mes más ventoso - 10.4 km/h promedio):</strong> Viento sostenido del Este. Verifique la tensión de las guayas de 1/4" y los resortes zig-zag de la malla 50×25 en la fachada barlovento.
      </div>`;
  } else {
    alertBox.className = "alert-box alert-warning";
    alertBox.innerHTML = `
      <div class="alert-icon">ℹ️</div>
      <div class="alert-content">
        <strong>Condiciones de ${data.mes}:</strong> Viento medio de ${data.viento} km/h (${data.dir}). Humedad y calor sostenidos con ${data.bochorno} días bochornosos.
      </div>`;
  }

  // Update boundary layer with new base wind
  const sliderHeight = document.getElementById("input-wind-height");
  if (sliderHeight) {
    updateBoundaryLayerDisplays(parseFloat(sliderHeight.value));
  }
}

// Hellmann boundary layer: v(z) = v10 * (z/10)^0.16
function getWindAtHeight(v10, z) {
  return v10 * Math.pow(z / 10.0, 0.16);
}

function updateBoundaryLayerDisplays(userHeight) {
  const selectMonth = document.getElementById("select-month");
  const monthIdx = selectMonth ? parseInt(selectMonth.value, 10) : 2;
  const v10 = QUIBOR_CLIMATE[monthIdx].viento;

  const v25 = getWindAtHeight(v10, 2.5);
  const vUser = getWindAtHeight(v10, userHeight);

  document.getElementById("val-wind-height").textContent = `${userHeight.toFixed(1)} m`;
  document.getElementById("speed-25m").textContent = `${v25.toFixed(1)} km/h`;
  document.getElementById("label-user-height").textContent = `A ${userHeight.toFixed(1)} m`;
  document.getElementById("speed-user-height").textContent = `${vUser.toFixed(1)} km/h`;
  document.getElementById("speed-10m").textContent = `${v10.toFixed(1)} km/h`;

  const diffPercent = ((vUser - v10) / v10) * 100;
  const diffElem = document.getElementById("diff-user-height");
  diffElem.textContent = `${diffPercent.toFixed(1)}% respecto a 10m`;
  diffElem.className = diffPercent < -15 ? "comp-diff danger" : "comp-diff success";
}

// ==========================================================================
// 5. TAB 2: CALCULADORA EXTRACTORES EÓLICOS & VENTILACIÓN
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

  calculateVentilation();
}

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
// 6. TAB 3: CALCULADORA FAO-56 & SALINIDAD
// ==========================================================================
const FAO_STAGES = [
  { nombre: "Trasplante / Establecimiento", kc: 0.60, etc: 3.0, netLitersPlanta: 8.0, desc: "0-3 semanas. Raíz superficial (<15 cm)." },
  { nombre: "Crecimiento Vegetativo", kc: 0.80, etc: 4.0, netLitersPlanta: 11.0, desc: "3-6 semanas. Desarrollo foliar y tallo." },
  { nombre: "Floración - Cuajado", kc: 1.10, etc: 5.8, netLitersPlanta: 16.0, desc: "6-10 semanas. Crítico: evitar déficit hídrico." },
  { nombre: "Fructificación - Cosecha", kc: 1.05, etc: 6.3, netLitersPlanta: 18.5, desc: "Pico de transpiración en calor de marzo-abril." },
  { nombre: "Fin de Ciclo / Senescencia", kc: 0.90, etc: 5.0, netLitersPlanta: 13.5, desc: "Maduración final." }
];

function initIrrigationCalculator() {
  const inputs = [
    "select-crop",
    "select-stage",
    "input-well-ec",
    "input-plant-density"
  ];

  inputs.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener("change", calculateIrrigation);
      elem.addEventListener("input", calculateIrrigation);
    }
  });

  calculateIrrigation();
}

function calculateIrrigation() {
  const crop = document.getElementById("select-crop").value;
  const stageIdx = parseInt(document.getElementById("select-stage").value, 10);
  const ecW = parseFloat(document.getElementById("input-well-ec").value) || 1.4;
  const density = parseFloat(document.getElementById("input-plant-density").value) || 2.2;

  // Umbrales de salinidad según FAO-29 / FAO-56
  // Pimentón: ECe umbral = 1.5 dS/m (muy sensible)
  // Tomate: ECe umbral = 2.5 dS/m (moderadamente tolerante)
  const ecE = crop === "pimenton" ? 1.5 : 2.5;

  // Fracción de lavado: LF = ECw / (5 * ECe - ECw)
  let lf = ecW / (5.0 * ecE - ecW);
  if (lf < 0) lf = 0.05;
  if (lf > 0.45) lf = 0.45; // Tope práctico

  const stageData = FAO_STAGES[stageIdx];
  const kc = stageData.kc;
  const netLitersWeek = stageData.netLitersPlanta;

  // Lámina bruta por planta (L/semana) = Neto / (1 - LF)
  const grossLitersWeek = netLitersWeek / (1.0 - lf);

  // Demanda diaria total del módulo de 2.000 m²
  // Total plantas = 2.000 m² * densidad (4.400 plantas a 2.2 pl/m²)
  const totalPlants = 2000 * density;
  const dailyLitersTotal = (grossLitersWeek * totalPlants) / 7.0;
  const dailyM3Total = dailyLitersTotal / 1000.0;

  // Actualizar UI
  document.getElementById("res-fao-kc").textContent = kc.toFixed(2);
  document.getElementById("res-fao-etc").textContent = `${stageData.etc} mm/día (~${netLitersWeek.toFixed(1)} L/pl/sem neto)`;
  document.getElementById("res-fao-lf").textContent = `${(lf * 100).toFixed(1)} % de sobre-riego`;
  document.getElementById("res-fao-liters-plant").textContent = `${grossLitersWeek.toFixed(1)} L / planta / semana`;
  document.getElementById("res-fao-daily-m3").textContent = `${dailyM3Total.toFixed(2)} m³ / día`;

  // Advertencia de salinidad
  const adviceText = document.getElementById("salinity-advice-text");
  if (crop === "pimenton") {
    if (ecW >= 1.5) {
      adviceText.innerHTML = `<strong>⚠️ ALERTA DE SALINIDAD ALTA:</strong> El agua de pozo (${ecW} dS/m) supera el umbral del pimentón (1.5 dS/m). Requiere un <strong>${(lf * 100).toFixed(0)}% de lavado</strong> para evitar necrosis en bordes de hojas y reducción de calibre. Fraccionar en 4 a 5 pulsos de riego al día.`;
    } else {
      adviceText.innerHTML = `Para agua de pozo de ${ecW} dS/m en pimentón, aplique un <strong>${(lf * 100).toFixed(0)}% extra de lavado</strong>. El suelo franco de Quíbor mantendrá las sales fuera de la zona de los primeros 30-40 cm con pulsos fraccionados.`;
    }
  } else {
    adviceText.innerHTML = `El tomate tolera hasta 2.5 dS/m con relativa facilidad. Con su agua de ${ecW} dS/m, la fracción de lavado es de <strong>${(lf * 100).toFixed(1)}%</strong>. Aproveche esta ligera salinidad controlada para aumentar los grados Brix (°Bx) del fruto sin comprometer el cuajado.`;
  }
}

// ==========================================================================
// 7. TAB 4: MATRIZ DE PLAGAS Y FILTRADO
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
// 8. TAB 5: VISUALIZADOR ESTRUCTURAL INTERACTIVO (CANVAS 2D/3D)
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

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, "#080c16");
  bgGrad.addColorStop(0.7, "#0f172a");
  bgGrad.addColorStop(1, "#111b2e");
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
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, groundY);
  ctx.lineTo(w - 30, groundY);
  ctx.stroke();

  // Soil hatching
  ctx.strokeStyle = "rgba(71, 85, 105, 0.3)";
  ctx.lineWidth = 1;
  for (let x = 40; x < w - 40; x += 15) {
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x - 8, groundY + 12);
    ctx.stroke();
  }

  // 5 Naves Geometría (40m total)
  // Ancho de dibujo para las 5 naves
  const startX = 130;
  const totalWidth = w - 240; // ~560px
  const numNaves = 5;
  const naveW = totalWidth / numNaves; // ~112px por nave (8m escala)

  // Escala vertical: 1 metro = 40 píxeles aprox.
  // Ground = 0m -> groundY
  // Techo de guayas = 3.80m -> groundY - (3.80 * 40) = groundY - 152px
  // Alambre tutorado español = 2.20m -> groundY - (2.20 * 40) = groundY - 88px
  const scaleY = 40;
  const techoY = groundY - (3.80 * scaleY);
  const tutorY = groundY - (2.20 * scaleY);

  // Malla semitransparente que envuelve el techo de guayas y paredes
  ctx.fillStyle = "rgba(16, 185, 129, 0.05)";
  ctx.beginPath();
  ctx.moveTo(startX, groundY);
  ctx.lineTo(startX, techoY);
  ctx.lineTo(startX + totalWidth, techoY);
  ctx.lineTo(startX + totalWidth, groundY);
  ctx.closePath();
  ctx.fill();

  // Pilares verticales tubulares (ÚNICOS TUBOS EN LA ESTRUCTURA - CERO TUBOS EN TECHO)
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 3;
  for (let i = 0; i <= numNaves; i++) {
    const px = startX + i * naveW;
    ctx.beginPath();
    ctx.moveTo(px, groundY);
    ctx.lineTo(px, techoY);
    ctx.stroke();

    // Capitel pasacables en tope de pilar
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(px - 4, techoY - 3, 8, 4);

    // Dados de concreto cimentación
    ctx.fillStyle = "rgba(148, 163, 184, 0.25)";
    ctx.fillRect(px - 6, groundY, 12, 16);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.5)";
    ctx.strokeRect(px - 6, groundY, 12, 16);
  }

  // GUAYAS MAESTRAS DE TECHO (Cable de acero galvanizado 3/8" tensado - CERO ARCOS)
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(startX, techoY);
  ctx.lineTo(startX + totalWidth, techoY);
  ctx.stroke();

  // Malla 50x25 HDPE cosida a las guayas (representada con línea segmentada verde)
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 2]);
  ctx.beginPath();
  ctx.moveTo(startX, techoY - 2);
  ctx.lineTo(startX + totalWidth, techoY - 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Tirantes verticales de soporte del tutorado que bajan de las guayas de techo
  ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
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
    ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(startX, tutorY);
    ctx.lineTo(startX + totalWidth, tutorY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Plantas de tomate tutoradas (Malla Espaldera vs Hilo)
    drawTomatoPlants(ctx, startX, totalWidth, groundY, tutorY, showTrellisMesh);
  }

  // Tensores a tierra en la fachada ESTE (lado derecho del gráfico)
  if (showTensores) {
    const eastX = startX + totalWidth;
    const anchorX = eastX + 60;
    const anchorY = groundY + 10;

    // Guaya a 45°
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(eastX, techoY);
    ctx.lineTo(anchorX, groundY);
    ctx.stroke();

    // Muerto de concreto subterráneo
    ctx.fillStyle = "rgba(244, 63, 94, 0.3)";
    ctx.fillRect(anchorX - 10, groundY, 20, 24);
    ctx.strokeRect(anchorX - 10, groundY, 20, 24);

    // Etiqueta tensor
    ctx.fillStyle = "#fda4af";
    ctx.font = "bold 10px var(--font-sans)";
    ctx.fillText("Guaya 3/8\" a 45° + Tensor 5/8\"", anchorX - 50, groundY - 10);
  }

  // Vector Viento Este (sopla de derecha a izquierda)
  if (showWind) {
    drawWindArrows(ctx, startX + totalWidth + 70, groundY - 100);
  }

  // Cotas y dimensiones
  if (showDims) {
    drawDimensions(ctx, startX, totalWidth, groundY, techoY, tutorY);
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

function drawTomatoPlants(ctx, startX, totalWidth, groundY, tutorY, showTrellisMesh = true) {
  // Si la Malla Espaldera está activa, dibujamos la cuadrícula de polipropileno continua (15×15 cm)
  if (showTrellisMesh) {
    const lowerWireY = groundY - 8; // Alambre guía inferior a 0.20 m
    
    // Alambre guía inferior (0.20 m)
    ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, lowerWireY);
    ctx.lineTo(startX + totalWidth, lowerWireY);
    ctx.stroke();

    // Líneas horizontales de la malla espaldera (cada 15 cm a escala ~6px)
    ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
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
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1;
    ctx.fillRect(startX + 10, tutorY - 22, 330, 18);
    ctx.strokeRect(startX + 10, tutorY - 22, 330, 18);
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 9.5px sans-serif";
    ctx.fillText("MALLA ESPALDERA BIORIENTADA 15×15 cm (-88% MANO DE OBRA)", startX + 16, tutorY - 9);
    ctx.restore();
  }

  const step = 22;
  for (let px = startX + 15; px < startX + totalWidth; px += step) {
    if (!showTrellisMesh) {
      // Hilo tradicional de rafia individual (si el usuario apaga la malla tutora)
      ctx.strokeStyle = "rgba(203, 213, 225, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, groundY);
      ctx.lineTo(px, tutorY);
      ctx.stroke();
    }

    // Follaje de la planta (verde esmeralda) entrelazado naturalmente en los cuadros
    ctx.fillStyle = "rgba(16, 185, 129, 0.75)";
    for (let py = groundY - 10; py > tutorY + 8; py -= 18) {
      ctx.beginPath();
      ctx.ellipse(px - 4, py, 7, 4.5, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(px + 4, py - 6, 7, 4.5, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Frutos de tomate (rojo) apoyados por gravedad sobre la cuadrícula
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(px + 5, groundY - 35, 3.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px - 4, groundY - 45, 3.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWindArrows(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = "#38bdf8";
  ctx.fillStyle = "#38bdf8";
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
  ctx.fillText("VIENTO DEL ESTE (Dominante)", x - 55, y - 12);
  ctx.font = "10px var(--font-sans)";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("88% horas / Ráfagas 27 km/h", x - 55, y + 95);
  ctx.restore();
}

function drawDimensions(ctx, startX, totalWidth, groundY, techoY, tutorY) {
  ctx.save();
  ctx.strokeStyle = "#64748b";
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px var(--font-mono)";
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
  ctx.fillText("20.00 m ANCHO (5 Franjas de 4.00 m) × 100.00 m LARGO (2.000 m²)", startX + totalWidth / 2 - 165, dimY - 6);

  // Cotas de Altura (Izquierda)
  const dimX = startX - 45;

  // Cota Techo de Guayas 3.80 m
  ctx.beginPath();
  ctx.moveTo(dimX, groundY);
  ctx.lineTo(dimX, techoY);
  ctx.stroke();
  ctx.strokeRect(dimX - 4, groundY, 8, 1);
  ctx.strokeRect(dimX - 4, techoY, 8, 1);
  ctx.fillText("Techo Guayas: 3.80 m", dimX - 110, (groundY + techoY) / 2);

  // Cota Tutorado 2.20 m
  ctx.fillStyle = "#f59e0b";
  ctx.fillText("Malla Tutora: 2.20 m", startX + 10, tutorY - 5);

  ctx.restore();
}

// ==========================================================================
// 8. TAB 7: PLAN MAESTRO DE PRODUCCIÓN AGRONÓMICA (2.000 m² / 4.400 PLANTAS)
// ==========================================================================
const PROD_STAGES = [
  {
    idx: 0,
    nombre: "1. Enraizamiento / Establecimiento (Sem 1 a 3)",
    grossLiters: 11.1,
    netLiters: 9.4,
    lf: 15,
    dailyM3: 7.00,
    pulses: 3,
    pulseTime: 18,
    schedule: "08:00 | 11:30 | 15:00 (Sectores 1, 2 y 3 en secuencia)",
    ec: "1.9 dS/m",
    ph: "5.8 - 6.0 (Relación N:K 1:1.3)",
    tankA: {
      total: "22.45 kg/sem",
      detail: "Nitrato de Calcio: 12.0 kg | Nitrato de Potasio: 10.0 kg | Fe-EDDHA: 0.45 kg"
    },
    tankB: {
      total: "15.28 kg/sem",
      detail: "MKP (0-52-34): 6.0 kg | K₂SO₄: 4.0 kg | MgSO₄: 5.0 kg | Boro: 0.08 kg | Micro: 0.20 kg"
    },
    tankC: {
      total: "~7.0 L/sem",
      detail: "Ácido Nítrico 60% (regula pH de gotero a 5.8 y neutraliza bicarbonatos)"
    }
  },
  {
    idx: 1,
    nombre: "2. Crecimiento Vegetativo (Sem 4 a 7)",
    grossLiters: 15.8,
    netLiters: 13.0,
    lf: 18,
    dailyM3: 9.95,
    pulses: 4,
    pulseTime: 19,
    schedule: "08:00 | 10:30 | 13:00 | 15:30 (Sectores 1, 2 y 3 en secuencia)",
    ec: "2.2 dS/m",
    ph: "5.8 - 6.2 (Relación N:K 1:1.5)",
    tankA: {
      total: "42.70 kg/sem",
      detail: "AIFA Nitrato de Calcio: 22.0 kg | AIFA Nitrato de Potasio: 20.0 kg | Fe-EDDHA: 0.70 kg"
    },
    tankB: {
      total: "27.50 kg/sem",
      detail: "AIFA MKP: 8.0 kg | K₂SO₄: 10.0 kg | AIFA MgSO₄: 9.0 kg | Boro: 0.15 kg | Micro: 0.35 kg"
    },
    tankC: {
      total: "~14.0 L/sem",
      detail: "Ácido Nítrico 60% (neutraliza bicarbonatos de Quíbor a pH 5.9)"
    }
  },
  {
    idx: 2,
    nombre: "3. Floración y Cuajado (Sem 8 a 11)",
    grossLiters: 23.6,
    netLiters: 18.9,
    lf: 20,
    dailyM3: 14.85,
    pulses: 5,
    pulseTime: 22,
    schedule: "07:30 | 09:30 | 11:30 | 13:30 | 15:30 (Sectores 1, 2 y 3 en secuencia)",
    ec: "2.5 dS/m",
    ph: "5.8 - 6.2 (Relación N:K 1:1.9)",
    tankA: {
      total: "67.90 kg/sem",
      detail: "AIFA Nitrato de Calcio: 32.0 kg | AIFA Nitrato de Potasio: 35.0 kg | Fe-EDDHA: 0.90 kg"
    },
    tankB: {
      total: "44.75 kg/sem",
      detail: "AIFA MKP: 12.0 kg | K₂SO₄: 18.0 kg | AIFA MgSO₄: 14.0 kg | Boro: 0.25 kg | Micro: 0.50 kg"
    },
    tankC: {
      total: "~20.0 L/sem",
      detail: "Ácido Nítrico 60% (neutraliza agua alcalina de pozo)"
    }
  },
  {
    idx: 3,
    nombre: "4. Fructificación Masiva y Cosecha (Sem 12 a 22)",
    grossLiters: 27.2,
    netLiters: 21.8,
    lf: 20,
    dailyM3: 17.10,
    pulses: 5,
    pulseTime: 28,
    schedule: "07:00 | 09:30 | 11:45 | 14:00 | 16:00 (Sectores 1, 2 y 3 en secuencia)",
    ec: "2.7 dS/m",
    ph: "5.8 - 6.2 (Relación N:K 1:2.2)",
    tankA: {
      total: "52.10 kg/sem",
      detail: "AIFA Nitrato de Calcio: 36.0 kg | AIFA Nitrato de Potasio: 15.0 kg | Fe-EDDHA (6%): 1.10 kg"
    },
    tankB: {
      total: "80.90 kg/sem",
      detail: "AIFA Fructificación 12-6-36: 50.0 kg | AIFA MKP: 8.0 kg | K₂SO₄: 20.0 kg | AIFA MgSO₄: 16.0 kg | Boro: 0.30 kg"
    },
    tankC: {
      total: "~25.0 L/sem",
      detail: "Ácido Nítrico 60% (neutraliza bicarbonatos de Quíbor y aporta nitrógeno nítrico)"
    }
  },
  {
    idx: 4,
    nombre: "5. Fin de Ciclo / Cierre (Sem 23 a 24)",
    grossLiters: 18.8,
    netLiters: 16.0,
    lf: 15,
    dailyM3: 11.80,
    pulses: 4,
    pulseTime: 22,
    schedule: "08:00 | 11:00 | 13:30 | 15:30 (Sectores 1, 2 y 3 en secuencia)",
    ec: "2.3 dS/m",
    ph: "5.8 - 6.2 (Relación N:K 2.0)",
    tankA: {
      total: "32.60 kg/sem",
      detail: "AIFA Nitrato de Calcio: 20.0 kg | Nitrato de Potasio: 12.0 kg | Fe-EDDHA: 0.60 kg"
    },
    tankB: {
      total: "42.30 kg/sem",
      detail: "AIFA 12-6-36: 25.0 kg | AIFA MKP: 6.0 kg | K₂SO₄: 10.0 kg | AIFA MgSO₄: 9.0 kg"
    },
    tankC: {
      total: "~16.0 L/sem",
      detail: "Ácido Nítrico 60% (limpieza y desincrustación de goteros)"
    }
  }
];

const SPRAY_MATRIX = [
  {
    categoria: "acaros",
    blanco: "Araña Roja (Tetranychus urticae)",
    activo: "Abamectina 1.8% EC",
    comercial: "Vertimec / Acaramik",
    grupo: "IRAC 6",
    dosis: "75 – 100 mL",
    modo: "Translaminar. Aspersión al envés foliar con boquilla cónica fina.",
    pc: "3 días"
  },
  {
    categoria: "acaros",
    blanco: "Huevos y Ninfas de Ácaro",
    activo: "Hexitiazox 10% WP",
    comercial: "Caesar / Nissorun",
    grupo: "IRAC 10A",
    dosis: "50 – 60 g",
    modo: "Ovicida-larvicida selectivo. Inhibe la muda. Rotar con IRAC 6.",
    pc: "7 días"
  },
  {
    categoria: "acaros",
    blanco: "Ácaro Blanco y Mosca Blanca",
    activo: "Spiromesifen 24% SC",
    comercial: "Oberon",
    grupo: "IRAC 23",
    dosis: "60 – 80 mL",
    modo: "Inhibidor de la síntesis de lípidos. Larga persistencia preventiva.",
    pc: "3 días"
  },
  {
    categoria: "vectores",
    blanco: "Trips Occidental (Frankliniella)",
    activo: "Spinosad 48% SC",
    comercial: "Tracer",
    grupo: "IRAC 5",
    dosis: "20 – 25 mL",
    modo: "Modulador nicotínico GABA. Aplicar al atardecer fresco.",
    pc: "1 día"
  },
  {
    categoria: "vectores",
    blanco: "Trips y Mosca Blanca (Adultos)",
    activo: "Acetamiprid 20% SP",
    comercial: "Mospilan",
    grupo: "IRAC 4A",
    dosis: "35 – 50 g",
    modo: "Sistémico acropétalo. Alta eficacia de choque.",
    pc: "3 días"
  },
  {
    categoria: "vectores",
    blanco: "Pulgones / Áfidos y Mosca",
    activo: "Flonicamid 50% WG",
    comercial: "Teppeki / Beleaf",
    grupo: "IRAC 29",
    dosis: "15 – 20 g",
    modo: "Inhibidor de la succión por estilete. Cero impacto a benéficos.",
    pc: "1 día"
  },
  {
    categoria: "vectores",
    blanco: "Gusano Perforador del Fruto",
    activo: "Clorantraniliprol 20% SC",
    comercial: "Coragen",
    grupo: "IRAC 28",
    dosis: "15 – 20 mL",
    modo: "Modulador receptor de rianodina. Ovicida y larvicida ingestión.",
    pc: "1 día"
  },
  {
    categoria: "hongos",
    blanco: "Oídio / Cenicilla (Leveillula taurica)",
    activo: "Azufre Micronizado 80% WP",
    comercial: "Kumulus / Microthiol",
    grupo: "FRAC M02",
    dosis: "250 – 300 g",
    modo: "Multisitio preventivo. No aplicar a temperaturas >32 °C.",
    pc: "0 días"
  },
  {
    categoria: "hongos",
    blanco: "Oídio y Tizón Temprano",
    activo: "Difenoconazol 25% EC",
    comercial: "Score",
    grupo: "FRAC 3",
    dosis: "40 – 50 mL",
    modo: "Triazol sistémico DMI. Acción curativa y erradicante.",
    pc: "7 días"
  },
  {
    categoria: "hongos",
    blanco: "Tizón Temprano (Alternaria solani)",
    activo: "Clorotalonil 72% SC",
    comercial: "Daconil / Bravo",
    grupo: "FRAC M05",
    dosis: "200 – 250 mL",
    modo: "Contacto multisitio puro. Bloquea germinación de conidias.",
    pc: "3 días"
  },
  {
    categoria: "hongos",
    blanco: "Moho Gris (Botrytis cinerea)",
    activo: "Boscalid 50% WG",
    comercial: "Cantus",
    grupo: "FRAC 7",
    dosis: "50 – 60 g",
    modo: "Inhibidor respiratorio complejo II SDHI. Clave en floración.",
    pc: "3 días"
  },
  {
    categoria: "hongos",
    blanco: "Bacteriosis (Xanthomonas / Clavibacter)",
    activo: "Oxicloruro Cobre + Mancozeb",
    comercial: "Cobrethane / Cupravit",
    grupo: "FRAC M01+M03",
    dosis: "250 g + 200 g",
    modo: "Bactericida y fungicida de contacto protector. Post-poda.",
    pc: "7 días"
  },
  {
    categoria: "virus",
    blanco: "Virus Rugoso (ToBRFV) y Mosaico (TMV)",
    activo: "Leche en Polvo Descremada 10%",
    comercial: "Leche descremada",
    grupo: "Bioseguridad",
    dosis: "100 g / L agua",
    modo: "Inmersión de manos en la esclusa. Desactiva la cápside viral.",
    pc: "Exento"
  },
  {
    categoria: "virus",
    blanco: "Desinfección de Tijeras y Pediluvios",
    activo: "Amonio Cuaternario / Virkon S",
    comercial: "Virkon S al 1%",
    grupo: "Bioseguridad",
    dosis: "10 g / L agua",
    modo: "Inmersión de tijeras entre camellón y bandeja de pies en entrada.",
    pc: "Exento"
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
  initSprayFilterButtons();
  renderSprayMatrix("all");
}

function updateProductionStage() {
  const stageIdx = FarmState.prodStageIdx;
  const data = PROD_STAGES[stageIdx] || PROD_STAGES[3];
  const isYacambu = FarmState.waterSource === "yacambu";

  // Water source adjustment
  const lfPercent = isYacambu ? 6.5 : data.lf;
  const lfFactor = lfPercent / 100.0;
  const grossLiters = data.netLiters / (1.0 - lfFactor);
  const dailyM3 = (grossLiters * 4400) / 7.0 / 1000.0;
  const pulseQty = isYacambu ? Math.max(3, data.pulses - 1) : data.pulses;
  const pulseTime = isYacambu ? data.pulseTime - 2 : data.pulseTime;

  // Acid calculation
  let acidText = data.tankC.total;
  let acidDetail = data.tankC.detail;
  if (isYacambu) {
    const rawVal = parseFloat(data.tankC.total.replace("~", "").replace(" L/sem", "")) || 22;
    const reducedAcid = Math.max(3, Math.round(rawVal * 0.36));
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
    if (elKpiYield) elKpiYield.textContent = "24.2 – 29.9 Ton";
    if (elKpiYieldSub) elKpiYieldSub.textContent = "5.5 a 6.8 kg/planta (1.210 – 1.495 cajas | 60-65% 1ª)";
    if (elKpiYieldTag) elKpiYieldTag.textContent = "Meta: 24.2 a 29.9 Ton (Granulado)";

    if (fertAlertBox && fertAlertText) {
      fertAlertBox.className = "alert-box alert-caution";
      if (fertAlertIcon) fertAlertIcon.textContent = "⚠️";
      fertAlertText.innerHTML = `<strong>Abonado Granulado Manual Edáfico (NPK 12-12-17 SOP + Sulfato de Potasio Granular):</strong> Aplicación manual a suelo descubierto cada 20 días en banda a 15 cm del tallo (32 g/planta = 140.8 kg/abonada = 3 sacos de 50 kg). Costo por saco 45% menor, pero causa <strong>merma productiva del 20-25% (24.2 a 29.9 Ton)</strong> por picos osmóticos de salinidad y absorción discontinua.`;
    }

    if (stageIdx === 3) {
      tankATotal = "1.10 kg/sem (Solo Quelato Fe)";
      tankADetail = "Fe-EDDHA (6%): 1.10 kg inyectado en goteo | Calcio y Potasio aportados al suelo vía Nitrato de Calcio granular y Sulfato de Potasio (SOP) granulado comercial.";
      tankBTotal = "3.00 kg/sem (Solo Foliar / B-Micro)";
      tankBDetail = "Microelementos quelatados: 0.60 kg | Ácido Bórico: 0.30 kg | Fósforo, Magnesio y K de fondo en suelo vía NPK 12-12-17+2MgO SOP.";
    }
  } else if (FarmState.fertilizerRegime === "hibrido") {
    if (elKpiYield) elKpiYield.textContent = "31.5 – 35.5 Ton";
    if (elKpiYieldSub) elKpiYieldSub.textContent = "7.1 a 8.0 kg/planta (1.575 – 1.775 cajas | 72-76% 1ª)";
    if (elKpiYieldTag) elKpiYieldTag.textContent = "Meta: 31.5 a 35.5 Ton (Híbrido)";

    if (fertAlertBox && fertAlertText) {
      fertAlertBox.className = "alert-box alert-success";
      if (fertAlertIcon) fertAlertIcon.textContent = "💡";
      fertAlertText.innerHTML = `<strong>Estrategia Híbrida Óptima para Quíbor:</strong> Fondo granulado al preparar el camellón (NPK 12-12-17 SOP a 30 g/m lin) + Fertirriego hidrosoluble AIFA en floración y cosecha. Proyecta <strong>31.5 a 35.5 Ton (7.1 a 8.0 kg/pl)</strong> con excelente relación costo/beneficio en Venezuela.`;
    }

    if (stageIdx === 3) {
      tankATotal = "38.00 kg/sem";
      tankADetail = "AIFA Nitrato de Calcio: 25.0 kg | AIFA Nitrato de Potasio: 12.0 kg | Fe-EDDHA (6%): 1.00 kg (complementa reserva de fondo en suelo).";
      tankBTotal = "55.00 kg/sem";
      tankBDetail = "AIFA Fructificación 12-6-36: 35.0 kg | AIFA MKP: 6.0 kg | K₂SO₄ soluble: 14.0 kg | AIFA MgSO₄: 10.0 kg.";
    }
  } else {
    // "aifa" (100% hidrosoluble)
    if (elKpiYield) elKpiYield.textContent = "33.0 – 37.4 Ton";
    if (elKpiYieldSub) elKpiYieldSub.textContent = "7.5 a 8.5 kg/planta (1.650 – 1.870 cajas | 75-80% 1ª)";
    if (elKpiYieldTag) elKpiYieldTag.textContent = "Meta: 33.0 a 37.4 Ton (AIFA Hidrosoluble)";

    if (fertAlertBox && fertAlertText) {
      fertAlertBox.className = "alert-box alert-success";
      if (fertAlertIcon) fertAlertIcon.textContent = "✨";
      fertAlertText.innerHTML = `<strong>Línea AIFA Hidrosoluble (Venezuela):</strong> Inyección continua y dosificada por cinta a 40 cm en 3 sectores (AIFA Fructificación 12-6-36 + Nitrato de Calcio AIFA + MKP AIFA). Eficiencia del 85-90% sin picos salinos. Proyecta <strong>7.5 a 8.5 kg/planta (33.0 a 37.4 Ton)</strong> con 75-80% fruta de Primera calidad.`;
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

function initSprayFilterButtons() {
  const buttons = document.querySelectorAll("[data-spray-filter]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-spray-filter");
      renderSprayMatrix(filter);
    });
  });
}

function renderSprayMatrix(filter = "all") {
  const tbody = document.getElementById("spray-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  const filtered = filter === "all" 
    ? SPRAY_MATRIX 
    : SPRAY_MATRIX.filter(item => item.categoria === filter);

  filtered.forEach(item => {
    const tr = document.createElement("tr");

    let badgeColor = "#38bdf8";
    let badgeBg = "rgba(56,189,248,0.15)";
    if (item.categoria === "acaros") {
      badgeColor = "#f43f5e";
      badgeBg = "rgba(244,63,94,0.2)";
    } else if (item.categoria === "virus") {
      badgeColor = "#10b981";
      badgeBg = "rgba(16,185,129,0.2)";
    } else if (item.categoria === "hongos") {
      badgeColor = "#f59e0b";
      badgeBg = "rgba(245,158,11,0.2)";
    }

    tr.innerHTML = `
      <td><strong>${item.blanco}</strong></td>
      <td>${item.activo}</td>
      <td style="color:#cbd5e1;">${item.comercial}</td>
      <td><span class="tag" style="background:${badgeBg}; color:${badgeColor}; border:1px solid ${badgeColor}40; font-size:0.75rem; padding:0.2rem 0.5rem;">${item.grupo}</span></td>
      <td><strong style="color:#f8fafc;">${item.dosis}</strong></td>
      <td style="font-size:0.8rem; color:#94a3b8;">${item.modo}</td>
      <td><span class="status-badge" style="background:rgba(255,255,255,0.06); color:#f8fafc; font-size:0.8rem;">${item.pc}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// ==========================================================================
// 12. PROTOCOLO DE VALIDACIÓN Y CERTIFICACIÓN DE POZO PROFUNDO
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

function calculateWellValidation() {
  const flowLs = parseFloat(document.getElementById("well-test-flow")?.value) || 2.5;
  const nd = parseFloat(document.getElementById("well-test-nd")?.value) || 87.0;
  const resVol = parseFloat(document.getElementById("well-test-res-vol")?.value) || 80.0;
  const lfPercent = parseFloat(document.getElementById("well-test-lf")?.value) || 20.0;

  FarmState.setState({ wellFlowLs: flowLs });

  // 1. Demanda diaria pico para 4.400 plantas de tomate
  // Neta: 18.5 L/planta/semana = 2.643 L/planta/día
  const lfFrac = Math.min(Math.max(lfPercent / 100.0, 0.05), 0.40);
  const grossLitersPlantDay = 2.642857 / (1.0 - lfFrac);
  const dailyDemandM3 = (4400 * grossLitersPlantDay) / 1000.0;

  // 2. Caudal horario del pozo (m³/h)
  const flowM3h = flowLs * 3.6;

  // 3. Horas de bombeo diario
  const pumpHours = dailyDemandM3 / flowM3h;

  // 4. Altura Manométrica Total (HMT)
  // ND + 3.5m elevación + 4.5m fricción + 5.0m presión residual (0.5 bar)
  const hmt = nd + 13.0;
  const psi = hmt * 1.4223;

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
  if (elPsi) elPsi.textContent = `~${Math.round(psi)} PSI total`;
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
      titleVerdict.textContent = "Pozo Aprobado para Casa de Malla (2.000 m²)";
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
// 10. MÓDULO DE CÁLCULO Y PROYECTO DE PERFORACIÓN DE POZO PROFUNDO (120 m)
// ==========================================================================
function initWellDrillingCalculator() {
  const selDepth = document.getElementById("select-drill-depth");
  const selDrillDiam = document.getElementById("select-drill-diameter");
  const selCasingDiam = document.getElementById("select-casing-diameter");
  const selScreenType = document.getElementById("select-screen-type");

  if (!selDepth || !selDrillDiam || !selCasingDiam || !selScreenType) return;

  function recalculateDrillMetrics() {
    const depth = parseFloat(selDepth.value);
    const drillDiamInches = parseFloat(selDrillDiam.value);
    const casingDiamInches = parseFloat(selCasingDiam.value);
    const screenType = selScreenType.value;

    FarmState.setState({
      wellDepthM: depth,
      drillDiamInches: drillDiamInches,
      casingDiamInches: casingDiamInches,
      screenType: screenType
    });

    // Metraje de tubería según profundidad
    let casingLen = 82.0;
    let screenLen = 38.0;
    let pumpHp = "7.5 HP";
    let hmtDesc = "HMT = 100.5 mca (a 98 m)";

    if (depth === 90) {
      casingLen = 66.0;
      screenLen = 24.0;
      pumpHp = "5.5 HP";
      hmtDesc = "HMT = 86.0 mca (a 78 m)";
    } else if (depth === 105) {
      casingLen = 75.0;
      screenLen = 30.0;
      pumpHp = "5.5 a 7.5 HP";
      hmtDesc = "HMT = 94.0 mca (a 88 m)";
    }

    // Cálculo de empaque de grava cuarzosa anular
    const dDrillM = drillDiamInches * 0.0254;
    const dCasingM = (casingDiamInches === 8 ? 8.625 : 6.625) * 0.0254;
    const anularArea = (Math.PI / 4) * Math.max(0.001, (dDrillM * dDrillM - dCasingM * dCasingM));
    const gravelLen = depth - 15.0; // Sello sanitario ocupa los primeros 15 m
    const gravelVol = anularArea * gravelLen * 1.25; // 25% esponjamiento y derrumbe en arenas
    const gravelTons = gravelVol * 1.60;
    const gravelBags = Math.round((gravelTons * 1000) / 50);

    // Cálculo de sello sanitario
    const dConductorM = 14.0 * 0.0254;
    const sealArea = (Math.PI / 4) * Math.max(0.001, (dConductorM * dConductorM - dCasingM * dCasingM));
    const sealVol = sealArea * 15.0 * 1.20;

    // Cálculo presupuestario referencial (mercado Venezuela)
    const costMobilization = 1500;
    const costConductor = 18.0 * 95;
    const costSeal = 650;
    const costDrilling = (depth - 18.0) * (drillDiamInches > 12.0 ? 75 : 70);
    const costLogging = 600;
    const costCasing = casingLen * (casingDiamInches === 8 ? 62 : 48);
    const screenUnitPrice = screenType === "johnson" ? (casingDiamInches === 8 ? 140 : 110) : 70;
    const costScreens = screenLen * screenUnitPrice;
    const costGravel = gravelTons * 65;
    const costAirlift = 24.0 * 55;
    const costPumpingTest = 1200;
    const costLab = 220;
    const costPump = casingDiamInches === 8 ? 2850 : 2450;
    const costColumn = (depth - 22.0) * 22;
    const costVfd = 1150;
    const costWellhead = 450;

    const subtotal = costMobilization + costConductor + costSeal + costDrilling + costLogging +
                     costCasing + costScreens + costGravel + costAirlift + costPumpingTest +
                     costLab + costPump + costColumn + costVfd + costWellhead;
    const contingencies = subtotal * 0.05;
    const totalCost = subtotal + contingencies;

    // Actualizar elementos en UI
    const elCasing = document.getElementById("disp-drill-casing");
    const elScreen = document.getElementById("disp-drill-screen");
    const elScreenSub = document.getElementById("disp-drill-screen-sub");
    const elGravel = document.getElementById("disp-drill-gravel");
    const elGravelSub = document.getElementById("disp-drill-gravel-sub");
    const elSeal = document.getElementById("disp-drill-seal");
    const elPump = document.getElementById("disp-drill-pump");
    const elPumpSub = document.getElementById("disp-drill-pump-sub");
    const elCost = document.getElementById("disp-drill-cost");
    const elTotalCost = document.getElementById("drill-summary-total");

    if (elCasing) elCasing.textContent = `${casingLen.toFixed(1)} m`;
    if (elScreen) elScreen.textContent = `${screenLen.toFixed(1)} m`;
    if (elScreenSub) elScreenSub.textContent = screenType === "johnson" ? "Inox AISI 304 (Ve = 0.0007 m/s)" : "Ranurada Puente (Ve = 0.0018 m/s)";
    if (elGravel) elGravel.textContent = `${gravelVol.toFixed(2)} m³`;
    if (elGravelSub) elGravelSub.textContent = `${gravelTons.toFixed(1)} Ton (~${gravelBags} sacos 50kg)`;
    if (elSeal) elSeal.textContent = `${sealVol.toFixed(2)} m³`;
    if (elPump) elPump.textContent = pumpHp;
    if (elPumpSub) elPumpSub.textContent = hmtDesc;
    if (elCost) elCost.textContent = `$${Math.round(totalCost).toLocaleString("en-US")} USD`;
    if (elTotalCost) elTotalCost.textContent = `$${totalCost.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
  }

  selDepth.addEventListener("change", recalculateDrillMetrics);
  selDrillDiam.addEventListener("change", recalculateDrillMetrics);
  selCasingDiam.addEventListener("change", recalculateDrillMetrics);
  selScreenType.addEventListener("change", recalculateDrillMetrics);

  recalculateDrillMetrics();
}

