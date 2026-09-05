/**
 * ====================================================================
 * AgroQuíbor Pro — Motor 3D Interactivo Estilo Blender (WebGL / Three.js)
 * Estructura: Casa de Malla 2.000 m² (20.00 m Ancho × 100.00 m Fondo)
 * Coordenadas: 9°53'20.0"N 69°35'35.0"W (Valle de Quíbor, Lara)
 * ====================================================================
 */

class Greenhouse3DViewer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`[Greenhouse3D] Contenedor #${containerId} no encontrado.`);
      return;
    }

    this.options = Object.assign({
      width: 20.0,      // Ancho transversal (m)
      length: 100.0,    // Fondo longitudinal (m)
      height: 3.80,     // Altura libre pilares (m)
      trellisHeight: 2.20, // Altura tutorado español (m)
      numBays: 5,       // 5 franjas de 4.00 m
      bayWidth: 4.0,    // Ancho de cada rollo en cubierta (m)
      pillarSpacingZ: 5.0 // Espaciamiento postes en fondo (m)
    }, options);

    // Estado del visor
    this.isAutoRotating = false;
    this.shadingMode = 'solid'; // 'solid' | 'wireframe' | 'xray'
    this.isWalkMode = false;
    this.isSunlightMode = document.body.classList.contains('sunlight-mode');
    this.meshOpacity = 0.45;
    
    // Grupos de capas para inspección
    this.layers = {
      ground: new THREE.Group(),
      pillars: new THREE.Group(),
      cables: new THREE.Group(),
      mesh: new THREE.Group(),
      crop: new THREE.Group(),
      dims: new THREE.Group(),
      wind: new THREE.Group()
    };

    // Colección de animables
    this.animables = [];
    this.isInitialized = false;

    this.initScene();
    this.buildModel();
    this.initGizmo();
    this.bindEvents();
    this.animate();
  }

  initScene() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 560;

    // Escena
    this.scene = new THREE.Scene();
    this.updateSceneBackground();

    // Cámara Perspectiva Principal
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
    this.camera.position.set(45, 32, 60);

    // Renderer WebGL con soporte de sombras suaves
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.id = 'greenhouse-3d-webgl';
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.container.appendChild(this.renderer.domElement);

    // OrbitControls con amortiguación inercial suave estilo Blender
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 220.0;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05; // No bajar demasiado bajo tierra
    this.controls.target.set(0, 2.0, 0);
    this.controls.update();

    // Preset inicial
    this.setCameraPreset('iso', false);

    // Sistema de Iluminación
    this.setupLighting();

    // Agregar todas las capas a la escena principal
    Object.values(this.layers).forEach(layer => this.scene.add(layer));
  }

  setupLighting() {
    // Luz ambiental
    this.ambientLight = new THREE.AmbientLight(
      this.isSunlightMode ? 0xffffff : 0x88a0c0,
      this.isSunlightMode ? 0.9 : 0.6
    );
    this.scene.add(this.ambientLight);

    // Sol direccional de Quíbor (simula radiación cenital con ángulo hacia el Este)
    this.sunLight = new THREE.DirectionalLight(0xfffaed, this.isSunlightMode ? 1.6 : 1.2);
    this.sunLight.position.set(30, 50, 20);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 150;
    this.sunLight.shadow.camera.left = -40;
    this.sunLight.shadow.camera.right = 40;
    this.sunLight.shadow.camera.top = 70;
    this.sunLight.shadow.camera.bottom = -70;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Luz de relleno lateral (difusa del cielo)
    this.skyLight = new THREE.HemisphereLight(
      this.isSunlightMode ? 0xd0e8ff : 0x1e3a8a,
      this.isSunlightMode ? 0xe2e8f0 : 0x0f172a,
      0.5
    );
    this.scene.add(this.skyLight);
  }

  updateSceneBackground() {
    if (this.isSunlightMode) {
      this.scene.background = new THREE.Color(0xf1f5f9);
      this.scene.fog = new THREE.FogExp2(0xf1f5f9, 0.0035);
    } else {
      this.scene.background = new THREE.Color(0x050912);
      this.scene.fog = new THREE.FogExp2(0x050912, 0.0038);
    }
  }

  /**
   * Construcción geométrica paramétrica del invernadero
   */
  buildModel() {
    this.buildGround();
    this.buildPillars();
    this.buildCables();
    this.buildMeshCover();
    this.buildCrop();
    this.buildDimensions();
    this.buildWindFlow();
  }

  // 1. Terreno, Zanja Sanitaria y Cuadrícula CAD
  buildGround() {
    const W = this.options.width;
    const L = this.options.length;

    // Plano de suelo interior (huella 2.000 m²)
    const groundGeo = new THREE.PlaneGeometry(W, L);
    const groundMat = new THREE.MeshStandardMaterial({
      color: this.isSunlightMode ? 0xe2e8f0 : 0x0a101f,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.0;
    ground.receiveShadow = true;
    this.layers.ground.add(ground);

    // Zanja Sanitaria Perimetral (0.20 m prof × 0.20 m ancho)
    const trenchMat = new THREE.MeshStandardMaterial({
      color: this.isSunlightMode ? 0x059669 : 0x047857,
      roughness: 0.8
    });
    const trenchBorder = new THREE.BoxGeometry(W + 0.4, 0.2, L + 0.4);
    const trench = new THREE.Mesh(trenchBorder, trenchMat);
    trench.position.y = -0.10;
    this.layers.ground.add(trench);

    // Cuadrícula CAD exterior estilo Blender
    const gridHelper = new THREE.GridHelper(
      Math.max(W, L) * 1.6,
      30,
      this.isSunlightMode ? 0x059669 : 0x10b981,
      this.isSunlightMode ? 0x94a3b8 : 0x1e293b
    );
    gridHelper.position.y = -0.01;
    this.layers.ground.add(gridHelper);
  }

  // 2. Pilares Sch 40, Dados de Concreto y Capiteles Pasacables
  buildPillars() {
    const W = this.options.width;
    const L = this.options.length;
    const H = this.options.height;
    const stepZ = this.options.pillarSpacingZ;

    const xCoords = [-10, -6, -2, 2, 6, 10]; // 6 líneas de pilares = 5 naves de 4m
    const zSteps = Math.round(L / stepZ);     // 20 vanos = 21 líneas en Z

    // Geometrías compartidas
    const pillarGeo = new THREE.CylinderGeometry(0.04, 0.04, H, 12);
    const footingGeo = new THREE.BoxGeometry(0.40, 0.60, 0.40); // 40×40×60 cm
    const capGeo = new THREE.BoxGeometry(0.14, 0.08, 0.14);

    // Materiales
    const pillarMat = new THREE.MeshStandardMaterial({
      color: this.isSunlightMode ? 0x334155 : 0x94a3b8,
      metalness: 0.75,
      roughness: 0.35
    });

    const footingMat = new THREE.MeshStandardMaterial({
      color: this.isSunlightMode ? 0x64748b : 0x334155,
      roughness: 0.95
    });

    const capMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.2
    });

    this.pillarMeshes = [];

    for (let i = 0; i < xCoords.length; i++) {
      const x = xCoords[i];

      for (let j = 0; j <= zSteps; j++) {
        const z = -L / 2 + j * stepZ;

        // Tubo vertical
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(x, H / 2, z);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        this.layers.pillars.add(pillar);
        this.pillarMeshes.push(pillar);

        // Capitel pasacables en tope a 3.80m
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(x, H + 0.04, z);
        this.layers.pillars.add(cap);

        // Dado de concreto bajo suelo
        const footing = new THREE.Mesh(footingGeo, footingMat);
        footing.position.set(x, -0.30, z);
        footing.receiveShadow = true;
        this.layers.pillars.add(footing);
      }
    }
  }

  // 3. Red de Guayas Maestras 3/8" y Tirantes a Tierra a 45°
  buildCables() {
    const W = this.options.width;
    const L = this.options.length;
    const H = this.options.height;
    const xCoords = [-10, -6, -2, 2, 6, 10];

    const cableMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.2
    });

    const guyMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      metalness: 0.8,
      roughness: 0.3
    });

    const turnbuckleMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.2
    });

    // A. 6 Guayas Maestras Longitudinales de 100 m
    for (let x of xCoords) {
      const cableGeo = new THREE.CylinderGeometry(0.015, 0.015, L, 8);
      const cable = new THREE.Mesh(cableGeo, cableMat);
      cable.rotation.x = Math.PI / 2;
      cable.position.set(x, H + 0.06, 0);
      cable.castShadow = true;
      this.layers.cables.add(cable);
    }

    // B. Guayas Transversales cada 20 m
    for (let z = -L / 2; z <= L / 2; z += 20.0) {
      const transGeo = new THREE.CylinderGeometry(0.012, 0.012, W, 8);
      const transCable = new THREE.Mesh(transGeo, cableMat);
      transCable.rotation.z = Math.PI / 2;
      transCable.position.set(0, H + 0.05, z);
      this.layers.cables.add(transCable);
    }

    // C. Tirantes perimetrales a tierra a 45° con Tensores Ojo-Ojo
    const anchorDist = H; // 3.80 m a tierra para 45°

    // Tirantes en fachadas Este y Oeste (+X y -X) cada 10 metros
    for (let z = -L / 2; z <= L / 2; z += 10.0) {
      // Fachada Este (+X = +10m) - Esfuerzo crítico por viento dominante
      this.createGuyWire(10.0, z, 10.0 + anchorDist, z, H, guyMat, turnbuckleMat);
      // Fachada Oeste (-X = -10m)
      this.createGuyWire(-10.0, z, -10.0 - anchorDist, z, H, guyMat, turnbuckleMat);
    }

    // Tirantes en cabeceras Norte y Sur (+Z y -Z)
    for (let x of xCoords) {
      this.createGuyWire(x, L / 2, x, L / 2 + anchorDist, H, guyMat, turnbuckleMat);
      this.createGuyWire(x, -L / 2, x, -L / 2 - anchorDist, H, guyMat, turnbuckleMat);
    }
  }

  createGuyWire(x1, z1, x2, z2, h, cableMat, turnbuckleMat) {
    const p1 = new THREE.Vector3(x1, h, z1);
    const p2 = new THREE.Vector3(x2, 0, z2);
    const dist = p1.distanceTo(p2);

    const wireGeo = new THREE.CylinderGeometry(0.012, 0.012, dist, 6);
    const wire = new THREE.Mesh(wireGeo, cableMat);

    // Posicionar y orientar cilindro hacia p2
    const mid = p1.clone().add(p2).multiplyScalar(0.5);
    wire.position.copy(mid);
    wire.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
    this.layers.cables.add(wire);

    // Tensor de tornillo ojo-ojo a 1.2 m del suelo
    const tbPos = p2.clone().add(p1.clone().sub(p2).normalize().multiplyScalar(1.2));
    const tbGeo = new THREE.BoxGeometry(0.08, 0.25, 0.08);
    const tb = new THREE.Mesh(tbGeo, turnbuckleMat);
    tb.position.copy(tbPos);
    tb.quaternion.copy(wire.quaternion);
    this.layers.cables.add(tb);

    // Anclaje de concreto a tierra
    const anchorGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const anchorMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
    const anchor = new THREE.Mesh(anchorGeo, anchorMat);
    anchor.position.set(x2, -0.15, z2);
    this.layers.cables.add(anchor);
  }

  // 4. Cubierta y Paredes de Malla 50×25 HDPE (5 Rollos de 4.00 m)
  buildMeshCover() {
    const W = this.options.width;
    const L = this.options.length;
    const H = this.options.height;
    const bayW = this.options.bayWidth;

    this.meshMaterials = [];

    // Colores alternados sutiles para identificar las 5 franjas de 4m×100m
    const colors = [0x10b981, 0x06b6d4, 0x10b981, 0x06b6d4, 0x10b981];

    for (let i = 0; i < this.options.numBays; i++) {
      const xCenter = -W / 2 + (i + 0.5) * bayW;
      const roofStripGeo = new THREE.PlaneGeometry(bayW - 0.04, L);
      const stripMat = new THREE.MeshStandardMaterial({
        color: colors[i],
        transparent: true,
        opacity: this.meshOpacity,
        roughness: 0.6,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      this.meshMaterials.push(stripMat);

      const strip = new THREE.Mesh(roofStripGeo, stripMat);
      strip.rotation.x = -Math.PI / 2;
      strip.position.set(xCenter, H + 0.02, 0);
      strip.receiveShadow = true;
      this.layers.mesh.add(strip);
    }

    // Paredes Perimetrales (Rollo 4m: 3.80m visible + 0.20m enterrado)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: this.meshOpacity * 0.85,
      roughness: 0.5,
      side: THREE.DoubleSide
    });
    this.meshMaterials.push(wallMat);

    // Pared Lateral Este (+X = 10m)
    const wallEastGeo = new THREE.PlaneGeometry(L, H);
    const wallEast = new THREE.Mesh(wallEastGeo, wallMat);
    wallEast.rotation.y = -Math.PI / 2;
    wallEast.position.set(W / 2, H / 2, 0);
    this.layers.mesh.add(wallEast);

    // Pared Lateral Oeste (-X = -10m)
    const wallWest = new THREE.Mesh(wallEastGeo, wallMat);
    wallWest.rotation.y = Math.PI / 2;
    wallWest.position.set(-W / 2, H / 2, 0);
    this.layers.mesh.add(wallWest);

    // Fachada Frontal Sur (+Z = 50m)
    const wallFrontGeo = new THREE.PlaneGeometry(W, H);
    const wallFront = new THREE.Mesh(wallFrontGeo, wallMat);
    wallFront.position.set(0, H / 2, L / 2);
    this.layers.mesh.add(wallFront);

    // Fachada Trasera Norte (-Z = -50m)
    const wallBack = new THREE.Mesh(wallFrontGeo, wallMat);
    wallBack.rotation.y = Math.PI;
    wallBack.position.set(0, H / 2, -L / 2);
    this.layers.mesh.add(wallBack);
  }

  // 5. Cultivo de Tomate Tutorado en 10 Camellones Dobles a 2.20 m
  buildCrop() {
    const L = this.options.length;
    const trellisH = this.options.trellisHeight;

    // Emparrillado de alambre a 2.20 m
    const trellisMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.6
    });

    // 10 Camellones dobles a lo largo de los 100 m
    const rowX = [-8.8, -7.2, -4.8, -3.2, -0.8, 0.8, 3.2, 4.8, 7.2, 8.8];

    // Alambres horizontales de tutorado
    rowX.forEach(x => {
      const points = [
        new THREE.Vector3(x, trellisH, -L / 2),
        new THREE.Vector3(x, trellisH, L / 2)
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, trellisMat);
      this.layers.crop.add(line);
    });

    // Muestreo de plantas de tomate y racimos vivos a lo largo de las filas
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.85,
      metalness: 0.05
    });

    const tomatoMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.3,
      metalness: 0.1
    });

    const plantBushGeo = new THREE.SphereGeometry(0.35, 7, 7);
    const tomatoFruitGeo = new THREE.SphereGeometry(0.08, 6, 6);

    for (let r = 0; r < rowX.length; r++) {
      const x = rowX[r];
      // Muestrear plantas cada 2.5 metros a lo largo de los 100m
      for (let z = -L / 2 + 1.5; z < L / 2; z += 2.5) {
        // Bloque de follaje denso escalonado desde 0.4m hasta 2.20m
        for (let h = 0.6; h <= trellisH; h += 0.55) {
          const bush = new THREE.Mesh(plantBushGeo, foliageMat);
          bush.position.set(x + (Math.random() - 0.5) * 0.15, h, z + (Math.random() - 0.5) * 0.2);
          bush.scale.set(1.0, 1.2, 1.0);
          bush.castShadow = true;
          this.layers.crop.add(bush);
        }

        // Racimo de tomates maduros colgantes
        if (Math.random() > 0.3) {
          const tomato = new THREE.Mesh(tomatoFruitGeo, tomatoMat);
          tomato.position.set(x + 0.22, 1.1 + Math.random() * 0.4, z);
          this.layers.crop.add(tomato);
        }
      }
    }
  }

  // 6. Cotas Métricas 3D en Tiempo Real
  buildDimensions() {
    const W = this.options.width;
    const L = this.options.length;
    const H = this.options.height;
    const trellisH = this.options.trellisHeight;

    const dimMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });

    // A. Cota de Ancho Frontal: 20.00 m
    this.createDimensionLine(
      new THREE.Vector3(-W / 2, 0.3, L / 2 + 1.5),
      new THREE.Vector3(W / 2, 0.3, L / 2 + 1.5),
      '20.00 m Ancho (5 Franjas × 4.00 m)',
      dimMat
    );

    // B. Cota de Fondo Longitudinal: 100.00 m
    this.createDimensionLine(
      new THREE.Vector3(W / 2 + 1.5, 0.3, -L / 2),
      new THREE.Vector3(W / 2 + 1.5, 0.3, L / 2),
      '100.00 m Fondo (2.000 m²)',
      dimMat
    );

    // C. Cota de Altura de Pilares: 3.80 m libre
    this.createDimensionLine(
      new THREE.Vector3(-W / 2 - 1.2, 0, L / 2),
      new THREE.Vector3(-W / 2 - 1.2, H, L / 2),
      '3.80 m Libre Techo',
      dimMat
    );

    // D. Cota de Tutorado: 2.20 m
    this.createDimensionLine(
      new THREE.Vector3(-W / 2 - 0.6, 0, L / 2),
      new THREE.Vector3(-W / 2 - 0.6, trellisH, L / 2),
      '2.20 m Tutorado Español',
      new THREE.LineBasicMaterial({ color: 0xf59e0b })
    );
  }

  createDimensionLine(start, end, labelText, material) {
    const points = [start, end];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geo, material);
    this.layers.dims.add(line);

    // Flechas / ticks en los extremos
    const tickLen = 0.3;
    const up = new THREE.Vector3(0, 1, 0);

    const tick1Geo = new THREE.BufferGeometry().setFromPoints([
      start.clone().add(up.clone().multiplyScalar(tickLen / 2)),
      start.clone().sub(up.clone().multiplyScalar(tickLen / 2))
    ]);
    this.layers.dims.add(new THREE.Line(tick1Geo, material));

    const tick2Geo = new THREE.BufferGeometry().setFromPoints([
      end.clone().add(up.clone().multiplyScalar(tickLen / 2)),
      end.clone().sub(up.clone().multiplyScalar(tickLen / 2))
    ]);
    this.layers.dims.add(new THREE.Line(tick2Geo, material));
  }

  // 7. Vector Aerodinámico Viento del Este (88% persistencia en Quíbor)
  buildWindFlow() {
    const W = this.options.width;
    const L = this.options.length;
    const H = this.options.height;

    const arrowGroup = new THREE.Group();

    // Filas de flechas aerodinámicas incidiendo desde el Este (+X) hacia el Oeste (-X)
    for (let z = -L / 2 + 10; z <= L / 2 - 10; z += 20) {
      for (let y = 1.0; y <= H; y += 1.4) {
        const arrow = new THREE.ArrowHelper(
          new THREE.Vector3(-1, 0, 0), // Dirección: hacia el Oeste (-X)
          new THREE.Vector3(W / 2 + 7.0, y, z), // Origen en fachada Este
          5.0,
          0x38bdf8,
          1.2,
          0.6
        );
        arrowGroup.add(arrow);
      }
    }

    this.layers.wind.add(arrowGroup);

    // Animación suave de pulsación del viento
    this.animables.push((time) => {
      arrowGroup.children.forEach((arrow, idx) => {
        const offset = (Math.sin(time * 3 + idx) * 0.5);
        arrow.position.x = (W / 2 + 7.0) + offset;
      });
    });
  }

  // ===================================================================
  // GIZMO 3D ESTILO BLENDER (Top-Right Navigation Axis Widget)
  // ===================================================================
  initGizmo() {
    this.gizmoCanvas = document.getElementById('greenhouse-3d-gizmo');
    if (!this.gizmoCanvas) return;

    this.gizmoRenderer = new THREE.WebGLRenderer({
      canvas: this.gizmoCanvas,
      alpha: true,
      antialias: true
    });
    this.gizmoRenderer.setSize(100, 100);

    this.gizmoScene = new THREE.Scene();
    this.gizmoCamera = new THREE.OrthographicCamera(-1.8, 1.8, 1.8, -1.8, 0.1, 50);
    this.gizmoCamera.position.set(0, 0, 5);

    // Esfera central
    const centerGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const centerMat = new THREE.MeshBasicMaterial({ color: 0x64748b });
    this.gizmoScene.add(new THREE.Mesh(centerGeo, centerMat));

    // Ejes X (Rojo), Y (Verde), Z (Azul)
    this.gizmoAxes = new THREE.Group();
    this.gizmoInteractives = [];

    const axesData = [
      { dir: new THREE.Vector3(1, 0, 0), color: 0xef4444, label: 'X', view: 'side' },     // Este / Lateral
      { dir: new THREE.Vector3(-1, 0, 0), color: 0x991b1b, label: '-X', view: 'side-w' },
      { dir: new THREE.Vector3(0, 1, 0), color: 0x22c55e, label: 'Z', view: 'top' },       // Cenital
      { dir: new THREE.Vector3(0, -1, 0), color: 0x166534, label: '-Z', view: 'bottom' },
      { dir: new THREE.Vector3(0, 0, 1), color: 0x3b82f6, label: 'Y', view: 'front' },     // Frontal 20m
      { dir: new THREE.Vector3(0, 0, -1), color: 0x1e40af, label: '-Y', view: 'back' }
    ];

    axesData.forEach(axis => {
      // Línea de eje
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        axis.dir.clone().multiplyScalar(1.2)
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: axis.color, linewidth: 2 });
      this.gizmoAxes.add(new THREE.Line(lineGeo, lineMat));

      // Esfera interactiva de click
      const sphereGeo = new THREE.SphereGeometry(0.24, 12, 12);
      const sphereMat = new THREE.MeshBasicMaterial({ color: axis.color });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.copy(axis.dir.clone().multiplyScalar(1.2));
      sphere.userData = { view: axis.view, label: axis.label };
      this.gizmoAxes.add(sphere);
      this.gizmoInteractives.push(sphere);
    });

    this.gizmoScene.add(this.gizmoAxes);

    // Raycaster para clicks en el Gizmo
    this.gizmoRaycaster = new THREE.Raycaster();
    this.gizmoMouse = new THREE.Vector2();

    this.gizmoCanvas.addEventListener('pointerdown', (e) => {
      const rect = this.gizmoCanvas.getBoundingClientRect();
      this.gizmoMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.gizmoMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.gizmoRaycaster.setFromCamera(this.gizmoMouse, this.gizmoCamera);
      const intersects = this.gizmoRaycaster.intersectObjects(this.gizmoInteractives);

      if (intersects.length > 0) {
        const targetView = intersects[0].object.userData.view;
        this.setCameraPreset(targetView, true);
      }
    });
  }

  // ===================================================================
  // PRESETS DE CÁMARA ESTILO BLENDER
  // ===================================================================
  setCameraPreset(presetName, animate = true) {
    this.isWalkMode = false;
    let targetPos = new THREE.Vector3();
    let targetLookAt = new THREE.Vector3(0, 2.0, 0);

    switch (presetName) {
      case 'iso': // Vista Isométrica 3D (Blender [0])
        targetPos.set(45, 32, 60);
        break;
      case 'front': // Vista Frontal Transversal 20m (Blender [1])
        targetPos.set(0, 4.0, 75);
        break;
      case 'back':
        targetPos.set(0, 4.0, -75);
        break;
      case 'side': // Vista Lateral Este 100m (Blender [3])
        targetPos.set(65, 5.0, 0);
        break;
      case 'side-w': // Vista Lateral Oeste
        targetPos.set(-65, 5.0, 0);
        break;
      case 'top': // Vista Cenital Techo (Blender [7])
        targetPos.set(0, 110, 0);
        targetLookAt.set(0, 0, 0);
        break;
      case 'walk': // Modo Paseo Interior (Cámara a 1.70m dentro del cultivo)
        this.isWalkMode = true;
        targetPos.set(-2.0, 1.70, -35.0);
        targetLookAt.set(-2.0, 1.70, 20.0);
        break;
      default:
        targetPos.set(45, 32, 60);
    }

    if (this.controls) {
      if (animate) {
        this.tweenCamera(targetPos, targetLookAt, 800);
      } else {
        this.camera.position.copy(targetPos);
        this.controls.target.copy(targetLookAt);
        this.controls.update();
      }
    } else {
      this.camera.position.copy(targetPos);
    }

    this.updateHUDViewName(presetName);
  }

  tweenCamera(targetPos, targetLookAt, durationMs = 800) {
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const startTime = performance.now();

    const updateTween = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1.0);
      // Easing cúbico suave
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(startPos, targetPos, ease);
      this.controls.target.lerpVectors(startTarget, targetLookAt, ease);
      this.controls.update();

      if (progress < 1.0) {
        requestAnimationFrame(updateTween);
      }
    };

    requestAnimationFrame(updateTween);
  }

  // ===================================================================
  // MODOS DE SOMBREADO & CAPAS (Blender Shading Modes)
  // ===================================================================
  setShadingMode(mode) {
    this.shadingMode = mode;

    if (mode === 'wireframe') {
      this.scene.traverse(obj => {
        if (obj.isMesh && obj.material) {
          obj.material.wireframe = true;
        }
      });
    } else if (mode === 'xray') {
      this.scene.traverse(obj => {
        if (obj.isMesh && obj.material) {
          obj.material.wireframe = false;
        }
      });
      this.setMeshOpacity(0.15);
    } else {
      // Solid mode
      this.scene.traverse(obj => {
        if (obj.isMesh && obj.material) {
          obj.material.wireframe = false;
        }
      });
      this.setMeshOpacity(0.45);
    }
  }

  toggleLayer(layerName, visible) {
    if (this.layers[layerName]) {
      this.layers[layerName].visible = visible;
    }
  }

  setMeshOpacity(opacity) {
    this.meshOpacity = opacity;
    this.meshMaterials.forEach(mat => {
      mat.opacity = opacity;
    });
  }

  toggleAutoRotate() {
    this.isAutoRotating = !this.isAutoRotating;
    this.controls.autoRotate = this.isAutoRotating;
    this.controls.autoRotateSpeed = 1.4;

    const btn = document.getElementById('btn-3d-autorotate');
    if (btn) {
      btn.classList.toggle('active', this.isAutoRotating);
    }
    return this.isAutoRotating;
  }

  toggleFullscreen() {
    const elem = this.container;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  takeScreenshot() {
    this.renderer.render(this.scene, this.camera);
    const dataURL = this.renderer.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'plano_3d_invernadero_quibor_2000m2.png';
    link.href = dataURL;
    link.click();
  }

  setThemeMode(isSunlight) {
    this.isSunlightMode = isSunlight;
    this.updateSceneBackground();

    // Actualizar luces
    if (this.ambientLight && this.sunLight && this.skyLight) {
      this.ambientLight.color.setHex(this.isSunlightMode ? 0xffffff : 0x88a0c0);
      this.ambientLight.intensity = this.isSunlightMode ? 0.9 : 0.6;
      this.sunLight.intensity = this.isSunlightMode ? 1.6 : 1.2;
      this.skyLight.color.setHex(this.isSunlightMode ? 0xd0e8ff : 0x1e3a8a);
      this.skyLight.groundColor.setHex(this.isSunlightMode ? 0xe2e8f0 : 0x0f172a);
    }

    // Actualizar pilares
    if (this.pillarMeshes) {
      const color = this.isSunlightMode ? 0x1e293b : 0x94a3b8;
      this.pillarMeshes.forEach(mesh => mesh.material.color.setHex(color));
    }
  }

  // ===================================================================
  // EVENTOS, HUD & RENDER LOOP
  // ===================================================================
  bindEvents() {
    window.addEventListener('resize', () => this.onResize());

    // Atajos de teclado estilo Blender
    window.addEventListener('keydown', (e) => {
      const tabPlanos = document.getElementById('tab-planos');
      if (!tabPlanos || !tabPlanos.classList.contains('active')) return;

      switch (e.key) {
        case '1': this.setCameraPreset('front', true); break;
        case '3': this.setCameraPreset('side', true); break;
        case '7': this.setCameraPreset('top', true); break;
        case '0': this.setCameraPreset('iso', true); break;
        case 'w': case 'W': this.setCameraPreset('walk', true); break;
        case ' ':
          e.preventDefault();
          this.toggleAutoRotate();
          break;
      }
    });
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 560;
    if (width <= 0 || height <= 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  updateHUDViewName(name) {
    const hudElem = document.getElementById('hud-view-name');
    if (!hudElem) return;
    const names = {
      'iso': 'Isométrica 3D',
      'front': 'Frontal (20m Corte)',
      'side': 'Lateral Este (100m)',
      'top': 'Cenital (Planta)',
      'walk': 'Paseo Interior (1.70m)'
    };
    hudElem.textContent = names[name] || name;
  }

  updateHUDTelemetry() {
    const coordsElem = document.getElementById('hud-camera-coords');
    if (coordsElem && this.camera) {
      const p = this.camera.position;
      coordsElem.textContent = `X: ${p.x.toFixed(1)}m | Y: ${p.y.toFixed(1)}m | Z: ${p.z.toFixed(1)}m`;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = performance.now() * 0.001;

    // Actualizar animaciones (viento, oscilaciones)
    this.animables.forEach(fn => fn(time));

    // Actualizar controles de cámara
    this.controls.update();

    // Renderizar escena principal
    this.renderer.render(this.scene, this.camera);

    // Sincronizar Gizmo con la rotación de la cámara principal
    if (this.gizmoRenderer && this.gizmoAxes) {
      this.gizmoAxes.quaternion.copy(this.camera.quaternion).invert();
      this.gizmoRenderer.render(this.gizmoScene, this.gizmoCamera);
    }

    this.updateHUDTelemetry();
  }
}

window.Greenhouse3DViewer = Greenhouse3DViewer;
