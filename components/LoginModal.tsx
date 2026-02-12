
import React, { useState } from 'react';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../constants';
import { getAdmins } from '../services/storageService';
import { AccessLevel } from '../types';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (level: AccessLevel | 'Master') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check Master Admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      onLoginSuccess('Master');
      return;
    }

    // Check Dynamic Admins
    const admins = getAdmins();
    const foundAdmin = admins.find(a => a.email.toLowerCase() === email.toLowerCase());

    if (foundAdmin && foundAdmin.senha === password) {
      onLoginSuccess(foundAdmin.nivelAcesso);
    } else {
      setError('Acesso restrito. Usuário não autorizado ou senha incorreta.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <i className="fa-solid fa-user-lock"></i> Autenticação ADM
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
              <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Login / E-mail</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input 
                required
                type="email"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Senha de Acesso</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="fa-solid fa-key"></i>
              </span>
              <input 
                required
                type="password"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-lg font-bold shadow-lg transition transform active:scale-[0.98]"
          >
            Entrar no Painel ADM
          </button>
          
          <p className="text-center text-[10px] text-slate-400 uppercase tracking-tighter">
            Controle de Acesso - Secretaria BAMN
          </p>
        </form>
      </div>
    </div>
  );
};
