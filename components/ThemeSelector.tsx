
import React from 'react';
import { ThemeName } from '../types';

interface ThemeOption {
  id: ThemeName;
  name: string;
  preview: string;
  colors: {
    primary: string;
    nav: string;
  };
}

const THEMES: ThemeOption[] = [
  { id: 'militar', name: 'Militar (Padrão)', preview: 'bg-slate-900', colors: { primary: '#1d4ed8', nav: '#0f172a' } },
  { id: 'claro', name: 'Tema Claro', preview: 'bg-white border', colors: { primary: '#3b82f6', nav: '#ffffff' } },
  { id: 'escuro', name: 'Tema Escuro', preview: 'bg-black', colors: { primary: '#334155', nav: '#000000' } },
  { id: 'verde', name: 'Verde Institucional', preview: 'bg-emerald-900', colors: { primary: '#047857', nav: '#064e3b' } },
  { id: 'profissional', name: 'Azul Profissional', preview: 'bg-indigo-900', colors: { primary: '#4338ca', nav: '#312e81' } },
];

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  onSelect: (theme: ThemeName) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onSelect }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Temas do Sistema</h2>
        <p className="text-slate-500">Personalize sua experiência visual sem alterar as funcionalidades.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            className={`group relative bg-white border-2 p-4 rounded-xl transition-all duration-300 ${
              currentTheme === theme.id ? 'border-blue-500 shadow-lg scale-105' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`w-full h-24 rounded-lg mb-4 flex flex-col ${theme.preview}`}>
              <div className="h-4 w-full opacity-50 bg-white/10 mt-auto"></div>
            </div>
            <h3 className="font-bold text-slate-800 text-sm">{theme.name}</h3>
            {currentTheme === theme.id && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs animate-bounce">
                <i className="fa-solid fa-check"></i>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-12 bg-white p-6 rounded-xl border border-slate-200 text-center">
        <p className="text-sm text-slate-600 italic">
          <i className="fa-solid fa-circle-info mr-2 text-blue-500"></i>
          O tema selecionado será salvo automaticamente para este dispositivo.
        </p>
      </div>
    </div>
  );
};
