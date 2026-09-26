'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/components/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, BookOpen } from 'lucide-react';
import { MonogramLogo } from '@/components/brand/MonogramLogo';
import { useRouter } from 'next/navigation';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authView, setAuthView, redirectUrl } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();

      if (authView === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.user) {
          closeAuthModal();
          router.push(redirectUrl || '/create');
        } else {
          setSuccessMessage('Please check your email for the confirmation link!');
        }
      } else if (authView === 'signin') {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        if (data.user) {
          closeAuthModal();
          router.push(redirectUrl || '/create');
        }
      } else if (authView === 'forgot_password') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/create`,
        });
        if (resetError) throw resetError;
        setSuccessMessage('Password reset link sent to your email.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(
            redirectUrl || '/create'
          )}`,
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err: any) {
      setError(err.message || 'Could not connect with Google.');
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal} className="max-w-[440px]">
      <div className="flex flex-col items-center text-center">
        {/* BookGenie Atelier Monogram */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary-container/20 dark:bg-white/5 text-secondary dark:text-secondary-fixed border border-secondary/20 mb-3 shadow-xs">
          <MonogramLogo size={28} iconOnly />
        </div>

        <div className="font-headline-sm text-xl text-on-surface dark:text-white tracking-tight">
          BookGenie Atelier
        </div>
        <p className="font-label-caps text-[10px] uppercase tracking-widest text-outline mb-3">
          Autonomous Craft & Architecture
        </p>

        <h2 className="font-headline-sm text-2xl text-on-surface dark:text-white tracking-tight mb-1.5">
          {authView === 'signup'
            ? 'Create your account'
            : authView === 'signin'
            ? 'Welcome back'
            : 'Reset your password'}
        </h2>
        <p className="font-body-md text-xs sm:text-sm text-on-surface-variant dark:text-[#c4c7c5] mb-6">
          {authView === 'signup'
            ? 'Start turning your ideas into masterwork folios.'
            : authView === 'signin'
            ? 'Sign in to access your atelier workbench and library.'
            : 'Enter your email address to receive a secure reset link.'}
        </p>

        {error && (
          <div className="w-full mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 text-left font-medium">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="w-full mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 text-left font-medium">
            {successMessage}
          </div>
        )}

        {/* Google OAuth Button */}
        {authView !== 'forgot_password' && (
          <>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container text-sm font-semibold text-on-surface dark:text-white transition-all shadow-xs active:scale-[0.98] disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="w-full flex items-center my-4">
              <div className="flex-1 h-px bg-outline-variant/30" />
              <span className="px-3 text-xs text-outline uppercase tracking-wider font-label-caps">
                or
              </span>
              <div className="flex-1 h-px bg-outline-variant/30" />
            </div>
          </>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="w-full space-y-3.5 text-left">
          {authView === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#1A1612] mb-1.5">
                What can we call you?
              </label>
              <Input
                type="text"
                placeholder="Taj"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<UserIcon className="w-4 h-4" />}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1A1612] mb-1.5">
              Email address
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />
          </div>

          {authView !== 'forgot_password' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#1A1612]">
                  Password
                </label>
                {authView === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setAuthView('forgot_password')}
                    className="text-xs text-[#9A6F3C] hover:text-[#845D30] font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E968E] hover:text-[#1A1612]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="lg">
            {authView === 'signup'
              ? 'Create account →'
              : authView === 'signin'
              ? 'Sign in →'
              : 'Send reset link →'}
          </Button>
        </form>

        {authView === 'signup' && (
          <p className="mt-4 text-[11px] text-[#9E968E] leading-relaxed">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="underline hover:text-[#1A1612]">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline hover:text-[#1A1612]">
              Privacy Policy
            </a>
            .
          </p>
        )}

        {/* View Toggle Footer */}
        <div className="mt-5 pt-4 border-t border-[#EFECE6] w-full text-center text-xs text-[#6B635B]">
          {authView === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthView('signin')}
                className="font-semibold text-[#9A6F3C] hover:text-[#845D30]"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthView('signup')}
                className="font-semibold text-[#9A6F3C] hover:text-[#845D30]"
              >
                Create account
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
