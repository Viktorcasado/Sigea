import { supabase } from '@/src/services/supabase';
import { Event } from '@/src/types';

export const EventRepository = {
  async listAll(): Promise<Event[]> {
    const { data, error } = await supabase.from('eventos').select('*');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async findById(id: number): Promise<Event | null> {
    const { data, error } = await supabase.from('eventos').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
  },

  async create(eventData: Omit<Event, 'id'>): Promise<Event> {
    const { data, error } = await supabase.from('eventos').insert(eventData).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async update(id: number, eventData: Partial<Omit<Event, 'id'>>): Promise<Event> {
    const { data, error } = await supabase.from('eventos').update(eventData).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async listByIds(ids: number[]): Promise<Event[]> {
    if (ids.length === 0) return [];
    const { data, error } = await supabase.from('eventos').select('*').in('id', ids);
    if (error) throw new Error(error.message);
    return data || [];
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from('eventos').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
