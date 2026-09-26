'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Search, Moon, Sun, Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MonogramLogo } from '@/components/brand/MonogramLogo';

export function Header() {
  const { user, openAuthModal, signOut } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const router = useRouter();

  // Synchronize state with current HTML class on mount (default to minimal white)
  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem('bookgenie_theme_v2');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      }
    } catch (_) {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('bookgenie_theme_v2', 'dark');
      } catch (_) {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('bookgenie_theme_v2', 'light');
      } catch (_) {}
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Create Studio', href: '/create' },
    { label: 'Showcase', href: '/#showcase' },
    { label: 'Pricing', href: '/#pricing' },
  ];

  return (
    <div className="sticky top-0 z-50 w-full transition-all bg-surface-container-lowest/95 dark:bg-[#121217]/95 backdrop-blur-md border-b border-surface-container-highest dark:border-white/10 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <header className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between transition-all">
        {/* Atelier Monogram Logo */}
        <Link href="/" className="flex items-center group select-none">
          <MonogramLogo />
        </Link>

        {/* Center Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-label-ui text-on-surface-variant dark:text-neutral-400">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-primary dark:hover:text-white transition-colors py-1 font-medium tracking-wide"
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
            className="p-2 text-on-surface-variant dark:text-neutral-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Search library"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-on-surface-variant dark:text-neutral-400 hover:text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
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
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-surface-container-highest dark:border-white/10 bg-surface-container-lowest dark:bg-[#1a1b22] text-xs font-label-ui text-on-surface dark:text-[#f1effa] hover:bg-surface-container-low transition-all shadow-xs"
              >
                <div className="w-6 h-6 rounded-full bg-secondary-container dark:bg-amber-950 text-secondary dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-surface-container-lowest dark:bg-[#1a1b22] border border-surface-container-highest dark:border-white/10 shadow-xl py-1.5 z-50">
                  <Link
                    href="/create"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-on-surface dark:text-[#f1effa] hover:bg-surface-container-low dark:hover:bg-white/5 font-medium"
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
                className="font-label-ui text-label-ui text-on-surface-variant dark:text-neutral-300 hover:text-on-surface dark:hover:text-white px-2 py-1.5 transition-colors cursor-pointer"
              >
                Sign in
              </button>

              {/* Atelier Start Creating Button with Gold Indicator */}
              <Link
                href="/create"
                className="inline-flex items-center gap-2 bg-primary dark:bg-white text-on-primary dark:text-black hover:bg-on-surface-variant dark:hover:bg-neutral-200 transition-colors px-4 py-2 rounded-full font-label-ui text-label-ui tracking-wide shadow-sm hover:shadow-[0_0_12px_rgba(252,186,100,0.35)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#fcba64]"></span>
                <span>Start Creating</span>
              </Link>
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
