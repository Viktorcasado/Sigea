import { supabase } from './supabase';

export const checkInscription = async (userId: string, eventId: number): Promise<boolean> => {
  const { data, error } = await supabase
    .from('inscriptions')
    .select('id')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Erro ao verificar inscrição:', error);
    throw error;
  }

  return !!data;
};

export const createInscription = async (userId: string, eventId: number) => {
  const { error } = await supabase
    .from('inscriptions')
    .insert({ user_id: userId, event_id: eventId });

  if (error) {
    console.error('Erro ao criar inscrição:', error);
    throw error;
  }
};

export const deleteInscription = async (userId: string, eventId: number) => {
  const { error } = await supabase
    .from('inscriptions')
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId);

  if (error) {
    console.error('Erro ao cancelar inscrição:', error);
    throw error;
  }
};
