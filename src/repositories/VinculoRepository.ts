import { supabase } from '@/src/services/supabase';
import { Vinculo, VinculoStatus } from '@/src/types';

export const VinculoRepository = {
  async listByStatus(status: VinculoStatus): Promise<Vinculo[]> {
    const { data, error } = await supabase.from('vinculos').select('*').eq('status', status);
    if (error) throw new Error(error.message);
    return data || [];
  },

  async updateStatus(vinculoId: number, status: VinculoStatus): Promise<Vinculo> {
    const { data, error } = await supabase
      .from('vinculos')
      .update({ status })
      .eq('id', vinculoId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async create(vinculoData: Omit<Vinculo, 'id' | 'created_at'>): Promise<Vinculo> {
    const { data, error } = await supabase.from('vinculos').insert(vinculoData).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
};
