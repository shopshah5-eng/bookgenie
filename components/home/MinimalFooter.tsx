'use client';

import React from 'react';
import Link from 'next/link';

export function MinimalFooter() {
  return (
    <footer className="w-full bg-white border-t border-[#EAEAEA] pt-14 pb-10">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10">
          
          {/* Left: Brand & Tagline */}
          <div className="flex flex-col gap-2">
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
            <p className="text-[13px] text-[#666666]">
              Turn your ideas into beautiful books.
            </p>
          </div>

          {/* Center: Primary Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-[13px] font-medium text-[#111111] hover:underline"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-[13px] font-medium text-[#111111] hover:underline"
            >
              Pricing
            </Link>
          </div>

          {/* Right: Social Icons & Legal Links */}
          <div className="flex flex-col items-start md:items-end gap-3">
            {/* Social Icons (X, Instagram, YouTube, Pinterest) */}
            <div className="flex items-center gap-4 text-[#111111]">
              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-70 transition-opacity"
                aria-label="X Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-70 transition-opacity"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-70 transition-opacity"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-70 transition-opacity"
                aria-label="Pinterest"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.95-.14-2.42.03-3.46l1.24-5.26s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.58 2.25-.87 3.5-.25 1.05.53 1.9 1.56 1.9 1.88 0 3.32-1.98 3.32-4.84 0-2.53-1.82-4.3-4.42-4.3-3.01 0-4.78 2.26-4.78 4.59 0 .91.35 1.88.79 2.41a.32.32 0 0 1 .07.31c-.08.35-.28 1.13-.32 1.29-.05.21-.17.26-.39.16-1.46-.68-2.37-2.81-2.37-4.52 0-3.69 2.68-7.07 7.73-7.07 4.06 0 7.21 2.89 7.21 6.75 0 4.03-2.54 7.27-6.07 7.27-1.19 0-2.3-.62-2.68-1.35l-.73 2.78c-.26 1.02-.98 2.29-1.46 3.08A12 12 0 1 0 12 0z" />
                </svg>
              </a>
            </div>

            {/* Privacy / Terms / Contact */}
            <div className="flex items-center gap-4 text-[12px] text-[#666666]">
              <Link href="/privacy" className="hover:text-[#111111] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[#111111] transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-[#111111] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#F0F0F0] text-right">
          <p className="text-[12px] text-[#888888]">
            © 2026 BookGenie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
