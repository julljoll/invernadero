import React from 'react';
import { HeroPitch } from './hero/HeroPitch';
import { HeroStatsGrid } from './hero/HeroStatsGrid';
import { Hero3DPreview } from './hero/Hero3DPreview';

export const HeroInvestment: React.FC = () => {
  return (
    <section className="py-5 overflow-hidden">
      <div className="container-xl">
        <div className="row align-items-center g-5">
          {/* Columna Izquierda: Pitch y Estadísticas */}
          <div className="col-12 col-lg-7">
            <HeroPitch />
            <HeroStatsGrid />
          </div>

          {/* Columna Derecha: Render 3D del Pozo */}
          <div className="col-12 col-lg-5">
            <Hero3DPreview />
          </div>
        </div>
      </div>
    </section>
  );
};
