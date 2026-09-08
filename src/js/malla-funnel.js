/**
 * malla-funnel.js — Lógica de Conversión, Selector de Variante y Calculadora Agronómica
 * Valle de Quíbor, Lara, Venezuela
 * 
 * Reglas de negocio:
 * - Cero precios en USD (solicitud explícita de cotización a WhatsApp)
 * - Nave estándar Quíbor: 1.000 m² = 8 rollos (4m × 100m)
 * - Soporta selector interactivo de Variante 110 gsm (Tomate) vs 125-130 gsm (Pimentón)
 */

const MALLA_CONFIG = {
  rollArea: 400,         // m² por rollo comercial (4.00 m × 100 m)
  waNumber: '584160000000', // Teléfono WhatsApp para cotización
};

const CROP_DATA = {
  pimenton: {
    label: 'Pimentón (Capsicum annuum)',
    shortLabel: 'Pimentón',
    recommendedGsm: '125-130 gsm',
    pesticideReduction: '75%',
    virosisRiskReduction: '98%',
    roiCycle: '1 Ciclo',
    ventilationNote: 'El porte compacto del pimentón (0.8–1.2 m) permite priorizar la máxima resistencia mecánica de la variante 125–130 gsm frente a ráfagas eólicas del Este.'
  },
  tomate: {
    label: 'Tomate Indeterminado (Hilo Alto)',
    shortLabel: 'Tomate Indeterminado',
    recommendedGsm: '110 gsm',
    pesticideReduction: '70%',
    virosisRiskReduction: '95%',
    roiCycle: '1 Ciclo',
    ventilationNote: 'El tomate de hilo alto (2.2 m) requiere un volumen buffer de aire fresco. La variante 110 gsm facilita mayor flujo convectivo manteniendo la casa hasta 2 °C más fresca.'
  }
};

const VARIANT_INFO = {
  '110': {
    name: 'Variante A — 110 gsm',
    badge: '110 g/m² • 50×25 Mesh • 720 KLY',
    targetCrop: 'Tomate Hilo Alto',
    airPermeability: 'Mayor flujo de aire (casas hasta 2 °C más frescas)',
    breakingStrength: '1.280 N / 5cm (ASTM D 5034)',
    noteText: '<strong>Variante 110 gsm seleccionada:</strong> Diseñada para maximizar la tasa de renovación de aire convectiva en casas de malla de <strong>tomate indeterminado</strong>. Permite mantener temperaturas internas ≤ 31 °C en horas de alta radiación en Quíbor, previniendo el aborto floral.'
  },
  '130': {
    name: 'Variante B — 125–130 gsm',
    badge: '125–130 g/m² • 50×25 Mesh • 720 KLY',
    targetCrop: 'Pimentón / Cultivos Densos',
    airPermeability: 'Máxima resistencia mecánica estructural',
    breakingStrength: '1.530 N / 5cm (ASTM D 5034)',
    noteText: '<strong>Variante 125–130 gsm seleccionada:</strong> Máxima robustez para soportar la fricción constante y ráfagas del Este de 27 km/h. Óptima para <strong>pimentón</strong> y zonas de viento intenso donde la integridad física y durabilidad a 5 años son la máxima prioridad.'
  }
};

let currentVariant = '110';

/**
 * Cálculo del número de rollos comerciales (4m × 100m = 400 m²)
 * Basado en la arquitectura estándar de nave en Quíbor:
 * - 1.000 m² de suelo (nave 20m × 50m) = 8 rollos exactos (cubierta + cerramiento lateral + solapes)
 * - Escalado proporcional con factor de envolvente y cortes
 */
function calcRolls(areaSuelo) {
  if (!areaSuelo || areaSuelo <= 0) return 0;
  // 1000 m2 -> 8 rollos
  const rolls = Math.max(1, Math.round(areaSuelo * 0.0072 + 0.8));
  return rolls;
}

/**
 * Animación fluida de contador numérico
 */
function animateCounter(el, targetVal, prefix = '', suffix = '', decimals = 0) {
  if (!el) return;
  const startVal = parseFloat(el.getAttribute('data-val')) || 0;
  const duration = 650;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = startVal + (targetVal - startVal) * ease;

    el.textContent = prefix + (decimals > 0 ? current.toFixed(decimals) : Math.round(current)) + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.setAttribute('data-val', targetVal);
    }
  }

  requestAnimationFrame(step);
}

/**
 * Actualiza la calculadora y genera el enlace dinámico de cotización para WhatsApp
 */
