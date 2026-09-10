import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface WellViewerProps {
  scenario?: '60m' | '120m';
  totalDepthM?: number;
  staticWaterLevelM?: number;
  dynamicWaterLevelM?: number;
  className?: string;
}

export const WellViewer: React.FC<WellViewerProps> = ({
  scenario = '60m',
  totalDepthM = 60.0,
  staticWaterLevelM = 49.5,
  dynamicWaterLevelM = 53.2,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPumping, setIsPumping] = useState<boolean>(true);
  const [viewStage, setViewStage] = useState<'isometric' | 'surface' | 'casing' | 'bottom'>('isometric');
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [camCoords, setCamCoords] = useState<{ x: number; y: number; z: number }>({ x: 25, y: -30, z: 35 });
  
  // Refs para manipular objetos 3D y cámara
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(25, -30, 35));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, -30, 0));
  const isTransitioningRef = useRef<boolean>(true);

  // Actualización de cámara según escenario y viewStage
  useEffect(() => {
    const bottomDepth = scenario === '60m' ? 60 : 120;
    isTransitioningRef.current = true;
    
    switch (viewStage) {
      case 'surface':
        targetCamPos.current.set(10, -5, 10);
        targetLookAt.current.set(0, -5, 0);
        break;
      case 'casing':
        targetCamPos.current.set(15, -25, 15);
        targetLookAt.current.set(0, -25, 0);
        break;
      case 'bottom':
        targetCamPos.current.set(10, -bottomDepth + 6, 10);
        targetLookAt.current.set(0, -bottomDepth + 6, 0);
        break;
      case 'isometric':
      default:
        if (scenario === '60m') {
          targetCamPos.current.set(25, -30, 35);
          targetLookAt.current.set(0, -30, 0);
        } else {
          targetCamPos.current.set(35, -60, 45);
          targetLookAt.current.set(0, -60, 0);
        }
        break;
    }
  }, [scenario, viewStage]);

  // Funciones de Zoom y control de cámara
  const handleZoomIn = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    isTransitioningRef.current = false;
    const cam = cameraRef.current;
    const target = controlsRef.current.target;
    const direction = new THREE.Vector3().subVectors(target, cam.position).normalize();
    cam.position.addScaledVector(direction, 6);
    controlsRef.current.update();
  };

  const handleZoomOut = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    isTransitioningRef.current = false;
    const cam = cameraRef.current;
    const target = controlsRef.current.target;
    const direction = new THREE.Vector3().subVectors(cam.position, target).normalize();
    cam.position.addScaledVector(direction, 6);
    controlsRef.current.update();
  };

  const handleResetZoom = () => {
    isTransitioningRef.current = true;
    if (scenario === '60m') {
      targetCamPos.current.set(25, -30, 35);
      targetLookAt.current.set(0, -30, 0);
    } else {
      targetCamPos.current.set(35, -60, 45);
      targetLookAt.current.set(0, -60, 0);
    }
    setViewStage('isometric');
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // 1. Escena CAD Layout (Fondo oscuro técnico)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05080f);

    // Grid Helper de fondo tipo AutoCAD
    const gridHelper = new THREE.GridHelper(120, 60, 0x00e5ff, 0x1e293b);
    gridHelper.position.y = 0;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    // Ejes de Coordenadas AutoCAD (UCS Icon)
    const axesHelper = new THREE.AxesHelper(8);
    axesHelper.position.set(-15, 0, -15);
    scene.add(axesHelper);

    // 2. Cámara
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000);
    camera.position.copy(targetCamPos.current);
    cameraRef.current = camera;

    // 3. Renderer con soporte WebGL de alta precisión
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Controles OrbitControls con ZOOM COMPLETAMENTE HABILITADO
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.3;
    controls.minDistance = 3.0; // Permite acercarse a inspeccionar tubería o filtros
    controls.maxDistance = 160.0; // Límite amplio para no perder el modelo
    controls.target.copy(targetLookAt.current);
    controlsRef.current = controls;

    // Detener la interpolación automática en cuanto el usuario interactúa manualmente
    const onControlsStart = () => {
      isTransitioningRef.current = false;
    };
    controls.addEventListener('start', onControlsStart);

    // Utilidad: Text Sprites estilo CAD
    const createTextSprite = (text: string, color = '#00e5ff', fontSize = 38) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Sprite();
      
      canvas.width = 512;
      canvas.height = 128;
      
      ctx.font = `bold ${fontSize}px "JetBrains Mono", Consolas, monospace`;
      ctx.fillStyle = color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      
      // Halo/Stroke oscuro para máxima legibilidad CAD
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 5;
      ctx.strokeText(text, 12, canvas.height / 2);
      ctx.fillText(text, 12, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(16, 4, 1);
      return sprite;
    };

    // 5. Estratigrafía Geológica (Quíbor: CIDIAT-ULA) en modo CAD Wireframe
    const strataConfig: [number, number, string][] = [
      [15, 0x8b4513, 'Arcillas Limosas Superficiales (0-15m)'],
      [20, 0x475569, 'Gravas Fluvio-Lacustres (15-35m)'],
      [15, 0xb45309, 'Arcillas Acuitardas (35-50m)'],
      [10, 0x0369a1, 'Lentes de Arena (Acuífero Cuara 50-60m)'],
      [30, 0x64748b, 'Arcillas Marinas Terciarias (60-90m)'],
      [30, 0x0284c7, 'Lentes Basales Gravosos Morán (90-120m)'],
    ];

    let currentY = 0;
    const strataGroup = new THREE.Group();

    strataConfig.forEach((cfg) => {
      const h = cfg[0];
      const color = cfg[1];
      const label = cfg[2];

      if (Math.abs(currentY) >= totalDepthM) return;
      
      // Geometría Alámbrica CAD
      const strataGeo = new THREE.CylinderGeometry(5.0, 5.0, h, 16, 1, true, 0, Math.PI * 1.6);
      const edges = new THREE.EdgesGeometry(strataGeo);
      const lineMat = new THREE.LineBasicMaterial({ color, opacity: 0.35, transparent: true });
      const strataWire = new THREE.LineSegments(edges, lineMat);
      
      strataWire.position.y = currentY - h / 2;
      strataGroup.add(strataWire);

      // Cota de profundidad y tipo de estrato
      const sprite = createTextSprite(`▼ ${(Math.abs(currentY) + h).toFixed(0)}m: ${label}`, `#${color.toString(16).padStart(6, '0')}`, 26);
      sprite.position.set(6.0, currentY - h / 2, 0);
      strataGroup.add(sprite);

      currentY -= h;
    });
    scene.add(strataGroup);

    // 6. Encofrado (Casing), Barreno y Filtros según escenario
    const casingGroup = new THREE.Group();

    // Diámetros paramétricos según escenario
    const is120 = scenario === '120m';
    // 60m: Fuste manual a pico Ø 80cm y camisa de concreto Ø 70cm ext (útil 60cm)
    // 120m: Barreno rotatorio 12¼" (311mm) y camisa de acero 8" ASTM A53 (219.1mm)
    const boreholeRadius = is120 ? 1.55 : 1.6;  // Barreno 12¼" (311mm) vs Fuste a pico Ø 80cm (800mm)
    const casingRadius = is120 ? 0.95 : 1.35;    // Camisa Acero 8" (219mm) vs Camisa Concreto Ø 70cm ext
    const usefulInnerRadius = is120 ? 0.88 : 1.15; // Diámetro interior útil (Concreto Ø útil 60cm)
    const pumpRadius = is120 ? 0.55 : 0.40;      // Bomba 6" (152mm) vs 4" (101mm)
    const pumpLength = is120 ? 2.4 : 1.4;        // 7.5HP multietapas vs 2.0HP

    // Barreno / Fuste exterior
    const boreholeGeo = new THREE.CylinderGeometry(boreholeRadius, boreholeRadius, totalDepthM, 18, 1, true);
    const boreholeEdges = new THREE.EdgesGeometry(boreholeGeo);
    const boreholeMat = new THREE.LineBasicMaterial({ 
      color: is120 ? 0x334155 : 0x78350f, 
      transparent: true, 
      opacity: is120 ? 0.4 : 0.6 
    });
    const boreholeWire = new THREE.LineSegments(boreholeEdges, boreholeMat);
    boreholeWire.position.y = -totalDepthM / 2;
    casingGroup.add(boreholeWire);

    // Cota técnica de excavación / perforación
    const drillSprite = createTextSprite(
      is120 
        ? 'Barreno Rotatorio Ø 12¼" (311mm) c/ lodo bentonítico' 
        : 'Fuste Manual a Pico Ø 80cm (Paredes Autoportantes Su > 120 kPa)',
      is120 ? '#64748b' : '#d97706',
      24
    );
    drillSprite.position.set(-6.8, -2, 0);
    casingGroup.add(drillSprite);

    if (is120) {
      // Sello Sanitario (0 a 15m) para 120m
      const sealGeo = new THREE.CylinderGeometry(boreholeRadius, boreholeRadius, 15, 16);
      const sealMat = new THREE.MeshBasicMaterial({ color: 0x9ca3af, transparent: true, opacity: 0.4, wireframe: true }); 
      const seal = new THREE.Mesh(sealGeo, sealMat);
      seal.position.y = -7.5;
      casingGroup.add(seal);
      
      const sealSprite = createTextSprite("Sello Sanitario Portland + 4% Bent (0-15m)", '#cbd5e1', 26);
      sealSprite.position.set(3.8, -7.5, 0);
      casingGroup.add(sealSprite);
    } else {
      // Brocal de Concreto y Cota Superior para 60m
      const brocalGeo = new THREE.CylinderGeometry(boreholeRadius + 0.3, boreholeRadius + 0.3, 1.5, 16);
      const brocalMat = new THREE.MeshBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.5, wireframe: true });
      const brocal = new THREE.Mesh(brocalGeo, brocalMat);
      brocal.position.y = 0.75;
      casingGroup.add(brocal);

      const brocalSprite = createTextSprite("Brocal y Marco Metálico c/ Tapa de Inspección", '#94a3b8', 24);
      brocalSprite.position.set(3.8, 1.2, 0);
      casingGroup.add(brocalSprite);
    }

    // Empaque de Grava Cuarzosa en espacio anular
    const gravelDepth = is120 ? (totalDepthM - 15) : totalDepthM;
    const gravelGeo = new THREE.CylinderGeometry(boreholeRadius, boreholeRadius, gravelDepth, 16);
    const gravelMat = new THREE.MeshBasicMaterial({ 
      color: 0xd4d4d8, 
      transparent: true, 
      opacity: 0.10, 
      wireframe: true 
    });
    const gravel = new THREE.Mesh(gravelGeo, gravelMat);
    gravel.position.y = is120 ? (-15 - (gravelDepth / 2)) : (-gravelDepth / 2);
    casingGroup.add(gravel);

    if (!is120) {
      const gravelAnnularSprite = createTextSprite("Empaque Anular Grava Cuarzosa 1/4\" (Filtro Natural)", '#cbd5e1', 22);
      gravelAnnularSprite.position.set(3.8, -22, 0);
      casingGroup.add(gravelAnnularSprite);
    }

    // Camisa Estructural (Casing): Concreto Armado (60m) o Acero ASTM A53 (120m)
    // Para 60m: Anillos de concreto visibles cada 1m
    const casingGeo = new THREE.CylinderGeometry(
      casingRadius, 
      casingRadius, 
      totalDepthM, 
      20, 
      is120 ? 1 : Math.floor(totalDepthM)
    );
    const casingMat = new THREE.MeshBasicMaterial({ 
      color: is120 ? 0x94a3b8 : 0xcbd5e1, 
      transparent: true, 
      opacity: wireframeMode ? 0.25 : (is120 ? 0.45 : 0.55),
      wireframe: wireframeMode || !is120 
    });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.position.y = -totalDepthM / 2;
    casingGroup.add(casing);

    // Cota dimensional de la camisa
    const casingLabel = is120
      ? 'Camisa 8" ASTM A53 Gr. B (Ø ext 219.1mm - e=6.35mm)'
      : 'Camisa Anillos Concreto Armado Ø 70cm (Ø int útil 60cm)';
    const casingSprite = createTextSprite(casingLabel, is120 ? '#38bdf8' : '#38bdf8', 26);
    casingSprite.position.set(-6.8, -20, 0);
    casingGroup.add(casingSprite);

    if (!is120) {
      const bufferSprite = createTextSprite('Vaso Buffer en Fuste: ~3.800 Litros en Reposo (283 L/m)', '#10b981', 25);
      bufferSprite.position.set(-6.8, -36, 0);
      casingGroup.add(bufferSprite);
    }
    
    // Filtros Ranurados (Johnson AISI 304 para 120m / Camisa Ranurada c/ Manto de Grava Negra 48-60m para 60m)
    const filterLength = is120 ? 38 : 12;
    const filterY = is120 ? -86 - 13 : -totalDepthM + (filterLength / 2);
    const filterGeo = new THREE.CylinderGeometry(casingRadius + 0.02, casingRadius + 0.02, filterLength, 20, Math.floor(filterLength * 3), true);
    const filterEdges = new THREE.EdgesGeometry(filterGeo);
    const filterMat = new THREE.LineBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.95 });
    const filterWire = new THREE.LineSegments(filterEdges, filterMat);
    filterWire.position.y = filterY;
    casingGroup.add(filterWire);

    const filterSprite = createTextSprite(
      is120 
        ? 'Filtro Johnson AISI 304 Ranura 0.030" (38m activos - Ve=0.07 cm/s)' 
        : 'Filtro Basal Ranurado 12m en Paleocauce Grava Negra (Lidita y Cuarzo)',
      '#facc15',
      24
    );
    filterSprite.position.set(3.8, filterY, 0);
    casingGroup.add(filterSprite);

    scene.add(casingGroup);

    // 7. Columna de Agua (Superficie Dinámica y Estática)
    const waterGroup = new THREE.Group();
    
    // Nivel Estático (NE)
    const staticSprite = createTextSprite(`NE: ${staticWaterLevelM}m (${(700 - staticWaterLevelM).toFixed(0)} msnm)`, '#38bdf8', 34);
    staticSprite.position.set(-7.5, -staticWaterLevelM, 0);
    waterGroup.add(staticSprite);
    
    const staticPlaneGeo = new THREE.PlaneGeometry(14, 14);
    const staticPlaneMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
    const staticPlane = new THREE.Mesh(staticPlaneGeo, staticPlaneMat);
    staticPlane.rotation.x = -Math.PI / 2;
    staticPlane.position.y = -staticWaterLevelM;
    waterGroup.add(staticPlane);

    // Nivel Dinámico (ND)
    const ndColor = is120 ? '#10b981' : '#38bdf8';
    const ndSprite = createTextSprite(`ND: ${dynamicWaterLevelM}m (Δs = ${(dynamicWaterLevelM - staticWaterLevelM).toFixed(1)}m)`, ndColor, 34);
    ndSprite.position.set(-7.5, -dynamicWaterLevelM - 1, 0);
    waterGroup.add(ndSprite);

    // Cilindro de agua activa (desde ND hasta fondo)
    const waterColumnHeight = Math.max(0.5, totalDepthM - dynamicWaterLevelM);
    const waterGeo = new THREE.CylinderGeometry(usefulInnerRadius, usefulInnerRadius, waterColumnHeight, 16);
    const waterMeshMat = new THREE.MeshBasicMaterial({ 
      color: 0x0284c7, 
      transparent: true, 
      opacity: 0.35, 
      blending: THREE.AdditiveBlending 
    });
    const water = new THREE.Mesh(waterGeo, waterMeshMat);
    water.position.y = -dynamicWaterLevelM - waterColumnHeight / 2;
    waterGroup.add(water);

    // Cono de Abatimiento Teórico (Theis / Dupuit)
    const coneLineMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.8 });
    const conePoints = [];
    conePoints.push(new THREE.Vector3(5.0, -staticWaterLevelM, 0));
    conePoints.push(new THREE.Vector3(usefulInnerRadius, -dynamicWaterLevelM, 0));
    conePoints.push(new THREE.Vector3(-usefulInnerRadius, -dynamicWaterLevelM, 0));
    conePoints.push(new THREE.Vector3(-5.0, -staticWaterLevelM, 0));
    const coneGeo = new THREE.BufferGeometry().setFromPoints(conePoints);
    const coneLine = new THREE.Line(coneGeo, coneLineMat);
    waterGroup.add(coneLine);

    scene.add(waterGroup);

    // 8. Bomba Sumergible y Tubería (Estilo CAD Detallado)
    const pumpY = is120 ? -98.0 : -totalDepthM + 2.5;
    
    // Cuerpo de la bomba (Acero Inoxidable AISI 304)
    const pumpGeo = new THREE.CylinderGeometry(pumpRadius, pumpRadius, pumpLength, 16);
    const pumpMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true });
    const pump = new THREE.Mesh(pumpGeo, pumpMat);
    pump.position.set(0, pumpY, 0);
    scene.add(pump);
    
    // Anotación Técnica de la Bomba
    const pumpDescription = is120
      ? 'Electrobomba Sumergible 6" 7.5 HP (2.5-3.0 L/s @ HMT 100.5 mca)'
      : 'Electrobomba Sumergible 4" 1.5 HP (1.5-2.0 L/s @ HMT 63.5 mca)';
    const pumpSprite = createTextSprite(pumpDescription, '#10b981', 28);
    pumpSprite.position.set(4.5, pumpY, 0);
    scene.add(pumpSprite);

    // Columna de impulsión
    const pipeDiameter = is120 ? 0.16 : 0.10; // Tubería 2½" vs 1½"
    const pipeGeo = new THREE.CylinderGeometry(pipeDiameter, pipeDiameter, Math.abs(pumpY), 6);
    const pipeEdges = new THREE.EdgesGeometry(pipeGeo);
    const pipeMat = new THREE.LineBasicMaterial({ color: 0x10b981 });
    const pipe = new THREE.LineSegments(pipeEdges, pipeMat);
    pipe.position.y = pumpY / 2;
    scene.add(pipe);

    // Redimensionamiento
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Loop Animación con Interpolación y Liberación de Zoom
    let animId: number;
    const clock = new THREE.Clock();
    let frameCount = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      frameCount++;
      
      // Interpolación suave solo si se disparó cambio de vista y aún no se interactuó manualmente
      if (isTransitioningRef.current) {
        camera.position.lerp(targetCamPos.current, 0.06);
        controls.target.lerp(targetLookAt.current, 0.06);

        // Si ya llegó cerca de la posición objetivo, se libera el control
        if (
          camera.position.distanceTo(targetCamPos.current) < 0.15 &&
          controls.target.distanceTo(targetLookAt.current) < 0.15
        ) {
          isTransitioningRef.current = false;
        }
      }

      controls.update();

      // Actualizar tracker de coordenadas HUD periódicamente
      if (frameCount % 6 === 0) {
        setCamCoords({
          x: Number(camera.position.x.toFixed(1)),
          y: Number(camera.position.y.toFixed(1)),
          z: Number(camera.position.z.toFixed(1)),
        });
      }

      // Efecto pulsante en el cono de abatimiento si isPumping
      if (isPumping) {
        coneLineMat.opacity = 0.5 + Math.sin(elapsed * 4) * 0.3;
      } else {
        coneLineMat.opacity = 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      controls.removeEventListener('start', onControlsStart);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scenario, totalDepthM, staticWaterLevelM, dynamicWaterLevelM, isPumping, viewStage, wireframeMode]);

  return (
    <div className={`position-relative w-100 rounded-3 overflow-hidden bg-black ${className}`} style={{ minHeight: '520px' }}>
      {/* Contenedor WebGL Canvas */}
      <div ref={mountRef} style={{ width: '100%', height: '520px', cursor: 'grab' }} />

      {/* AutoCAD Reticle / Crosshair Central Overlay */}
      <div className="position-absolute top-50 start-50 translate-middle pointer-events-none opacity-25 z-1">
        <div style={{ width: '44px', height: '44px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '21px', left: 0, width: '44px', height: '1px', backgroundColor: '#00e5ff' }} />
          <div style={{ position: 'absolute', top: 0, left: '21px', width: '1px', height: '44px', backgroundColor: '#00e5ff' }} />
          <div style={{ position: 'absolute', top: '16px', left: '16px', width: '11px', height: '11px', border: '1px solid #00e5ff' }} />
        </div>
      </div>

      {/* AutoCAD Engineering Status Bar Superior */}
      <div className="position-absolute top-0 start-0 w-100 px-3 py-1 bg-dark bg-opacity-75 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center text-xs font-monospace text-secondary z-3 backdrop-blur">
        <div className="d-flex align-items-center gap-3">
          <span className="text-info fw-bold d-flex align-items-center gap-1">
            <span className="material-symbols-outlined ms-sm">architecture</span>
            <span>AUTOCAD 3D HYDRAULIC MODEL</span>
          </span>
          <span className="d-none d-md-inline text-muted">|</span>
          <span className="d-none d-md-inline">DWG: QUIBOR-HIDRO-2026.DWG</span>
          <span className="d-none d-lg-inline text-muted">|</span>
          <span className="d-none d-lg-inline">{scenario === '120m' ? 'BARRENO: ROTARIO 12¼" (311mm)' : 'FUSTE: MANUAL A PICO Ø 80cm'}</span>
          <span className="d-none d-lg-inline text-muted">|</span>
          <span className="d-none d-lg-inline text-warning">{scenario === '120m' ? 'CAMISA: 8" ASTM A53 Gr. B' : 'CAMISA: ANILLOS CONCRETO Ø 70cm'}</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-black border border-secondary border-opacity-50 text-light py-1 px-2 font-monospace">
            Z: {camCoords.y}m | DIST: {Math.sqrt(camCoords.x**2 + camCoords.z**2).toFixed(1)}m
          </span>
        </div>
      </div>

      {/* Tarjeta Glassmorphism de Especificaciones Técnicas */}
      <div className="position-absolute top-0 start-0 m-3 mt-5 d-flex flex-column gap-2 z-3" style={{ maxWidth: '320px' }}>
        <div className="card card-agro card-agro-water p-3 shadow-lg border-secondary border-opacity-25 bg-dark bg-opacity-80 backdrop-blur text-xs">
          <div className="fw-bold text-info fs-6 mb-2 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-1.5">
              <span className="material-symbols-outlined text-info ms-sm">water_pump</span>
              <span>{scenario === '60m' ? 'Pozo Artesanal 60m' : 'Pozo Industrial 120m'}</span>
            </div>
            <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-50 text-2xs">
              {scenario === '60m' ? 'CONCRETO Ø70cm' : 'ACERO 8"'}
            </span>
          </div>

          <div className="text-secondary font-monospace lh-lg">
            <div className="d-flex justify-content-between">
              <span>Profundidad Total:</span>
              <strong className="text-light">{totalDepthM} m</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Fuste / Perforación:</span>
              <strong className="text-light">{scenario === '120m' ? '12¼" (Rotaria)' : 'Ø 80cm (Manual a Pico)'}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Entubado (Casing):</span>
              <strong className="text-warning">{scenario === '120m' ? '8" ASTM A53 Gr. B' : 'Concreto Ø 70cm (útil 60cm)'}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Vaso Buffer en Fuste:</span>
              <strong className="text-success">{scenario === '60m' ? '~3.800 Litros (283 L/m)' : '~380 Litros (31 L/m)'}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Electrobomba:</span>
              <strong className="text-success">{scenario === '120m' ? '6" - 7.5 HP (Trifásica)' : '4" - 1.5 a 2.0 HP'}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Nivel Estático (NE):</span>
              <strong className="text-info">{staticWaterLevelM} m</strong>
            </div>
            <div className="d-flex justify-content-between border-top border-secondary border-opacity-50 mt-1 pt-1">
              <span>Columna Activa:</span>
              <strong className="text-success">
                {(totalDepthM - dynamicWaterLevelM).toFixed(1)} m
              </strong>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>Caudal Continuo:</span>
              <strong className="text-light">{scenario === '60m' ? '1.5 - 2.0 L/s' : '2.5 - 3.0 L/s'}</strong>
            </div>
            {scenario === '120m' && (
              <div className="d-flex justify-content-between text-info border-top border-info border-opacity-25 mt-1 pt-1 text-2xs">
                <span>Carga HMT Bombeo:</span>
                <strong>100.5 mca</strong>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPumping(!isPumping)}
          className={`btn btn-sm rounded-pill d-flex align-items-center justify-content-center gap-1.5 px-3 backdrop-blur shadow-sm ${
            isPumping ? 'btn-info text-dark fw-bold' : 'btn-dark bg-opacity-75 text-secondary border-secondary'
          }`}
        >
          <span className="material-symbols-outlined ms-sm">{isPumping ? 'water_pump' : 'power_off'}</span>
          <span>{isPumping ? 'Bomba en Marcha (Dinámico)' : 'Bomba en Reposo (Estático)'}</span>
        </button>
      </div>

      {/* Controles de Zoom Flotantes (AutoCAD CAD Navigation Tools) */}
      <div className="position-absolute top-0 end-0 m-3 mt-5 z-3 d-flex flex-column gap-1.5">
        <div className="btn-group-vertical shadow-lg backdrop-blur">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In (Acercar cota)"
            className="btn btn-sm btn-dark bg-opacity-75 border-secondary text-info p-2 d-flex align-items-center justify-content-center"
          >
            <span className="material-symbols-outlined ms-sm">zoom_in</span>
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out (Alejar cota)"
            className="btn btn-sm btn-dark bg-opacity-75 border-secondary text-info p-2 d-flex align-items-center justify-content-center"
          >
            <span className="material-symbols-outlined ms-sm">zoom_out</span>
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            title="Restablecer Vista Isométrica"
            className="btn btn-sm btn-dark bg-opacity-75 border-secondary text-secondary p-2 d-flex align-items-center justify-content-center"
          >
            <span className="material-symbols-outlined ms-sm">restart_alt</span>
          </button>
          <button
            type="button"
            onClick={() => setWireframeMode(!wireframeMode)}
            title="Alternar Modo Alámbrico / Sólido"
            className={`btn btn-sm p-2 d-flex align-items-center justify-content-center border-secondary ${
              wireframeMode ? 'btn-warning text-dark' : 'btn-dark bg-opacity-75 text-secondary'
            }`}
          >
            <span className="material-symbols-outlined ms-sm">grid_view</span>
          </button>
        </div>
      </div>

      {/* Indicador de Transmisividad Inferior Derecho */}
      <div className="position-absolute bottom-0 end-0 m-3 z-3">
        <div className={`badge bg-dark bg-opacity-80 border px-3 py-2 rounded-pill d-flex align-items-center gap-1.5 font-monospace shadow-sm backdrop-blur ${scenario === '60m' ? 'border-success text-success' : 'border-info text-info'}`}>
          <span className="material-symbols-outlined ms-sm">layers</span>
          <span>Transmisividad (T): <strong>{scenario === '60m' ? '120 m²/día (Cuara)' : '250 m²/día (Morán)'}</strong></span>
        </div>
      </div>

      {/* Botones de Etapas de Cámara y Perspectivas Técnicas */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 z-3 d-flex flex-wrap justify-content-center gap-2">
        {(['isometric', 'surface', 'casing', 'bottom'] as const).map(stage => (
          <button
            key={stage}
            onClick={() => setViewStage(stage)}
            className={`btn btn-sm rounded-pill font-monospace text-xs px-3 shadow-sm backdrop-blur ${
              viewStage === stage 
                ? 'btn-info text-dark fw-bold border-info' 
                : 'btn-dark bg-opacity-75 text-secondary border-secondary'
            }`}
          >
            {stage === 'isometric' && 'Vista Isométrica'}
            {stage === 'surface' && 'Sello Sanitario (0-15m)'}
            {stage === 'casing' && (scenario === '120m' ? 'Camisa 8" ASTM' : 'Camisa 6" ASTM')}
            {stage === 'bottom' && (scenario === '120m' ? 'Bomba 6" 7.5HP (98m)' : 'Filtros (Fondo 60m)')}
          </button>
        ))}
      </div>
    </div>
  );
};

