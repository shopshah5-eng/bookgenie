'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function MinimalFooter() {
  return (
    <footer className="w-full bg-white border-t border-[#EAEAEA] pt-16 sm:pt-20 pb-12 relative overflow-hidden select-none">
      {/* Container */}
      <div className="max-w-[1240px] mx-auto px-6 relative">
        
        {/* Decorative Books Left (Desktop / Tablet) */}
        <div className="hidden md:block absolute -left-2 lg:left-4 top-4 w-44 lg:w-56 pointer-events-none select-none z-0">
          <Image
            src="/images/footer-books-left.png"
            alt="A Calmer You, Mindful Living, The Little Explorer"
            width={260}
            height={260}
            className="w-full h-auto object-contain opacity-95"
            priority={false}
          />
        </div>

        {/* Decorative Books Right (Desktop / Tablet) */}
        <div className="hidden md:block absolute -right-2 lg:right-4 top-8 w-44 lg:w-56 pointer-events-none select-none z-0">
          <Image
            src="/images/footer-books-right.png"
            alt="Flavours of Home, A Journey Within, The Art of Simple Living"
            width={254}
            height={280}
            className="w-full h-auto object-contain opacity-95"
            priority={false}
          />
        </div>

        {/* 2. Top Footer Brand Area (Centered) */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-14 sm:mb-16 relative z-10">
          {/* BookGenie Logo */}
          <Link href="/" className="inline-flex items-center gap-2 group select-none mb-5">
            <svg
              className="w-6 h-6 text-[#111111]"
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
            <span className="font-semibold text-xl tracking-tight text-[#111111] font-sans">
              BookGenie
            </span>
          </Link>

          {/* Headline */}
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[38px] leading-tight text-[#111111] font-normal tracking-tight mb-3">
            Turn Your Ideas Into <span className="italic">Beautiful Books.</span>
          </h2>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-[#666666] font-normal leading-relaxed max-w-md">
            Create beautifully written, illustrated and designed eBooks from a simple idea.
          </p>
        </div>

        {/* 4. Three Navigation Columns (PRODUCT, RESOURCES, COMPANY) */}
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center sm:text-left mb-16 relative z-10">
          
          {/* COLUMN 1 — PRODUCT */}
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] block mb-4">
              PRODUCT
            </span>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/my-ebooks"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  My eBooks
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 2 — RESOURCES */}
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] block mb-4">
              RESOURCES
            </span>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/blog"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/examples"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Examples
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — COMPANY */}
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] block mb-4">
              COMPANY
            </span>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliate"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refunds"
                  className="text-[13px] sm:text-[14px] text-[#666666] hover:text-[#111111] transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 17. Bottom Bar with "Made for storytellers." */}
        <div className="relative pt-8 pb-2">
          {/* Centered Divider with Tagline */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EAEAEA]" />
            </div>
            <span className="relative bg-white px-4 font-serif italic text-sm text-[#777777]">
              Made for storytellers.
            </span>
          </div>

          {/* Bottom Legal Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#777777]">
            {/* Left: Copyright */}
            <p>© 2026 BookGenie. All rights reserved.</p>

            {/* Right: Legal Links */}
            <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
              <Link href="/privacy" className="hover:text-[#111111] transition-colors">
                Privacy
              </Link>
              <span className="text-[#DDDDDD]">|</span>
              <Link href="/terms" className="hover:text-[#111111] transition-colors">
                Terms
              </Link>
              <span className="text-[#DDDDDD]">|</span>
              <Link href="/cookies" className="hover:text-[#111111] transition-colors">
                Cookies
              </Link>
              <span className="text-[#DDDDDD]">|</span>
              <Link href="/refunds" className="hover:text-[#111111] transition-colors">
                Refunds
              </Link>
              <span className="text-[#DDDDDD]">|</span>
              <Link href="/contact" className="hover:text-[#111111] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
