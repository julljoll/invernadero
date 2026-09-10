import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface MeshViewerProps {
  className?: string;
  initialMode?: 'weave' | 'roll';
}

export const MeshViewer: React.FC<MeshViewerProps> = ({
  className = '',
  initialMode = 'weave',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'weave' | 'roll'>(initialMode);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    // 1. Escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040806);

    // 2. Cámara
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, mode === 'weave' ? 7.5 : 12);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 5. Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x53c942, 1.8);
    dirLight.position.set(5, 10, 8);
    scene.add(dirLight);

    // 6. Contenido según Modo
    const contentGroup = new THREE.Group();
    scene.add(contentGroup);

    if (mode === 'weave') {
      const threadMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.3,
        metalness: 0.1,
      });

      const countX = 25;
      const countY = 50;

      const threadGeoH = new THREE.CylinderGeometry(0.04, 0.04, 5, 8);
      for (let i = -countX / 2; i <= countX / 2; i++) {
        const thread = new THREE.Mesh(threadGeoH, threadMat);
        thread.rotation.z = Math.PI / 2;
        thread.position.y = (i * 5) / countX;
        thread.position.z = Math.sin(i) * 0.04;
        contentGroup.add(thread);
      }

      const threadGeoV = new THREE.CylinderGeometry(0.04, 0.04, 5, 8);
      for (let j = -countY / 4; j <= countY / 4; j++) {
        const thread = new THREE.Mesh(threadGeoV, threadMat);
        thread.position.x = (j * 5) / (countY / 2);
        thread.position.z = -Math.sin(j) * 0.04;
        contentGroup.add(thread);
      }
    } else {
      const rollGeo = new THREE.CylinderGeometry(0.8, 0.8, 4.0, 32);
      const rollMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.7,
      });
      const roll = new THREE.Mesh(rollGeo, rollMat);
      roll.rotation.z = Math.PI / 2;
      contentGroup.add(roll);

      const edgeGeo = new THREE.TorusGeometry(0.81, 0.05, 16, 32);
      const edgeMat = new THREE.MeshStandardMaterial({ color: 0x10b981 });
      const edgeLeft = new THREE.Mesh(edgeGeo, edgeMat);
      edgeLeft.rotation.y = Math.PI / 2;
      edgeLeft.position.x = -1.95;
      contentGroup.add(edgeLeft);

      const edgeRight = new THREE.Mesh(edgeGeo, edgeMat);
      edgeRight.rotation.y = Math.PI / 2;
      edgeRight.position.x = 1.95;
      contentGroup.add(edgeRight);
    }

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
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      contentGroup.rotation.y += 0.003;
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
  }, [mode]);

  return (
    <div className={`position-relative w-100 rounded-3 overflow-hidden bg-black ${className}`}>
      <div ref={mountRef} style={{ width: '100%', height: '480px' }} />

      {/* Selector de Modos con Botones Bootstrap */}
      <div className="position-absolute top-0 start-0 m-3 d-flex gap-2 z-3">
        <button
          type="button"
          onClick={() => setMode('weave')}
          className={`btn btn-sm rounded-pill d-flex align-items-center gap-1.5 px-3 backdrop-blur ${
            mode === 'weave'
              ? 'btn-success text-dark fw-bold'
              : 'btn-dark bg-opacity-75 text-secondary border-secondary'
          }`}
        >
          <span className="material-symbols-outlined ms-sm">microscope</span>
          <span>Tejido Microscópico (Poro ≤ 192 µm)</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('roll')}
          className={`btn btn-sm rounded-pill d-flex align-items-center gap-1.5 px-3 backdrop-blur ${
            mode === 'roll'
              ? 'btn-success text-dark fw-bold'
              : 'btn-dark bg-opacity-75 text-secondary border-secondary'
          }`}
        >
          <span className="material-symbols-outlined ms-sm">inventory_2</span>
          <span>Rollo Comercial (4m × 100m)</span>
        </button>
      </div>

      <div className="position-absolute bottom-0 end-0 m-3 z-3">
        <div className="badge bg-dark bg-opacity-75 border border-success border-opacity-50 text-success px-3 py-2 rounded-pill d-flex align-items-center gap-1.5 font-monospace">
          <span className="material-symbols-outlined ms-sm">verified</span>
          <span>Garantía UV Quíbor: <strong>5 Años (720 KLY)</strong></span>
        </div>
      </div>
    </div>
  );
};
