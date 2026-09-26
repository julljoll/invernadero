import React from 'react';

export default function Overlay({ onToggleMode, isVideoMode }) {
  return (
    <div className="ui-overlay">
      <header className="header">
        <h1>ReactCAD Viewer <span style={{fontSize: '0.8rem', color: '#ffcc00'}}>CSG SÓLIDO</span></h1>
        <div className="badge">Vivero Magistral - Quíbor</div>
      </header>
      
      <div className="sidebar">
        <h3>Geometría OpenCASCADE</h3>
        <div className="prop-row">
          <span>Ancho:</span> <span>5.0 m</span>
        </div>
        <div className="prop-row">
          <span>Largo:</span> <span>12.0 m</span>
        </div>
        <div className="prop-row">
          <span>Alero:</span> <span>3.0 m</span>
        </div>
        <div className="prop-row">
          <span>Kernel:</span> <span className="highlight">WASM Core</span>
        </div>
        <hr />
        <p className="instruction">
          🖱️ <strong>Click + Arrastrar</strong> para rotar<br/>
          ⚙️ <strong>Scroll</strong> para zoom<br/>
        </p>
        <button className="export-btn" onClick={() => alert("Llamando a core.exportSTEP()...")}>
          Exportar a .STEP (CAD)
        </button>
        
        <button 
          className="export-btn" 
          style={{ background: isVideoMode ? '#ff4757' : '#2ed573', marginTop: '10px' }}
          onClick={onToggleMode}
        >
          {isVideoMode ? "⏹️ Volver al Editor CAD" : "🎬 Animar y Generar Video"}
        </button>
      </div>
    </div>
  );
}
