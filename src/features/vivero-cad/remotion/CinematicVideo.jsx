import React, { useRef } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useFrame } from '@react-three/fiber';
import GreenhouseCAD from '../core/cad/GreenhouseCAD';

// Geometría puente que simula el Sólido exportado para el video
const AnimatedStructure = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const mesh = useRef(null);

  // Animación matemática (El plano gira y se eleva estilo holograma)
  useFrame(() => {
    if (!mesh.current) return;
    
    // Rotación suave de 360 grados durante el video
    const rotation = interpolate(
      frame,
      [0, durationInFrames],
      [0, Math.PI * 2]
    );
    
    // Efecto de aparición desde abajo (Exploded view / Hologram effect)
    const yPos = interpolate(
      frame,
      [0, 60], // Sube durante los primeros 2 segundos
      [-5, 0],
      { extrapolateRight: 'clamp' }
    );

    mesh.current.rotation.y = rotation;
    mesh.current.position.y = yPos;
  });

  return (
    <group ref={mesh}>
      <GreenhouseCAD animate={false} />
    </group>
  );
};

export const CinematicVideo = () => {
  return (
    <ThreeCanvas 
      width={1280} 
      height={720} 
      camera={{ fov: 50, position: [10, 5, 15] }}
      style={{
        backgroundColor: '#0a1128',
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      
      {/* Malla 3D animada por Remotion */}
      <AnimatedStructure />
    </ThreeCanvas>
  );
};
