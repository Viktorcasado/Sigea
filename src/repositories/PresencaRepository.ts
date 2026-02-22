"use client";

import { supabase } from '@/src/integrations/supabase/client';

export const PresencaRepository = {
  async listByAtividade(activityId: string) {
    const { data, error } = await supabase
      .from('activity_registrations')
      .select('*, profiles(full_name)')
      .eq('activity_id', activityId);

    if (error) throw error;
    return data;
  },

  async setPresenca(activityId: string, userId: string, attended: boolean): Promise<void> {
    const { error } = await supabase
      .from('activity_registrations')
      .upsert({
        activity_id: activityId,
        user_id: userId,
        attended: attended,
      }, { onConflict: 'activity_id,user_id' });

    if (error) throw error;
  },

  async listByUser(userId: string) {
    const { data, error } = await supabase
      .from('activity_registrations')
      .select('*, activities(*)')
      .eq('user_id', userId)
      .eq('attended', true);

    if (error) throw error;
    return data;
  },

  async calcularCargaHorariaTotal(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('activity_registrations')
      .select('activities(hours)')
      .eq('user_id', userId)
      .eq('attended', true);

    if (error) return 0;
    
    return data.reduce((acc, curr: any) => {
      return acc + (curr.activities?.hours || 0);
    }, 0);
  },
};