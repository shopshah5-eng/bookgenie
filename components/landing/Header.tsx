'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { BookOpen, Moon, Sun, Menu, X, ArrowRight, User as UserIcon, LogOut } from 'lucide-react';
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
    { label: 'Home', href: '/' },
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Examples', href: '/examples' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Affiliate', href: '/affiliate' },
    { label: 'FAQ', href: '/faq' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FDFBF7]/90 dark:bg-[#12100E]/90 backdrop-blur-md border-b border-[#EFECE6] dark:border-[#2B2621] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F8F3EA] dark:bg-[#252019] text-[#8C5F2E] dark:text-[#B2834A] border border-[#E8DCCB] dark:border-[#4A3E31] transition-transform group-hover:scale-105 shadow-2xs">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#1A1612] dark:text-[#F5F2EB] tracking-tight leading-tight">
              BookGenie
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#9E968E] font-medium leading-tight">
              Ideas into Beautiful Books
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B635B] dark:text-[#A8A199]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-[#1A1612] dark:hover:text-[#F5F2EB] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#9A6F3C] after:transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA / Auth controls */}
        <div className="hidden sm:flex items-center gap-3.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-[#6B635B] hover:text-[#1A1612] hover:bg-[#F4F0E8] dark:hover:bg-[#1C1917] transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#EFECE6] bg-white text-sm font-medium text-[#1A1612] hover:bg-[#F9F7F2] transition-all shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#F8F3EA] text-[#8C5F2E] flex items-center justify-center font-bold text-xs">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-[#EFECE6] shadow-xl py-1.5 z-50">
                  <Link
                    href="/create"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-[#1A1612] hover:bg-[#FDFBF7] font-medium"
                  >
                    + Create Book
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => openAuthModal('signin')}
                className="text-sm font-semibold text-[#1A1612] dark:text-[#F5F2EB] hover:text-[#9A6F3C] px-3 py-2 transition-colors"
              >
                Sign in
              </button>

              <Button
                variant="primary"
                size="md"
                onClick={() => openAuthModal('signup', '/create')}
                className="shadow-sm hover:shadow-md"
              >
                Get started free <ArrowRight className="w-4 h-4 ml-0.5" />
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu trigger button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#6B635B]"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#1A1612] hover:bg-[#F4F0E8]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#EFECE6] bg-[#FDFBF7] px-4 py-5 space-y-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#1A1612] py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#EFECE6] flex flex-col gap-2.5">
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
                  Sign in
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup', '/create');
                  }}
                  className="w-full"
                >
                  Get started free →
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
