import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface GreenhouseViewerProps {
  widthM?: number;
  lengthM?: number;
  gutterHeightM?: number;
  ridgeHeightM?: number;
  className?: string;
}

export const GreenhouseViewer: React.FC<GreenhouseViewerProps> = ({
  widthM = 20.0,
  lengthM = 50.0,
  gutterHeightM = 3.0,
  ridgeHeightM = 5.5,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [showPillars, setShowPillars] = useState<boolean>(true);
  const [showCrop, setShowCrop] = useState<boolean>(true);

  // Referencias a Three.js para mutación
  const sceneRef = useRef<THREE.Scene | null>(null);
  const pillarsGroupRef = useRef<THREE.Group | null>(null);
  const cropGroupRef = useRef<THREE.Group | null>(null);
  const meshMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050a07);
    sceneRef.current = scene;

    // 2. Cámara
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000);
    camera.position.set(38, 25, 45);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, gutterHeightM / 2, 0);

    // 5. Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8e7, 1.5);
    dirLight.position.set(30, 40, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // 6. Suelo
    const groundGeo = new THREE.PlaneGeometry(widthM * 1.6, lengthM * 1.4);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x171f1a,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Cuadrícula de suelo
    const grid = new THREE.GridHelper(Math.max(widthM, lengthM) * 1.5, 30, 0x53c942, 0x1f3626);
    grid.position.y = 0.02;
    scene.add(grid);

    // 7. Estructura de Pilares (108 pilares Sch 40)
    const pillarsGroup = new THREE.Group();
    pillarsGroupRef.current = pillarsGroup;
    scene.add(pillarsGroup);

    const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, gutterHeightM, 8);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.8,
      roughness: 0.3,
    });

    const spacingX = 4.0;
    const spacingZ = 2.94;
    const halfW = widthM / 2;
    const halfL = lengthM / 2;

    for (let x = -halfW; x <= halfW; x += spacingX) {
      for (let z = -halfL; z <= halfL; z += spacingZ) {
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(x, gutterHeightM / 2, z);
        pillarsGroup.add(pillar);
      }
    }

    // 8. Cobertura de Malla 50 Mesh
    const meshMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      wireframe: false,
    });
    meshMaterialRef.current = meshMaterial;

    // Paredes perimetrales
    const wallsGroup = new THREE.Group();
    const wallLongGeo = new THREE.PlaneGeometry(lengthM, gutterHeightM);
    const wallEast = new THREE.Mesh(wallLongGeo, meshMaterial);
    wallEast.position.set(halfW, gutterHeightM / 2, 0);
    wallEast.rotation.y = -Math.PI / 2;
    wallsGroup.add(wallEast);

    const wallWest = new THREE.Mesh(wallLongGeo, meshMaterial);
    wallWest.position.set(-halfW, gutterHeightM / 2, 0);
    wallWest.rotation.y = Math.PI / 2;
    wallsGroup.add(wallWest);

    const wallShortGeo = new THREE.PlaneGeometry(widthM, gutterHeightM);
    const wallFront = new THREE.Mesh(wallShortGeo, meshMaterial);
    wallFront.position.set(0, gutterHeightM / 2, halfL);
    wallsGroup.add(wallFront);

    const wallBack = new THREE.Mesh(wallShortGeo, meshMaterial);
    wallBack.position.set(0, gutterHeightM / 2, -halfL);
    wallBack.rotation.y = Math.PI;
    wallsGroup.add(wallBack);

    // Techo a dos aguas
    const roofSlopeL = Math.sqrt(Math.pow(halfW, 2) + Math.pow(ridgeHeightM - gutterHeightM, 2));
    const roofGeo = new THREE.PlaneGeometry(roofSlopeL, lengthM);
    const angle = Math.atan2(ridgeHeightM - gutterHeightM, halfW);

    const roofRight = new THREE.Mesh(roofGeo, meshMaterial);
    roofRight.position.set(halfW / 2, (gutterHeightM + ridgeHeightM) / 2, 0);
    roofRight.rotation.z = angle;
    roofRight.rotation.y = Math.PI / 2;
    wallsGroup.add(roofRight);

    const roofLeft = new THREE.Mesh(roofGeo, meshMaterial);
    roofLeft.position.set(-halfW / 2, (gutterHeightM + ridgeHeightM) / 2, 0);
    roofLeft.rotation.z = -angle;
    roofLeft.rotation.y = Math.PI / 2;
    wallsGroup.add(roofLeft);

    scene.add(wallsGroup);

    // 9. Cultivo (Hileras de Pimentón / Tomate)
    const cropGroup = new THREE.Group();
    cropGroupRef.current = cropGroup;
    scene.add(cropGroup);

    const plantGeo = new THREE.ConeGeometry(0.35, 1.4, 6);
    const plantMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.8 });

    for (let x = -halfW + 1.5; x <= halfW - 1.5; x += 1.8) {
      for (let z = -halfL + 2.0; z <= halfL - 2.0; z += 1.2) {
        const plant = new THREE.Mesh(plantGeo, plantMat);
        plant.position.set(x, 0.7, z);
        cropGroup.add(plant);
      }
    }

    // 10. Flecha de Viento Dominante del ESTE (Quíbor 88%)
    const arrowDir = new THREE.Vector3(-1, 0, 0);
    const arrowOrigin = new THREE.Vector3(halfW + 8, gutterHeightM, 0);
    const arrowHelper = new THREE.ArrowHelper(arrowDir, arrowOrigin, 6, 0x38bdf8, 1.5, 0.8);
    scene.add(arrowHelper);

    // Redimensionamiento
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Loop de animación
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
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
  }, [widthM, lengthM, gutterHeightM, ridgeHeightM]);

  useEffect(() => {
    if (pillarsGroupRef.current) pillarsGroupRef.current.visible = showPillars;
  }, [showPillars]);

  useEffect(() => {
    if (cropGroupRef.current) cropGroupRef.current.visible = showCrop;
  }, [showCrop]);

  useEffect(() => {
    if (meshMaterialRef.current) meshMaterialRef.current.wireframe = wireframe;
  }, [wireframe]);

  return (
    <div className={`position-relative w-100 rounded-3 overflow-hidden bg-black ${className}`}>
      {/* Canvas 3D */}
      <div ref={mountRef} style={{ width: '100%', height: '500px' }} />

      {/* Controles Flotantes con Botones Bootstrap y Material Symbols */}
      <div className="position-absolute top-0 start-0 m-3 d-flex flex-wrap gap-2 z-3">
        <button
          type="button"
          onClick={() => setShowPillars(!showPillars)}
          className={`btn btn-sm rounded-pill d-flex align-items-center gap-1.5 backdrop-blur ${
            showPillars ? 'btn-success text-dark fw-bold' : 'btn-dark bg-opacity-75 text-secondary border-secondary'
          }`}
        >
          <span className="material-symbols-outlined ms-sm">grid_on</span>
          <span>108 Pilares ({showPillars ? 'ON' : 'OFF'})</span>
        </button>

        <button
          type="button"
          onClick={() => setShowCrop(!showCrop)}
          className={`btn btn-sm rounded-pill d-flex align-items-center gap-1.5 backdrop-blur ${
            showCrop ? 'btn-success text-dark fw-bold' : 'btn-dark bg-opacity-75 text-secondary border-secondary'
          }`}
        >
          <span className="material-symbols-outlined ms-sm">eco</span>
          <span>Cultivo ({showCrop ? 'ON' : 'OFF'})</span>
        </button>

        <button
          type="button"
          onClick={() => setWireframe(!wireframe)}
          className={`btn btn-sm rounded-pill d-flex align-items-center gap-1.5 backdrop-blur ${
            wireframe ? 'btn-info text-dark fw-bold' : 'btn-dark bg-opacity-75 text-secondary border-secondary'
          }`}
        >
          <span className="material-symbols-outlined ms-sm">view_in_ar</span>
          <span>Malla ({wireframe ? 'Wireframe' : 'Sólido'})</span>
        </button>
      </div>

      {/* Badge Viento Quíbor */}
      <div className="position-absolute bottom-0 end-0 m-3 z-3">
        <div className="badge bg-dark bg-opacity-75 border border-info border-opacity-50 text-info px-3 py-2 rounded-pill d-flex align-items-center gap-1.5 font-monospace">
          <span className="material-symbols-outlined ms-sm">air</span>
          <span>Viento Alisio Dominante: <strong>88% ESTE</strong></span>
        </div>
      </div>
    </div>
  );
};
