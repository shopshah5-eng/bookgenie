'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { ArrowRight, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

export function CallToActionBanner() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const handleStart = () => {
    if (!user) {
      openAuthModal('signup', '/create');
    } else {
      router.push('/create');
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-[#F8F4EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#F5EFE6] via-[#EFE7D8] to-[#E5DBC8] border border-[#D9CBBA] p-8 sm:p-14 overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Subtle Radial Atmosphere */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none -z-0" />

          {/* Left Decorative Book Geometry */}
          <div className="hidden lg:flex items-center gap-4 shrink-0 z-10">
            <div className="w-16 h-22 bg-[#0B2545] border border-[#2E5077] rounded-sm book-shadow flex flex-col justify-between p-2 text-white transform -rotate-6">
              <span className="text-[7px] uppercase tracking-widest text-amber-200 font-semibold">Studio</span>
              <BookOpen className="w-5 h-5 text-white/90 mx-auto" />
              <span className="text-[7px] text-sky-200 italic">Ocean</span>
            </div>
            <div className="w-16 h-24 bg-white border border-[#E5D5C0] rounded-sm book-shadow flex flex-col justify-between p-2 text-[#181511] transform rotate-3">
              <span className="text-[7px] uppercase tracking-widest text-[#A47A45] font-semibold">Book</span>
              <div className="space-y-1">
                <div className="w-full h-1 bg-[#181511]/10 rounded-full" />
                <div className="w-3/4 h-1 bg-[#181511]/10 rounded-full" />
              </div>
              <span className="text-[7px] text-[#9E968E] italic">Page 1</span>
            </div>
          </div>

          {/* Center Text */}
          <div className="relative z-10 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 text-[#8C5F2E] border border-[#D9CBBA] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3 text-[#A47A45]" /> Ready to Publish
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#181511] tracking-tight mb-2 leading-tight">
              Your story belongs on paper.
            </h2>
            <p className="text-sm sm:text-base text-[#746B60] leading-relaxed">
              Step into the studio. Create your first illustrated picture book, fiction novel, or practical guide in under three minutes.
            </p>
          </div>

          {/* Right Action Button & Guarantee */}
          <div className="relative z-10 flex flex-col items-center md:items-end shrink-0 w-full sm:w-auto">
            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white gold-gradient-bg shadow-md hover:shadow-lg transition-all active:scale-[0.98] w-full sm:w-auto"
            >
              <span>Enter Publishing Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mt-3 text-xs text-[#746B60]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5F2E]" />
              <span>Full commercial rights • PDF & EPUB3</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
