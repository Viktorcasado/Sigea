import { createContext, useState, useContext, ReactNode, FC, useEffect } from 'react';
import { User } from '@/src/types';
import { supabase, supabaseError } from '@/src/services/supabase';
import { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';

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

  const fetchCurrentProfile = async (supabaseUser: SupabaseUser) => {
    if (!supabase) return null;
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }
      return profile as User;
    } catch (error) {
      console.error('Erro inesperado ao buscar perfil:', error);
      return null;
    }
  };

  const refreshUser = async () => {
    if (!supabase) return;
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (supabaseUser) {
      const profile = await fetchCurrentProfile(supabaseUser);
      setUser(profile);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const handleAuthChange = async (event: AuthChangeEvent, session: Session | null) => {
      const supabaseUser = session?.user ?? null;
      if (supabaseUser) {
        const profile = await fetchCurrentProfile(supabaseUser);
        setUser(profile);
        if (['SIGNED_IN', 'TOKEN_REFRESHED'].includes(event)) {
          await upsertProfile(supabaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange('INITIAL_SESSION', session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase client não inicializado.');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const loginWithGoogle = async () => {
    if (!supabase) throw new Error('Supabase client não inicializado.');
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw error;
  };

  const logout = async () => {
    if (!supabase) throw new Error('Supabase client não inicializado.');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  

  const upsertProfile = async (supabaseUser: SupabaseUser) => {
    if (!supabaseUser || !supabase) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: supabaseUser.id,
        email: supabaseUser.email,
        nome: supabaseUser.user_metadata.full_name || supabaseUser.email,
        status: 'ativo_comunidade',
      }, { onConflict: 'id' });

    if (error) {
      console.error("Erro no upsert do perfil: ", error);
    }
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
