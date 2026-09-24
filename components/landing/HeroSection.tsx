'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export function HeroSection() {
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
    <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-16 bg-white dark:bg-[#0A0A0A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs (Exact match to reference) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left z-10">
            
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#F3F3F1] dark:bg-[#1E1E1E] text-[#666666] dark:text-[#A0A0A0] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mb-5 border border-[#E5E5E5] dark:border-[#2C2C2C]">
              AI PUBLISHING STUDIO
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight leading-[1.08] mb-5">
              Turn an idea into<br className="hidden sm:inline" /> a finished book.
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-base sm:text-lg text-[#555555] dark:text-[#A0A0A0] leading-relaxed max-w-xl mb-8 font-sans">
              BookGenie writes, structures, designs, illustrates, and prepares your book for publication.
            </p>

            {/* CTA Buttons Row */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8 w-full sm:w-auto">
              <button
                onClick={handleStart}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#111111] hover:bg-black dark:bg-white dark:text-black dark:hover:bg-[#EAEAEA] transition-all shadow-sm active:scale-[0.98] cursor-pointer w-full sm:w-auto"
              >
                <span>Create your book</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => router.push('/examples/ocean-wonders')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-medium text-[#111111] dark:text-[#F5F5F5] bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2C2C2C] hover:bg-[#F9F9F8] dark:hover:bg-[#222222] transition-all shadow-2xs cursor-pointer w-full sm:w-auto"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#111111] dark:text-white" />
                <span>Watch demo</span>
              </button>
            </div>

            {/* 4 Micro Feature Checks (Exact match from reference) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full text-[11px] sm:text-xs text-[#666666] dark:text-[#999999] font-medium pt-2 border-t border-[#F0F0EE] dark:border-[#1E1E1E]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#888888] dark:text-[#777777] shrink-0" />
                <span>No design skills required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#888888] dark:text-[#777777] shrink-0" />
                <span>Commercial rights</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#888888] dark:text-[#777777] shrink-0" />
                <span>PDF + EPUB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#888888] dark:text-[#777777] shrink-0" />
                <span>AI-powered publishing</span>
              </div>
            </div>

          </div>

          {/* Right Column: Physical Hardcover & Book Stack Still-Life */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex flex-col items-center justify-center select-none">
            
            {/* Visual Still Life Composition - Seamless Blend to Background */}
            <div className="relative w-full max-w-[560px] aspect-[4/3] overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_65%,transparent_100%)] dark:[mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] transition-transform duration-500 hover:scale-[1.01]">
              <Image
                src="/images/hero-brighter-you.jpg"
                alt="Artisanal hardcover book edition with stack of volumes"
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                priority
                className="object-cover object-center"
              />
            </div>

            {/* Handwritten Cursive Callout with Hand-drawn Arrow */}
            <div className="absolute -top-4 right-1 sm:right-4 z-20 hidden sm:flex flex-col items-end transform -rotate-2 select-none pointer-events-none">
              <span className="font-serif italic text-sm sm:text-base text-[#3A3530] dark:text-[#E8C28A] tracking-wide">
                Your ideas deserve a beautiful home.
              </span>
              <svg className="w-14 h-8 text-[#554E46] dark:text-[#D4AF37] -mr-2 mt-0.5" viewBox="0 0 56 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M4 4 C 18 10, 36 6, 44 24 M 38 20 L 44 24 L 46 16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}



