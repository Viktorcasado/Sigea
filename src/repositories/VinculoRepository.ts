"use client";

import { supabase } from '@/src/integrations/supabase/client';

export const VinculoRepository = {
  async listPendentes() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_type', 'servidor')
      .eq('is_organizer', false);

    if (error) throw error;
    return data;
  },

  async aprovarVinculo(profileId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ is_organizer: true })
      .eq('id', profileId);

    if (error) throw error;
  },

  async rejeitarVinculo(profileId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ user_type: 'comunidade_externa' })
      .eq('id', profileId);

    if (error) throw error;
  }
};