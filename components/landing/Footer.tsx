'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const links = [
    { label: 'About', href: '/how-it-works' },
    { label: 'Blog', href: '/how-it-works' },
    { label: 'Help', href: '/contact' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="bg-white dark:bg-[#0A0A0A] py-8 border-t border-[#F0F0EE] dark:border-[#1E1E1E] text-xs text-[#666666] dark:text-[#888888] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Brand */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <span className="text-[#9A6F3C] text-sm">✦</span>
            <span className="font-serif font-bold text-base text-[#111111] dark:text-white">
              BookGenie
            </span>
          </Link>

          {/* Center: Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[#666666] dark:text-[#888888] hover:text-[#111111] dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Socials & Copyright */}
          <div className="flex items-center gap-4 text-xs text-[#888888] dark:text-[#777777] shrink-0">
            <div className="flex items-center gap-3 text-[#555555] dark:text-[#A0A0A0]">
              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-black dark:hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-black dark:hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* X */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-black dark:hover:text-white transition-colors font-bold text-xs">
                𝕏
              </a>
              {/* Pinterest */}
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="hover:text-black dark:hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.99-.1-2.52.02-3.61l.73-3.11s-.18-.37-.18-.91c0-.85.49-1.49 1.11-1.49.52 0 .78.39.78.87 0 .53-.33 1.32-.51 2.05-.15.62.31 1.12.92 1.12 1.1 0 1.95-1.16 1.95-2.84 0-1.48-1.07-2.52-2.59-2.52-1.77 0-2.8 1.33-2.8 2.7 0 .54.21 1.11.47 1.42.05.06.06.12.04.18l-.17.72c-.03.11-.1.15-.22.1-1.03-.48-1.67-1.98-1.67-3.19 0-2.6 1.89-4.99 5.45-4.99 2.86 0 5.09 2.04 5.09 4.77 0 2.85-1.79 5.13-4.28 5.13-.84 0-1.62-.43-1.89-.95l-.51 1.96c-.19.72-.69 1.62-1.03 2.17A12 12 0 1 0 12 0z"/>
                </svg>
              </a>
            </div>

            <span className="hidden sm:inline">Ideas deserve a home.</span>
            <span>© 2026 BookGenie</span>
          </div>

        </div>

      </div>
    </footer>
  );
}

