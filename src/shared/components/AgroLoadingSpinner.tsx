import React from 'react';
import { Container } from 'react-bootstrap';

interface Props {
  message?: string;
}

export const AgroLoadingSpinner: React.FC<Props> = ({
  message = 'Cargando Suite Agrotecnológica...',
}) => {
  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 bg-light"
      style={{ minHeight: '60vh' }}
    >
      <Container className="text-center py-5">
        <div className="position-relative d-inline-block mb-3">
          {/* Logo animado con halo sutil */}
          <div
            className="rounded-circle p-3 d-flex align-items-center justify-content-center bg-white shadow-sm border border-success border-opacity-25 animate-agro-pulse"
            style={{ width: '72px', height: '72px' }}
          >
            <span
              className="material-symbols-outlined text-success"
              style={{ fontSize: '2.5rem' }}
            >
              spa
            </span>
          </div>
        </div>

        <h5 className="fw-bold text-dark mb-1">{message}</h5>
        <div className="d-flex align-items-center justify-content-center gap-2 text-xxs text-secondary font-mono">
          <span>📍 Valle de Quíbor · 9°53'20"N 69°35'35"W</span>
          <span>·</span>
          <span>700 msnm</span>
        </div>

        <div className="mt-3 mx-auto" style={{ maxWidth: '180px' }}>
          <div className="agro-skeleton" style={{ height: '4px' }} />
        </div>
      </Container>
    </div>
  );
};
