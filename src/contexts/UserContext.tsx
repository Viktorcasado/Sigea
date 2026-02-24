import { createContext, useState, useContext, ReactNode, FC, useEffect, useCallback } from 'react';
import { User } from '@/src/types';
import { supabase } from '@/src/services/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    if (!supabase) return null;
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('[UserContext] Erro ao buscar perfil:', error);
        return null;
      }

      if (!profile) {
        console.warn('[UserContext] Perfil não encontrado para o usuário:', supabaseUser.id);
        return null;
      }
      
      return {
        id: profile.id,
        email: supabaseUser.email,
        nome: profile.full_name || 'Usuário',
        campus: profile.campus,
        avatar_url: profile.avatar_url,
        perfil: profile.user_type || 'comunidade_externa',
        status: profile.user_type === 'gestor' ? 'gestor' : 'ativo_comunidade',
        matricula: profile.registration_number
      } as User;
    } catch (error) {
      console.error('[UserContext] Erro inesperado ao buscar perfil:', error);
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        const profile = await fetchCurrentProfile(supabaseUser);
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("[UserContext] Erro ao atualizar usuário:", err);
    }
  }, [fetchCurrentProfile]);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (!supabase) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        // 1. Tenta pegar a sessão atual imediatamente
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          const profile = await fetchCurrentProfile(session.user);
          setUser(profile);
        }
      } catch (err) {
        console.error("[UserContext] Erro na inicialização:", err);
      } finally {
        if (mounted) setLoading(false);
      }

      // 2. Configura o listener para mudanças futuras
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(`[UserContext] Auth event: ${event}`);
        
        if (session?.user) {
          const profile = await fetchCurrentProfile(session.user);
          if (mounted) setUser(profile);
        } else {
          if (mounted) setUser(null);
        }
        
        if (mounted) setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    const cleanup = initAuth();

    // Timeout de segurança (fail-safe)
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("[UserContext] Loading timeout atingido. Forçando encerramento.");
        setLoading(false);
      }
    }, 6000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      cleanup.then(unsubscribe => unsubscribe?.());
    };
  }, [fetchCurrentProfile]);

  const login = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase client não inicializado.');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // O onAuthStateChange cuidará de atualizar o estado do usuário
  };

  const loginWithGoogle = async () => {
    if (!supabase) throw new Error('Supabase client não inicializado.');
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  const logout = async () => {
    if (!supabase) throw new Error('Supabase client não inicializado.');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, loginWithGoogle, logout, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};