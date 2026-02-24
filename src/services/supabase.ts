import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;
let supabaseError: string | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  supabaseError = 'As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram encontradas. Verifique a configuração de Secrets no AI Studio.';
  console.error(supabaseError);
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error: any) {
    supabaseError = `Falha ao inicializar o Supabase: ${error.message}`;
    console.error(supabaseError);
  }
}

export { supabase, supabaseError };
