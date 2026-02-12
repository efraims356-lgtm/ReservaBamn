
import React from 'react';

interface DashboardProps {
  onReserve: (space: 'Auditório' | 'Sala de Reunião') => void;
  onViewAgenda: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onReserve, onViewAgenda }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
          Sistema de Reserva Militar
        </h2>
        <p className="text-lg text-slate-600">Base Aérea – Controle de Espaços Institucionais</p>
        <div className="h-1 w-24 theme-primary-bg mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => onReserve('Auditório')}
          className="group relative bg-white border-2 border-slate-200 p-8 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 text-center"
        >
          <div className="bg-blue-50 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-users-rectangle text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-800">Reservar Auditório</h3>
          <p className="text-sm text-slate-500 mt-2">Capacidade ampliada para formaturas e palestras.</p>
        </button>

        <button 
          onClick={() => onReserve('Sala de Reunião')}
          className="group relative bg-white border-2 border-slate-200 p-8 rounded-xl shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300 text-center"
        >
          <div className="bg-emerald-50 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-handshake text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-800">Sala de Reunião</h3>
          <p className="text-sm text-slate-500 mt-2">Espaço reservado para briefings e missões.</p>
        </button>

        <button 
          onClick={onViewAgenda}
          className="group relative bg-white border-2 border-slate-200 p-8 rounded-xl shadow-sm hover:shadow-xl hover:border-slate-800 transition-all duration-300 text-center"
        >
          <div className="bg-slate-100 text-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-calendar-days text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-800">Ver Agenda</h3>
          <p className="text-sm text-slate-500 mt-2">Consulte a disponibilidade de todos os espaços.</p>
        </button>
      </div>

      <div className="mt-16 bg-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 theme-primary-bg opacity-10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="flex-1 relative z-10">
          <h4 className="text-2xl font-bold mb-4">Atenção Militar</h4>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-circle-check theme-accent-text mt-1"></i>
              <span>Todas as solicitações de reserva passam por triagem administrativa.</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-circle-check theme-accent-text mt-1"></i>
              <span>Identificação por Patente e Nome de Guerra é obrigatória.</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-circle-check theme-accent-text mt-1"></i>
              <span>O status inicial de toda reserva é PENDENTE até aprovação do Comando.</span>
            </li>
          </ul>
        </div>
        <div className="hidden md:block relative z-10">
          <i className="fa-solid fa-shield-halved text-8xl text-slate-800 opacity-50"></i>
        </div>
      </div>
    </div>
  );
};
