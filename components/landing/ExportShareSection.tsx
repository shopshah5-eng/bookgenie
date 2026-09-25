'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FileDown, BookOpen, Share2, Sparkles, Check, ArrowRight } from 'lucide-react';

export function ExportShareSection() {
  const router = useRouter();

  const handleAction = (type: string) => {
    if (type === 'share' || type === 'read') {
      router.push('/examples/ocean-wonders');
      return;
    }
    // For PDF / EPUB, demonstrate or route
    router.push('/examples/ocean-wonders');
  };

  return (
    <section className="py-16 sm:py-24 border-t border-[#EDE6DC] dark:border-[#26221D] bg-[#FAF8F5] dark:bg-[#151311] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Realistic Open Book Spread with Olive Leaves Still Life */}
          <div className="lg:col-span-6 relative flex items-center justify-center select-none">
            <div className="relative w-full max-w-[540px] aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_22px_55px_-10px_rgba(24,21,17,0.22)] border border-[#E5DFD5] dark:border-[#382F24] bg-white">
              <Image
                src="/images/mindful-tomorrow-spread.jpg"
                alt="A More Mindful Tomorrow open book spread"
                fill
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover"
              />
              
              {/* Subtle glass badge overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2.5 rounded-xl bg-black/45 backdrop-blur-md text-white text-xs">
                <div>
                  <span className="font-serif font-bold text-sm block">A More Mindful Tomorrow</span>
                  <span className="text-[10px] text-white/80">Refined Typesetting • 300 DPI CMYK Print</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber-300">
                  Ready to Export
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy & 3 Download Pills */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1ECE2] dark:bg-[#231E18] text-[#8C5F2E] dark:text-[#C49B66] border border-[#E5D7C3] dark:border-[#382F24] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#A87B45]" />
              <span>Beautiful. Portable. Yours.</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#181511] dark:text-[#F8F5EE] tracking-tight leading-[1.15] mb-4">
              Export, Share, Inspire.
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#6B635B] dark:text-[#A8A199] leading-relaxed mb-8 font-sans">
              Download print-ready PDF files for physical printing, reflowable EPUB for readers like Kindle and Apple Books, or share a private interactive web link.
            </p>

            {/* The 3 Signature Action Pills (Exact match to reference mockup) */}
            <div className="w-full space-y-3 mb-8">
              
              {/* Option 1: PDF */}
              <div
                onClick={() => handleAction('pdf')}
                className="group cursor-pointer flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E1B18] border border-[#EDE6DC] dark:border-[#2C2721] hover:border-[#8C5F2E]/60 shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] dark:bg-[#282420] border border-[#E5DFD5] dark:border-[#382F24] flex items-center justify-center text-[#8C5F2E] dark:text-[#C49B66] group-hover:scale-105 transition-transform">
                    <FileDown className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#181511] dark:text-[#F8F5EE] group-hover:text-[#8C5F2E] dark:group-hover:text-[#C49B66] transition-colors">
                      Download PDF
                    </h3>
                    <p className="text-xs text-[#746B60] dark:text-[#A8A199] mt-0.5">
                      Print-ready 300 DPI CMYK layout for physical press or home printing
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C5F2E] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </div>

              {/* Option 2: EPUB */}
              <div
                onClick={() => handleAction('epub')}
                className="group cursor-pointer flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E1B18] border border-[#EDE6DC] dark:border-[#2C2721] hover:border-[#8C5F2E]/60 shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] dark:bg-[#282420] border border-[#E5DFD5] dark:border-[#382F24] flex items-center justify-center text-[#8C5F2E] dark:text-[#C49B66] group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#181511] dark:text-[#F8F5EE] group-hover:text-[#8C5F2E] dark:group-hover:text-[#C49B66] transition-colors">
                      Download EPUB
                    </h3>
                    <p className="text-xs text-[#746B60] dark:text-[#A8A199] mt-0.5">
                      Reflowable standard EPUB 3.0 for Kindle, Apple Books, and Kobo
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C5F2E] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </div>

              {/* Option 3: Share */}
              <div
                onClick={() => handleAction('share')}
                className="group cursor-pointer flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E1B18] border border-[#EDE6DC] dark:border-[#2C2721] hover:border-[#8C5F2E]/60 shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] dark:bg-[#282420] border border-[#E5DFD5] dark:border-[#382F24] flex items-center justify-center text-[#8C5F2E] dark:text-[#C49B66] group-hover:scale-105 transition-transform">
                    <Share2 className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#181511] dark:text-[#F8F5EE] group-hover:text-[#8C5F2E] dark:group-hover:text-[#C49B66] transition-colors">
                      Share Book
                    </h3>
                    <p className="text-xs text-[#746B60] dark:text-[#A8A199] mt-0.5">
                      Interactive read-only web link with dual-page flip animations
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C5F2E] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </div>

            </div>

            {/* Commercial Rights / Integrity check */}
            <div className="flex items-center gap-2 text-xs text-[#746B60] dark:text-[#A8A199]">
              <Check className="w-4 h-4 text-[#8C5F2E] shrink-0" />
              <span>Zero watermarks. Complete commercial copyright is 100% yours.</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
