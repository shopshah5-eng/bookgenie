'use client';

import React from 'react';
import Link from 'next/link';
import {
  Printer,
  BookOpen,
  Share2,
  Check,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export function ExportFormatsSection() {
  const formats = [
    {
      title: 'Print-Ready PDF',
      badge: '300 DPI CMYK',
      icon: Printer,
      headline: 'Commercial press-ready files for Amazon KDP & IngramSpark.',
      features: [
        '300 DPI high-resolution image rendering',
        'CMYK color profile separation',
        'Strict bleed and inner gutter margin math',
        'Automated ISBN and barcode placement space',
      ],
      ctaText: 'Download sample PDF',
      ctaUrl: '/api/books/ocean-wonders/export?format=pdf',
    },
    {
      title: 'Reflowable EPUB 3',
      badge: 'Reflowable EPUB 3.0',
      icon: BookOpen,
      headline: 'Global e-reader standard for Kindle, Apple Books, and Kobo (sample export provided as structural edition).',
      features: [
        'Valid W3C EPUB 3.0 packaging & schema',
        'Fluid reflowable typography across all screens',
        'Embedded cover and interior metadata',
        'Dynamic navigational Table of Contents',
      ],
      ctaText: 'Download sample EPUB (Text Proof)',
      ctaUrl: '/api/books/ocean-wonders/export?format=epub',
    },
    {
      title: 'Private Web Reader',
      badge: 'Zero-Install Share',
      icon: Share2,
      headline: 'Share an interactive digital preview with readers and editors.',
      features: [
        'Dual-page flipbook responsive experience',
        'Private access controls & shareable web links',
        'Full desktop, tablet, and mobile responsiveness',
        'Instant client review without software downloads',
      ],
      ctaText: 'Open interactive reader',
      ctaUrl: '/examples/ocean-wonders',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-[#0A0A0A] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            One book. Every format.
          </h2>
          <p className="text-sm sm:text-base text-[#666666] dark:text-[#999999] mt-2 font-sans leading-relaxed">
            Generate and export publication-ready files for physical bookstores, global digital marketplaces, and private readers simultaneously.
          </p>
        </div>

        {/* 3 Format Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formats.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-7 rounded-3xl border border-[#EAEAEA] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#141414] flex flex-col justify-between hover:border-[#111111] dark:hover:border-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2C2C2C] flex items-center justify-center text-[#111111] dark:text-white shadow-2xs">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-white dark:bg-[#1E1E1E] text-[#666666] dark:text-[#A0A0A0] border border-[#E5E5E5] dark:border-[#2C2C2C]">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#111111] dark:text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#555555] dark:text-[#999999] leading-relaxed mb-6 font-sans">
                    {f.headline}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-[#EFEFEF] dark:border-[#222222]">
                    {f.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 text-xs text-[#444444] dark:text-[#CCCCCC]">
                        <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#EFEFEF] dark:border-[#222222]">
                  <Link
                    href={f.ctaUrl}
                    target={f.ctaUrl.startsWith('/api') ? '_blank' : undefined}
                    className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-full text-xs font-semibold bg-white dark:bg-[#1E1E1E] text-[#111111] dark:text-white border border-[#E0E0E0] dark:border-[#333333] hover:border-[#111111] dark:hover:border-white transition-all shadow-2xs"
                  >
                    <span>{f.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
