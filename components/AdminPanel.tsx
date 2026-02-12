
import React, { useState, useEffect } from 'react';
import { 
  getReservations, updateReservation, deleteReservation, 
  getAdmins, saveAdmin, updateAdmin, deleteAdmin,
  getSettings, saveSettings
} from '../services/storageService';
import { Reservation, Status, AdminAccount, AccessLevel, SystemSettings } from '../types';
import { COLORS } from '../constants';

interface AdminPanelProps {
  currentUserLevel: AccessLevel | 'Master';
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUserLevel }) => {
  const [activeTab, setActiveTab] = useState<'reservas' | 'admins' | 'config'>('reservas');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(getSettings());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Tudo' | Status>('Tudo');
  
  // Admin form state
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [adminFormData, setAdminFormData] = useState<Partial<AdminAccount>>({
    nome: '',
    email: '',
    senha: '',
    nivelAcesso: 'Administrador'
  });
  const [adminError, setAdminError] = useState('');

  // Logo upload state
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [configMessage, setConfigMessage] = useState({ text: '', type: '' });

  const canManageAdmins = currentUserLevel === 'Master' || currentUserLevel === 'Administrador Supervisor';

  useEffect(() => {
    loadReservations();
    if (canManageAdmins) loadAdmins();
    setSettings(getSettings());
  }, [canManageAdmins]);

  const loadReservations = () => setReservations(getReservations());
  const loadAdmins = () => setAdmins(getAdmins());

  const handleStatusUpdate = (id: string, status: Status) => {
    const res = reservations.find(r => r.id === id);
    if (res) {
      updateReservation({ ...res, status });
      loadReservations();
    }
  };

  const handleDeleteReservation = (id: string) => {
    if (confirm('Deseja realmente excluir esta reserva permanentemente?')) {
      deleteReservation(id);
      loadReservations();
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (!adminFormData.nome || !adminFormData.email || (!isEditingAdmin && !adminFormData.senha)) {
      setAdminError('Preencha os campos obrigatórios.');
      return;
    }

    if (adminFormData.senha && adminFormData.senha.length < 6) {
      setAdminError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (isEditingAdmin && adminFormData.id) {
      updateAdmin(adminFormData as AdminAccount);
    } else {
      const result = saveAdmin({
        ...adminFormData as AdminAccount,
        id: crypto.randomUUID(),
        criadoEm: new Date().toISOString()
      });
      if (!result.success) {
        setAdminError(result.message || 'Erro ao salvar.');
        return;
      }
    }

    setAdminFormData({ nome: '', email: '', senha: '', nivelAcesso: 'Administrador' });
    setIsEditingAdmin(false);
    loadAdmins();
  };

  const handleDeleteAdmin = (id: string) => {
    if (confirm('Excluir este administrador permanentemente?')) {
      deleteAdmin(id);
      loadAdmins();
    }
  };

  // Logo logic
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setConfigMessage({ text: 'A imagem deve ter no máximo 2MB.', type: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveConfig = () => {
    if (!previewLogo && !settings.logoUrl) {
      setConfigMessage({ text: 'Selecione uma imagem primeiro.', type: 'error' });
      return;
    }

    const newSettings: SystemSettings = {
      ...settings,
      logoUrl: previewLogo || settings.logoUrl,
      dataAtualizacao: new Date().toISOString(),
      atualizadoPor: currentUserLevel
    };

    saveSettings(newSettings);
    setSettings(newSettings);
    setPreviewLogo(null);
    setConfigMessage({ text: 'Logo atualizada com sucesso.', type: 'success' });
    setTimeout(() => setConfigMessage({ text: '', type: '' }), 3000);
  };

  const filteredReservations = reservations
    .filter(r => 
      r.nomeGuerra.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.patente.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(r => statusFilter === 'Tudo' || r.status === statusFilter)
    .sort((a, b) => b.data.localeCompare(a.data));

  const getStatusBadge = (status: Status) => {
    const base = "text-[10px] font-bold px-2 py-0.5 rounded text-white ";
    switch(status) {
      case 'APROVADO': return <span className={base + COLORS.Aprovado}>APROVADO</span>;
      case 'RECUSADO': return <span className={base + COLORS.Recusado}>RECUSADO</span>;
      default: return <span className={base + COLORS.Pendente}>PENDENTE</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Painel Administrativo</h2>
          <p className="text-slate-500">Logado como: <span className="font-bold text-slate-700">{currentUserLevel}</span></p>
        </div>

        <div className="flex bg-slate-200 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('reservas')}
            className={`px-4 py-2 rounded-md text-xs font-bold transition ${activeTab === 'reservas' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Reservas
          </button>
          {canManageAdmins && (
            <button 
              onClick={() => setActiveTab('admins')}
              className={`px-4 py-2 rounded-md text-xs font-bold transition ${activeTab === 'admins' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Admins
            </button>
          )}
          <button 
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-md text-xs font-bold transition ${activeTab === 'config' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Configurações
          </button>
        </div>
      </div>

      {activeTab === 'reservas' && (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-end">
            <input 
              type="text"
              placeholder="Buscar por Nome de Guerra ou Patente..."
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="Tudo">Todos os Status</option>
              <option value="PENDENTE">Apenas Pendentes</option>
              <option value="APROVADO">Aprovados</option>
              <option value="RECUSADO">Recusados</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-4">Militar</th>
                    <th className="px-6 py-4">Espaço</th>
                    <th className="px-6 py-4">Data / Horário</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReservations.map(res => (
                    <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{res.patente} {res.nomeGuerra}</span>
                          <span className="text-[11px] text-slate-400">{res.email || 'Sem email'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${res.espaco === 'Auditório' ? 'text-blue-600' : 'text-emerald-600'}`}>
                          {res.espaco}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{new Date(res.data).toLocaleDateString('pt-BR')}</span>
                          <span className="text-[11px] text-slate-400">{res.horaInicio} - {res.horaFim}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(res.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {res.status === 'PENDENTE' && (
                            <>
                              <button onClick={() => handleStatusUpdate(res.id, 'APROVADO')} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                                <i className="fa-solid fa-check"></i>
                              </button>
                              <button onClick={() => handleStatusUpdate(res.id, 'RECUSADO')} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            </>
                          )}
                          <button onClick={() => handleDeleteReservation(res.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded">
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'admins' && canManageAdmins && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-user-plus text-blue-600"></i>
                {isEditingAdmin ? 'Editar Administrador' : 'Novo Administrador'}
              </h3>
              
              {adminError && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-xs font-medium">{adminError}</div>}
              
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                  <input 
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={adminFormData.nome}
                    onChange={(e) => setAdminFormData({...adminFormData, nome: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail (Login)</label>
                  <input 
                    required
                    type="email"
                    disabled={isEditingAdmin}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    value={adminFormData.email}
                    onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{isEditingAdmin ? 'Nova Senha (opcional)' : 'Senha *'}</label>
                  <input 
                    required={!isEditingAdmin}
                    type="password"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={adminFormData.senha}
                    onChange={(e) => setAdminFormData({...adminFormData, senha: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nível de Acesso</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={adminFormData.nivelAcesso}
                    onChange={(e) => setAdminFormData({...adminFormData, nivelAcesso: e.target.value as AccessLevel})}
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Administrador Supervisor">Supervisor</option>
                  </select>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-slate-900 text-white py-2 rounded font-bold text-sm shadow-sm hover:bg-slate-800 transition">
                    {isEditingAdmin ? 'Atualizar' : 'Cadastrar'}
                  </button>
                  {isEditingAdmin && (
                    <button 
                      type="button" 
                      onClick={() => { setIsEditingAdmin(false); setAdminFormData({ nome: '', email: '', senha: '', nivelAcesso: 'Administrador' }); }}
                      className="bg-slate-100 text-slate-600 px-4 py-2 rounded font-bold text-sm"
                    >
                      X
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b">
                  <tr>
                    <th className="px-6 py-4">Administrador</th>
                    <th className="px-6 py-4">Nível</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admins.map(adm => (
                    <tr key={adm.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{adm.nome}</span>
                          <span className="text-[11px] text-slate-400">{adm.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${adm.nivelAcesso === 'Administrador Supervisor' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                          {adm.nivelAcesso === 'Administrador Supervisor' ? 'Supervisor' : 'Padrão'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => { setAdminFormData(adm); setIsEditingAdmin(true); }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteAdmin(adm.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="max-w-2xl bg-white p-8 rounded-xl border border-slate-200 shadow-lg mx-auto">
          <div className="mb-8 border-b pb-4">
            <h3 className="text-xl font-bold text-slate-900">Configurações do Sistema</h3>
            <p className="text-sm text-slate-500">Personalize a identidade institucional da BAMN.</p>
          </div>

          <div className="space-y-8">
            <section>
              <h4 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
                <i className="fa-solid fa-image text-blue-500"></i>
                Alterar Logo do Site
              </h4>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                  {(previewLogo || settings.logoUrl) ? (
                    <img src={previewLogo || settings.logoUrl!} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <i className="fa-solid fa-jet-fighter-up text-4xl text-slate-200"></i>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <p className="text-xs text-slate-500">
                    Formatos aceitos: <strong>PNG, JPG ou SVG</strong>.<br />
                    Tamanho máximo: <strong>2MB</strong>.
                  </p>
                  
                  <div className="flex gap-2">
                    <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded text-sm font-bold cursor-pointer transition">
                      Selecionar nova logo
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                    </label>
                    <button 
                      onClick={handleSaveConfig}
                      className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded text-sm font-bold shadow transition"
                    >
                      Salvar logo
                    </button>
                  </div>
                </div>
              </div>

              {configMessage.text && (
                <div className={`mt-4 p-3 rounded text-xs font-bold ${configMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <i className={`fa-solid ${configMessage.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'} mr-2`}></i>
                  {configMessage.text}
                </div>
              )}
            </section>

            <section className="pt-8 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Informações Adicionais</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded">
                  <p className="text-[10px] text-slate-400 uppercase">Última atualização</p>
                  <p className="text-xs font-bold text-slate-700">{new Date(settings.dataAtualizacao).toLocaleString('pt-BR')}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                  <p className="text-[10px] text-slate-400 uppercase">Atualizado por</p>
                  <p className="text-xs font-bold text-slate-700">{settings.atualizadoPor}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
