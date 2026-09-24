'use client';

import React from 'react';
import Link from 'next/link';
import {
  Lightbulb,
  Compass,
  PenTool,
  Palette,
  LayoutTemplate,
  BookOpenCheck,
  ArrowRight,
} from 'lucide-react';

export function PromptToPageShowcase() {
  const steps = [
    {
      num: '01',
      tag: 'IDEA',
      title: 'Describe your vision',
      desc: 'Type a prompt, paste an outline, or describe your concept in plain words.',
      icon: Lightbulb,
    },
    {
      num: '02',
      tag: 'BLUEPRINT',
      title: 'Structure the book',
      desc: 'Review the generated blueprint, chapter arc, tone bible, and page budgets.',
      icon: Compass,
    },
    {
      num: '03',
      tag: 'WRITING',
      title: 'Craft the prose',
      desc: 'Watch each chapter write with calibrated depth, voice, and narrative pacing.',
      icon: PenTool,
    },
    {
      num: '04',
      tag: 'VISUALS',
      title: 'Generate artwork',
      desc: 'Create cohesive high-resolution cover art and full-bleed interior illustrations.',
      icon: Palette,
    },
    {
      num: '05',
      tag: 'DESIGN',
      title: 'Typeset & format',
      desc: 'Automatic professional typesetting, drop caps, folios, and dual-page reader.',
      icon: LayoutTemplate,
    },
    {
      num: '06',
      tag: 'PUBLISH',
      title: 'Download & bind',
      desc: 'Export bookstore-ready CMYK PDF and reflowable EPUB for Amazon KDP & Apple.',
      icon: BookOpenCheck,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-[#0A0A0A] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-row items-baseline justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
              From blank page to bound book.
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] dark:text-[#999999] mt-0.5">
              A simple, powerful process.
            </p>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#111111] dark:text-[#F5F5F5] hover:text-[#9A6F3C] dark:hover:text-[#E8C28A] transition-colors group shrink-0"
          >
            <span>See how it works</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6 Minimalist Connected Process Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-3 items-center">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center text-center group">
                  {/* Clean Circular Icon Badge */}
                  <div className="w-12 h-12 rounded-full border border-[#E5E5E5] dark:border-[#2C2C2C] bg-[#FAFAF8] dark:bg-[#161616] flex items-center justify-center text-[#222222] dark:text-[#E0E0E0] mb-3 group-hover:border-[#111111] dark:group-hover:border-white group-hover:scale-105 transition-all shadow-2xs">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>

                  {/* Step Number & Name */}
                  <div className="text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-wider mb-0.5">
                    {step.num}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#111111] dark:text-[#F5F5F5] tracking-wide mb-0.5">
                    {step.tag}
                  </div>
                  <div className="text-[11px] text-[#666666] dark:text-[#999999]">
                    {step.desc.split('.')[0] || step.desc}
                  </div>
                </div>

                {/* Arrow connector between steps (only on lg desktop) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center -mx-2 text-[#CCCCCC] dark:text-[#333333]">
                    <span className="text-xs select-none">→</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </section>
  );
}


