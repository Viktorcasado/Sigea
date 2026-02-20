"use client";

import { createContext, useState, useContext, ReactNode, FC, useEffect } from 'react';
import { User, UserStatus } from '@/src/types';
import { supabase } from '@/src/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface UserContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata: any) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const deriveStatus = (userType: string | null, isOrganizer: boolean): UserStatus => {
    if (isOrganizer) return 'gestor';
    if (userType === 'aluno' || userType === 'servidor') return 'ativo_vinculado';
    return 'ativo_comunidade';
  };

  const fetchProfile = async (supabaseUser: SupabaseUser | null) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();
      
      if (profile) {
        setUser({
          id: profile.id,
          nome: profile.full_name || 'Usuário',
          email: supabaseUser.email || '',
          perfil: profile.user_type || 'comunidade_externa',
          status: deriveStatus(profile.user_type, profile.is_organizer || false),
          is_organizer: profile.is_organizer || false,
          campus: profile.campus || '',
          matricula: profile.registration_number || '',
          avatar_url: profile.avatar_url || ''
        } as User);
      } else {
        // Fallback para usuário sem perfil no banco ainda
        setUser({
          id: supabaseUser.id,
          nome: supabaseUser.user_metadata.full_name || 'Usuário',
          email: supabaseUser.email || '',
          perfil: 'comunidade_externa',
          status: 'ativo_comunidade',
          is_organizer: false,
          avatar_url: supabaseUser.user_metadata.avatar_url || ''
        } as User);
      }
    } catch (err) {
      console.error("[UserContext] Erro no fetchProfile:", err);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(initialSession);
          if (initialSession?.user) {
            await fetchProfile(initialSession.user);
          }
        }
      } catch (error) {
        console.error("[UserContext] Erro ao inicializar auth:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`[UserContext] Evento Auth: ${event}`);
      if (mounted) {
        setSession(currentSession);
        if (currentSession?.user) {
          await fetchProfile(currentSession.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    if (error) throw error;
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    const profileUpdates: any = {};
    if (updates.nome !== undefined) profileUpdates.full_name = updates.nome;
    if (updates.campus !== undefined) profileUpdates.campus = updates.campus;
    if (updates.matricula !== undefined) profileUpdates.registration_number = updates.matricula;
    if (updates.avatar_url !== undefined) profileUpdates.avatar_url = updates.avatar_url;
    if (updates.perfil !== undefined) profileUpdates.user_type = updates.perfil;
    if (updates.is_organizer !== undefined) profileUpdates.is_organizer = updates.is_organizer;

    const { error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', user.id);
    
    if (error) throw error;
    
    const newUserType = updates.perfil !== undefined ? updates.perfil : user.perfil;
    const newIsOrganizer = updates.is_organizer !== undefined ? updates.is_organizer : user.is_organizer;
    
    setUser(prev => prev ? { 
      ...prev, 
      ...updates,
      status: deriveStatus(newUserType, newIsOrganizer)
    } : null);
  };

  return (
    <UserContext.Provider value={{ user, session, login, signUp, loginWithGoogle, logout, updateProfile, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  return context;
};