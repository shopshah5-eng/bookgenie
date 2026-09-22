'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export function Footer() {
  const footerGroups = [
    {
      title: 'Studio',
      links: [
        { label: 'Create Book', href: '/create' },
        { label: 'Library Showcase', href: '/examples' },
        { label: 'Ocean Wonders Demo', href: '/examples/ocean-wonders' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Pricing & Plans', href: '/pricing' },
        { label: 'Affiliate Program', href: '/affiliate' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Frequently Asked Questions', href: '/faq' },
        { label: 'Editorial Support', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy & Data Rights', href: '/privacy' },
        { label: 'Refund Policy', href: '/refund' },
        { label: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  return (
    <footer className="border-t border-[rgba(24,21,17,0.08)] bg-[#F8F4EC] text-[#746B60] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-12 border-b border-[rgba(24,21,17,0.07)]">
          
          {/* Brand Wordmark & Mission */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-3 select-none">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#8C5F2E] text-white">
                <BookOpen className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-xl font-serif font-bold text-[#181511] tracking-tight">
                BookGenie
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#746B60] leading-relaxed max-w-sm mb-4">
              A luxury digital publishing studio. Turn ideas, stories, and manuscripts into beautifully illustrated and typeset books with AI.
            </p>

            <span className="text-[11px] text-[#9E968E] font-serif italic">
              Dual-format print PDF + reflowable EPUB3
            </span>
          </div>

          {/* 4 Clean Editorial Groups */}
          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col">
              <h4 className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#181511] mb-3">
                {group.title}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-[#181511] hover:underline underline-offset-4 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Dignified Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E968E] gap-4">
          <p>© 2026 BookGenie Publishing Studio. All rights reserved.</p>
          <p className="font-serif italic text-[#8C5F2E]">
            Designed for authors, educators, and independent publishers.
          </p>
        </div>

      </div>
    </footer>
  );
}
