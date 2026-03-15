import { Presenca } from '@/src/types';
import { ActivityRepository } from './ActivityRepository';

const mockPresencas: Presenca[] = [];

export const PresencaRepository = {
  async listByAtividade(activityId: number): Promise<Presenca[]> {
    return mockPresencas.filter(p => p.activity_id === activityId);
  },

  async setPresenca(presencaData: Omit<Presenca, 'id' | 'created_at'>[]): Promise<void> {
    presencaData.forEach(p => {
      const index = mockPresencas.findIndex(mp => mp.activity_id === p.activity_id && mp.user_id === p.user_id);
      if (index !== -1) {
        mockPresencas[index] = { ...mockPresencas[index], ...p };
      } else {
        mockPresencas.push({
          ...p,
          id: Math.floor(Math.random() * 1000),
          created_at: new Date().toISOString()
        } as Presenca);
      }
    });
  },

  async listByUser(userId: string): Promise<Presenca[]> {
    return mockPresencas.filter(p => p.user_id === userId);
  },

  async calcularCargaHoraria(eventId: number, userId: string): Promise<number> {
    const presencas = mockPresencas.filter(p => p.user_id === userId && p.presente === true);
    const atividadesDoEvento = await ActivityRepository.listByEvent(eventId);
    
    let totalMinutos = 0;
    presencas.forEach(presenca => {
      const atividade = atividadesDoEvento.find(a => a.id === presenca.activity_id);
      if (atividade && atividade.carga_horaria_minutos) {
        totalMinutos += atividade.carga_horaria_minutos;
      }
    });
    return totalMinutos;
  },
};
