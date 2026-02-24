export interface User {
  id: string;
  email?: string;
  nome: string;
  telefone?: string;
  status: 'ativo_comunidade' | 'ativo_vinculado' | 'gestor' | 'admin';
  perfil: 'aluno' | 'servidor' | 'comunidade_externa' | 'gestor' | 'admin';
  cpf?: string;
  matricula?: string;
  siape?: string;
  instituicao?: string;
  campus?: string;
}

export interface Event {
  id: number;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  local: string;
  banner_url?: string;
  status?: 'rascunho' | 'publicado' | 'encerrado';
  modalidade?: 'Presencial' | 'Online' | 'Híbrido';
  vagas?: number;
  instituicao?: string;
  campus?: string;
}

export interface Inscription {
  id: number;
  user_id: string;
  event_id: number;
  created_at: string;
}

export type NotificationType = 'evento' | 'aviso' | 'sistema';

export interface Notification {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: NotificationType;
  lida: boolean;
  created_at: string;
  referenciaId?: string;
}

export interface Certificate {
  id: string;
  evento_titulo: string;
  nome_participante: string;
  data_emissao: string;
  codigo_validacao: string;
  evento: Event;
}

export type ActivityType = 'palestra' | 'minicurso' | 'mesa_redonda' | 'outra';

export interface Activity {
  id: number;
  event_id: number;
  titulo: string;
  descricao: string;
  tipo: ActivityType;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  local: string;
  instrutor?: string;
}

export type VinculoStatus = 'pendente' | 'aprovado' | 'rejeitado';

export interface Vinculo {
  id: number;
  user_id: string;
  instituicao: string;
  campus: string;
  matricula?: string;
  siape?: string;
  status: VinculoStatus;
  created_at: string;
}

// Tipos que estavam faltando e causando erros
export type UserProfile = 'aluno' | 'servidor' | 'comunidade_externa' | 'gestor' | 'admin';
export type UserStatus = 'ativo_comunidade' | 'ativo_vinculado' | 'gestor' | 'admin';
export type EventInstitution = string;
export type EventModality = 'Presencial' | 'Online' | 'Híbrido';
export type Inscricao = Inscription;
export type Presenca = any; // Definição de placeholder, pode ser refinada
