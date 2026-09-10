import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../shared/components/Navbar';
import { Footer } from '../shared/components/Footer';
import { AppRoutes } from './routes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 bg-light text-dark selection-green" data-bs-theme="light">
        <Navbar />
        <main className="flex-grow-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};


export default App;
