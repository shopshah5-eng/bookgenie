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
    // Check local session or Supabase user
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
        } else {
          // Check local simulated session for dev testing
          const stored = localStorage.getItem('bg_demo_user');
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch {
              localStorage.removeItem('bg_demo_user');
            }
          }
        }
      } catch (err) {
        console.warn('Supabase auth init notice:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
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
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors
    }
    localStorage.removeItem('bg_demo_user');
    setUser(null);
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
