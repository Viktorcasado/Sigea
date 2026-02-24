import { supabase } from '@/src/services/supabase';
import { Inscricao } from '@/src/types';

export const InscricaoRepository = {
  async getStatus(eventId: number, userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('inscricoes')
      .select('status')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single();
    if (error) return null;
    return data?.status || null;
  },

  async listByEvento(eventId: number): Promise<Inscricao[]> {
    const { data, error } = await supabase.from('inscricoes').select('*').eq('event_id', eventId);
    if (error) throw new Error(error.message);
    return data || [];
  },

  async listByUser(userId: string): Promise<Inscricao[]> {
    const { data, error } = await supabase.from('inscricoes').select('*').eq('user_id', userId);
    if (error) throw new Error(error.message);
    return data || [];
  },

  async create(inscricaoData: Omit<Inscricao, 'id' | 'created_at'>): Promise<Inscricao> {
    const { data, error } = await supabase.from('inscricoes').insert(inscricaoData).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async cancel(eventId: number, userId: string): Promise<void> {
    const { error } = await supabase
      .from('inscricoes')
      .update({ status: 'cancelada' })
      .eq('event_id', eventId)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  },

  async countByEvento(eventId: number): Promise<number> {
    const { count, error } = await supabase
      .from('inscricoes')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('status', 'confirmada');
    if (error) throw new Error(error.message);
    return count || 0;
  },
};
