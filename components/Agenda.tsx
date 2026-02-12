
import React, { useState, useEffect } from 'react';
import { getReservations } from '../services/storageService';
import { Reservation } from '../types';

export const Agenda: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<'All' | 'Auditório' | 'Sala de Reunião'>('All');

  useEffect(() => {
    setReservations(getReservations());
  }, []);

  const filtered = reservations
    .filter(r => r.status === 'APROVADO')
    .filter(r => filter === 'All' || r.espaco === filter)
    .sort((a, b) => `${a.data} ${a.horaInicio}`.localeCompare(`${b.data} ${b.horaInicio}`));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Agenda Operacional</h2>
          <p className="text-slate-500">Visualização de espaços ocupados e missões agendadas.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-lg shadow-sm border border-slate-200">
          <button 
            onClick={() => setFilter('All')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filter === 'All' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter('Auditório')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filter === 'Auditório' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Auditório
          </button>
          <button 
            onClick={() => setFilter('Sala de Reunião')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filter === 'Sala de Reunião' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Sala de Reunião
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <div className="text-slate-300 mb-4">
            <i className="fa-regular fa-calendar-xmark text-6xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-slate-700">Nenhuma reserva confirmada</h3>
          <p className="text-slate-400">Não há eventos aprovados para os critérios selecionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(res => (
            <div key={res.id} className={`bg-white rounded-lg shadow-sm border-l-4 overflow-hidden ${res.espaco === 'Auditório' ? 'border-blue-600' : 'border-emerald-600'}`}>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${res.espaco === 'Auditório' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {res.espaco}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{new Date(res.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-blue-900">{res.patente}</span>
                  <span>{res.nomeGuerra}</span>
                </h4>
                <div className="mt-3 flex items-center gap-2 text-slate-600">
                  <i className="fa-regular fa-clock text-xs"></i>
                  <span className="text-sm font-semibold">{res.horaInicio} – {res.horaFim}</span>
                </div>
                <div className="mt-2 text-sm text-slate-500 line-clamp-2 italic">
                  "{res.finalidade}"
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
