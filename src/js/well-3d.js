/**
 * ====================================================================
 * AGROVENECUA INGENIERÍA — Motor 3D Interactivo del Pozo Artesanal (60m)
 * Ubicación: Cuara, Valle de Quíbor, Municipio Jiménez, Lara, Venezuela
 * Coordenadas GPS: 9°53'15.79"N 69°35'37.25"W (Cota: 734 msnm)
 * WebGL / Three.js r128 + OrbitControls
 * ====================================================================
 */

class Well3DViewer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn(`[Well3D] Contenedor #${containerId} no encontrado en el DOM.`);
      return;
    }

    this.options = Object.assign({
      totalDepth: 60.0,       // Profundidad total proyectada (m)
      currentDepth: 50.0,     // Profundidad actual consolidada (m)
      staticWaterLevel: 49.5, // Nivel estático en reposo (m)
      wellDiameter: 1.0,      // Diámetro exterior de excavación (m)
      casingDiameter: 0.60,   // Diámetro interior encofrado de anillos (m)
      pumpDepth: 58.0,        // Profundidad de asentamiento de bomba (m)
      autoRotate: true,
      showCutaway: true,
      showPump: true,
      isPumping: false
    }, options);

    // Estado interno
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.animId = null;
    this.clock = new THREE.Clock();

    // Grupos de capas para inspección
    this.layers = {
      surface: new THREE.Group(),
      strata: new THREE.Group(),
      casing: new THREE.Group(),
      water: new THREE.Group(),
      pump: new THREE.Group(),
      markers: new THREE.Group()
    };

    this.waterMesh = null;
    this.bubbles = null;
    this.isInitialized = false;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 500;

    // 1. Escena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x080d0a);
    this.scene.fog = new THREE.FogExp2(0x080d0a, 0.008);

    // 2. Cámara
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300);
    // Posición inicial: mirando a la zona de transición 30-50m
    this.camera.position.set(28, -25, 38);

    // 3. Renderer con antialiasing
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Limpiar contenedor previo si existe
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.target.set(0, -30, 0); // Mirar al centro del pozo (-30m)
      this.controls.maxDistance = 140;
      this.controls.minDistance = 6;
      this.controls.autoRotate = this.options.autoRotate;
      this.controls.autoRotateSpeed = 1.2;
    }

    // 5. Iluminación
    this.setupLighting();

    // 6. Construir modelo geológico y estructural
    this.buildGroundSurface();
    this.buildGeologicalStrata();
    this.buildWellFusteAndRings();
    this.buildWaterColumn();
    this.buildPumpEquipment();
    this.buildDepthMarkers();

    // Añadir todos los grupos a la escena
    Object.values(this.layers).forEach(layer => this.scene.add(layer));

    // 7. Event listeners
    window.addEventListener('resize', () => this.onResize());

    // 8. Crear interfaz HUD de control
    this.createUIOverlay();

    // 9. Loop de render
    this.isInitialized = true;
    this.animate();
  }

  setupLighting() {
    // Luz ambiental suave
    const ambientLight = new THREE.AmbientLight(0xd4e9d7, 0.6);
    this.scene.add(ambientLight);

    // Luz solar cenital (superficie)
    const sunLight = new THREE.DirectionalLight(0xfff7e6, 1.2);
    sunLight.position.set(20, 40, 25);
    sunLight.castShadow = true;
    this.scene.add(sunLight);

    // Luz subterránea para revelar estratos (tono esmeralda agritech)
    const undergroundLight1 = new THREE.PointLight(0x53C942, 1.0, 60);
    undergroundLight1.position.set(12, -25, 12);
    this.scene.add(undergroundLight1);

    // Luz en fondo del acuífero (tono azul cristalino agua de pozo)
    const aquiferLight = new THREE.PointLight(0x38bdf8, 1.8, 40);
    aquiferLight.position.set(0, -52, 0);
    this.scene.add(aquiferLight);

    // Luz tenue en fuste
    const fusteLight = new THREE.PointLight(0xffd166, 0.8, 30);
    fusteLight.position.set(0, -10, 0);
    this.scene.add(fusteLight);
  }

  buildGroundSurface() {
    const group = this.layers.surface;

    // Terreno plano en cota 0 (Cuara 734 msnm)
    const groundGeo = new THREE.CylinderGeometry(18, 18, 1.5, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x3d332a,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = 0.75;
    ground.receiveShadow = true;
    group.add(ground);

    // Brocal del pozo en superficie (marco con angular de acero y bordillo)
    const brocalGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.8, 32);
    const brocalMat = new THREE.MeshStandardMaterial({
      color: 0x5a6065, // Concreto / metal
      roughness: 0.5,
      metalness: 0.4
    });
    const brocal = new THREE.Mesh(brocalGeo, brocalMat);
    brocal.position.y = 1.9;
    group.add(brocal);

    // Tapa / marco superior de protección (con escotilla semiabierta)
    const lidGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.08, 32);
    const lidMat = new THREE.MeshStandardMaterial({
      color: 0x0F4D06, // Verde bosque Agrovenecua
      metalness: 0.6,
      roughness: 0.3
    });
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.position.y = 2.34;
    group.add(lid);

    // Poste de acometida eléctrica contiguo al pozo (evidencia de campo RAG)
    const poleGeo = new THREE.CylinderGeometry(0.12, 0.15, 8.0, 16);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x7c858c, roughness: 0.9 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(-3.5, 4.0, -2.5);
    group.add(pole);

    // Tablero eléctrico en el poste
    const boxGeo = new THREE.BoxGeometry(0.5, 0.7, 0.3);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x2b3d2c, metalness: 0.7 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(-3.5, 2.5, -2.2);
    group.add(box);
  }

  buildGeologicalStrata() {
    const group = this.layers.strata;
    const radius = 14.0;
    const cutAngle = this.options.showCutaway ? Math.PI * 1.35 : Math.PI * 2;

    // ESTRATO 1: 0 a 8m — Conglomerado Aluvial (Matriz arenosa ocre + cantos de lidita/caliche)
    const h1 = 8.0;
    const g1 = new THREE.CylinderGeometry(radius, radius, h1, 36, 1, false, 0, cutAngle);
    const m1 = new THREE.MeshStandardMaterial({
      color: 0xb5844b, // Ocre terroso aluvial
      roughness: 0.95,
      side: THREE.DoubleSide
    });
    const mesh1 = new THREE.Mesh(g1, m1);
    mesh1.position.y = -h1 / 2;
    group.add(mesh1);

    // ESTRATO 2: 8 a 48m — Acuitardo Arcilloso Masivo Impermeable (Sello geológico autoportante)
    const h2 = 40.0;
    const g2 = new THREE.CylinderGeometry(radius, radius, h2, 36, 1, false, 0, cutAngle);
    const m2 = new THREE.MeshStandardMaterial({
      color: 0x473c33, // Arcilla plástica densa chocolate/grisácea
      roughness: 0.85,
      side: THREE.DoubleSide
    });
    const mesh2 = new THREE.Mesh(g2, m2);
    mesh2.position.y = -8.0 - (h2 / 2);
    group.add(mesh2);

    // ESTRATO 3: 48 a 50m — Techo del Acuífero Cuara (Transición con rezumo inicial)
    const h3 = 2.0;
    const g3 = new THREE.CylinderGeometry(radius, radius, h3, 36, 1, false, 0, cutAngle);
    const m3 = new THREE.MeshStandardMaterial({
      color: 0x2f3c3a, // Grava oscura con humedad
      roughness: 0.7,
      side: THREE.DoubleSide
    });
    const mesh3 = new THREE.Mesh(g3, m3);
    mesh3.position.y = -48.0 - (h3 / 2);
    group.add(mesh3);

    // ESTRATO 4: 50 a 60m — Acuífero Cuara de Alta Transmisividad (Gravas de lidita y cuarzo)
    const h4 = 10.0;
    const g4 = new THREE.CylinderGeometry(radius, radius, h4, 36, 1, false, 0, cutAngle);
    const m4 = new THREE.MeshStandardMaterial({
      color: 0x1d3b37, // Grava saturada reflectante con tintes cian mineral
      roughness: 0.4,
      metalness: 0.3,
      side: THREE.DoubleSide
    });
    const mesh4 = new THREE.Mesh(g4, m4);
    mesh4.position.y = -50.0 - (h4 / 2);
    group.add(mesh4);
  }

  buildWellFusteAndRings() {
    const group = this.layers.casing;
    const totalRings = 60;
    const ringHeight = 1.0;
    const ringRadius = 0.50; // radio 50cm = diámetro 1.0m exterior
    const innerRadius = 0.30; // diámetro 60cm interior

    for (let i = 0; i < totalRings; i++) {
      const depthTop = i;
      const isAquiferZone = depthTop >= 48; // Zona con huecos de filtrado (cribas)
      const isUnexcavated = depthTop >= 50; // Últimos 10 metros proyectados

      // Cilindro del anillo
      const ringGeo = new THREE.CylinderGeometry(ringRadius, ringRadius, ringHeight * 0.96, 24, 1, true);
      
      let ringColor = 0x8a9296; // Concreto estándar
      let ringOpacity = 0.95;
      let roughness = 0.8;

      if (isAquiferZone) {
        ringColor = 0x587b87; // Concreto impermeable con aditivo anti-salino
        roughness = 0.5;
      }
      if (isUnexcavated) {
        // Modo translúcido/destacado para mostrar los 10 metros que faltan
        ringColor = 0x53C942; // Verde Agrovenecua destacando la inversión
        ringOpacity = 0.75;
      }

      const ringMat = new THREE.MeshStandardMaterial({
        color: ringColor,
        roughness: roughness,
        metalness: isAquiferZone ? 0.2 : 0.05,
        transparent: isUnexcavated,
        opacity: ringOpacity,
        side: THREE.DoubleSide
      });

      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = -depthTop - 0.5;
      group.add(ringMesh);

      // Si está en la zona acuífera (48 a 60m), añadir pequeños puntos representativos de los orificios de filtrado
      if (isAquiferZone) {
        const perforationsGeo = new THREE.TorusGeometry(ringRadius * 0.99, 0.02, 6, 16);
        const perfMat = new THREE.MeshBasicMaterial({ color: 0x112229 });
        const perf1 = new THREE.Mesh(perforationsGeo, perfMat);
        perf1.rotation.x = Math.PI / 2;
        perf1.position.y = -depthTop - 0.3;
        group.add(perf1);

        const perf2 = new THREE.Mesh(perforationsGeo, perfMat);
        perf2.rotation.x = Math.PI / 2;
        perf2.position.y = -depthTop - 0.7;
        group.add(perf2);
      }
    }
  }

  buildWaterColumn() {
    const group = this.layers.water;

    // Nivel estático: 49.5m a 60m = 10.5m de altura de agua
    const waterHeight = 10.5;
    const waterRadius = 0.29; // Llena el interior del anillo de 60cm

    const waterGeo = new THREE.CylinderGeometry(waterRadius, waterRadius, waterHeight, 32);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0369a1,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.82,
      roughness: 0.1,
      transmission: 0.7,
      ior: 1.333
    });

    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
    // Posición centrada de la columna entre -49.5 y -60 = -54.75
    this.waterMesh.position.y = -54.75;
    group.add(this.waterMesh);

    // Disco superior brillante representando el espejo de agua a 49.5m
    const surfaceDiskGeo = new THREE.CircleGeometry(waterRadius, 32);
    const surfaceDiskMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      side: THREE.DoubleSide
    });
    const surfaceDisk = new THREE.Mesh(surfaceDiskGeo, surfaceDiskMat);
    surfaceDisk.rotation.x = Math.PI / 2;
    surfaceDisk.position.y = -49.5;
    group.add(surfaceDisk);

    // Partículas de burbujas en movimiento
    const bubbleCount = 45;
    const bubbleGeo = new THREE.SphereGeometry(0.018, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
    this.bubbles = new THREE.Group();

    for (let i = 0; i < bubbleCount; i++) {
      const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
      bubble.position.set(
        (Math.random() - 0.5) * 0.4,
        -49.6 - Math.random() * 10.0,
        (Math.random() - 0.5) * 0.4
      );
      bubble.userData = { speed: 0.02 + Math.random() * 0.04 };
      this.bubbles.add(bubble);
    }
    group.add(this.bubbles);
  }

  buildPumpEquipment() {
    const group = this.layers.pump;
    if (!this.options.showPump) return;

    // 1. Bomba sumergible cilíndrica de acero inoxidable a 58 m
    const pumpGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
    const pumpMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.9,
      roughness: 0.2
    });
    const pump = new THREE.Mesh(pumpGeo, pumpMat);
    pump.position.set(0, -58.0, 0);
    group.add(pump);

    // Rejilla de succión de la bomba (en medio de la bomba)
    const suctionGeo = new THREE.CylinderGeometry(0.082, 0.082, 0.2, 16);
    const suctionMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.95 });
    const suction = new THREE.Mesh(suctionGeo, suctionMat);
    suction.position.set(0, -58.2, 0);
    group.add(suction);

    // 2. Columna de tubería vertical de impulsión (PEAD 1.5" azul/negra hasta superficie)
    const pipeLength = 58.0;
    const pipeGeo = new THREE.CylinderGeometry(0.025, 0.025, pipeLength, 12);
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Azul tubería de agua
      roughness: 0.3
    });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.position.set(0.06, -29.0, 0);
    group.add(pipe);

    // 3. Cable sumergible azul (desde bomba hasta superficie)
    const cableGeo = new THREE.CylinderGeometry(0.008, 0.008, pipeLength, 8);
    const cableMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const cable = new THREE.Mesh(cableGeo, cableMat);
    cable.position.set(-0.06, -29.0, 0.04);
    group.add(cable);

    // 4. Guaya de acero inoxidable de suspensión (1.400 kgf)
    const wireGeo = new THREE.CylinderGeometry(0.004, 0.004, pipeLength, 6);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.95 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.position.set(0, -29.0, -0.06);
    group.add(wire);
  }

  buildDepthMarkers() {
    const group = this.layers.markers;

    // Hitos clave con esferas marcadoras y anillos
    const milestones = [
      { depth: 0, label: "0m Superficie (Brocal)", color: 0xffffff },
      { depth: 8, label: "8m Base Conglomerado", color: 0xb5844b },
      { depth: 48, label: "48m Techo Acuífero", color: 0xf59e0b },
      { depth: 49.5, label: "49.5m Nivel Estático Agua", color: 0x38bdf8 },
      { depth: 50, label: "50m Fin Obra Actual (83%)", color: 0xef4444 },
      { depth: 58, label: "58m Bomba Sumergible", color: 0xa855f7 },
      { depth: 60, label: "60m Fondo Objetivo (+10m)", color: 0x53C942 }
    ];

    milestones.forEach(m => {
      // Anillo indicador a la profundidad
      const ringGeo = new THREE.TorusGeometry(1.6, 0.03, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: m.color });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -m.depth;
      group.add(ring);

      // Pequeña esfera de baliza
      const dotGeo = new THREE.SphereGeometry(0.16, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({ color: m.color });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(1.8, -m.depth, 0);
      group.add(dot);
    });
  }

  createUIOverlay() {
    // Si ya existe un HUD no crearlo dos veces
    if (this.container.querySelector('.well-3d-hud')) return;

    const hud = document.createElement('div');
    hud.className = 'well-3d-hud';
    hud.innerHTML = `
      <div class="hud-header">
        <span class="hud-badge"><span class="pulse-dot"></span> Pozo Artesanal 60 m</span>
        <span class="hud-depth-label" id="hud-current-view">Vista: Perfil Estratigráfico</span>
      </div>

      <div class="hud-controls">
        <button class="hud-btn active" id="btn-well-view-profile" title="Ver todo el perfil 0-60m">
          <span class="material-symbols-outlined">straighten</span> Perfil 60m
        </button>
        <button class="hud-btn" id="btn-well-view-aquifer" title="Zoom al Acuífero y Agua">
          <span class="material-symbols-outlined">water_ph</span> Acuífero (48-60m)
        </button>
        <button class="hud-btn" id="btn-well-view-surface" title="Vista de Superficie y Brocal">
          <span class="material-symbols-outlined">cottage</span> Superficie
        </button>
        <button class="hud-btn" id="btn-well-toggle-rotate" title="Pausar / Reanudar Rotación">
          <span class="material-symbols-outlined">sync</span> Rotar
        </button>
      </div>

      <div class="hud-strata-legend">
        <div class="strata-item" data-depth="0"><span class="color-dot" style="background:#b5844b"></span> 0-8m Conglomerado</div>
        <div class="strata-item" data-depth="8"><span class="color-dot" style="background:#473c33"></span> 8-48m Acuitardo Arcilla</div>
        <div class="strata-item" data-depth="49.5"><span class="color-dot" style="background:#38bdf8"></span> 49.5m Espejo Agua</div>
        <div class="strata-item highlight" data-depth="50"><span class="color-dot" style="background:#53C942"></span> 50-60m Faltan 10m ($4k)</div>
      </div>
    `;

    this.container.appendChild(hud);

    // Conectar botones
    const btnProfile = hud.querySelector('#btn-well-view-profile');
    const btnAquifer = hud.querySelector('#btn-well-view-aquifer');
    const btnSurface = hud.querySelector('#btn-well-view-surface');
    const btnRotate = hud.querySelector('#btn-well-toggle-rotate');
    const hudLabel = hud.querySelector('#hud-current-view');

    btnProfile.addEventListener('click', () => {
      this.setActiveBtn(btnProfile);
      hudLabel.textContent = "Vista: Perfil Completo (0 a 60m)";
      this.animateCamera(new THREE.Vector3(26, -28, 36), new THREE.Vector3(0, -30, 0));
    });

    btnAquifer.addEventListener('click', () => {
      this.setActiveBtn(btnAquifer);
      hudLabel.textContent = "Vista: Fondo Acuífero (48 a 60m) — 10.5m Columna";
      this.animateCamera(new THREE.Vector3(8, -52, 9), new THREE.Vector3(0, -54, 0));
    });

    btnSurface.addEventListener('click', () => {
      this.setActiveBtn(btnSurface);
      hudLabel.textContent = "Vista: Brocal y Acometida Eléctrica";
      this.animateCamera(new THREE.Vector3(7, 6, 9), new THREE.Vector3(0, 1.5, 0));
    });

    btnRotate.addEventListener('click', () => {
      if (this.controls) {
        this.controls.autoRotate = !this.controls.autoRotate;
        btnRotate.classList.toggle('active', this.controls.autoRotate);
      }
    });

    // Clic en items de la leyenda para viajar al estrato
    hud.querySelectorAll('.strata-item').forEach(item => {
      item.addEventListener('click', () => {
        const depth = parseFloat(item.dataset.depth);
        this.animateCamera(new THREE.Vector3(12, -depth, 14), new THREE.Vector3(0, -depth, 0));
        hudLabel.textContent = `Estrato: Profundidad -${depth} m`;
      });
    });
  }

  setActiveBtn(activeBtn) {
    this.container.querySelectorAll('.hud-btn').forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  animateCamera(targetPos, targetLookAt, duration = 1200) {
    if (!this.controls) return;
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const startTime = performance.now();

    const updateCamera = (currentTime) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1.0);
      // Easing cúbico suave
      const ease = t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

      this.camera.position.lerpVectors(startPos, targetPos, ease);
      this.controls.target.lerpVectors(startTarget, targetLookAt, ease);
      this.controls.update();

      if (t < 1.0) {
        requestAnimationFrame(updateCamera);
      }
    };

    requestAnimationFrame(updateCamera);
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Actualizar controles orbitales
    if (this.controls) {
      this.controls.update();
    }

    // Animación sutil del agua (ondulaciones leves en su escala o emisión)
    if (this.waterMesh) {
      this.waterMesh.material.emissiveIntensity = 0.35 + Math.sin(time * 2.5) * 0.08;
    }

    // Animación de burbujas en la columna de agua
    if (this.bubbles) {
      this.bubbles.children.forEach(bubble => {
        bubble.position.y += bubble.userData.speed;
        if (bubble.position.y > -49.5) {
          bubble.position.y = -59.5;
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
  }

  setCameraProfile(profile) {
    if (profile === 'overview') {
      this.animateCamera(new THREE.Vector3(38, -25, 42), new THREE.Vector3(0, -30, 0));
    } else if (profile === 'surface') {
      this.animateCamera(new THREE.Vector3(7, 6, 9), new THREE.Vector3(0, 1.5, 0));
    } else if (profile === 'water') {
      this.animateCamera(new THREE.Vector3(10, -50, 12), new THREE.Vector3(0, -55, 0));
    } else if (profile === 'pump') {
      this.animateCamera(new THREE.Vector3(8, -52, 9), new THREE.Vector3(0, -54, 0));
    }
  }

  toggleAutoRotate(enable) {
    if (this.controls) {
      this.controls.autoRotate = (enable !== undefined) ? enable : !this.controls.autoRotate;
      return this.controls.autoRotate;
    }
    return false;
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
    window.removeEventListener('resize', () => this.onResize());
  }
}

// Exportar globalmente para consumo en index.html y cockpit.html
window.Well3DViewer = Well3DViewer;
