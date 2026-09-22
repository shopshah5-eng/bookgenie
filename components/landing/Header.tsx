'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { BookOpen, Moon, Sun, Menu, X, ArrowRight, LogOut, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, openAuthModal, signOut } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navLinks = [
    { label: 'Create', href: '/create' },
    { label: 'Library', href: '/examples' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
  ];

  return (
    <div className="sticky top-0 z-50 w-full px-3 sm:px-6 pt-3 sm:pt-5 pb-2 transition-all">
      <header className="max-w-6xl mx-auto rounded-2xl editorial-glass-header shadow-[0_4px_20px_-4px_rgba(24,21,17,0.06)] px-4 sm:px-6 h-16 sm:h-17 flex items-center justify-between transition-all">
        {/* Brand Wordmark & Tiny Open Book Icon */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#8C5F2E] text-white transition-transform group-hover:scale-105 shadow-xs">
            <BookOpen className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-serif font-bold tracking-tight text-[#181511] dark:text-[#F5F2EB]">
              BookGenie
            </span>
            <span className="hidden md:inline-block text-[10px] font-sans uppercase tracking-widest text-[#A47A45] font-semibold">
              Studio
            </span>
          </div>
        </Link>

        {/* Desktop Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs lg:text-sm font-medium text-[#746B60] dark:text-[#A8A199]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-[#181511] dark:hover:text-[#F5F2EB] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#A47A45] after:transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA / Auth controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#746B60] hover:text-[#181511] hover:bg-[#F1ECE2]/60 dark:hover:bg-[#1C1917] transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[rgba(24,21,17,0.08)] bg-white text-xs sm:text-sm font-medium text-[#181511] hover:bg-[#F9F7F2] transition-all shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#F7EFE4] text-[#8C5F2E] flex items-center justify-center font-bold text-xs">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-[rgba(24,21,17,0.1)] shadow-xl py-1.5 z-50">
                  <Link
                    href="/create"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-[#181511] hover:bg-[#FDFBF7] font-medium"
                  >
                    + Create New Book
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
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
                className="text-xs sm:text-sm font-semibold text-[#181511] dark:text-[#F5F2EB] hover:text-[#A47A45] px-3 py-1.5 transition-colors"
              >
                Log in
              </button>

              <button
                onClick={() => openAuthModal('signup', '/create')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white gold-gradient-bg shadow-sm hover:shadow-md hover:opacity-95 transition-all active:scale-[0.98]"
              >
                <span>Start Creating</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-[#746B60]"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-[#181511] hover:bg-[#F1ECE2]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 max-w-6xl mx-auto rounded-2xl editorial-glass-header px-5 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2.5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#181511] py-1 hover:text-[#A47A45]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-[rgba(24,21,17,0.08)] flex flex-col gap-2">
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
                  className="w-full"
                >
                  Log in
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup', '/create');
                  }}
                  className="w-full"
                >
                  Start Creating →
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
