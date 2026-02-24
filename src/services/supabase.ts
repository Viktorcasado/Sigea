import { supabase, SUPABASE_PUBLISHABLE_KEY } from '@/src/integrations/supabase/client';

// Mantendo a compatibilidade com o restante do código
const supabaseError = !SUPABASE_PUBLISHABLE_KEY ? 'Configuração do Supabase ausente.' : null;

export { supabase, supabaseError };