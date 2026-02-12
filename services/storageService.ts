
import { Reservation, AdminAccount, SystemSettings } from '../types';

const RESERVATIONS_KEY = 'bamn_reservations';
const ADMINS_KEY = 'bamn_admins';
const SETTINGS_KEY = 'bamn_settings';

// Reservations Logic
export const getReservations = (): Reservation[] => {
  const data = localStorage.getItem(RESERVATIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveReservation = (reservation: Reservation): void => {
  const current = getReservations();
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify([...current, reservation]));
};

export const updateReservation = (updated: Reservation): void => {
  const current = getReservations();
  const index = current.findIndex(r => r.id === updated.id);
  if (index !== -1) {
    current[index] = updated;
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(current));
  }
};

export const deleteReservation = (id: string): void => {
  const current = getReservations();
  const filtered = current.filter(r => r.id !== id);
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(filtered));
};

export const checkConflict = (data: string, inicio: string, fim: string, espaco: string, excludeId?: string): boolean => {
  const reservations = getReservations().filter(r => r.status === 'APROVADO' && r.id !== excludeId);
  
  return reservations.some(r => {
    if (r.data !== data || r.espaco !== espaco) return false;
    const rStart = r.horaInicio;
    const rEnd = r.horaFim;
    return (inicio < rEnd) && (fim > rStart);
  });
};

// Admins Management Logic
export const getAdmins = (): AdminAccount[] => {
  const data = localStorage.getItem(ADMINS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAdmin = (admin: AdminAccount): { success: boolean; message?: string } => {
  const current = getAdmins();
  if (current.some(a => a.email.toLowerCase() === admin.email.toLowerCase())) {
    return { success: false, message: 'Email já cadastrado.' };
  }
  localStorage.setItem(ADMINS_KEY, JSON.stringify([...current, admin]));
  return { success: true };
};

export const updateAdmin = (updated: AdminAccount): void => {
  const current = getAdmins();
  const index = current.findIndex(a => a.id === updated.id);
  if (index !== -1) {
    current[index] = updated;
    localStorage.setItem(ADMINS_KEY, JSON.stringify(current));
  }
};

export const deleteAdmin = (id: string): void => {
  const current = getAdmins();
  const filtered = current.filter(a => a.id !== id);
  localStorage.setItem(ADMINS_KEY, JSON.stringify(filtered));
};

// System Settings Logic
export const getSettings = (): SystemSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : {
    logoUrl: null,
    atualizadoPor: 'Sistema',
    dataAtualizacao: new Date().toISOString()
  };
};

export const saveSettings = (settings: SystemSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
