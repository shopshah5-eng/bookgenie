'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export function PromptToPageShowcase() {
  const steps = [
    { num: '01', label: 'Prompt / Outline' },
    { num: '02', label: 'Book Blueprint' },
    { num: '03', label: 'Multi-Tier Prose' },
    { num: '04', label: 'Visual Engine' },
    { num: '05', label: 'Editorial Layout' },
    { num: '06', label: 'Print & EPUB' },
  ];

  return (
    <section className="py-20 sm:py-28 border-t border-[rgba(24,21,17,0.08)] bg-[#F1ECE2]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7EFE4] text-[#8C5F2E] border border-[#E5D5C0] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#A47A45]" /> The Publishing Studio Transformation
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#181511] tracking-tight mb-4">
            From prompt to pages.
          </h2>
          <p className="text-sm sm:text-base text-[#746B60] leading-relaxed">
            Witness how a raw creative idea transforms into a bound, typeset, and beautifully illustrated literary volume.
          </p>
        </div>

        {/* Studio Pipeline Indicator Bar */}
        <div className="hidden lg:grid grid-cols-6 gap-2 mb-14 max-w-4xl mx-auto">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex flex-col items-center text-center relative">
              <span className="text-[10px] font-mono font-bold text-[#A47A45] mb-1">{s.num}</span>
              <span className="text-xs font-serif font-semibold text-[#181511]">{s.label}</span>
              {idx < steps.length - 1 && (
                <div className="absolute top-2.5 -right-1/2 w-full h-[1px] bg-[rgba(24,21,17,0.12)] -z-10" />
              )}
            </div>
          ))}
        </div>

        {/* Transformation Showcase Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-[rgba(24,21,17,0.09)] p-6 sm:p-10 shadow-[0_18px_50px_-12px_rgba(24,21,17,0.08)]">
          
          {/* Left Column: Creator Prompt Manuscript Card */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#FDFBF7] rounded-2xl border border-[rgba(24,21,17,0.07)] p-6 shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(24,21,17,0.06)] mb-4 text-xs">
                <span className="font-mono text-[10px] text-[#A47A45] font-bold tracking-widest uppercase">
                  RAW CREATOR PROMPT
                </span>
                <span className="text-[10px] text-[#9E968E] font-serif italic">
                  Input Manuscript
                </span>
              </div>

              <blockquote className="font-serif italic text-base sm:text-lg text-[#181511] leading-relaxed mb-6 border-l-2 border-[#A47A45] pl-4">
                &ldquo;Create a 28-page illustrated children&rsquo;s story about Barnaby, a curious little sea turtle with gold-tipped flippers who ventures beyond the sunlit shallows to find a singing coral reef.&rdquo;
              </blockquote>

              <div className="space-y-2 text-xs text-[#746B60]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Genre: Illustrated Picture Book (Ages 4–8)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Target: 28 Pages • 14 Double Spreads</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Visual Style: Whimsical Watercolor & Vibrant Coral</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[rgba(24,21,17,0.06)] flex items-center justify-between text-[11px] text-[#9E968E]">
              <span>Processed in 88s</span>
              <span className="font-serif italic text-[#8C5F2E]">Multi-Tier AI Router</span>
            </div>
          </div>

          {/* Center Column: Pipeline Transition Arrow */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center text-center py-2 lg:py-0">
            <div className="w-12 h-12 rounded-full bg-[#F8F4EC] border border-[#E5D5C0] flex items-center justify-center text-[#A47A45] shadow-xs mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-serif italic text-[#8C5F2E] font-medium">
              Studio Typesetting
            </span>
            <ArrowRight className="w-4 h-4 text-[#A47A45] mt-1 hidden lg:block" />
          </div>

          {/* Right Column: The Finished Bound Book Spread */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden book-shadow border border-[#E5D5C0] aspect-[4/3] bg-[#FDFBF7]">
            <Image
              src="/images/editorial-book-spread.jpg"
              alt="Finished physical-style illustrated book spread"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
              <div>
                <span className="font-serif font-bold text-sm block">Ocean Wonders</span>
                <span className="text-[10px] text-white/80">Page 8 & 9 Spread • Print-Ready CMYK PDF</span>
              </div>
              <Link
                href="/examples/ocean-wonders"
                className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md hover:bg-white/30 text-[11px] font-semibold transition-colors"
              >
                Inspect Book →
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
