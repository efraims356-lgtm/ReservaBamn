
export type Status = 'PENDENTE' | 'APROVADO' | 'RECUSADO';
export type Espaco = 'Auditório' | 'Sala de Reunião';
export type AccessLevel = 'Administrador' | 'Administrador Supervisor';
export type ThemeName = 'militar' | 'claro' | 'escuro' | 'verde' | 'profissional';

export interface Reservation {
  id: string;
  nomeGuerra: string;
  nomeCompleto: string;
  patente: string;
  email: string;
  telefone: string;
  espaco: Espaco;
  data: string;
  horaInicio: string;
  horaFim: string;
  finalidade: string;
  status: Status;
}

export interface AdminAccount {
  id: string;
  nome: string;
  email: string;
  senha: string;
  nivelAcesso: AccessLevel;
  criadoEm: string;
}

export interface SystemSettings {
  logoUrl: string | null;
  atualizadoPor: string;
  dataAtualizacao: string;
}

export interface User {
  email: string;
  isAdmin: boolean;
  nivelAcesso?: AccessLevel | 'Master';
}

export enum Rank {
  S2 = 'S2',
  S1 = 'S1',
  Cabo = 'Cabo',
  Sgt3 = '3º Sargento',
  Sgt2 = '2º Sargento',
  Sgt1 = '1º Sargento',
  Suboficial = 'Suboficial',
  Aspirante = 'Aspirante',
  Ten2 = '2º Tenente',
  Ten1 = '1º Tenente',
  Capitao = 'Capitão',
  Major = 'Major',
  TenCoronel = 'Tenente-Coronel',
  Coronel = 'Coronel',
  Brigadeiro = 'Brigadeiro'
}
