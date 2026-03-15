import { Inscricao } from '@/src/types';

const mockInscricoes: Inscricao[] = [];

export const InscricaoRepository = {
  async getStatus(eventId: number, userId: string): Promise<string | null> {
    const inscricao = mockInscricoes.find(i => i.event_id === eventId && i.user_id === userId);
    return inscricao ? 'confirmada' : null;
  },

  async listByEvento(eventId: number): Promise<Inscricao[]> {
    return mockInscricoes.filter(i => i.event_id === eventId);
  },

  async listByUser(userId: string): Promise<Inscricao[]> {
    return mockInscricoes.filter(i => i.user_id === userId);
  },

  async create(inscricaoData: Omit<Inscricao, 'id' | 'created_at'>): Promise<Inscricao> {
    const newInscricao: Inscricao = {
      ...inscricaoData,
      id: Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString()
    };
    mockInscricoes.push(newInscricao);
    return newInscricao;
  },

  async cancel(eventId: number, userId: string): Promise<void> {
    const index = mockInscricoes.findIndex(i => i.event_id === eventId && i.user_id === userId);
    if (index !== -1) mockInscricoes.splice(index, 1);
  },

  async countByEvento(eventId: number): Promise<number> {
    return mockInscricoes.filter(i => i.event_id === eventId).length;
  },
};
