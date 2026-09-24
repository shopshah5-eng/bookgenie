'use client';

import React from 'react';
import Link from 'next/link';
import {
  Lightbulb,
  Compass,
  PenTool,
  Palette,
  LayoutTemplate,
  CheckCircle2,
  BookOpenCheck,
  ArrowRight,
} from 'lucide-react';

export function PromptToPageShowcase() {
  const steps = [
    {
      num: '01',
      tag: 'INPUT',
      title: 'Start with your idea',
      desc: 'Type a prompt, paste an outline, or upload your manuscript.',
      icon: Lightbulb,
    },
    {
      num: '02',
      tag: 'PLAN',
      title: 'Build the blueprint',
      desc: 'Deterministic chapter arc, tone bible, and page budgets.',
      icon: Compass,
    },
    {
      num: '03',
      tag: 'WRITE',
      title: 'Craft the content',
      desc: 'Multi-tier text engine with voice consistency and pacing.',
      icon: PenTool,
    },
    {
      num: '04',
      tag: 'ART',
      title: 'Create the visuals',
      desc: 'Cohesive high-resolution cover art and interior illustrations.',
      icon: Palette,
    },
    {
      num: '05',
      tag: 'DESIGN',
      title: 'Typeset the book',
      desc: 'Automated book design, drop caps, folios, and dual margins.',
      icon: LayoutTemplate,
    },
    {
      num: '06',
      tag: 'VERIFY',
      title: 'Check every detail',
      desc: 'Semantic QC, orphan/widow suppression, formatting checks.',
      icon: CheckCircle2,
    },
    {
      num: '07',
      tag: 'PUBLISH',
      title: 'Export your book',
      desc: '300 DPI CMYK PDF, reflowable EPUB3, and private web reader.',
      icon: BookOpenCheck,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-[#0A0A0A] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-row items-baseline justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
              From blank page to bound book.
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] dark:text-[#999999] mt-0.5">
              A complete seven-stage deterministic publishing pipeline.
            </p>
          </div>

          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#111111] dark:text-[#F5F5F5] hover:text-[#9A6F3C] dark:hover:text-[#E8C28A] transition-colors group shrink-0"
          >
            <span>Architecture details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 7 Minimalist Connected Process Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-5 lg:gap-2 items-start">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center text-center group relative px-1">
                  {/* Clean Circular Icon Badge */}
                  <div className="w-12 h-12 rounded-full border border-[#E5E5E5] dark:border-[#2C2C2C] bg-white dark:bg-[#161616] flex items-center justify-center text-[#222222] dark:text-[#E0E0E0] mb-3 group-hover:border-[#111111] dark:group-hover:border-white group-hover:scale-105 transition-all shadow-2xs">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>

                  {/* Step Number & Tag */}
                  <div className="text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-wider mb-0.5">
                    {step.num}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#111111] dark:text-[#F5F5F5] tracking-wide mb-1">
                    {step.tag}
                  </div>
                  <div className="text-[11px] font-medium text-[#333333] dark:text-[#CCCCCC] leading-tight mb-1">
                    {step.title}
                  </div>
                  <div className="text-[10px] text-[#777777] dark:text-[#999999] leading-relaxed hidden sm:block">
                    {step.desc}
                  </div>
                </div>

                {/* Arrow connector between steps (only on lg desktop) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center -mx-2 pt-4 text-[#D0D0D0] dark:text-[#333333] select-none">
                    <span className="text-xs">→</span>
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


