import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface Profile {
  id: string;
  role: 'user' | 'admin';
  display_name: string | null;
  avatar_url: string | null;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  bootstrapAdmin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, display_name, avatar_url')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as Profile | null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setAuthError(null);

    if (!session?.user) {
      setProfile(null);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    loadProfile(session.user.id)
      .then((nextProfile) => {
        if (!cancelled) setProfile(nextProfile);
      })
      .catch(() => {
        if (!cancelled) setAuthError('Не удалось загрузить профиль. Попробуйте обновить страницу.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    profile,
    loading,
    authError,
    async signIn(email, password) {
      setAuthError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError('Не удалось войти. Проверьте email и пароль.');
        return false;
      }
      return true;
    },
    async signUp(email, password) {
      setAuthError(null);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setAuthError('Не удалось создать аккаунт. Проверьте данные и попробуйте снова.');
        return false;
      }
      return true;
    },
    async signOut() {
      await supabase.auth.signOut();
      setProfile(null);
    },
    async bootstrapAdmin() {
      setAuthError(null);
      const { data, error } = await supabase.rpc('bootstrap_first_admin');
      if (error) {
        setAuthError('Не удалось назначить администратора. Возможно, он уже назначен.');
        return false;
      }
      if (data === true && session?.user) {
        setProfile(await loadProfile(session.user.id));
        return true;
      }
      setAuthError('Первый администратор уже назначен.');
      return false;
    },
  }), [authError, loading, profile, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
