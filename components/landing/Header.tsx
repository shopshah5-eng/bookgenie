'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Search, Moon, Sun, Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, openAuthModal, signOut } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('bookgenie_theme_v2') === 'dark';
      } catch {
        return false;
      }
    }
    return false;
  });
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('bookgenie_theme_v2', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('bookgenie_theme_v2', 'light');
      } catch {}
    }
  };

  const navLinks = [
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Showcase', href: '/examples' },
    { label: 'Studio', href: '/#studio' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
  ];

  return (
    <div className="sticky top-0 z-50 w-full transition-all editorial-glass-header">
      <header className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between transition-all">
        {/* Brand Wordmark with Gold Sparkle (Exact to Reference) */}
        <Link href="/" className="flex items-center gap-1.5 group select-none">
          <span className="text-amber-600 dark:text-amber-400 text-lg font-serif leading-none select-none">✦</span>
          <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#111111] dark:text-[#F5F5F5] leading-none">
            BookGenie
          </span>
        </Link>

        {/* Center Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-normal text-[#444444] dark:text-[#A0A0A0]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-colors py-1"
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right CTA / Search / Auth controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => router.push('/examples')}
            className="p-2 text-[#555555] dark:text-[#A0A0A0] hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Search library"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#555555] dark:text-[#A0A0A0] hover:text-[#111111] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle theme"
            title={mounted && isDark ? "Switch to white mode" : "Switch to dark mode"}
          >
            {mounted && isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#555555]" />
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E5E5E5] dark:border-[#2C2C2C] bg-white dark:bg-[#1A1A1A] text-xs sm:text-sm font-medium text-[#111111] dark:text-[#F5F5F5] hover:bg-[#F9F9F8] transition-all shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#F0EBE1] dark:bg-[#2A241E] text-[#8C5F2E] dark:text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2C2C2C] shadow-xl py-1.5 z-50">
                  <Link
                    href="/create"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-[#111111] dark:text-[#F5F5F5] hover:bg-[#F9F9F8] dark:hover:bg-[#252525] font-medium"
                  >
                    + Create New Book
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => openAuthModal('signin')}
                className="text-xs sm:text-[13px] font-medium text-[#222222] dark:text-[#D5D5D5] hover:text-[#111111] dark:hover:text-white px-2 py-1.5 transition-colors cursor-pointer"
              >
                Sign in
              </button>

              {/* Exact reference pill button: Create a book -> */}
              <button
                onClick={() => openAuthModal('signup', '/create')}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-semibold text-white bg-[#111111] hover:bg-black dark:bg-white dark:text-black dark:hover:bg-[#EAEAEA] transition-all active:scale-[0.98] shadow-xs cursor-pointer"
              >
                <span>Create a book</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile action bar */}
        <div className="flex sm:hidden items-center gap-1.5">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#555555] dark:text-[#A0A0A0]"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#555555]" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#111111] dark:text-[#F5F5F5]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-6 py-5 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-xl border-b border-[#EAEAEA] dark:border-[#262626] space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#222222] dark:text-[#E0E0E0] py-1.5 hover:text-black dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#EAEAEA] dark:border-[#262626] flex flex-col gap-2.5">
            {user ? (
              <>
                <Button
                  variant="primary"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/create');
                  }}
                  className="w-full"
                >
                  Create New Book
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full text-red-600"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signin');
                  }}
                  className="w-full font-medium"
                >
                  Sign in
                </Button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup', '/create');
                  }}
                  className="w-full py-3 rounded-full text-center text-sm font-semibold text-white bg-[#111111] dark:bg-white dark:text-black shadow-sm"
                >
                  Create a book →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
