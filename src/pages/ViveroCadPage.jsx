import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Player } from '@remotion/player';
import GreenhouseCAD from '../features/vivero-cad/core/cad/GreenhouseCAD';
import Overlay from '../features/vivero-cad/components/ui/Overlay';
import { CinematicVideo } from '../features/vivero-cad/remotion/CinematicVideo';
import '../features/vivero-cad/index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { this.setState({ error, info }); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: 'red', color: 'white', position: 'absolute', inset: 0, zIndex: 9999 }}>
          <h1>React Crashed!</h1>
          <pre>{this.state.error?.toString()}</pre>
          <pre>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [isVideoMode, setIsVideoMode] = useState(false);

  return (
    <ErrorBoundary>
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
          // Visor interactivo nativo de Three.js
          <Canvas camera={{ position: [10, 8, 15], fov: 45 }}>
            <color attach="background" args={['#0a1128']} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <directionalLight position={[-10, 10, 5]} intensity={1} color="#53C942" />
            
            <GreenhouseCAD animate={false} />
            
            <OrbitControls makeDefault />
          </Canvas>
        )}
      </div>
    </div>
    </ErrorBoundary>
  );
}

export default App;
