import React from 'react';
import { GreenhouseViewer } from '../../../3d-viewers/GreenhouseViewer/GreenhouseViewer';

export const GreenhouseSection: React.FC = () => {
  return (
    <section className="py-5 border-top border-secondary-subtle">
      <div className="container-xl">
        <div className="text-center max-w-2xl mx-auto mb-4">
          <span className="badge bg-success bg-opacity-10 border border-success border-opacity-25 text-success rounded-pill px-3 py-1 text-uppercase fw-bold mb-2">
            Ingeniería Estructural
          </span>
          <h2 className="display-6 fw-bold text-dark mb-2">
            Estructura Protegida: Casa de Malla 1.000 m²
          </h2>
          <p className="text-secondary small">
            Diseñada con 108 pilares Sch 40, cables tensores orientados al viento del Este y Malla 50 Mesh monofilamento virgen.
          </p>
        </div>

        <div className="card card-agro p-2 shadow-lg">
          <GreenhouseViewer widthM={20} lengthM={50} gutterHeightM={3.0} ridgeHeightM={5.5} />
        </div>
      </div>
    </section>
  );
};
