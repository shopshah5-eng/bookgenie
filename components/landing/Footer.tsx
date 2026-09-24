'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const productLinks = [
    { label: 'Create a Book', href: '/create' },
    { label: 'Showcase Gallery', href: '/examples' },
    { label: 'Publishing Architecture', href: '/how-it-works' },
    { label: 'Studio Creator', href: '/create' },
    { label: 'Pricing & Plans', href: '/pricing' },
    { label: 'Demo Reader', href: '/examples/ocean-wonders' },
  ];

  const publishingLinks = [
    { label: '7-Stage Pipeline', href: '/how-it-works' },
    { label: 'Print PDF & EPUB Specs', href: '/how-it-works' },
    { label: 'Commercial Rights', href: '/terms' },
    { label: 'Deterministic Quality Control', href: '/how-it-works' },
  ];

  const supportLinks = [
    { label: 'Frequently Asked Questions', href: '/faq' },
    { label: 'Editorial Support', href: '/contact' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Affiliate Program', href: '/affiliate' },
  ];

  const legalLinks = [
    { label: 'Privacy & Data Rights', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
    { label: 'Cookie Policy', href: '/cookies' },
  ];

  return (
    <footer className="bg-white dark:bg-[#0A0A0A] py-14 border-t border-[#F0F0EE] dark:border-[#1E1E1E] text-xs text-[#666666] dark:text-[#888888] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-1.5 shrink-0">
              <span className="text-[#9A6F3C] text-sm">✦</span>
              <span className="font-serif font-bold text-base text-[#111111] dark:text-white">
                BookGenie
              </span>
            </Link>
            <p className="text-xs text-[#666666] dark:text-[#888888] leading-relaxed">
              The AI publishing studio for authors, educators, and creators. Turn ideas into bookstore-ready editions.
            </p>
            <div className="text-[11px] text-[#888888] font-mono pt-1">
              Private by design • Supabase RLS
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-xs text-[#111111] dark:text-white uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-[#111111] dark:hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Publishing */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-xs text-[#111111] dark:text-white uppercase tracking-wider">
              Publishing
            </h4>
            <ul className="space-y-2">
              {publishingLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-[#111111] dark:hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-xs text-[#111111] dark:text-white uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-[#111111] dark:hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-xs text-[#111111] dark:text-white uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-[#111111] dark:hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-6 border-t border-[#F0F0EE] dark:border-[#1E1E1E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#888888] dark:text-[#777777]">
          <span>© 2026 BookGenie AI Publishing Studio. All rights reserved.</span>

          <div className="flex items-center gap-4 text-[#555555] dark:text-[#A0A0A0]">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-black dark:hover:text-white transition-colors font-bold text-xs">
              𝕏
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-black dark:hover:text-white transition-colors">
              Instagram
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-black dark:hover:text-white transition-colors">
              YouTube
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

