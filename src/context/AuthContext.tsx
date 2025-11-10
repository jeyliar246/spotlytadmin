import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  error: string | null;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ADMIN_ROLES = ['super_admin', 'admin'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    setIsLoading(true);
    try {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        await evaluateAdminRole(data.session.user);
      } else {
        setIsAdmin(false);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const evaluateAdminRole = async (currentUser: User) => {
    const appRole = currentUser.app_metadata?.role as string | undefined;
    if (appRole && ADMIN_ROLES.includes(appRole)) {
      setIsAdmin(true);
      return;
    }

    const { data, error: profileError } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (profileError) {
      setError(profileError.message);
      setIsAdmin(false);
      return;
    }

    const role = data?.role;
    setIsAdmin(role ? ADMIN_ROLES.includes(role) : false);
  };

  useEffect(() => {
    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        evaluateAdminRole(newSession.user);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithMagicLink = async (email: string) => {
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (signInError) {
      throw signInError;
    }
  };

  const signOut = async () => {
    setError(null);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      throw signOutError;
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, user, isLoading, isAdmin, error, signInWithMagicLink, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
