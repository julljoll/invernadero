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
  
  // Refs para manipular objetos 3D y cámara
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(18, -30, 35));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, -30, 0));

  // Actualización de cámara según escenario
  useEffect(() => {
    if (scenario === '60m') {
      targetCamPos.current.set(16, -30, 28);
      targetLookAt.current.set(0, -30, 0);
    } else {
      targetCamPos.current.set(25, -60, 45);
      targetLookAt.current.set(0, -60, 0);
    }
  }, [scenario]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Escena CAD Layout (Fondo oscuro técnico)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05080c);

    // Grid Helper de fondo
    const gridHelper = new THREE.GridHelper(100, 50, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // 2. Cámara
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000);
    camera.position.copy(targetCamPos.current);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.copy(targetLookAt.current);
    controlsRef.current = controls;

    // Utilidad: Text Sprites estilo CAD
    const createTextSprite = (text: string, color = '#00e5ff', fontSize = 42) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Sprite();
      
      canvas.width = 512;
      canvas.height = 128;
      
      ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;
      ctx.fillStyle = color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      
      // Halo/Stroke oscuro
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText(text, 10, canvas.height / 2);
      ctx.fillText(text, 10, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(16, 4, 1);
      return sprite;
    };

    // 5. Estratigrafía Geológica (Quíbor: CIDIAT-ULA) en modo CAD Wireframe
    // Estratos definidos: [Altura, Color, Etiqueta]
    const strataConfig: [number, number, string][] = [
      [15, 0x8b4513, 'Arcillas Limosas Superficiales'],     // 0 a 15m
      [20, 0x475569, 'Gravas Fluvio-Lacustres'],            // 15 a 35m
      [15, 0xb45309, 'Arcillas Acuitardas'],                // 35 a 50m
      [10, 0x0369a1, 'Lentes de Arena (Acuífero Libre)'],   // 50 a 60m (Fondo Pozo 60m)
      [30, 0x64748b, 'Arcillas Marinas Terciarias'],        // 60 a 90m
      [30, 0x0284c7, 'Lentes Profundos (Semiconfinado)'],   // 90 a 120m (Fondo Pozo 120m)
    ];

    let currentY = 0;
    const strataGroup = new THREE.Group();

    strataConfig.forEach((cfg, idx) => {
      const h = cfg[0];
      const color = cfg[1];
      const label = cfg[2];

      // No renderizar estratos por debajo de la profundidad total del escenario
      if (Math.abs(currentY) >= totalDepthM) return;
      
      // Geometría Alámbrica CAD
      const strataGeo = new THREE.CylinderGeometry(4.5, 4.5, h, 16, 1, true, 0, Math.PI * 1.5);
      const edges = new THREE.EdgesGeometry(strataGeo);
      const lineMat = new THREE.LineBasicMaterial({ color, opacity: 0.35, transparent: true });
      const strataWire = new THREE.LineSegments(edges, lineMat);
      
      strataWire.position.y = currentY - h / 2;
      strataGroup.add(strataWire);

      // Cota de profundidad y tipo de estrato
      const sprite = createTextSprite(`▼ ${(Math.abs(currentY) + h).toFixed(0)}m: ${label}`, `#${color.toString(16).padStart(6, '0')}`, 28);
      sprite.position.set(5.5, currentY - h / 2, 0);
      strataGroup.add(sprite);

      currentY -= h;
    });
    scene.add(strataGroup);

    // 6. Encofrado (Casing) del Pozo (Modo CAD)
    const casingGeo = new THREE.CylinderGeometry(0.7, 0.7, totalDepthM, 12, Math.floor(totalDepthM / 5));
    const casingEdges = new THREE.EdgesGeometry(casingGeo);
    const casingMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, opacity: 0.7, transparent: true });
    const casing = new THREE.LineSegments(casingEdges, casingMat);
    casing.position.y = -totalDepthM / 2;
    scene.add(casing);

    // 7. Columna de Agua (Superficie Dinámica y Estática)
    const waterGroup = new THREE.Group();
    
    // Nivel Estático (NE)
    const staticSprite = createTextSprite(`NE: ${staticWaterLevelM}m (546 msnm)`, '#38bdf8', 36);
    staticSprite.position.set(-6.5, -staticWaterLevelM, 0);
    waterGroup.add(staticSprite);
    
    const staticPlaneGeo = new THREE.PlaneGeometry(12, 12);
    const staticPlaneMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const staticPlane = new THREE.Mesh(staticPlaneGeo, staticPlaneMat);
    staticPlane.rotation.x = -Math.PI / 2;
    staticPlane.position.y = -staticWaterLevelM;
    waterGroup.add(staticPlane);

    // Nivel Dinámico (ND)
    const ndColor = scenario === '60m' ? '#ef4444' : '#10b981'; // Rojo si 60m (crítico), Verde si 120m (seguro)
    const ndSprite = createTextSprite(`ND: ${dynamicWaterLevelM}m`, ndColor, 36);
    ndSprite.position.set(-5.5, -dynamicWaterLevelM - 1, 0);
    waterGroup.add(ndSprite);

    // Cilindro de agua activa (desde ND hasta fondo)
    const waterColumnHeight = Math.max(0.5, totalDepthM - dynamicWaterLevelM);
    const waterGeo = new THREE.CylinderGeometry(0.65, 0.65, waterColumnHeight, 16);
    const waterMeshMat = new THREE.MeshBasicMaterial({ color: scenario === '60m' ? 0xef4444 : 0x0284c7, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending });
    const water = new THREE.Mesh(waterGeo, waterMeshMat);
    water.position.y = -dynamicWaterLevelM - waterColumnHeight / 2;
    waterGroup.add(water);

    // Cota de Cono de Abatimiento
    const coneLineMat = new THREE.LineBasicMaterial({ color: scenario === '60m' ? 0xef4444 : 0x38bdf8, transparent: true, opacity: 0.8 });
    const conePoints = [];
    conePoints.push(new THREE.Vector3(4.5, -staticWaterLevelM, 0));
    conePoints.push(new THREE.Vector3(0.7, -dynamicWaterLevelM, 0));
    conePoints.push(new THREE.Vector3(-0.7, -dynamicWaterLevelM, 0));
    conePoints.push(new THREE.Vector3(-4.5, -staticWaterLevelM, 0));
    const coneGeo = new THREE.BufferGeometry().setFromPoints(conePoints);
    const coneLine = new THREE.Line(coneGeo, coneLineMat);
    waterGroup.add(coneLine);

    scene.add(waterGroup);

    // 8. Bomba Sumergible y Tubería (Estilo CAD Eléctrico)
    const pumpY = -totalDepthM + 2.0;
    const pumpGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8);
    const pumpMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true });
    const pump = new THREE.Mesh(pumpGeo, pumpMat);
    pump.position.set(0, pumpY, 0);
    scene.add(pump);
    
    const pumpSprite = createTextSprite(`Bomba: ${scenario === '60m' ? '2.0 L/s' : '2.5 L/s'}`, '#10b981', 32);
    pumpSprite.position.set(4, pumpY, 0);
    scene.add(pumpSprite);

    const pipeGeo = new THREE.CylinderGeometry(0.08, 0.08, Math.abs(pumpY), 4);
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

    // Loop Animación
    let animId: number;
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      
      // Smooth camera transition
      camera.position.lerp(targetCamPos.current, 0.03);
      controls.target.lerp(targetLookAt.current, 0.03);
      controls.update();

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
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scenario, totalDepthM, staticWaterLevelM, dynamicWaterLevelM, isPumping]);

  return (
    <div className={`position-relative w-100 rounded-3 overflow-hidden bg-black ${className}`}>
      <div ref={mountRef} style={{ width: '100%', height: '520px' }} />

      {/* Info Flotante con Card Glassmorphism */}
      <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-2 z-3" style={{ maxWidth: '300px' }}>
        <div className="card card-agro card-agro-water p-3 shadow-lg border-secondary border-opacity-25 bg-dark bg-opacity-75 backdrop-blur text-xs">
          <div className="fw-bold text-info fs-6 mb-2 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined ms-sm">architecture</span>
            <span>{scenario === '60m' ? 'CAD: Pozo Superficial' : 'CAD: Pozo Profundo'}</span>
          </div>
          <div className="text-secondary font-monospace lh-lg">
            <div className="d-flex justify-content-between">
              <span>Profundidad Total:</span>
              <strong className="text-light">{totalDepthM} m</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Nivel Estático:</span>
              <strong className="text-info">{staticWaterLevelM} m</strong>
            </div>
            <div className="d-flex justify-content-between border-top border-secondary border-opacity-50 mt-1 pt-1">
              <span>Columna Activa:</span>
              <strong className={scenario === '60m' ? 'text-danger' : 'text-success'}>
                {(totalDepthM - dynamicWaterLevelM).toFixed(1)} m
              </strong>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>Caudal Extracción:</span>
              <strong className="text-light">{scenario === '60m' ? '2.0 L/s' : '2.5 L/s'}</strong>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPumping(!isPumping)}
          className={`btn btn-sm rounded-pill d-flex align-items-center gap-1.5 px-3 backdrop-blur shadow-sm ${
            isPumping ? 'btn-info text-dark fw-bold' : 'btn-dark bg-opacity-75 text-secondary border-secondary'
          }`}
        >
          <span className="material-symbols-outlined ms-sm">{isPumping ? 'water_pump' : 'power_off'}</span>
          <span>{isPumping ? 'Motor Activo (Bombeando)' : 'Motor Reposo'}</span>
        </button>
      </div>

      <div className="position-absolute bottom-0 end-0 m-3 z-3">
        <div className={`badge bg-dark bg-opacity-75 border px-3 py-2 rounded-pill d-flex align-items-center gap-1.5 font-monospace shadow-sm ${scenario === '60m' ? 'border-warning text-warning' : 'border-info text-info'}`}>
          <span className="material-symbols-outlined ms-sm">layers</span>
          <span>Transmisividad (T): <strong>{scenario === '60m' ? '120 m²/día' : '250 m²/día'}</strong></span>
        </div>
      </div>
    </div>
  );
};
