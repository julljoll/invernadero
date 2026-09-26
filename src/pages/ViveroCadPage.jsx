import React, { useState } from 'react';
import Viewer from '@react-cad/viewer';
import { Player } from '@remotion/player';
import GreenhouseCAD from '../features/vivero-cad/core/cad/GreenhouseCAD';
import Overlay from '../features/vivero-cad/components/ui/Overlay';
import { CinematicVideo } from '../features/vivero-cad/remotion/CinematicVideo';
import '../features/vivero-cad/index.css';

function App() {
  const [isVideoMode, setIsVideoMode] = useState(false);

  return (
    <div className="cad-container">
      {/* Interfaz de Usuario (UI) */}
      <Overlay 
        isVideoMode={isVideoMode} 
        onToggleMode={() => setIsVideoMode(!isVideoMode)} 
      />

      <div style={{ width: '100vw', height: '100vh', background: '#0a1128' }}>
        {isVideoMode ? (
          // Modo Cinematográfico de Remotion (Player renderizando la composición)
          <Player
            component={CinematicVideo}
            durationInFrames={300} // 10 segundos de video a 30 FPS
            compositionWidth={1920}
            compositionHeight={1080}
            fps={30}
            controls
            autoPlay
            loop
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        ) : (
          // Visor interactivo nativo de ReactCAD
          <Viewer
            model={<GreenhouseCAD />}
            displayMode="shaded"
            color="#00ffff"
            ambientLight={0.5}
            pointLight={0.8}
          />
        )}
      </div>
    </div>
  );
}

export default App;
