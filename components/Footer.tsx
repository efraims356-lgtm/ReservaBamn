
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-slate-600 text-sm font-medium">
          Sistema de Reserva Militar - Base Aérea de Manaus
        </p>
        <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-widest">
          Secretaria do CMD da BAMN
        </p>
      </div>
    </footer>
  );
};
