import React from 'react';
import { NavBrand } from './navbar/NavBrand';

export const Navbar: React.FC = () => {
  return (
    <header 
      className="sticky-top bg-white border-bottom border-success border-opacity-25 shadow-sm d-flex align-items-center justify-content-center"
      style={{ height: '70px' }}
    >
      <div className="container-fluid px-3 d-flex justify-content-center align-items-center h-100">
        {/* Logo centrado sin texto */}
        <NavBrand />
      </div>
    </header>
  );
};



