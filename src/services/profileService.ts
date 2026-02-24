import { supabase } from './supabase';
import { User } from '@/src/types';

export const updateProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  // Mapeamento de campos do App para colunas do Supabase
  const supabaseUpdates: any = {};
  
  if (updates.nome) supabaseUpdates.full_name = updates.nome;
  if (updates.campus) supabaseUpdates.campus = updates.campus;
  if (updates.avatar_url) supabaseUpdates.avatar_url = updates.avatar_url;
  if (updates.perfil) supabaseUpdates.user_type = updates.perfil;
  if (updates.matricula) supabaseUpdates.registration_number = updates.matricula;
  
  // Nota: Campos como 'telefone', 'cpf', 'siape', 'instituicao' podem precisar de colunas extras 
  // na tabela 'profiles' se você desejar persisti-los. Por enquanto, mapeamos os existentes.

  const { data, error } = await supabase
    .from('profiles')
    .update(supabaseUpdates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }

  // Retorna o objeto mapeado de volta para o tipo User do App
  return {
    id: data.id,
    nome: data.full_name,
    campus: data.campus,
    avatar_url: data.avatar_url,
    perfil: data.user_type,
    matricula: data.registration_number,
    status: data.user_type === 'gestor' ? 'gestor' : 'ativo_comunidade'
  } as User;
};