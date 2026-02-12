
import React, { useState } from 'react';
import { RANKS } from '../constants';
import { Espaco, Reservation } from '../types';
import { checkConflict, saveReservation } from '../services/storageService';

interface ReservationFormProps {
  initialSpace?: Espaco;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ initialSpace, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    nomeGuerra: '',
    nomeCompleto: '',
    patente: '',
    email: '',
    telefone: '',
    espaco: initialSpace || 'Auditório' as Espaco,
    data: new Date().toISOString().split('T')[0],
    horaInicio: '08:00',
    horaFim: '09:00',
    finalidade: ''
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nomeGuerra || !formData.patente || !formData.espaco || !formData.data) {
      setError('Todos os campos obrigatórios (*) devem ser preenchidos.');
      return;
    }

    if (formData.horaInicio >= formData.horaFim) {
      setError('A hora de início deve ser anterior à hora de término.');
      return;
    }

    const hasConflict = checkConflict(formData.data, formData.horaInicio, formData.horaFim, formData.espaco);
    if (hasConflict) {
      setError('Horário já reservado para operação/reunião neste espaço.');
      return;
    }

    const newReservation: Reservation = {
      id: crypto.randomUUID(),
      ...formData,
      status: 'PENDENTE'
    };

    saveReservation(newReservation);
    onSuccess();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="theme-nav-bg theme-nav-text px-6 py-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-file-pen"></i> Solicitação de Reserva
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm animate-pulse">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Patente *</label>
            <select 
              required
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.patente}
              onChange={(e) => setFormData({...formData, patente: e.target.value})}
            >
              <option value="">Selecione...</option>
              {RANKS.map(rank => <option key={rank} value={rank}>{rank}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome de Guerra *</label>
            <input 
              required
              type="text"
              placeholder="Ex: SILVA"
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.nomeGuerra}
              onChange={(e) => setFormData({...formData, nomeGuerra: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
          <input 
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.nomeCompleto}
            onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Institucional</label>
            <input 
              type="email"
              placeholder="usuario@fab.mil.br"
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Telefone / Ramal</label>
            <input 
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Espaço *</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                checked={formData.espaco === 'Auditório'} 
                onChange={() => setFormData({...formData, espaco: 'Auditório'})}
              />
              <span className="text-sm">Auditório</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                checked={formData.espaco === 'Sala de Reunião'} 
                onChange={() => setFormData({...formData, espaco: 'Sala de Reunião'})}
              />
              <span className="text-sm">Sala de Reunião</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data *</label>
            <input 
              required
              type="date"
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.data}
              onChange={(e) => setFormData({...formData, data: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Início *</label>
            <input 
              required
              type="time"
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.horaInicio}
              onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Término *</label>
            <input 
              required
              type="time"
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.horaFim}
              onChange={(e) => setFormData({...formData, horaFim: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Finalidade da Missão *</label>
          <textarea 
            required
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Descreva brevemente o objetivo da reserva..."
            value={formData.finalidade}
            onChange={(e) => setFormData({...formData, finalidade: e.target.value})}
          ></textarea>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded font-bold transition"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-1 theme-primary-bg theme-primary-bg-hover text-white py-2.5 rounded font-bold shadow-md transition"
          >
            Confirmar Reserva
          </button>
        </div>
      </form>
    </div>
  );
};
