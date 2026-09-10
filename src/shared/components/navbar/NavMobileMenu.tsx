import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAgroStore } from '../../store/useAgroStore';
import { NAV_ITEMS } from './NavLinks';

interface NavMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavMobileMenu: React.FC<NavMobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { liveTemperatureC, liveWindSpeedKmH } = useAgroStore();

  if (!isOpen) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="d-lg-none pt-3 pb-2 border-top border-white border-opacity-10 mt-2">
      <div className="d-flex flex-column gap-2 mb-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`p-2.5 rounded-3 text-xs fw-semibold text-decoration-none d-flex align-items-center gap-2 ${
              isActive(item.path)
                ? 'bg-success bg-opacity-25 text-success border border-success border-opacity-50'
                : 'bg-dark bg-opacity-50 text-secondary border border-white border-opacity-5'
            }`}
          >
            <span className="material-symbols-outlined ms-sm text-success">{item.icon}</span>
            <span className="fs-6">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Widget Telemetría en Móvil */}
      <div className="p-2.5 rounded-3 bg-dark border border-info border-opacity-25 text-info text-xs font-monospace d-flex align-items-center gap-2">
        <span className="material-symbols-outlined ms-sm text-info">satellite_alt</span>
        <span>
          Quíbor:{' '}
          <strong className="text-light">
            {liveTemperatureC ? `${liveTemperatureC}°C` : '28.5°C'}
          </strong>{' '}
          · <strong>{liveWindSpeedKmH ? `${liveWindSpeedKmH} km/h` : '8.8 km/h'} ESTE</strong>
        </span>
      </div>
    </div>
  );
};
