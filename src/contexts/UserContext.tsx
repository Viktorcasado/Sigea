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
  const [user, setUser] = useState<User | null>({
    id: 'admin-user-id',
    nome: 'Administrador do Sistema',
    email: 'admin@sigea.com',
    status: 'admin',
    perfil: 'admin',
    instituicao: 'IFAL',
    campus: 'Maceió'
  });
  const [loading, setLoading] = useState(false);

  const fetchCurrentProfile = async (supabaseUser: SupabaseUser) => {
    return user;
  };

  const refreshUser = async () => {
    // No-op in mock mode
  };

  useEffect(() => {
    // Auth listeners removed to disable login requirement
    setLoading(false);
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

  

  return (
    <UserContext.Provider value={{ 
      user, 
      login: async () => {}, 
      loginWithGoogle: async () => {}, 
      logout: async () => {}, 
      loading, 
      refreshUser 
    }}>
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
