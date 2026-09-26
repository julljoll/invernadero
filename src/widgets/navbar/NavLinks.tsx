import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Inversión ($4k)', icon: 'payments' },
  { path: '/cockpit', label: 'Cockpit Técnico', icon: 'biotech' },
  { path: '/malla-50mesh', label: 'Malla 50 Mesh', icon: 'grid_view' },
];

export const NavLinks: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="d-none d-lg-flex align-items-center gap-1 p-1 bg-dark bg-opacity-75 border border-white border-opacity-10 rounded-pill shadow-sm">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-3 py-1.5 rounded-pill text-xs fw-semibold text-decoration-none d-flex align-items-center gap-1.5 transition-all ${
            isActive(item.path)
              ? 'bg-success bg-opacity-25 text-success border border-success border-opacity-50 shadow-sm'
              : 'text-secondary hover-text-light'
          }`}
        >
          <span className="material-symbols-outlined ms-sm">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};
