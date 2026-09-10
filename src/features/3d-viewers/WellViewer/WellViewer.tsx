import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface WellViewerProps {
  totalDepthM?: number;
  staticWaterLevelM?: number;
  className?: string;
}

export const WellViewer: React.FC<WellViewerProps> = ({
  totalDepthM = 60.0,
  staticWaterLevelM = 49.5,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPumping, setIsPumping] = useState<boolean>(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05080c);

    // 2. Cámara
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000);
    camera.position.set(16, -15, 28);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, -totalDepthM / 3, 0);

    // 5. Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2, 80);
    pointLight.position.set(5, -staticWaterLevelM + 5, 5);
    scene.add(pointLight);

    // 6. Estratigrafía Geológica (Cuara, Quíbor)
    const strataHeights = [15, 20, 15, 10];
    const strataColors = [0x78350f, 0x475569, 0xb45309, 0x0369a1];
    let currentY = 0;

    strataHeights.forEach((h, idx) => {
      const strataGeo = new THREE.CylinderGeometry(4.5, 4.5, h, 24, 1, true, 0, Math.PI * 1.5);
      const strataMat = new THREE.MeshStandardMaterial({
        color: strataColors[idx],
        side: THREE.BackSide,
        roughness: 0.9,
      });
      const strataMesh = new THREE.Mesh(strataGeo, strataMat);
      strataMesh.position.y = currentY - h / 2;
      scene.add(strataMesh);
      currentY -= h;
    });

    // 7. Encofrado de Anillos de Concreto
    const casingGeo = new THREE.CylinderGeometry(0.7, 0.7, totalDepthM, 32);
    const casingMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      wireframe: true,
    });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.position.y = -totalDepthM / 2;
    scene.add(casing);

    // 8. Columna de Agua en el fondo del pozo
    const waterColumnHeight = Math.max(1, totalDepthM - staticWaterLevelM);
    const waterGeo = new THREE.CylinderGeometry(0.65, 0.65, waterColumnHeight, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = -staticWaterLevelM - waterColumnHeight / 2;
    scene.add(water);

    // 9. Bomba Sumergible de 2 HP
    const pumpGroup = new THREE.Group();
    const pumpBodyGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.2, 16);
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.9 });
    const pumpMesh = new THREE.Mesh(pumpBodyGeo, pumpMat);
    pumpGroup.add(pumpMesh);
    pumpGroup.position.set(0, -totalDepthM + 2.0, 0);
    scene.add(pumpGroup);

    // Tubería de impulsión hacia la superficie
    const pipeGeo = new THREE.CylinderGeometry(0.04, 0.04, totalDepthM - 2.0, 8);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.position.y = (-totalDepthM + 2.0) / 2;
    scene.add(pipe);

    // Redimensionamiento
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animación
    let animId: number;
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      controls.update();

      pointLight.intensity = 1.8 + Math.sin(elapsed * 3) * 0.4;
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
  }, [totalDepthM, staticWaterLevelM]);

  return (
    <div className={`position-relative w-100 rounded-3 overflow-hidden bg-black ${className}`}>
      <div ref={mountRef} style={{ width: '100%', height: '500px' }} />

      {/* Info Flotante con Card Bootstrap */}
      <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-2 z-3" style={{ maxWidth: '300px' }}>
        <div className="card card-agro card-agro-water p-3 shadow text-xs">
          <div className="fw-bold text-info fs-6 mb-1 d-flex align-items-center gap-1">
            <span className="material-symbols-outlined ms-sm">water_ph</span>
            <span>Pozo Artesanal 60m</span>
          </div>
          <div className="text-secondary font-monospace">
            <div>• Profundidad Total: <strong className="text-light">{totalDepthM} m</strong></div>
            <div>• Espejo Estático: <strong className="text-info">{staticWaterLevelM} m</strong></div>
            <div>• Columna Activa: <strong className="text-success">{(totalDepthM - staticWaterLevelM).toFixed(1)} m de agua</strong></div>
            <div>• Bomba Sumergible: <strong className="text-light">2.0 HP (2.5 L/s)</strong></div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPumping(!isPumping)}
          className={`btn btn-sm rounded-pill d-flex align-items-center gap-1.5 px-3 backdrop-blur ${
            isPumping ? 'btn-info text-dark fw-bold' : 'btn-dark bg-opacity-75 text-secondary border-secondary'
          }`}
        >
          <span className="material-symbols-outlined ms-sm">{isPumping ? 'power' : 'power_off'}</span>
          <span>Bomba: {isPumping ? 'Bombeando (2.5 L/s)' : 'En Reposo'}</span>
        </button>
      </div>

      <div className="position-absolute bottom-0 end-0 m-3 z-3">
        <div className="badge bg-dark bg-opacity-75 border border-success border-opacity-50 text-success px-3 py-2 rounded-pill d-flex align-items-center gap-1.5 font-monospace">
          <span className="material-symbols-outlined ms-sm">layers</span>
          <span>Transmisividad: <strong>T = 180 m²/día</strong></span>
        </div>
      </div>
    </div>
  );
};
