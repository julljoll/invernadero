import React from 'react';
import { LITHOLOGY_LAYERS } from '../wellData';

interface LithologicProfileProps {
  currentDepthM?: number;
  targetDepthM?: number;
  staticWaterLevelM?: number;
  heightPx?: number;
}

/**
 * LithologicProfile2D — Perfil estratigráfico SVG técnico de alta fidelidad
 * Reemplaza el WellViewer 3D con una visualización 2D más precisa y liviana.
 * Diseñado según convenciones de cartografía hidrogeológica (USGS / CIDIAT).
 */
export const LithologicProfile2D: React.FC<LithologicProfileProps> = ({
  currentDepthM = 50,
  targetDepthM = 60,
  staticWaterLevelM = 49.5,
  heightPx = 520,
}) => {
  const maxDepthDisplay = 75; // mostrar hasta el basamento
  const svgWidth = 340;
  const svgHeight = heightPx;
  const profileX = 80;        // X donde comienza el pozo
  const profileWidth = 140;   // Ancho del perfil litológico
  const wellX = profileX + profileWidth / 2; // Centro del pozo
  const wellRadius = 18;       // Radio visual del brocal
  const depthToY = (d: number) => (d / maxDepthDisplay) * (svgHeight - 60) + 30;

  return (
    <div className="position-relative">
      {/* Leyenda superior */}
      <div className="d-flex flex-wrap gap-2 mb-3 px-1 text-xs">
        <span className="d-flex align-items-center gap-1">
          <span style={{ width: 14, height: 14, background: '#7BA7C4', display: 'inline-block', borderRadius: 3 }}></span>
          <span className="text-secondary">Acuífero Saturado</span>
        </span>
        <span className="d-flex align-items-center gap-1">
          <span style={{ width: 14, height: 14, background: '#A8956A', display: 'inline-block', borderRadius: 3 }}></span>
          <span className="text-secondary">Grava Permeable</span>
        </span>
        <span className="d-flex align-items-center gap-1">
          <span style={{ width: 14, height: 14, background: '#9E8870', display: 'inline-block', borderRadius: 3 }}></span>
          <span className="text-secondary">Arcilla / Confín.</span>
        </span>
        <span className="d-flex align-items-center gap-1">
          <span style={{ width: 14, height: 14, background: '#4A4A5A', display: 'inline-block', borderRadius: 3 }}></span>
          <span className="text-secondary">Basamento Rocoso</span>
        </span>
      </div>

      <svg
        width="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ fontFamily: "'Courier New', monospace", background: '#F8FAFB', borderRadius: 12, border: '1px solid #e2e8f0' }}
        aria-label="Perfil Litológico Estratigráfico del Pozo"
      >
        <defs>
          {/* Patrón puntos (arena) */}
          <pattern id="pDots" patternUnits="userSpaceOnUse" width="6" height="6">
            <rect width="6" height="6" fill="#D4C085" />
            <circle cx="3" cy="3" r="1" fill="#B8A070" opacity="0.7" />
          </pattern>
          {/* Patrón líneas (arcilla) */}
          <pattern id="pLines" patternUnits="userSpaceOnUse" width="8" height="8">
            <rect width="8" height="8" fill="#C4A882" />
            <line x1="0" y1="4" x2="8" y2="4" stroke="#9E8870" strokeWidth="1.2" />
          </pattern>
          {/* Patrón grava */}
          <pattern id="pGravel" patternUnits="userSpaceOnUse" width="10" height="10">
            <rect width="10" height="10" fill="#A8956A" />
            <ellipse cx="3" cy="3" rx="2" ry="1.5" fill="#907D56" opacity="0.6" />
            <ellipse cx="7" cy="7" rx="2.5" ry="1.5" fill="#907D56" opacity="0.5" />
          </pattern>
          {/* Patrón grava saturada (azul) */}
          <pattern id="pGravelSat" patternUnits="userSpaceOnUse" width="10" height="10">
            <rect width="10" height="10" fill="#7BA7C4" />
            <ellipse cx="3" cy="3" rx="2" ry="1.5" fill="#5B87A4" opacity="0.5" />
            <ellipse cx="7" cy="7" rx="2.5" ry="1.5" fill="#5B87A4" opacity="0.5" />
          </pattern>
          {/* Degradado agua */}
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
          </linearGradient>
          {/* Sombra fuste */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* ─── CAPAS LITOLÓGICAS ─────────────────────────────────────────── */}
        {LITHOLOGY_LAYERS.map((layer) => {
          const y1 = depthToY(layer.fromM);
          const y2 = depthToY(layer.toM);
          const h = y2 - y1;
          const fillMap: Record<string, string> = {
            'solid': layer.color,
            'dots': 'url(#pDots)',
            'lines': 'url(#pLines)',
            'gravel': layer.permeability === 'muy_alta' ? 'url(#pGravelSat)' : 'url(#pGravel)',
            'clay': 'url(#pLines)',
          };
          const fill = fillMap[layer.pattern] ?? layer.color;
          return (
            <g key={layer.name}>
              <rect
                x={profileX} y={y1}
                width={profileWidth} height={h}
                fill={fill}
                stroke="#CBD5E1" strokeWidth="0.5"
              />
              {/* Etiqueta de profundidad al cambio de capa */}
              <text
                x={profileX - 5} y={y1 + 4}
                textAnchor="end" fontSize="7.5" fill="#64748B"
              >
                {layer.fromM}m
              </text>
              {/* Nombre de capa (solo si es suficientemente alta) */}
              {h > 18 && (
                <text
                  x={profileX + profileWidth + 8} y={y1 + h / 2 + 4}
                  fontSize="7" fill="#374151"
                  style={{ fontWeight: 500 }}
                >
                  {layer.name.length > 28 ? layer.name.slice(0, 28) + '…' : layer.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Profundidad final en basamento */}
        <text x={profileX - 5} y={depthToY(75) + 4} textAnchor="end" fontSize="7.5" fill="#64748B">75m</text>

        {/* ─── NIVEL FREÁTICO ESTÁTICO (NFS) ───────────────────────────── */}
        <g>
          <line
            x1={profileX - 15} y1={depthToY(staticWaterLevelM)}
            x2={profileX + profileWidth + 60} y2={depthToY(staticWaterLevelM)}
            stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="5,3"
          />
          <text
            x={profileX + profileWidth + 64} y={depthToY(staticWaterLevelM) + 4}
            fontSize="7" fill="#0ea5e9" fontWeight="700"
          >
            NFS {staticWaterLevelM}m
          </text>
          {/* Símbolo estándar NFS (triángulo) */}
          <polygon
            points={`${profileX - 18},${depthToY(staticWaterLevelM) - 6} ${profileX - 12},${depthToY(staticWaterLevelM) - 6} ${profileX - 15},${depthToY(staticWaterLevelM)}`}
            fill="#0ea5e9"
          />
        </g>

        {/* ─── FUSTE DEL POZO (brocal) ──────────────────────────────────── */}
        <g filter="url(#shadow)">
          {/* Columna de agua en el fuste */}
          <rect
            x={wellX - wellRadius} y={depthToY(staticWaterLevelM)}
            width={wellRadius * 2}
            height={depthToY(currentDepthM) - depthToY(staticWaterLevelM)}
            fill="url(#waterGrad)"
            rx="0"
          />
          {/* Brocal artesanal (paredes) */}
          <rect
            x={wellX - wellRadius} y={depthToY(0)}
            width={3} height={depthToY(currentDepthM) - depthToY(0)}
            fill="#475569"
          />
          <rect
            x={wellX + wellRadius - 3} y={depthToY(0)}
            width={3} height={depthToY(currentDepthM) - depthToY(0)}
            fill="#475569"
          />
          {/* Fondo actual del pozo */}
          <rect
            x={wellX - wellRadius} y={depthToY(currentDepthM) - 2}
            width={wellRadius * 2} height={4}
            fill="#1e293b"
            rx="2"
          />
        </g>

        {/* ─── META DE EXCAVACIÓN (60 m) ─────────────────────────────────── */}
        {targetDepthM > currentDepthM && (
          <g>
            <rect
              x={wellX - wellRadius + 3} y={depthToY(currentDepthM)}
              width={wellRadius * 2 - 6}
              height={depthToY(targetDepthM) - depthToY(currentDepthM)}
              fill="#22c55e" opacity="0.25"
              strokeDasharray="4,2" stroke="#22c55e" strokeWidth="1"
            />
            <text
              x={wellX} y={depthToY(currentDepthM) + (depthToY(targetDepthM) - depthToY(currentDepthM)) / 2 + 4}
              textAnchor="middle" fontSize="7.5" fill="#16a34a" fontWeight="700"
            >
              +{targetDepthM - currentDepthM}m
            </text>
          </g>
        )}

        {/* ─── COTA DE PROFUNDIDAD ACTUAL ────────────────────────────────── */}
        <g>
          <line
            x1={profileX - 5} y1={depthToY(currentDepthM)}
            x2={wellX + wellRadius + 60} y2={depthToY(currentDepthM)}
            stroke="#dc2626" strokeWidth="1" strokeDasharray="4,2"
          />
          <text
            x={wellX + wellRadius + 64} y={depthToY(currentDepthM) + 4}
            fontSize="7" fill="#dc2626" fontWeight="700"
          >
            Actual {currentDepthM}m
          </text>
        </g>

        {/* ─── COTA META ─────────────────────────────────────────────────── */}
        <g>
          <line
            x1={profileX - 5} y1={depthToY(targetDepthM)}
            x2={wellX + wellRadius + 60} y2={depthToY(targetDepthM)}
            stroke="#22c55e" strokeWidth="1.5"
          />
          <text
            x={wellX + wellRadius + 64} y={depthToY(targetDepthM) + 4}
            fontSize="7" fill="#16a34a" fontWeight="700"
          >
            Meta {targetDepthM}m
          </text>
        </g>

        {/* ─── INDICADORES DE VOLUMEN Y COLUMNA ──────────────────────────── */}
        {/* Flecha indicativa columna activa */}
        <g>
          <line
            x1={wellX - wellRadius - 8} y1={depthToY(staticWaterLevelM)}
            x2={wellX - wellRadius - 8} y2={depthToY(currentDepthM)}
            stroke="#0ea5e9" strokeWidth="1.5"
            markerEnd="url(#arrow)"
          />
        </g>

        {/* ─── ESCALA TOPOGRÁFICA ─────────────────────────────────────────── */}
        <text x={profileX - 5} y={depthToY(0) + 4} textAnchor="end" fontSize="7.5" fill="#64748B">0m</text>
        <text x={profileX - 5} y={depthToY(20) + 4} textAnchor="end" fontSize="7.5" fill="#64748B">20m</text>
        <text x={profileX - 5} y={depthToY(40) + 4} textAnchor="end" fontSize="7.5" fill="#64748B">40m</text>
        <text x={profileX - 5} y={depthToY(60) + 4} textAnchor="end" fontSize="7.5" fill="#64748B">60m</text>

        {/* ─── TÍTULO TÉCNICO DEL PERFIL ──────────────────────────────────── */}
        <text x={svgWidth / 2} y={14} textAnchor="middle" fontSize="8.5" fill="#1e293b" fontWeight="700">
          PERFIL LITOLÓGICO — BROCAL ARTESANAL · CUARA, LARA
        </text>
        <text x={svgWidth / 2} y={24} textAnchor="middle" fontSize="7" fill="#64748B">
          9°53'15.8"N  69°35'37.3"W · Cota 734 msnm · T = 180 m²/día
        </text>
      </svg>
    </div>
  );
};

export default LithologicProfile2D;
