'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Menu, X } from 'lucide-react';

export function MinimalHeader() {
  const { user, openAuthModal, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (pathname === '/') {
      const pricingEl = document.getElementById('pricing');
      if (pricingEl) {
        pricingEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    } else {
      router.push('/#pricing');
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#0000000d] transition-all">
      <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          onClick={handleHomeClick}
          className="flex items-center gap-2 group select-none cursor-pointer"
        >
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

        {/* Center: Exactly Two Navigation Options — Home & Pricing */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            onClick={handleHomeClick}
            className={`relative text-[14px] font-medium transition-colors py-1 ${
              isHome
                ? 'text-[#111111]'
                : 'text-[#666666] hover:text-[#111111]'
            }`}
          >
            Home
            {isHome && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111] rounded-full" />
            )}
          </Link>

          <a
            href="/#pricing"
            onClick={handlePricingClick}
            className="text-[14px] font-medium text-[#666666] hover:text-[#111111] transition-colors py-1 cursor-pointer"
          >
            Pricing
          </a>
        </nav>

        {/* Right: User Profile / Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/my-ebooks"
                className="text-[13px] font-medium text-[#111111] px-4 py-1.5 rounded-full border border-[#EAEAEA] hover:border-[#111111] transition-all"
              >
                My eBooks
              </Link>

              {/* Corner User Profile Badge (Google avatar + Name) */}
              <Link
                href="/my-ebooks"
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#F6F5F2] hover:bg-[#EAE8E3] border border-[#EAEAEA] transition-all group"
                title={user.email || 'My Account'}
              >
                {(user.user_metadata?.avatar_url || user.user_metadata?.picture) ? (
                  <img
                    src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                    alt={user.user_metadata?.full_name || user.user_metadata?.name || 'Profile'}
                    className="w-7 h-7 rounded-full object-cover border border-black/10 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-semibold select-none shrink-0">
                    {((user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'U')[0]).toUpperCase()}
                  </div>
                )}
                <span className="text-[13px] font-medium text-[#111111] max-w-[130px] truncate">
                  {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]}
                </span>
              </Link>

              <button
                onClick={() => signOut()}
                className="text-[12px] font-medium text-[#777777] hover:text-[#111111] transition-colors px-1 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => openAuthModal('signin', '/')}
                className="px-4 py-2 rounded-full border border-[#EAEAEA] text-[13px] font-medium text-[#111111] hover:border-[#111111] transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup', '/')}
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
          className="md:hidden p-2 text-[#111111] rounded-lg hover:bg-black/5 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#0000000d] px-6 py-5 flex flex-col gap-4 shadow-lg animate-in fade-in duration-150">
          <Link
            href="/"
            onClick={handleHomeClick}
            className={`text-sm font-medium py-1 ${isHome ? 'text-[#111111] font-semibold' : 'text-[#666666]'}`}
          >
            Home
          </Link>
          <a
            href="/#pricing"
            onClick={handlePricingClick}
            className="text-sm font-medium text-[#666666] py-1 cursor-pointer"
          >
            Pricing
          </a>

          <div className="pt-4 border-t border-[#F0F0F0] flex flex-col gap-3">
            {user ? (
              <div className="flex flex-col gap-3">
                <Link
                  href="/my-ebooks"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-1"
                >
                  {(user.user_metadata?.avatar_url || user.user_metadata?.picture) ? (
                    <img
                      src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                      alt={user.user_metadata?.full_name || 'Profile'}
                      className="w-8 h-8 rounded-full object-cover border border-black/10 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                      {((user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'U')[0]).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-[#111111] truncate">
                      {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[11px] text-[#888888] truncate">{user.email}</span>
                  </div>
                </Link>

                <div className="flex items-center justify-between pt-2 border-t border-[#F0F0F0]">
                  <Link
                    href="/my-ebooks"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-[#111111]"
                  >
                    My eBooks
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-[#888888] hover:text-[#111111] cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    openAuthModal('signin', '/');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-full border border-[#EAEAEA] text-xs font-medium text-[#111111] text-center cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signup', '/');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-full bg-[#111111] text-white text-xs font-medium text-center cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
