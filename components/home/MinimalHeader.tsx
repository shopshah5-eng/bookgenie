'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import { Menu, X, BookOpen } from 'lucide-react';

export function MinimalHeader() {
  const { user, openAuthModal, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-[#0000000d] transition-all">
      <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group select-none">
          <svg
            className="w-5 h-5 text-[#111111]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 1-4 4v14a3 3 0 0 0 3-3h7z" />
          </svg>
          <span className="font-semibold text-lg tracking-tight text-[#111111] font-sans">
            BookGenie
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="relative text-[14px] font-medium text-[#111111] transition-colors py-1"
          >
            Home
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111] rounded-full" />
          </Link>
          <Link
            href="/pricing"
            className="text-[14px] font-medium text-[#666666] hover:text-[#111111] transition-colors py-1"
          >
            Pricing
          </Link>
          {user && (
            <Link
              href="/my-ebooks"
              className="text-[14px] font-medium text-[#666666] hover:text-[#111111] transition-colors py-1"
            >
              My eBooks
            </Link>
          )}
        </nav>

        {/* Right: Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/my-ebooks"
                className="text-[13px] font-medium text-[#111111] px-4 py-2 rounded-full border border-[#EAEAEA] hover:border-[#111111] transition-all"
              >
                My eBooks
              </Link>
              <div className="w-8 h-8 rounded-full bg-[#F2EFE9] text-[#111111] flex items-center justify-center text-xs font-semibold select-none border border-[#EAEAEA]">
                {(user.email?.[0] || 'T').toUpperCase()}
              </div>
              <button
                onClick={() => signOut()}
                className="text-[12px] font-medium text-[#777777] hover:text-[#111111] transition-colors px-1"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => openAuthModal('signin')}
                className="px-4 py-2 rounded-full border border-[#EAEAEA] text-[13px] font-medium text-[#111111] hover:border-[#111111] transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="px-5 py-2 rounded-full bg-[#111111] hover:bg-[#222222] text-[13px] font-medium text-white transition-all shadow-xs cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#111111] rounded-lg hover:bg-black/5"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#EAEAEA] bg-white px-6 py-4 flex flex-col gap-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-[#111111] py-1"
          >
            Home
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-[#666666] py-1"
          >
            Pricing
          </Link>
          {user && (
            <Link
              href="/my-ebooks"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#666666] py-1"
            >
              My eBooks
            </Link>
          )}

          <div className="pt-3 border-t border-[#EAEAEA] flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className="w-full py-2.5 rounded-full border border-[#EAEAEA] text-xs font-medium text-[#111111]"
              >
                Sign Out
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signin');
                  }}
                  className="w-full py-2.5 rounded-full border border-[#EAEAEA] text-xs font-medium text-[#111111]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup');
                  }}
                  className="w-full py-2.5 rounded-full bg-[#111111] text-xs font-medium text-white"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
