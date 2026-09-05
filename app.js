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
// 3. INICIALIZACIÓN Y MANEJO DE PESTAÑAS (TABS)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initClimateTab();
  initVentilationCalculator();
  initIrrigationCalculator();
  initPestMatrix();
  initCanvasVisualizer();
  initBlueprintViewers();
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

function initTabs() {
  const tabButtons = document.querySelectorAll(".nav-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetTabId = btn.getAttribute("data-tab");
      const targetPane = document.getElementById(targetTabId);
      if (targetPane) {
        targetPane.classList.add("active");
        if (targetTabId === "tab-estructura") {
          // Re-dibujar canvas al activar la pestaña
          requestAnimationFrame(drawGreenhouseStructure);
        }
      }
    });
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

  // Demanda diaria total del módulo de 1.000 m²
  // Total plantas = 1000 m² * densidad
  const totalPlants = 1000 * density;
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

  // Cota de Ancho Total (40.00 m)
  const dimY = groundY + 38;
  ctx.beginPath();
  ctx.moveTo(startX, dimY);
  ctx.lineTo(startX + totalWidth, dimY);
  ctx.stroke();
  // Flechas
  ctx.strokeRect(startX, dimY - 4, 1, 8);
  ctx.strokeRect(startX + totalWidth, dimY - 4, 1, 8);
  ctx.fillText("40.00 m (5 Módulos de 8.00 m entre postes)", startX + totalWidth / 2 - 120, dimY - 6);

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
  ctx.fillText("Tutor Español: 2.20 m", startX + 10, tutorY - 5);

  ctx.restore();
}
