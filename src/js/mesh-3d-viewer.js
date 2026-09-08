/**
 * Mesh3DViewer — Motor 3D WebGL para Malla Antiáfido 50 Mesh
 * Soporta 3 modos interactivos:
 * 1. 'weave': Tejido microscópico 50×25 mesh con hilos entrelazados HDPE virgen
 * 2. 'roll': Rollo industrial de 4.00 m × 100 m con orillo verde reforzado
 * 3. 'aero': Simulación de viento (85% disipación eólica / exclusión física de plagas)
 * 
 * Basado en Three.js r128 + OrbitControls
 */

class Mesh3DViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('[Mesh3D] Contenedor no encontrado:', containerId);
      return;
    }

    this.currentMode = 'weave';
    this.animables = [];
    this.clock = new THREE.Clock();
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.lightsGroup = null;
    this.contentGroup = null;

    this._initEngine();
    this.switchMode('weave');
    this._bindUiEvents();
    this._animate();

    console.log('[Mesh3D] Visor inicializado en modo: weave');
  }

  _initEngine() {
    // 1. Escena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050a07);

    // 2. Cámara
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 500;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 7.5);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (this.renderer.outputEncoding !== undefined) {
      this.renderer.outputEncoding = THREE.sRGBEncoding;
    }

    // Insertar canvas al inicio del contenedor (antes de controles)
    this.container.insertBefore(this.renderer.domElement, this.container.firstChild);

    // 4. OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.08;
      this.controls.maxDistance = 25;
      this.controls.minDistance = 2;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 1.2;
    }

    // Grupos
    this.lightsGroup = new THREE.Group();
    this.contentGroup = new THREE.Group();
    this.scene.add(this.lightsGroup);
    this.scene.add(this.contentGroup);

    this._setupBaseLights();

    // Resize listener
    window.addEventListener('resize', () => this._onWindowResize());
  }

  _setupBaseLights() {
    this.lightsGroup.clear();

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    this.lightsGroup.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(6, 8, 7);
    this.lightsGroup.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x53C942, 1.2);
    dirLight2.position.set(-6, -4, 4);
    this.lightsGroup.add(dirLight2);

    const backLight = new THREE.PointLight(0x38bdf8, 1.0, 30);
    backLight.position.set(0, 5, -8);
    this.lightsGroup.add(backLight);
  }

  _onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  _clearContent() {
    this.animables = [];
    while (this.contentGroup.children.length > 0) {
      const obj = this.contentGroup.children[0];
      this.contentGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }
  }

  switchMode(mode) {
    this.currentMode = mode;
    this._clearContent();

    // Remover overlays temporales de otros modos si existen
    const existingOverlays = this.container.querySelectorAll('.mode-runtime-overlay');
    existingOverlays.forEach(el => el.remove());

    if (mode === 'weave') {
      this.buildWeave();
    } else if (mode === 'roll') {
      this.buildRoll();
    } else if (mode === 'aero') {
      this.buildAero();
    }

    // Actualizar botones UI
    const buttons = this.container.querySelectorAll('.btn-mode');
    buttons.forEach(btn => {
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    console.log(`[Mesh3D] Modo cambiado a: ${mode}`);
  }

  /**
   * MODO 1: Tejido Microscópico 50×25 Mesh
   */
  buildWeave() {
    this.camera.position.set(0, 0, 7.2);
    if (this.controls) {
      this.controls.target.set(0, 0, 0);
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 1.0;
    }

    const threadRadius = 0.08;
    const threadMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f8f3,
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.94
    });

    const meshGroup = new THREE.Group();

    // 1. URDIMBRE: Hilos Verticales (más densos: 50 por pulgada -> paso menor)
    const warpCount = 18;
    const warpSpacing = 0.26;
    const warpLength = 5.2;

    for (let i = -warpCount / 2; i <= warpCount / 2; i++) {
      const geo = new THREE.CylinderGeometry(threadRadius, threadRadius, warpLength, 16);
      const thread = new THREE.Mesh(geo, threadMaterial);
      thread.position.set(i * warpSpacing, 0, 0);
      meshGroup.add(thread);
    }

    // 2. TRAMA: Hilos Horizontales (25 por pulgada -> paso mayor)
    const weftCount = 10;
    const weftSpacing = 0.52;
    const weftLength = (warpCount + 1) * warpSpacing;

    for (let j = -weftCount / 2; j <= weftCount / 2; j++) {
      const geo = new THREE.CylinderGeometry(threadRadius, threadRadius, weftLength, 16);
      const thread = new THREE.Mesh(geo, threadMaterial);
      thread.rotation.z = Math.PI / 2;
      // Ondulación Z sutil para efecto de trenzado real
      thread.position.set(0, j * weftSpacing, threadRadius * 1.05);
      meshGroup.add(thread);
    }

    // 3. Orillo Verde Reforzado (borde izquierdo del tejido)
    const orilloGeo = new THREE.BoxGeometry(0.55, warpLength, 0.28);
    const orilloMat = new THREE.MeshStandardMaterial({
      color: 0x22881a,
      roughness: 0.5,
      metalness: 0.05
    });
    const orillo = new THREE.Mesh(orilloGeo, orilloMat);
    orillo.position.set(- (warpCount / 2 * warpSpacing) - 0.28, 0, 0.05);
    meshGroup.add(orillo);

    // 4. Partícula "Mosca blanca" intentando penetrar el poro y bloqueada
    const flyGroup = new THREE.Group();
    const flyBodyGeo = new THREE.SphereGeometry(0.42, 16, 16); // 0.85mm a escala
    const flyBodyMat = new THREE.MeshStandardMaterial({
      color: 0xffeedd,
      roughness: 0.4
    });
    const flyBody = new THREE.Mesh(flyBodyGeo, flyBodyMat);
    flyBody.scale.set(1.4, 0.9, 0.8);

    const flyWingsGeo = new THREE.PlaneGeometry(0.9, 0.6);
    const flyWingsMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const flyWings = new THREE.Mesh(flyWingsGeo, flyWingsMat);
    flyWings.rotation.x = Math.PI / 3;
    flyWings.position.set(0, 0.25, 0.2);

    flyGroup.add(flyBody);
    flyGroup.add(flyWings);
    flyGroup.position.set(0.6, 0.3, 1.8);
    this.contentGroup.add(flyGroup);

    // Animación de intento de penetración y rebote
    let flyTime = 0;
    this.animables.push((delta) => {
      flyTime += delta * 2.5;
      // Oscila hacia la malla (Z=0.3) y rebota hacia atrás
      const zPos = 0.5 + Math.abs(Math.sin(flyTime)) * 1.5;
      flyGroup.position.z = zPos;
      flyGroup.rotation.y = Math.sin(flyTime * 0.8) * 0.3;
      flyWings.rotation.z = Math.sin(flyTime * 15) * 0.2;
    });

    this.contentGroup.add(meshGroup);

    // Animación suave del tejido
    this.animables.push((delta) => {
      meshGroup.rotation.y = Math.sin(this.clock.getElapsedTime() * 0.3) * 0.15;
    });
  }

  /**
   * MODO 2: Rollo Industrial 4.00 m × 100 m
   */
  buildRoll() {
    this.camera.position.set(4.5, 3.2, 5.8);
    if (this.controls) {
      this.controls.target.set(0, 0, 0);
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.9;
    }

    const rollGroup = new THREE.Group();

    // 1. Cilindro principal del rollo (4 metros de largo a escala)
    const rollLength = 4.2;
    const rollRadius = 0.95;
    const rollGeo = new THREE.CylinderGeometry(rollRadius, rollRadius, rollLength, 48);
    const rollMat = new THREE.MeshStandardMaterial({
      color: 0xf3fbf5,
      roughness: 0.35,
      metalness: 0.05
    });
    const rollMesh = new THREE.Mesh(rollGeo, rollMat);
    rollMesh.rotation.z = Math.PI / 2; // Acostado horizontalmente
    rollGroup.add(rollMesh);

    // 2. Núcleo de cartón / eje central
    const coreGeo = new THREE.CylinderGeometry(0.18, 0.18, rollLength + 0.25, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x8d6e63,
      roughness: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.rotation.z = Math.PI / 2;
    rollGroup.add(coreMesh);

    // 3. Orillos Verdes Reforzados en ambos bordes del rollo
    const orilloMat = new THREE.MeshStandardMaterial({
      color: 0x2e9b1f,
      roughness: 0.4
    });
    const orilloWidth = 0.18;

    [-rollLength / 2 + orilloWidth / 2, rollLength / 2 - orilloWidth / 2].forEach(pos => {
      const orilloRingGeo = new THREE.CylinderGeometry(rollRadius + 0.008, rollRadius + 0.008, orilloWidth, 48);
      const orilloRing = new THREE.Mesh(orilloRingGeo, orilloMat);
      orilloRing.rotation.z = Math.PI / 2;
      orilloRing.position.x = pos;
      rollGroup.add(orilloRing);
    });

    // 4. Lámina desenrollada desplegándose hacia adelante
    const sheetWidth = rollLength;
    const sheetLength = 3.2;
    const sheetGeo = new THREE.PlaneGeometry(sheetWidth, sheetLength, 16, 16);
    const sheetMat = new THREE.MeshStandardMaterial({
      color: 0xe8f5ea,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      roughness: 0.3
    });
    const sheetMesh = new THREE.Mesh(sheetGeo, sheetMat);
    sheetMesh.rotation.x = -Math.PI / 2.8;
    sheetMesh.position.set(0, -rollRadius + 0.1, sheetLength / 2 * 0.7);
    rollGroup.add(sheetMesh);

    // Orillo verde en la orilla desenrollada
    const sheetEdgeMat = new THREE.MeshStandardMaterial({ color: 0x2e9b1f });
    [-sheetWidth / 2 + 0.08, sheetWidth / 2 - 0.08].forEach(pos => {
      const edgeGeo = new THREE.BoxGeometry(0.12, sheetLength, 0.02);
      const edgeMesh = new THREE.Mesh(edgeGeo, sheetEdgeMat);
      edgeMesh.rotation.x = -Math.PI / 2.8;
      edgeMesh.position.set(pos, -rollRadius + 0.1, sheetLength / 2 * 0.7);
      rollGroup.add(edgeMesh);
    });

    this.contentGroup.add(rollGroup);

    // Animación de rotación del rollo
    this.animables.push((delta) => {
      rollGroup.rotation.y += delta * 0.2;
    });

    // Overlay flotante con cotas técnicas
    const overlay = document.createElement('div');
    overlay.className = 'mode-runtime-overlay';
    overlay.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(7, 11, 9, 0.85);
      border: 1px solid rgba(83, 201, 66, 0.3);
      border-radius: 12px;
      padding: 10px 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #f1f5f2;
      backdrop-filter: blur(8px);
      z-index: 10;
      pointer-events: none;
    `;
    overlay.innerHTML = `
      <div style="color: #53C942; font-weight: 800; margin-bottom: 2px;">4.00 m × 100 m</div>
      <div style="color: #8fa892; font-size: 0.72rem;">Superficie: 400 m² por rollo</div>
      <div style="color: #38bdf8; font-size: 0.72rem;">Orillo verde doble costura</div>
    `;
    this.container.appendChild(overlay);
  }

  /**
   * MODO 3: Dinámica Aerodinámica y Disipación Eólica
   */
  buildAero() {
    this.camera.position.set(0, 0, 8.5);
    if (this.controls) {
      this.controls.target.set(0, 0, 0);
      this.controls.autoRotate = false;
    }

    // 1. Panel de Malla Central en X = 0
    const panelHeight = 5.0;
    const panelWidth = 0.05;
    const panelDepth = 4.0;
    const panelGeo = new THREE.PlaneGeometry(panelDepth, panelHeight);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x90cdf4,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      wireframe: false
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.rotation.y = Math.PI / 2; // Perpendicular al flujo de viento
    this.contentGroup.add(panel);

    // Marco del panel
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x2d3748 });
    const topFrameGeo = new THREE.BoxGeometry(0.1, 0.1, panelDepth + 0.1);
    const topFrame = new THREE.Mesh(topFrameGeo, frameMat);
    topFrame.position.set(0, panelHeight / 2, 0);
    this.contentGroup.add(topFrame);

    const bottomFrame = topFrame.clone();
    bottomFrame.position.set(0, -panelHeight / 2, 0);
    this.contentGroup.add(bottomFrame);

    // 2. Sistema de Partículas (Simulación de Viento y Micro-plagas)
    const PARTICLE_COUNT = 320;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const particleData = [];

    const colorWind = new THREE.Color(0x38bdf8);    // Cyan: Viento entrante
    const colorBlocked = new THREE.Color(0xf43f5e); // Rojo: 85% frenado/bloqueado
    const colorPassed = new THREE.Color(0x53C942);  // Verde: 15% brisa filtrada

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Iniciar a la izquierda (X negativo)
      const x = -5.5 + Math.random() * 5.0;
      const y = (Math.random() - 0.5) * panelHeight * 0.9;
      const z = (Math.random() - 0.5) * panelDepth * 0.9;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      colors[i * 3] = colorWind.r;
      colors[i * 3 + 1] = colorWind.g;
      colors[i * 3 + 2] = colorWind.b;

      particleData.push({
        vx: 0.04 + Math.random() * 0.03,
        vy: (Math.random() - 0.5) * 0.005,
        vz: (Math.random() - 0.5) * 0.005,
        willBlock: Math.random() < 0.85, // 85% bloqueo físico
        isBlocked: false,
        fade: 1.0
      });
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });

    const particleSystem = new THREE.Points(geom, pMaterial);
    this.contentGroup.add(particleSystem);

    // Animación de flujo de partículas
    this.animables.push(() => {
      const pos = geom.attributes.position.array;
      const col = geom.attributes.color.array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particleData[i];

        if (!p.isBlocked) {
          pos[i * 3] += p.vx;
          pos[i * 3 + 1] += p.vy;
          pos[i * 3 + 2] += p.vz;

          // Cruce de la malla en X = 0
          if (pos[i * 3] >= 0) {
            if (p.willBlock) {
              p.isBlocked = true;
              // Cambiar color a rojo/bloqueado y desviar hacia arriba/lados
              col[i * 3] = colorBlocked.r;
              col[i * 3 + 1] = colorBlocked.g;
              col[i * 3 + 2] = colorBlocked.b;
              p.vx = -0.01 - Math.random() * 0.015; // Rebote
              p.vy = (Math.random() - 0.5) * 0.03;
            } else {
              // Pasa con velocidad reducida al 15% (brisa suave controlada)
              p.vx *= 0.25;
              col[i * 3] = colorPassed.r;
              col[i * 3 + 1] = colorPassed.g;
              col[i * 3 + 2] = colorPassed.b;
            }
          }
        } else {
          // Partícula bloqueada se disipa
          pos[i * 3] += p.vx;
          pos[i * 3 + 1] += p.vy;
          p.fade -= 0.025;
          if (p.fade <= 0) {
            // Reiniciar en la izquierda
            this._resetParticle(i, pos, col, particleData, colorWind, panelHeight, panelDepth);
          }
        }

        // Reinicio si cruza toda la escena
        if (pos[i * 3] > 4.5) {
          this._resetParticle(i, pos, col, particleData, colorWind, panelHeight, panelDepth);
        }
      }

      geom.attributes.position.needsUpdate = true;
      geom.attributes.color.needsUpdate = true;
    });

    // Overlay informativo de aerodinámica
    const overlay = document.createElement('div');
    overlay.className = 'mode-runtime-overlay';
    overlay.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(7, 11, 9, 0.88);
      border: 1px solid rgba(83, 201, 66, 0.3);
      border-radius: 12px;
      padding: 12px 18px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #f1f5f2;
      backdrop-filter: blur(8px);
      z-index: 10;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
    `;
    overlay.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="width:10px; height:10px; border-radius:50%; background:#f43f5e; display:inline-block;"></span>
        <span><strong>85% Bloqueo</strong> eólico y plagas</span>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="width:10px; height:10px; border-radius:50%; background:#53C942; display:inline-block;"></span>
        <span><strong>15% Flujo</strong> convectivo suave</span>
      </div>
      <div style="color:#38bdf8; font-size:0.72rem; margin-top:2px;">
        Ráfaga sim.: 27 km/h (Este Quíbor)
      </div>
    `;
    this.container.appendChild(overlay);
  }

  _resetParticle(i, pos, col, data, colorWind, h, d) {
    pos[i * 3] = -5.5;
    pos[i * 3 + 1] = (Math.random() - 0.5) * h * 0.9;
    pos[i * 3 + 2] = (Math.random() - 0.5) * d * 0.9;

    col[i * 3] = colorWind.r;
    col[i * 3 + 1] = colorWind.g;
    col[i * 3 + 2] = colorWind.b;

    data[i].vx = 0.04 + Math.random() * 0.03;
    data[i].vy = (Math.random() - 0.5) * 0.005;
    data[i].vz = (Math.random() - 0.5) * 0.005;
    data[i].willBlock = Math.random() < 0.85;
    data[i].isBlocked = false;
    data[i].fade = 1.0;
  }

  _bindUiEvents() {
    const buttons = this.container.querySelectorAll('.btn-mode');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const mode = btn.dataset.mode;
        if (mode && mode !== this.currentMode) {
          this.switchMode(mode);
        }
      });
    });
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    const delta = this.clock.getDelta();

    if (this.controls) {
      this.controls.update();
    }

    for (let i = 0; i < this.animables.length; i++) {
      this.animables[i](delta);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Exponer globalmente
window.Mesh3DViewer = Mesh3DViewer;
