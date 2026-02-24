import { supabase } from '@/src/services/supabase';
import { Presenca } from '@/src/types';
import { ActivityRepository } from './ActivityRepository';

export const PresencaRepository = {
  async listByAtividade(activityId: number): Promise<Presenca[]> {
    const { data, error } = await supabase.from('presencas').select('*').eq('activity_id', activityId);
    if (error) throw new Error(error.message);
    return data || [];
  },

  async setPresenca(presencaData: Omit<Presenca, 'id' | 'created_at'>[]): Promise<void> {
    const { error } = await supabase.from('presencas').upsert(presencaData, { onConflict: 'activity_id,user_id' });
    if (error) throw new Error(error.message);
  },

  async listByUser(userId: string): Promise<Presenca[]> {
    const { data, error } = await supabase.from('presencas').select('*').eq('user_id', userId);
    if (error) throw new Error(error.message);
    return data || [];
  },

  async calcularCargaHoraria(eventId: number, userId: string): Promise<number> {
    const { data: presencas, error: presencasError } = await supabase
      .from('presencas')
      .select('*')
      .eq('user_id', userId)
      .eq('presente', true);

    if (presencasError) throw new Error(presencasError.message);
    if (!presencas) return 0;

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
