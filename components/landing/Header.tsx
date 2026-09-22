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
    { label: 'Explore', href: '/examples' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Resources', href: '/faq', hasDropdown: true },
  ];

  return (
    <div className="sticky top-0 z-50 w-full transition-all bg-[#FDFBF7]/90 dark:bg-[#12100E]/90 backdrop-blur-md border-b border-[#EDE6DC]/80 dark:border-[#26221D]">
      <header className="max-w-7xl mx-auto px-4 sm:px-8 h-18 sm:h-20 flex items-center justify-between transition-all">
        {/* Brand Wordmark & Open Book Icon + Subline */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#8C5F2E] text-white shadow-xs transition-transform group-hover:scale-105">
            <BookOpen className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#181511] dark:text-[#F5F2EB] leading-none">
              BookGenie
            </span>
            <span className="text-[9px] font-sans uppercase tracking-[0.22em] text-[#8C5F2E] dark:text-[#C49B66] font-semibold mt-1">
              Turn Ideas Into Books
            </span>
          </div>
        </Link>

        {/* Desktop Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#5A5249] dark:text-[#B3AAA0]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-[#181511] dark:hover:text-[#F5F2EB] transition-colors py-1 flex items-center gap-1 group/link"
            >
              <span>{link.label}</span>
              {link.hasDropdown && (
                <span className="text-[10px] text-[#8C5F2E] opacity-70 group-hover/link:opacity-100 transition-opacity">
                  ▾
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right CTA / Auth controls */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#746B60] hover:text-[#181511] hover:bg-[#F1ECE2] dark:hover:bg-[#1C1917] transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#746B60]" />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E5DFD5] bg-white dark:bg-[#1A1816] text-xs sm:text-sm font-medium text-[#181511] dark:text-[#F5F2EB] hover:bg-[#F9F7F2] transition-all shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#F7EFE4] dark:bg-[#2A241E] text-[#8C5F2E] dark:text-[#C49B66] flex items-center justify-center font-bold text-xs">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#1A1816] border border-[#E5DFD5] dark:border-[#2C2721] shadow-xl py-1.5 z-50">
                  <Link
                    href="/create"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-[#181511] dark:text-[#F5F2EB] hover:bg-[#FDFBF7] dark:hover:bg-[#23201C] font-medium"
                  >
                    + Create New Book
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 font-medium"
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
                className="text-xs sm:text-[13px] font-semibold text-[#181511] dark:text-[#F5F2EB] hover:text-[#8C5F2E] px-3 py-1.5 transition-colors"
              >
                Log in
              </button>

              <button
                onClick={() => openAuthModal('signup', '/create')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-semibold text-white bg-gradient-to-r from-[#A87B45] to-[#8C5F2E] hover:from-[#B5854C] hover:to-[#966733] shadow-[0_2px_10px_rgba(140,95,46,0.25)] hover:shadow-[0_4px_14px_rgba(140,95,46,0.35)] transition-all active:scale-[0.98]"
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
            className="p-2 rounded-full text-[#746B60]"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#181511] hover:bg-[#F1ECE2]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-6 py-5 bg-[#FDFBF7] dark:bg-[#161412] border-b border-[#EDE6DC] dark:border-[#26221D] space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#181511] dark:text-[#F5F2EB] py-1 hover:text-[#8C5F2E]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#EDE6DC] dark:border-[#26221D] flex flex-col gap-2.5">
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
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup', '/create');
                  }}
                  className="w-full py-2.5 rounded-full text-center text-sm font-semibold text-white bg-gradient-to-r from-[#A87B45] to-[#8C5F2E]"
                >
                  Start Creating →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
