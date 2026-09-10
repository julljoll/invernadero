import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-top border-secondary-subtle bg-white py-4 mt-auto shadow-sm">
      <div className="container-xl d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-secondary text-xs">
        <div className="d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-success ms-sm">location_on</span>
          <span>
            <strong className="text-dark">AGROVENECUA INGENIERÍA C.A.</strong> · Finca La Cigarronera, Cuara, Valle de Quíbor, Lara, Venezuela (700 msnm)
          </span>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-light border border-success border-opacity-50 text-success rounded-pill font-monospace">
            NASA MERRA-2 · FAO-56
          </span>
          <span>React 18 · Bootstrap 5.3</span>
        </div>
      </div>
    </footer>
  );
};

