import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface FlatMeshViewerProps {
  widthM?: number;
  lengthM?: number;
  heightM?: number;
  className?: string;
}

type ViewMode = 'iso' | 'top' | 'front';

export const FlatMeshViewer: React.FC<FlatMeshViewerProps> = ({
  widthM = 20.0,
  lengthM = 50.0,
  heightM = 2.5, // Altura óptica 2.5m (postes 3m, 0.5m enterrados)
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Estados de capas (Layers)
  const [showPillars, setShowPillars] = useState<boolean>(true);
  const [showMesh, setShowMesh] = useState<boolean>(true);
  const [showWires, setShowWires] = useState<boolean>(true);
  const [showCrop, setShowCrop] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [wireframeOnly, setWireframeOnly] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ViewMode>('iso');

  // Referencias Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pillarsGroupRef = useRef<THREE.Group | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const wiresGroupRef = useRef<THREE.Group | null>(null);
  const cropGroupRef = useRef<THREE.Group | null>(null);
  const dimsGroupRef = useRef<THREE.Group | null>(null);
  const meshMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  // Objetivos de animación de cámara
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(45, 25, 35));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(widthM / 2, heightM / 2, lengthM / 2));
  const isTransitioningCam = useRef<boolean>(false);

  const initScene = useCallback(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // Escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0e17'); // Dark theme
    scene.fog = new THREE.FogExp2('#0a0e17', 0.015);
    sceneRef.current = scene;

    // Cámara
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.copy(targetCamPos.current);
    cameraRef.current = camera;

    // Renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.copy(targetLookAt.current);
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // No ir por debajo del suelo
    controlsRef.current = controls;

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaee, 1.2);
    sunLight.position.set(50, 80, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 150;
    const d = 40;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xaaccff, 0.3);
    fillLight.position.set(-50, 30, -50);
    scene.add(fillLight);

    // Grupos
    pillarsGroupRef.current = new THREE.Group();
    meshGroupRef.current = new THREE.Group();
    wiresGroupRef.current = new THREE.Group();
    cropGroupRef.current = new THREE.Group();
    dimsGroupRef.current = new THREE.Group();
    scene.add(pillarsGroupRef.current);
    scene.add(meshGroupRef.current);
    scene.add(wiresGroupRef.current);
    scene.add(cropGroupRef.current);
    scene.add(dimsGroupRef.current);

    buildStructure();

    // Loop de renderizado
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const renderLoop = () => {
      const delta = clock.getDelta();

      if (isTransitioningCam.current && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPos.current, 4 * delta);
        controlsRef.current.target.lerp(targetLookAt.current, 4 * delta);
        
        if (cameraRef.current.position.distanceTo(targetCamPos.current) < 0.1) {
          isTransitioningCam.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      // Dispose geometries/materials to avoid memory leaks
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [widthM, lengthM, heightM]);

  useEffect(() => {
    const cleanup = initScene();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initScene]);

  // Función para crear sprites de texto técnico estilo cota CAD
  const createTextSprite = (text: string, strokeColor = '#00e5ff') => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(10, 14, 23, 0.92)';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(4, 4, 248, 56, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = strokeColor;
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(4.2, 1.05, 1);
    return sprite;
  };

  const buildStructure = () => {
    if (!pillarsGroupRef.current || !meshGroupRef.current || !wiresGroupRef.current || !cropGroupRef.current || !dimsGroupRef.current) return;
    
    // Limpiar grupos
    pillarsGroupRef.current.clear();
    meshGroupRef.current.clear();
    wiresGroupRef.current.clear();
    cropGroupRef.current.clear();
    dimsGroupRef.current.clear();
    meshMatsRef.current = [];

    // Materiales
    const galvMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e5ec,
      metalness: 0.8,
      roughness: 0.4,
    });

    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.5
    });

    const meshMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.1
    });
    meshMatsRef.current.push(meshMaterial);

    const soilMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2817,
      roughness: 0.9,
    });

    // 1. Suelo
    const soilGeo = new THREE.PlaneGeometry(widthM + 10, lengthM + 10);
    const soil = new THREE.Mesh(soilGeo, soilMaterial);
    soil.rotation.x = -Math.PI / 2;
    soil.position.set(widthM / 2, 0, lengthM / 2);
    soil.receiveShadow = true;
    pillarsGroupRef.current.add(soil);

    // 2. Pilares (Retícula 4x3m)
    const pillarRadius = 0.0254; // Ø 2" = 50.8mm
    const pillarGeo = new THREE.CylinderGeometry(pillarRadius, pillarRadius, heightM, 8);
    pillarGeo.translate(0, heightM / 2, 0); // Base en Y=0

    const gridX = Math.ceil(widthM / 4);
    const gridZ = Math.ceil(lengthM / 3);

    for (let i = 0; i <= gridX; i++) {
      for (let j = 0; j <= gridZ; j++) {
        const x = Math.min(i * 4, widthM);
        const z = Math.min(j * 3, lengthM);
        
        // Pendiente simulada del 2% hacia el sur (z = lengthM)
        const currentHeight = heightM - (z * 0.02);
        
        const pillar = new THREE.Mesh(pillarGeo, galvMaterial);
        pillar.position.set(x, 0, z);
        pillar.scale.y = currentHeight / heightM;
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        pillarsGroupRef.current.add(pillar);

        // Anclajes perimetrales (Muertos y Tensores)
        if (i === 0 || i === gridX || j === 0 || j === gridZ) {
            const anchorGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            const anchorMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 });
            
            const addAnchor = (dirX: number, dirZ: number) => {
                const anchorX = x + dirX * 1.5;
                const anchorZ = z + dirZ * 1.5;
                const anchorY = 0.1; // Ligeramente sobre el nivel del suelo
                
                // Guaya / Tensor
                const points = [];
                points.push(new THREE.Vector3(x, currentHeight, z)); // Tope del pilar
                points.push(new THREE.Vector3(anchorX, anchorY, anchorZ));
                const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeo, wireMaterial);
                if (wiresGroupRef.current) wiresGroupRef.current.add(line);
                
                // Bloque de concreto (Muerto)
                const block = new THREE.Mesh(anchorGeo, anchorMat);
                block.position.set(anchorX, anchorY / 2, anchorZ);
                if (pillarsGroupRef.current) pillarsGroupRef.current.add(block);
            };

            // Esquinas tendrán 2 anclajes automáticamente por evaluación
            if (i === 0) addAnchor(-1, 0);
            if (i === gridX) addAnchor(1, 0);
            if (j === 0) addAnchor(0, -1);
            if (j === gridZ) addAnchor(0, 1);
        }

        // Correas perimetrales en la parte superior (Top of pillar)
        if (i === 0 || i === gridX || j === 0 || j === gridZ) {
            // Horizontal connections
            const reinforcementRadius = 0.0127; // Ø 1" = 25.4mm

            if (i < gridX && (j === 0 || j === gridZ)) {
               const nextX = Math.min((i + 1) * 4, widthM);
               const length = nextX - x;
               const pGeo = new THREE.CylinderGeometry(reinforcementRadius, reinforcementRadius, length, 8);
               pGeo.rotateZ(Math.PI/2);
               const pMesh = new THREE.Mesh(pGeo, galvMaterial);
               pMesh.position.set(x + length/2, currentHeight, z);
               pillarsGroupRef.current.add(pMesh);
            }
            if (j < gridZ && (i === 0 || i === gridX)) {
               const nextZ = Math.min((j + 1) * 3, lengthM);
               const length = nextZ - z;
               const midZ = z + length / 2;
               const midHeight = heightM - (midZ * 0.02);
               
               const pGeo = new THREE.CylinderGeometry(reinforcementRadius, reinforcementRadius, length, 8);
               pGeo.rotateX(Math.PI/2);
               const pMesh = new THREE.Mesh(pGeo, galvMaterial);
               pMesh.position.set(x, midHeight, midZ);
               
               // Aplicar la rotación de la pendiente (2% = atan(0.02))
               pMesh.rotation.x = Math.atan(0.02);
               
               pillarsGroupRef.current.add(pMesh);
            }
        }
      }
    }

    // 3. Alambrones (Retícula 1x1m)
    for (let x = 0; x <= widthM; x += 1) {
        const h0 = heightM;
        const h1 = heightM - (lengthM * 0.02);
        const points = [];
        points.push(new THREE.Vector3(x, h0, 0));
        points.push(new THREE.Vector3(x, h1, lengthM));
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, wireMaterial);
        wiresGroupRef.current.add(line);
    }
    for (let z = 0; z <= lengthM; z += 1) {
        const h = heightM - (z * 0.02);
        const points = [];
        points.push(new THREE.Vector3(0, h, z));
        points.push(new THREE.Vector3(widthM, h, z));
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, wireMaterial);
        wiresGroupRef.current.add(line);
    }

    // 4. Malla (Techo y Laterales)
    // Techo
    const topPoints = [
        new THREE.Vector3(0, heightM, 0),
        new THREE.Vector3(widthM, heightM, 0),
        new THREE.Vector3(widthM, heightM - (lengthM * 0.02), lengthM),
        new THREE.Vector3(0, heightM - (lengthM * 0.02), lengthM)
    ];
    const topGeo = new THREE.BufferGeometry().setFromPoints(topPoints);
    topGeo.setIndex([0, 1, 2, 0, 2, 3]);
    topGeo.computeVertexNormals();
    const topMesh = new THREE.Mesh(topGeo, meshMaterial);
    topMesh.receiveShadow = true;
    meshGroupRef.current.add(topMesh);

    // Laterales
    const sideGeos = [
        // Norte
        new THREE.PlaneGeometry(widthM, heightM),
        // Sur
        new THREE.PlaneGeometry(widthM, heightM - (lengthM * 0.02)),
        // Este
        new THREE.PlaneGeometry(lengthM, heightM),
        // Oeste
        new THREE.PlaneGeometry(lengthM, heightM),
    ];
    
    sideGeos[0].translate(widthM/2, heightM/2, 0);
    
    sideGeos[1].translate(widthM/2, (heightM - (lengthM * 0.02))/2, lengthM);
    
    sideGeos[2].rotateY(Math.PI/2);
    // Ajustar pendiente lateral (shear aproximado)
    const posEste = sideGeos[2].attributes.position;
    for(let i=0; i<posEste.count; i++) {
        const z = -posEste.getZ(i); // length
        const y = posEste.getY(i);
        if (y > 0) {
            posEste.setY(i, heightM - (Math.abs(z) * 0.02) );
        }
    }
    sideGeos[2].translate(widthM, 0, 0); // Position after rotation/shear
    sideGeos[2].translate(0, 0, lengthM/2);

    sideGeos[3].rotateY(Math.PI/2);
    const posOeste = sideGeos[3].attributes.position;
    for(let i=0; i<posOeste.count; i++) {
        const z = -posOeste.getZ(i); // length
        const y = posOeste.getY(i);
        if (y > 0) {
            posOeste.setY(i, heightM - (Math.abs(z) * 0.02) );
        }
    }
    sideGeos[3].translate(0, 0, lengthM/2);

    sideGeos.forEach(geo => {
        geo.computeVertexNormals();
        const sideMesh = new THREE.Mesh(geo, meshMaterial);
        meshGroupRef.current?.add(sideMesh);
    });

    // Dimensiones (Cotas CAD)
    const dimColor = '#00e5ff';
    
    // Ancho (X)
    const labelWidth = createTextSprite(`Ancho: ${widthM.toFixed(2)}m`, dimColor);
    labelWidth.position.set(widthM / 2, 0.5, -0.5);
    dimsGroupRef.current.add(labelWidth);

    // Largo (Z)
    const labelLength = createTextSprite(`Largo: ${lengthM.toFixed(2)}m`, dimColor);
    labelLength.position.set(-0.5, 0.5, lengthM / 2);
    dimsGroupRef.current.add(labelLength);

    // Altura Frontal (Y max)
    const labelHeightFront = createTextSprite(`H Max: ${heightM.toFixed(2)}m`, '#ffcc00');
    labelHeightFront.position.set(0, heightM + 0.5, 0);
    dimsGroupRef.current.add(labelHeightFront);

    // Altura Trasera (Y min - Pendiente 2%)
    const heightBack = heightM - (lengthM * 0.02);
    const labelHeightBack = createTextSprite(`H Min: ${heightBack.toFixed(2)}m`, '#ffcc00');
    labelHeightBack.position.set(widthM, heightBack + 0.5, lengthM);
    dimsGroupRef.current.add(labelHeightBack);

    // 5. Cultivo (Hileras de tomate)
    const cropRowGeo = new THREE.BoxGeometry(0.6, heightM - 1.0, lengthM - 2);
    cropRowGeo.translate(0, (heightM - 1.0)/2, 0);
    const cropMat = new THREE.MeshStandardMaterial({
        color: 0x228B22,
        roughness: 0.8,
        transparent: true,
        opacity: 0.85
    });
    
    for (let x = 2; x < widthM - 1; x += 1.8) {
        const cropMesh = new THREE.Mesh(cropRowGeo, cropMat);
        cropMesh.position.set(x, 0, lengthM / 2);
        cropMesh.castShadow = true;
        cropMesh.receiveShadow = true;
        cropGroupRef.current.add(cropMesh);
    }
  };

  // Efectos para toggles
  useEffect(() => {
    if (pillarsGroupRef.current) pillarsGroupRef.current.visible = showPillars;
    if (meshGroupRef.current) meshGroupRef.current.visible = showMesh;
    if (wiresGroupRef.current) wiresGroupRef.current.visible = showWires;
    if (cropGroupRef.current) cropGroupRef.current.visible = showCrop;
    if (dimsGroupRef.current) dimsGroupRef.current.visible = showDimensions;
  }, [showPillars, showMesh, showWires, showCrop, showDimensions]);

  useEffect(() => {
    meshMatsRef.current.forEach((mat) => {
      mat.wireframe = wireframeOnly;
      mat.opacity = wireframeOnly ? 0.8 : 0.35;
      mat.needsUpdate = true;
    });
  }, [wireframeOnly]);

  // Cambiar vistas
  const setView = (mode: ViewMode) => {
    setActiveView(mode);
    isTransitioningCam.current = true;
    switch (mode) {
      case 'iso':
        targetCamPos.current.set(widthM * 1.2, heightM * 4, lengthM * 1.2);
        break;
      case 'top':
        targetCamPos.current.set(widthM / 2, Math.max(widthM, lengthM) * 1.2, lengthM / 2);
        break;
      case 'front':
        targetCamPos.current.set(widthM / 2, heightM * 1.5, lengthM * 1.5);
        break;
    }
  };

  return (
    <div className={`position-relative w-100 ${className}`} style={{ minHeight: '500px', borderRadius: '1rem', overflow: 'hidden' }}>
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ zIndex: 0 }} />

      {/* Floating Toolbar */}
      <div className="position-absolute top-0 end-0 m-3 p-2 bg-dark bg-opacity-75 rounded shadow-sm border border-secondary" style={{ zIndex: 10, backdropFilter: 'blur(5px)' }}>
        <h6 className="text-white mb-2 text-center small text-uppercase tracking-wider">Vistas</h6>
        <div className="btn-group btn-group-sm w-100 mb-3" role="group">
          <button type="button" className={`btn btn-outline-info ${activeView === 'iso' ? 'active' : ''}`} onClick={() => setView('iso')}>ISO</button>
          <button type="button" className={`btn btn-outline-info ${activeView === 'top' ? 'active' : ''}`} onClick={() => setView('top')}>TOP</button>
          <button type="button" className={`btn btn-outline-info ${activeView === 'front' ? 'active' : ''}`} onClick={() => setView('front')}>FRONT</button>
        </div>

        <h6 className="text-white mb-2 text-center small text-uppercase tracking-wider">Capas (Layers)</h6>
        <div className="d-flex flex-column gap-2">
          <div className="form-check form-switch">
            <input className="form-check-input bg-info border-info" type="checkbox" id="toggleMesh" checked={showMesh} onChange={(e) => setShowMesh(e.target.checked)} />
            <label className="form-check-label text-white small" htmlFor="toggleMesh">Malla 50 Mesh</label>
          </div>
          <div className="form-check form-switch">
            <input className="form-check-input bg-info border-info" type="checkbox" id="togglePillars" checked={showPillars} onChange={(e) => setShowPillars(e.target.checked)} />
            <label className="form-check-label text-white small" htmlFor="togglePillars">Tubería Galv.</label>
          </div>
          <div className="form-check form-switch">
            <input className="form-check-input bg-info border-info" type="checkbox" id="toggleWires" checked={showWires} onChange={(e) => setShowWires(e.target.checked)} />
            <label className="form-check-label text-white small" htmlFor="toggleWires">Alambrones / Guayas</label>
          </div>
          <div className="form-check form-switch">
            <input className="form-check-input bg-info border-info" type="checkbox" id="toggleDims" checked={showDimensions} onChange={(e) => setShowDimensions(e.target.checked)} />
            <label className="form-check-label text-warning small" htmlFor="toggleDims">Cotas CAD</label>
          </div>
          <div className="form-check form-switch">
            <input className="form-check-input bg-success border-success" type="checkbox" id="toggleCrop" checked={showCrop} onChange={(e) => setShowCrop(e.target.checked)} />
            <label className="form-check-label text-white small" htmlFor="toggleCrop">Cultivo Tutorado</label>
          </div>
          <hr className="my-1 border-secondary" />
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="toggleWireframe" checked={wireframeOnly} onChange={(e) => setWireframeOnly(e.target.checked)} />
            <label className="form-check-label text-white small" htmlFor="toggleWireframe">Wireframe</label>
          </div>
        </div>
      </div>
      
      {/* Legend Badge */}
      <div className="position-absolute bottom-0 start-0 m-3 px-3 py-2 bg-dark bg-opacity-75 rounded border border-secondary text-white small" style={{ zIndex: 10, backdropFilter: 'blur(5px)' }}>
        <strong>Estructura Parral Plano</strong><br/>
        <span className="text-info">Tubo Ø 2" × 2.3 mm</span> | <span className="text-white-50">Retícula 4×4m</span>
      </div>
    </div>
  );
};
