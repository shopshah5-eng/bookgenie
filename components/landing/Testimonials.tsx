'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  Printer,
  BookOpen,
  Lightbulb,
} from 'lucide-react';

export function Testimonials() {
  const trustFeatures = [
    { title: 'Full commercial rights', icon: ShieldCheck },
    { title: 'Private projects', icon: Lock },
    { title: 'Print-ready PDF', icon: Printer },
    { title: 'Reflowable EPUB', icon: BookOpen },
    { title: 'No design experience required', icon: Lightbulb },
  ];

  return (
    <section className="py-12 sm:py-14 bg-white dark:bg-[#0A0A0A] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Your work stays yours + horizontal row of 5 badges */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight mb-4">
              Your work stays yours.
            </h2>

            {/* Horizontal row of 5 badges with icons */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs sm:text-[13px] text-[#555555] dark:text-[#A0A0A0]">
              {trustFeatures.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.title} className="flex items-center gap-1.5 whitespace-nowrap">
                    <Icon className="w-3.5 h-3.5 text-[#777777] dark:text-[#888888] shrink-0" />
                    <span>{feat.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Verified Product Statement */}
          <div className="lg:col-span-5 flex flex-col justify-center pl-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-[#F0F0EE] dark:border-[#222222] pt-6 lg:pt-0">
            <blockquote className="font-serif italic text-base sm:text-lg text-[#222222] dark:text-[#E8E8E8] leading-snug">
              &ldquo;Built to help creators move from idea to finished book.&rdquo;
            </blockquote>
            
            <p className="text-xs sm:text-[13px] text-[#666666] dark:text-[#999999] mt-2.5 leading-relaxed font-sans">
              BookGenie couples high-fidelity AI generation with automated book design engines, outputting publication-standard files ready for distribution.
            </p>

            <div className="flex items-center gap-2 mt-3.5 pt-3 border-t border-[#F5F5F3] dark:border-[#1E1E1E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              <span className="text-[11px] font-medium text-[#444444] dark:text-[#AAAAAA]">
                Production-grade typesetting &amp; instant asset ownership
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}



