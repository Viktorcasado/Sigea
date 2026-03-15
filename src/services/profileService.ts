import { supabase } from './supabase';
import { User } from '@/src/types';

export const updateProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }

  return data as User;
};
