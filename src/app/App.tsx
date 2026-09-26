import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '@widgets/navbar/Navbar';
import { Footer } from '@widgets/footer/Footer';
import { AppRoutes } from './routes';
import { usePageSeo } from '../core/hooks/usePageSeo';

const AppContent: React.FC = () => {
  usePageSeo();

  return (
    <div className="d-flex flex-column min-vh-100 bg-light text-dark selection-green" data-bs-theme="light">
      <Navbar />
      <main className="flex-grow-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
