import { supabase } from '@/src/services/supabase';
import { Event } from '@/src/types';

export const EventRepository = {
  async listAll(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.id,
      titulo: item.title,
      descricao: item.description,
      data_inicio: item.date,
      data_fim: item.date, // Ajustar se houver campo de fim
      local: item.location,
      status: 'publicado', // Mapear conforme lógica de negócio
      modalidade: 'Presencial', // Mapear conforme lógica de negócio
      campus: item.campus,
      instituicao: 'IFAL', // Valor padrão ou vindo do banco
      vagas: 0
    }));
  },

  async findById(id: string | number): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    
    return {
      id: data.id,
      titulo: data.title,
      descricao: data.description,
      data_inicio: data.date,
      data_fim: data.date,
      local: data.location,
      status: 'publicado',
      modalidade: 'Presencial',
      campus: data.campus,
      instituicao: 'IFAL',
      vagas: 0
    };
  },

  async listByIds(ids: string[]): Promise<Event[]> {
    if (ids.length === 0) return [];
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .in('id', ids);
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.id,
      titulo: item.title,
      descricao: item.description,
      data_inicio: item.date,
      data_fim: item.date,
      local: item.location,
      status: 'publicado',
      modalidade: 'Presencial',
      campus: item.campus,
      instituicao: 'IFAL',
      vagas: 0
    }));
  }
};