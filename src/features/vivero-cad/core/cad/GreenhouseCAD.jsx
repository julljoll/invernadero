import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Parametric Three.js Greenhouse Model (Replaces React-CAD OpenCASCADE)
export default function GreenhouseCAD({ animate = false }) {
  const width = 5;
  const length = 12;
  const colHeight = 3.0;
  
  const groupRef = useRef(null);
  
  // Optional animation for interactive viewer
  useFrame((state, delta) => {
    if (animate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -colHeight / 2, 0]}>
      {/* Columna Base 1 */}
      <mesh position={[width / 2, colHeight / 2, 0]}>
        <boxGeometry args={[0.1, colHeight, 0.1]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Columna Base 2 */}
      <mesh position={[-width / 2, colHeight / 2, 0]}>
        <boxGeometry args={[0.1, colHeight, 0.1]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Viga Transversal (Truss Bottom) */}
      <mesh position={[0, colHeight, 0]}>
        <boxGeometry args={[width, 0.05, 0.05]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pilares internos (estéticos, iluminados en verde) */}
      <mesh position={[0, colHeight / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, colHeight, 8]} />
        <meshBasicMaterial color="#00ff00" wireframe={true} transparent opacity={0.6} />
      </mesh>

      {/* Suelo (Tierra) */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[width + 1, 0.2, length + 1]} />
        <meshStandardMaterial color="#2d1c10" roughness={1} />
      </mesh>

      {/* Techo Translúcido (Simulación Malla/Plástico) */}
      <mesh position={[0, colHeight + 0.75, 0]}>
        <boxGeometry args={[width, 1.5, length]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.2} 
          roughness={0.1} 
          metalness={0.1}
          side={2} // DoubleSide equivalent in raw Three, but R3F uses standard props. Wait, side={THREE.DoubleSide} needs import. Let's just keep default.
        />
      </mesh>
      
      {/* Exoesqueleto Wireframe (estilo blueprint) */}
      <mesh position={[0, colHeight + 0.75, 0]}>
        <boxGeometry args={[width, 1.5, length]} />
        <meshStandardMaterial color="#00ffff" wireframe={true} />
      </mesh>
    </group>
  );
}
