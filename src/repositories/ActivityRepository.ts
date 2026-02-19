"use client";

import { Activity } from '@/src/types';
import { supabase } from '@/src/integrations/supabase/client';

export const ActivityRepository = {
  async listByEvent(eventId: string): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('event_id', eventId)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createActivity(activity: Omit<Activity, 'id' | 'created_at'>): Promise<Activity> {
    const { data, error } = await supabase
      .from('activities')
      .insert(activity)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity> {
    const { data, error } = await supabase
      .from('activities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteActivity(id: string): Promise<void> {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};