import React from 'react';
import { Navbar as BsNavbar, Container, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { NavBrand } from './navbar/NavBrand';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/cockpit', label: 'Cockpit Quíbor' },
    { to: '/catalogo-invernaderos', label: 'Catálogo Invernaderos' },
    { to: '/calculo-pozo', label: 'Viabilidad Pozo' },
    { to: '/malla-50mesh', label: 'Malla 50 Mesh' },
    { to: '/admin', label: 'Admin SQLite' },
  ];

  return (
    <BsNavbar expand="lg" sticky="top" className="bg-white border-bottom border-secondary-subtle shadow-sm py-2">
      <Container fluid="xl">
        <NavBrand />

        <BsNavbar.Toggle aria-controls="agro-main-navbar" className="border-0 shadow-none">
          <span className="material-symbols-outlined text-success">menu</span>
        </BsNavbar.Toggle>

        <BsNavbar.Collapse id="agro-main-navbar">
          <Nav className="mx-auto my-2 my-lg-0 gap-1 gap-lg-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  to={link.to}
                  key={link.to}
                  className={`nav-link px-3 py-2 rounded-3 fw-semibold text-xs text-uppercase tracking-wider transition-all ${
                    isActive 
                      ? 'bg-success bg-opacity-10 text-success fw-bold' 
                      : 'text-secondary hover-text-dark'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </Nav>

          <div className="d-flex align-items-center gap-2">
            <Link
              to="/cockpit"
              className="btn btn-success btn-sm rounded-pill px-3 py-2 fw-bold text-xs d-flex align-items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined ms-sm">speed</span>
              <span>Cockpit Pimentón</span>
            </Link>
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};



