
import React, { useState, useEffect } from 'react';
import { Footer } from './Footer';
import { getSettings } from '../services/storageService';

interface LayoutProps {
  children: React.ReactNode;
  onLoginClick: () => void;
  onAdminClick: () => void;
  isAdmin: boolean;
  onLogout: () => void;
  currentView: string;
  setView: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onLoginClick, 
  onAdminClick, 
  isAdmin, 
  onLogout,
  currentView,
  setView 
}) => {
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const settings = getSettings();
    setLogo(settings.logoUrl);

    const handleStorageChange = () => {
      const updatedSettings = getSettings();
      setLogo(updatedSettings.logoUrl);
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="theme-nav-bg theme-nav-text shadow-md sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setView('dashboard')}
          >
            <div className="bg-white p-1 rounded-full w-10 h-10 flex items-center justify-center overflow-hidden shadow-sm">
              {logo ? (
                <img src={logo} alt="Logo BAMN" className="w-full h-full object-contain" />
              ) : (
                <i className="fa-solid fa-jet-fighter-up text-slate-900 text-xl"></i>
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">BAMN</h1>
              <p className="text-xs opacity-70">Base Aérea de Manaus</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-6">
            <button 
              onClick={() => setView('agenda')}
              className={`text-xs md:text-sm font-medium hover:theme-accent-text transition ${currentView === 'agenda' ? 'theme-accent-text' : ''}`}
            >
              Agenda
            </button>
            <button 
              onClick={() => setView('themes')}
              className={`text-xs md:text-sm font-medium hover:theme-accent-text transition flex items-center gap-1 ${currentView === 'themes' ? 'theme-accent-text' : ''}`}
            >
              <i className="fa-solid fa-palette"></i> Temas
            </button>
            {isAdmin && (
              <button 
                onClick={onAdminClick}
                className={`text-xs md:text-sm font-medium hover:theme-accent-text transition flex items-center gap-1 ${currentView === 'admin' ? 'theme-accent-text' : ''}`}
              >
                <i className="fa-solid fa-lock text-xs"></i> Adm
              </button>
            )}
            {!isAdmin ? (
              <button 
                onClick={onLoginClick}
                className="theme-primary-bg theme-primary-bg-hover px-3 md:px-4 py-1.5 rounded text-xs md:text-sm font-semibold transition flex items-center gap-2 text-white shadow-sm"
              >
                <i className="fa-solid fa-user"></i> <span className="hidden md:inline">Login</span>
              </button>
            ) : (
              <button 
                onClick={onLogout}
                className="bg-red-700 hover:bg-red-600 px-3 md:px-4 py-1.5 rounded text-xs md:text-sm font-semibold transition flex items-center gap-2 text-white shadow-sm"
              >
                <i className="fa-solid fa-right-from-bracket"></i> <span className="hidden md:inline">Sair</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
};