function updateCalculator() {
  const areaInput = document.getElementById('calc-area');
  const cropInput = document.getElementById('calc-crop');
  const locInput = document.getElementById('calc-location');

  const area = parseFloat(areaInput?.value) || 1000;
  const cropKey = cropInput?.value || 'tomate';
  const location = locInput?.value.trim() || 'Valle de Quíbor';

  const crop = CROP_DATA[cropKey] || CROP_DATA['tomate'];
  const rolls = calcRolls(area);
  const variantData = VARIANT_INFO[currentVariant];

  // Actualizar UI de resultados
  const elRolls = document.getElementById('result-rolls');
  const elPest = document.getElementById('result-pesticide');
  const elViro = document.getElementById('result-virosis');
  const elRoi  = document.getElementById('result-roi');

  if (elRolls) animateCounter(elRolls, rolls, '', '', 0);
  if (elPest)  elPest.textContent = `-${crop.pesticideReduction}`;
  if (elViro)  elViro.textContent = crop.virosisRiskReduction;
  if (elRoi)   elRoi.textContent  = crop.roiCycle;

  // Actualizar enlace y mensaje de WhatsApp (sin precios, solo solicitud de cotización técnica)
  const waMsg = encodeURIComponent(
    `Hola, requiero cotización técnica para ${rolls} rollos de Malla Antiáfido 50 Mesh (${variantData.name}) para un cultivo de ${crop.shortLabel} en ${location} (${area.toLocaleString()} m² de superficie).`
  );

  const waBtn = document.getElementById('btn-whatsapp-quote');
  if (waBtn) {
    waBtn.href = `https://wa.me/${MALLA_CONFIG.waNumber}?text=${waMsg}`;
  }

  const waFloat = document.getElementById('btn-float-wa');
  if (waFloat) {
    waFloat.href = `https://wa.me/${MALLA_CONFIG.waNumber}?text=${waMsg}`;
  }

  const waFooter = document.getElementById('btn-footer-wa');
  if (waFooter) {
    waFooter.href = `https://wa.me/${MALLA_CONFIG.waNumber}?text=${waMsg}`;
  }
}

/**
 * Conmuta entre Variante A (110 gsm) y Variante B (125-130 gsm)
 */
function setVariant(variantKey) {
  if (!VARIANT_INFO[variantKey]) return;
  currentVariant = variantKey;

  const data = VARIANT_INFO[variantKey];

  // Actualizar botones de variante
  document.querySelectorAll('.btn-variant').forEach(btn => {
    if (btn.dataset.variant === variantKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Actualizar nota agronómica
  const noteEl = document.getElementById('variant-note-text');
  if (noteEl) {
    noteEl.innerHTML = data.noteText;
  }

  // Actualizar badges en Hero
  const heroBadgeEl = document.getElementById('hero-variant-badge');
  if (heroBadgeEl) {
    heroBadgeEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 0.9rem;">verified</span> ${data.badge}`;
  }

  // Actualizar tabla comparativa (resaltar columna correspondiente)
  const colA = document.querySelectorAll('.col-variant-a');
  const colB = document.querySelectorAll('.col-variant-b');

  if (variantKey === '110') {
    colA.forEach(el => el.style.background = 'var(--badge-spec-bg)');
    colB.forEach(el => el.style.background = 'transparent');
  } else {
    colB.forEach(el => el.style.background = 'var(--badge-spec-bg)');
    colA.forEach(el => el.style.background = 'transparent');
  }

  // Si el usuario selecciona 110 gsm, sincronizar select de cultivo a Tomate por defecto si aún no se cambió; si es 130 gsm, a Pimentón
  const cropSelect = document.getElementById('calc-crop');
  if (cropSelect && document.activeElement !== cropSelect) {
    if (variantKey === '110' && cropSelect.value !== 'tomate') {
      cropSelect.value = 'tomate';
    } else if (variantKey === '130' && cropSelect.value !== 'pimenton') {
      cropSelect.value = 'pimenton';
    }
  }

  updateCalculator();
}

/**
 * Inicializador del embudo
 */
function initFunnel() {
  // 1. Listeners de la calculadora
  ['calc-area', 'calc-crop', 'calc-location'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateCalculator);
      el.addEventListener('change', updateCalculator);
    }
  });

  // 2. Listeners de los botones selectores de variante
  document.querySelectorAll('.btn-variant').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const v = btn.dataset.variant;
      if (v) setVariant(v);
    });
  });

  // 3. Sincronizar cambio de cultivo con sugerencia de variante
  const cropSelect = document.getElementById('calc-crop');
  if (cropSelect) {
    cropSelect.addEventListener('change', () => {
      if (cropSelect.value === 'tomate') {
        setVariant('110');
      } else if (cropSelect.value === 'pimenton') {
        setVariant('130');
      }
    });
  }

  // Ejecución inicial
  setVariant('110');
  updateCalculator();
  console.log('[MallaFunnel] Embudo agronómico inicializado con éxito');
}

// Exponer globalmente
window.initFunnel = initFunnel;
window.setVariant = setVariant;
window.updateCalculator = updateCalculator;
