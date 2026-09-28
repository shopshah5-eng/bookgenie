'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

type AuthView = 'signin' | 'signup' | 'forgot_password';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authView: AuthView;
  openAuthModal: (view?: AuthView, redirectAfter?: string) => void;
  closeAuthModal: () => void;
  setAuthView: (view: AuthView) => void;
  signOut: () => Promise<void>;
  updateProfileName: (newName: string) => Promise<boolean>;
  redirectUrl: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('signup');
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      // Public/demo pages are allowed to render without auth configuration.
      // Authenticated actions will show a configuration error in the modal instead
      // of crashing the whole application during hydration.
      setIsLoading(false);
      return;
    }

    // Check if URL has an auth code (fallback if redirected directly to homepage)
    if (typeof window !== 'undefined' && window.location.search.includes('code=')) {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
          if (!error && data?.user) {
            setUser(data.user);
            // Clean up the URL query params without reloading
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        });
      }
    }

    // Check local session or Supabase user
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.warn('Supabase auth init notice:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Subscribe to real-time auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const openAuthModal = (view: AuthView = 'signup', redirectAfter?: string) => {
    setAuthView(view);
    if (redirectAfter) setRedirectUrl(redirectAfter);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      if (supabase) await supabase.auth.signOut();
    } catch {
      // Ignore network errors
    }
    setUser(null);
  };

  const updateProfileName = async (newName: string): Promise<boolean> => {
    const trimmed = newName.trim();
    if (!trimmed) return false;

    try {
      // 1. Try server API first for robust privileges
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.user) {
          setUser(json.user);
        } else if (user) {
          setUser({
            ...user,
            user_metadata: {
              ...user.user_metadata,
              full_name: trimmed,
              name: trimmed,
            },
          });
        }
        return true;
      }
    } catch (apiErr) {
      console.warn('API profile update error, falling back to client SDK:', apiErr);
    }

    // Fallback directly via client Supabase
    try {
      const supabase = createClient();
      if (!supabase) return false;
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: trimmed, name: trimmed },
      });
      if (!error && data?.user) {
        setUser(data.user);
        return true;
      }
    } catch (sdkErr) {
      console.error('Client SDK profile update error:', sdkErr);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        authView,
        openAuthModal,
        closeAuthModal,
        setAuthView,
        signOut,
        updateProfileName,
        redirectUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
