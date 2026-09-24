'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  Printer,
  BookOpen,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

export function Testimonials() {
  const trustFeatures = [
    { title: '100% Commercial rights', icon: ShieldCheck, desc: 'You own all copyright, prose, and generated artwork completely.' },
    { title: 'Private by design (RLS)', icon: Lock, desc: 'Protected by Supabase Row Level Security. Never used to train public models.' },
    { title: 'Print-ready CMYK PDF', icon: Printer, desc: '300 DPI press files prepared for Amazon KDP & IngramSpark.' },
    { title: 'Validated EPUB3', icon: BookOpen, desc: 'Reflowable digital standard compatible with Apple Books & Kindle.' },
    { title: 'Deterministic typography', icon: Lightbulb, desc: 'Automatic drop caps, folios, dual margins, and orphan suppression.' },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-[#0A0A0A] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading & 5 Trust Badges */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F3F3F1] dark:bg-[#1E1E1E] text-[#666666] dark:text-[#A0A0A0] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mb-3 border border-[#E5E5E5] dark:border-[#2C2C2C]">
              INTELLECTUAL PROPERTY &amp; SECURITY
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight mb-3">
              Your work stays yours. Private by design.
            </h2>

            <p className="text-sm text-[#666666] dark:text-[#999999] mb-8 leading-relaxed max-w-xl">
              We believe authors and publishers should retain total sovereignty over their work. Your manuscripts and generated assets are isolated with database-level security and are never used to train shared AI models.
            </p>

            {/* List of 5 verified capabilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {trustFeatures.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.title} className="p-3.5 rounded-xl border border-[#EAEAEA] dark:border-[#222222] bg-[#FAFAFA] dark:bg-[#141414] flex flex-col justify-start">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-[#9A6F3C] dark:text-[#D4AF37] shrink-0" />
                      <span className="text-xs font-semibold text-[#111111] dark:text-white">{feat.title}</span>
                    </div>
                    <p className="text-[11px] text-[#666666] dark:text-[#999999] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Security Architecture Statement Card */}
          <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl border border-[#EAEAEA] dark:border-[#222222] bg-[#FAFAFA] dark:bg-[#141414] shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <blockquote className="font-serif italic text-lg sm:text-xl text-[#111111] dark:text-white leading-snug">
              &ldquo;Built to give every creator the power of a world-class publishing house without sacrificing privacy or ownership.&rdquo;
            </blockquote>
            
            <p className="text-xs sm:text-[13px] text-[#666666] dark:text-[#999999] mt-4 leading-relaxed font-sans">
              BookGenie couples high-fidelity AI generation with automated book design engines, outputting publication-standard files ready for distribution.
            </p>

            <div className="space-y-2 mt-6 pt-5 border-t border-[#EFEFEF] dark:border-[#222222]">
              <div className="flex items-center gap-2 text-xs text-[#333333] dark:text-[#CCCCCC]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>Supabase Row-Level Security (RLS) enforcement</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#333333] dark:text-[#CCCCCC]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>Zero model training on user prompts or manuscripts</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#333333] dark:text-[#CCCCCC]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>Immediate export to open, non-proprietary formats</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}



