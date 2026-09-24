'use client';

import React from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Printer,
  ArrowRight,
} from 'lucide-react';

export function TechnicalQualitySection() {
  const pillars = [
    {
      icon: Layers,
      title: 'Structured Blueprinting',
      subtitle: 'Deterministic pacing & page allocation',
      description:
        'Every book begins with an architectural blueprint. Chapter arcs, narrative pacing, character bibles, and strict page budgets are calculated before a single sentence is written.',
      badge: 'Architecture',
    },
    {
      icon: Sparkles,
      title: 'Cohesive Visual Style',
      subtitle: 'Persistent character consistency',
      description:
        'Proprietary visual routing ensures characters, lighting palettes, and illustration styles remain identical from cover to final chapter plate without style drifting.',
      badge: 'Visual AI',
    },
    {
      icon: BookOpen,
      title: 'Editorial Typesetting',
      subtitle: 'Real typographic mathematics',
      description:
        'Dual-page spread margins, calibrated leading, running headers, chapter folios, and classical drop caps are mathematically typeset for bookshop aesthetic.',
      badge: 'Design Engine',
    },
    {
      icon: CheckCircle2,
      title: 'Automated QC & Verification',
      subtitle: 'Semantic checking & orphan suppression',
      description:
        'Deterministic code eliminates typographical orphans, widow lines, page breaks mid-dialogue, and text overflows before export.',
      badge: 'Quality Control',
    },
    {
      icon: Printer,
      title: 'Publication-Ready Standards',
      subtitle: 'Amazon KDP & Apple Books validated',
      description:
        'Direct generation of 300 DPI CMYK press-ready PDFs with correct trim/bleed and reflowable EPUB3 files verified against global e-reader standards.',
      badge: 'Press Output',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-[#0A0A0A] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F3F3F1] dark:bg-[#1E1E1E] text-[#666666] dark:text-[#A0A0A0] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mb-3 border border-[#E5E5E5] dark:border-[#2C2C2C]">
            PUBLISHING ARCHITECTURE
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight leading-tight">
            More than AI writing.<br className="hidden sm:inline" /> A complete publishing studio.
          </h2>
          <p className="text-sm sm:text-base text-[#666666] dark:text-[#999999] mt-3 font-sans leading-relaxed">
            Writing words is only 20% of publishing. BookGenie couples multi-tier language intelligence with deterministic layout math, visual persistence engines, and pre-press validation.
          </p>
        </div>

        {/* 5-Item Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            const isLarge = idx === 0 || idx === 3;
            return (
              <div
                key={p.title}
                className={`p-6 sm:p-7 rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#141414] flex flex-col justify-between hover:border-[#111111] dark:hover:border-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${
                  isLarge ? 'md:col-span-1 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2C2C2C] flex items-center justify-center text-[#111111] dark:text-white shadow-2xs">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white dark:bg-[#1E1E1E] text-[#777777] dark:text-[#999999] border border-[#E5E5E5] dark:border-[#2C2C2C]">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#111111] dark:text-[#F5F5F5] mb-1">
                    {p.title}
                  </h3>
                  <div className="text-xs font-medium text-[#9A6F3C] dark:text-[#D4AF37] mb-2.5">
                    {p.subtitle}
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#555555] dark:text-[#A0A0A0] leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EFEFEF] dark:border-[#1F1F1F] flex items-center justify-between text-[11px] text-[#888888]">
                  <span>Verified Deterministic Code</span>
                  <span className="text-[#16A34A] font-bold">✓ Active</span>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Interactive Creation CTA */}
          <div className="p-6 sm:p-7 rounded-2xl border border-[#111111] dark:border-white bg-[#111111] dark:bg-white text-white dark:text-[#111111] flex flex-col justify-between shadow-md">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#A0A0A0] dark:text-[#666666]">
                Ready to publish?
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl mt-2 mb-3 leading-snug">
                Experience real publication mathematics.
              </h3>
              <p className="text-xs sm:text-[13px] text-[#CCCCCC] dark:text-[#555555] leading-relaxed">
                Move from raw idea to bookstore-ready files in minutes with complete commercial rights and zero design hurdles.
              </p>
            </div>

            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 mt-6 px-5 py-3 rounded-full text-xs font-semibold bg-white dark:bg-[#111111] text-[#111111] dark:text-white hover:bg-[#F0F0EE] dark:hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
