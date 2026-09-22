'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Heart } from 'lucide-react';

export function Footer() {
  const footerGroups = [
    {
      title: 'Product',
      links: [
        { label: 'How it works', href: '/how-it-works' },
        { label: 'Examples', href: '/examples' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'What you can create', href: '/#what-can-you-create' },
      ],
    },
    {
      title: 'My Book',
      links: [
        { label: 'Create New', href: '/create' },
        { label: 'My Books', href: '/create' },
        { label: 'Templates (Coming Soon)', href: '#' },
      ],
    },
    {
      title: 'Affiliate',
      links: [
        { label: 'Affiliate Program', href: '/affiliate' },
        { label: 'Earn with BookGenie', href: '/affiliate' },
        { label: 'Affiliate Resources', href: '/affiliate#resources' },
        { label: 'Track Your Referrals', href: '/affiliate#track' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'FAQ', href: '/faq' },
        { label: 'Help Center', href: '/contact' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Feedback', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Refund Policy', href: '/refund' },
        { label: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  return (
    <footer className="border-t border-[#EFECE6] bg-[#F9F7F2] text-[#6B635B] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-10 lg:gap-8 pb-14 border-b border-[#EAE4D8]">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group select-none">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F4EDE0] text-[#8C5F2E] border border-[#E8DCCB] shadow-2xs">
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold text-[#1A1612] tracking-tight leading-none">
                  BookGenie
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#9E968E] font-medium mt-1">
                  Ideas into Beautiful Books
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#7A7268] leading-relaxed max-w-sm mb-6">
              Turn your ideas into beautifully designed books with the power of AI. Create. Explore. Share. Inspire.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 text-[#9E968E]">
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-[#EFECE6] flex items-center justify-center hover:text-[#1A1612] hover:border-[#D5CABC] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-[#EFECE6] flex items-center justify-center hover:text-[#1A1612] hover:border-[#D5CABC] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-[#EFECE6] flex items-center justify-center hover:text-[#1A1612] hover:border-[#D5CABC] transition-colors"
                aria-label="X / Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-[#EFECE6] flex items-center justify-center hover:text-[#1A1612] hover:border-[#D5CABC] transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 5 Link Column Groups */}
          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#1A1612] mb-3.5">
                {group.title}
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-[#1A1612] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E968E] gap-4">
          <p>© 2026 BookGenie. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-[#C27351] fill-[#C27351]" /> for dreamers, creators and curious minds.
          </p>
        </div>
      </div>
    </footer>
  );
}
