import React from 'react';
import { Link } from 'react-router-dom';

export const NavBrand: React.FC = () => {
  return (
    <Link 
      to="/" 
      className="navbar-brand d-flex align-items-center justify-content-center m-0 p-0 text-decoration-none"
      title="AGROVENECUA — La Cigarronera"
    >
      <img
        src="/assets/logo/agrovenecua_logo.svg"
        alt="Agrovenecua Logo"
        style={{ height: '52px', width: 'auto' }}
        className="d-block"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/agrovenecua_logo.svg';
        }}
      />
    </Link>
  );
};


