
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ReservationForm } from './components/ReservationForm';
import { Agenda } from './components/Agenda';
import { AdminPanel } from './components/AdminPanel';
import { LoginModal } from './components/LoginModal';
import { ThemeSelector } from './components/ThemeSelector';
import { Espaco, AccessLevel, ThemeName } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'form' | 'agenda' | 'admin' | 'themes'>('dashboard');
  const [selectedSpace, setSelectedSpace] = useState<Espaco | undefined>(undefined);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLevel, setAdminLevel] = useState<AccessLevel | 'Master' | undefined>(undefined);
  const [theme, setTheme] = useState<ThemeName>('militar');

  useEffect(() => {
    // Carrega dados de sessão
    const loggedIn = sessionStorage.getItem('bamn_admin_logged');
    const level = sessionStorage.getItem('bamn_admin_level') as any;
    if (loggedIn === 'true') {
      setIsAdmin(true);
      setAdminLevel(level);
    }

    // Carrega tema do localStorage
    const savedTheme = localStorage.getItem('bamn_theme') as ThemeName;
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      applyTheme('militar');
    }
  }, []);

  const applyTheme = (themeName: ThemeName) => {
    setTheme(themeName);
    localStorage.setItem('bamn_theme', themeName);
    const root = document.documentElement;

    const themeColors: Record<ThemeName, any> = {
      militar: { primary: '#1d4ed8', hover: '#1e40af', nav: '#0f172a', navText: '#ffffff', accent: '#60a5fa', bg: '#f8fafc' },
      claro: { primary: '#3b82f6', hover: '#2563eb', nav: '#ffffff', navText: '#0f172a', accent: '#2563eb', bg: '#ffffff' },
      escuro: { primary: '#334155', hover: '#1e293b', nav: '#000000', navText: '#e2e8f0', accent: '#94a3b8', bg: '#0f172a' },
      verde: { primary: '#047857', hover: '#065f46', nav: '#064e3b', navText: '#ffffff', accent: '#34d399', bg: '#f0fdf4' },
      profissional: { primary: '#4338ca', hover: '#3730a3', nav: '#312e81', navText: '#ffffff', accent: '#818cf8', bg: '#f5f3ff' },
    };

    const colors = themeColors[themeName];
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.hover);
    root.style.setProperty('--color-nav-bg', colors.nav);
    root.style.setProperty('--color-nav-text', colors.navText);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-page-bg', colors.bg);
  };

  const handleReserveClick = (space: Espaco) => {
    setSelectedSpace(space);
    setView('form');
  };

  const handleLoginSuccess = (level: AccessLevel | 'Master') => {
    setIsAdmin(true);
    setAdminLevel(level);
    setShowLogin(false);
    sessionStorage.setItem('bamn_admin_logged', 'true');
    sessionStorage.setItem('bamn_admin_level', level);
    setView('admin');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminLevel(undefined);
    sessionStorage.removeItem('bamn_admin_logged');
    sessionStorage.removeItem('bamn_admin_level');
    setView('dashboard');
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard 
          onReserve={handleReserveClick} 
          onViewAgenda={() => setView('agenda')} 
        />;
      case 'form':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <ReservationForm 
              initialSpace={selectedSpace} 
              onCancel={() => setView('dashboard')}
              onSuccess={() => {
                alert('Solicitação enviada com sucesso! Aguarde a aprovação administrativa.');
                setView('dashboard');
              }}
            />
          </div>
        );
      case 'agenda':
        return (
          <div className="animate-in fade-in duration-300">
            <Agenda />
          </div>
        );
      case 'themes':
        return (
          <div className="animate-in fade-in duration-300">
            <ThemeSelector 
              currentTheme={theme} 
              onSelect={(t) => {
                applyTheme(t);
                alert('Tema aplicado com sucesso.');
              }} 
            />
          </div>
        );
      case 'admin':
        return isAdmin && adminLevel ? (
          <div className="animate-in fade-in duration-300">
            <AdminPanel currentUserLevel={adminLevel} />
          </div>
        ) : (
          <div className="text-center py-20">
            <i className="fa-solid fa-lock text-5xl text-slate-200 mb-4"></i>
            <h3 className="text-xl font-bold text-slate-800">Acesso Restrito</h3>
            <p className="text-slate-500">Faça login para acessar esta área.</p>
            <button 
              onClick={() => setShowLogin(true)}
              className="mt-4 theme-primary-bg text-white px-6 py-2 rounded font-bold shadow-md"
            >
              Fazer Login ADM
            </button>
          </div>
        );
      default:
        return <Dashboard onReserve={handleReserveClick} onViewAgenda={() => setView('agenda')} />;
    }
  };

  return (
    <Layout 
      onLoginClick={() => setShowLogin(true)} 
      onAdminClick={() => setView('admin')}
      isAdmin={isAdmin}
      onLogout={handleLogout}
      currentView={view}
      setView={setView}
    >
      {renderContent()}
      
      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </Layout>
  );
};

export default App;
