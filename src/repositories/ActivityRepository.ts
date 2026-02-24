import { supabase } from '@/src/services/supabase';
import { Activity } from '@/src/types';

export const ActivityRepository = {
  async listByEvent(eventId: number): Promise<Activity[]> {
    const { data, error } = await supabase.from('atividades').select('*').eq('event_id', eventId);
    if (error) throw new Error(error.message);
    return data || [];
  },

  async create(activityData: Omit<Activity, 'id'>): Promise<Activity> {
    const { data, error } = await supabase.from('atividades').insert(activityData).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async update(id: number, activityData: Partial<Omit<Activity, 'id'>>): Promise<Activity> {
    const { data, error } = await supabase.from('atividades').update(activityData).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from('atividades').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
