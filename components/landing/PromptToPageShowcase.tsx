'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  PenTool,
  Compass,
  BookText,
  Palette,
  LayoutTemplate,
  DownloadCloud,
  Check,
} from 'lucide-react';

export function PromptToPageShowcase() {
  const steps = [
    {
      num: '01',
      title: 'Prompt & Outline',
      desc: 'Enter an idea, manuscript, or outline with target page count.',
      icon: PenTool,
    },
    {
      num: '02',
      title: 'Book Blueprint',
      desc: 'Deterministic character bibles, page budget, and arc planning.',
      icon: Compass,
    },
    {
      num: '03',
      title: 'Prose & Chapters',
      desc: 'Multi-tier LLMs write rich, calibrated narrative text.',
      icon: BookText,
    },
    {
      num: '04',
      title: 'Visual Generation',
      desc: 'Style-consistent art, illustrations, or photography.',
      icon: Palette,
    },
    {
      num: '05',
      title: 'Editorial Typesetting',
      desc: 'Refined book typography, drop caps, and balanced margins.',
      icon: LayoutTemplate,
    },
    {
      num: '06',
      title: 'Print & Export',
      desc: 'Instant CMYK print PDF and reflowable EPUB files.',
      icon: DownloadCloud,
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-t border-[#EDE6DC] dark:border-[#26221D] bg-[#FDFBF7] dark:bg-[#12100E] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1ECE2] dark:bg-[#231E18] text-[#8C5F2E] dark:text-[#C49B66] border border-[#E5D7C3] dark:border-[#382F24] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#A87B45]" />
            <span>How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#181511] dark:text-[#F8F5EE] tracking-tight mb-3">
            From prompt to pages.
          </h2>
          <p className="text-sm sm:text-base text-[#6B635B] dark:text-[#A8A199] leading-relaxed">
            A complete publishing workflow that takes your raw ideas and produces a finished, bookstore-quality volume.
          </p>
        </div>

        {/* Master White Studio Card with cursive script annotation */}
        <div className="bg-white dark:bg-[#1A1816] rounded-3xl border border-[#EDE6DC] dark:border-[#2C2721] p-6 sm:p-10 shadow-[0_16px_45px_-10px_rgba(24,21,17,0.07)] relative">
          
          {/* Cursive Handwriting Annotation in top right (exact from reference) */}
          <div className="absolute top-5 right-6 sm:right-10 z-20 hidden md:block transform rotate-[-2deg]">
            <span className="font-serif italic text-sm sm:text-base text-[#8C5F2E] dark:text-[#C49B66]">
              "Ideas become books. Books create impact."
            </span>
          </div>

          {/* 6 Circular Steps with Connectors */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-2 pb-10 border-b border-[#EDE6DC] dark:border-[#2C2721] relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex flex-col items-center text-center relative group">
                  {/* Circular Step Badge */}
                  <div className="w-13 h-13 rounded-2xl bg-[#FAF8F5] dark:bg-[#221F1C] border border-[#E5DFD5] dark:border-[#382F24] flex items-center justify-center text-[#8C5F2E] dark:text-[#C49B66] shadow-2xs group-hover:scale-105 group-hover:border-[#8C5F2E] transition-all mb-3 relative">
                    <Icon className="w-6 h-6 stroke-[1.8]" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#8C5F2E] text-white text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xs sm:text-sm text-[#181511] dark:text-[#F8F5EE] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-[#746B60] dark:text-[#A8A199] leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Connecting Arrow for Desktop */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-6 -right-3 text-[#D4C9BA] dark:text-[#382F24] z-10 pointer-events-none">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Side-by-Side Before/After Studio Transformation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
            
            {/* Left: Raw Creator Input */}
            <div className="lg:col-span-6 bg-[#FAF8F5] dark:bg-[#201D1A] rounded-2xl border border-[#EDE6DC] dark:border-[#2C2721] p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#EDE6DC] dark:border-[#2C2721] mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5F2E] dark:text-[#C49B66]">
                    Raw Creator Input
                  </span>
                  <span className="text-[11px] font-serif italic text-[#A8A199]">
                    Draft Manuscript
                  </span>
                </div>

                <blockquote className="font-serif italic text-base text-[#181511] dark:text-[#F8F5EE] leading-relaxed mb-6 border-l-2 border-[#8C5F2E] pl-4">
                  &ldquo;A whimsical children&rsquo;s story about a brave little fox named Barnaby who explores an enchanted forest to find an ancient clockwork tree.&rdquo;
                </blockquote>

                <div className="space-y-2 text-xs text-[#5A5249] dark:text-[#B3AAA0]">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#8C5F2E] shrink-0" />
                    <span>Format: Illustrated Picture Book (28 Pages)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#8C5F2E] shrink-0" />
                    <span>Visual Tone: Whimsical Watercolor & Woodland Palette</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#8C5F2E] shrink-0" />
                    <span>Output: CMYK Print PDF + Reflowable EPUB 3.0</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-[#EDE6DC] dark:border-[#2C2721] flex items-center justify-between text-[11px] text-[#A8A199]">
                <span>Pipeline execution time: 82 seconds</span>
                <span className="font-serif italic text-[#8C5F2E] dark:text-[#C49B66]">Multi-Tier AI Engine</span>
              </div>
            </div>

            {/* Right: Finished Bound Book Spread */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(24,21,17,0.16)] border border-[#EDE6DC] dark:border-[#2C2721] aspect-[4/3] bg-[#FAF8F5]">
              <Image
                src="/images/small-steps-open-spread.jpg"
                alt="Finished physical interior book spread"
                fill
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white text-xs">
                <div>
                  <span className="font-serif font-bold text-sm block">Small Steps Big Adventures</span>
                  <span className="text-[10px] text-white/80">Page 14 & 15 Spread • Typeset & Bound</span>
                </div>
                <Link
                  href="/examples/ocean-wonders"
                  className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/35 text-[11px] font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Inspect In Reader</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

