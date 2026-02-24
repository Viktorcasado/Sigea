import { supabase } from './supabase';
import { Event } from '@/src/types';

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('data_inicio', { ascending: false });

  if (error) {
    console.error('Erro ao buscar eventos:', error);
    throw error;
  }

  return data as Event[];
};
