import React, { useState } from 'react';
import { MeshViewer } from '../3d-viewers/MeshViewer/MeshViewer';
import { VariantSelector } from './components/VariantSelector';
import { MeshRollCalculator } from './components/MeshRollCalculator';
import { AgroCtaBanner } from '../../shared/components/AgroCtaBanner';

export const MallaSalesPage: React.FC = () => {
  const [variant, setVariant] = useState<'110' | '130'>('110');

  return (
    <div className="py-5">
      <div className="container-xl d-flex flex-column gap-5">
        {/* Header Producto */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="badge bg-success bg-opacity-10 border border-success border-opacity-25 text-success rounded-pill px-3 py-1 text-uppercase fw-bold mb-2">
            HDPE 100% Virgen · 5 Años Garantía UV (720 KLY)
          </span>

          <h1 className="display-5 fw-bold text-dark tracking-tight mb-3">
            Malla Antiáfido <span className="text-success">50 Mesh</span>
          </h1>

          <p className="lead text-secondary fs-6 mb-0">
            Blindaje biológico y aerodinámico contra Trips, Mosca Blanca y Pulgones. Diseñada específicamente para resistir las ráfagas del Este y la radiación solar extrema del Valle de Quíbor.
          </p>
        </div>

        {/* Visor 3D Malla */}
        <div className="card card-agro p-2 shadow-lg">
          <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center px-2 py-1">
            <span className="text-secondary small fw-bold text-uppercase d-flex align-items-center gap-1">
              <span className="material-symbols-outlined text-success ms-sm">grid_view</span>
              <span>Visor 3D Microscópico y Rollo Industrial</span>
            </span>
            <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace">
              Poro ≤ 192 µm
            </span>
          </div>
          <MeshViewer initialMode="weave" />
        </div>

        {/* Selector de Variante */}
        <VariantSelector selectedVariant={variant} onSelectVariant={setVariant} />

        {/* Calculadora de Rollos */}
        <MeshRollCalculator selectedVariant={variant} />

        {/* Banner Complementario hacia Catálogo de Invernaderos y Accesorios */}
        <AgroCtaBanner
          className="p-0 m-0"
          badgeKicker="Suministro Integral de Estructuras AGROVENECUA"
          badgeTag="Invernaderos y Casas de Malla"
          title={<>¿Necesitas la <span style={{ color: '#53C942' }}>Estructura Metálica</span> o Accesorios de Montaje?</>}
          description="Disponemos del catálogo completo de invernaderos AGROVENECUA (AGRO-U3 Pro, AGRO-U1 Pro Hilo Alto), perfiles Lock Channel C, alambre Wiggle Wire y canalones pluviales galvanizados."
          primaryCtaText="Ver Catálogo de Invernaderos"
          primaryCtaLink="/catalogo-invernaderos"
          primaryCtaIcon="storefront"
          secondaryCtaText="Ir a la Landing Principal"
          secondaryCtaLink="/"
          secondaryCtaIcon="home"
          contactTitle="Atención Directa en Campo"
          contactEmail="contacto@agrovenecua.com"
          contactPhone="+58 416-0000000"
          contactLocation="Finca La Cigarronera, Quíbor, Lara"
          whatsappMessage="Hola AGROVENECUA, deseo cotizar una estructura de invernadero y accesorios de montaje"
        />
      </div>
    </div>
  );
};
