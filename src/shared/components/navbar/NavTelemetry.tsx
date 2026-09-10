import React from 'react';
import { useAgroStore } from '../../store/useAgroStore';

export const NavTelemetry: React.FC = () => {
  const { liveTemperatureC, liveWindSpeedKmH } = useAgroStore();

  return (
    <div className="d-none d-md-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-dark border border-info border-opacity-25 text-info text-xs font-monospace">
      <span className="material-symbols-outlined ms-sm text-info">satellite_alt</span>
      <span>
        Quíbor:{' '}
        <strong className="text-light">
          {liveTemperatureC ? `${liveTemperatureC}°C` : '28.5°C'}
        </strong>{' '}
        · <strong>{liveWindSpeedKmH ? `${liveWindSpeedKmH} km/h` : '8.8 km/h'} ESTE</strong>
      </span>
    </div>
  );
};
