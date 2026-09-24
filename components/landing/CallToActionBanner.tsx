'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { ArrowRight, Play } from 'lucide-react';

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
    <section className="py-14 sm:py-20 bg-white dark:bg-[#0A0A0A] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading, Subtitle & Buttons */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight leading-[1.1] mb-4">
              Your next book starts with one idea.
            </h2>

            <p className="text-sm sm:text-base text-[#666666] dark:text-[#999999] max-w-lg leading-relaxed mb-7">
              You don&apos;t need a publisher. You don&apos;t need a designer. You just need the idea.
            </p>

            {/* CTA Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleStart}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#111111] hover:bg-black dark:bg-white dark:text-black dark:hover:bg-[#EAEAEA] transition-all shadow-xs active:scale-[0.98] cursor-pointer w-full sm:w-auto"
              >
                <span>Create my book</span>
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
          </div>

          {/* Right Column: Book Spine Still Life + Plant + Cursive Note */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-6 sm:gap-8 select-none">
            
            {/* Minimalist White Vase with Plant */}
            <div className="relative w-20 h-28 sm:w-24 sm:h-32 shrink-0 hidden sm:block opacity-90">
              <Image
                src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=200&q=80"
                alt="Studio Plant"
                fill
                sizes="96px"
                className="object-cover rounded-full [mask-image:radial-gradient(circle,black_60%,transparent_100%)]"
              />
            </div>

            {/* 4 Books Stack Mockup */}
            <div className="w-[190px] sm:w-[220px] space-y-1.5 shadow-[0_15px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.5)] p-2 rounded-xl bg-white dark:bg-[#161616] border border-[#EAEAEA] dark:border-[#262626]">
              {/* Spine 1: Ideas */}
              <div className="h-9 rounded-md bg-[#FAFAFA] dark:bg-[#22201D] border border-[#EEEEEE] dark:border-[#38342E] flex items-center justify-between px-3 text-xs font-serif font-bold text-[#333333] dark:text-[#D5CFC5]">
                <span className="text-[10px] font-sans font-normal text-[#888888]">01</span>
                <span className="tracking-widest uppercase text-[11px]">Ideas</span>
                <span className="w-2" />
              </div>

              {/* Spine 2: Create */}
              <div className="h-9 rounded-md bg-[#F2F2F2] dark:bg-[#2A2723] border border-[#E5E5E5] dark:border-[#3F3A33] flex items-center justify-between px-3 text-xs font-serif font-bold text-[#2A2A2A] dark:text-[#E2DCCF]">
                <span className="text-[10px] font-sans font-normal text-[#888888]">02</span>
                <span className="tracking-widest uppercase text-[11px]">Create</span>
                <span className="w-2" />
              </div>

              {/* Spine 3: Publish */}
              <div className="h-10 rounded-md bg-[#EAEAEA] dark:bg-[#332F2A] border border-[#DCDCDC] dark:border-[#484239] flex items-center justify-between px-3 text-xs font-serif font-bold text-[#222222] dark:text-[#EAE5DC]">
                <span className="text-[10px] font-sans font-normal text-[#888888]">03</span>
                <span className="tracking-widest uppercase text-[11px]">Publish</span>
                <span className="w-2" />
              </div>

              {/* Spine 4: Belong */}
              <div className="h-11 rounded-md bg-[#E0E0E0] dark:bg-[#3D3730] border border-[#D0D0D0] dark:border-[#524B40] flex items-center justify-between px-4 text-xs font-serif font-bold text-[#111111] dark:text-[#F5F2EB]">
                <span className="text-[10px] font-sans font-normal text-[#888888]">04</span>
                <span className="tracking-widest uppercase text-xs">Belong</span>
                <span className="w-2" />
              </div>
            </div>

            {/* Handwritten cursive callout */}
            <div className="transform -rotate-6 text-center sm:text-left select-none">
              <span className="font-serif italic text-sm sm:text-base text-[#444444] dark:text-[#D4AF37] block leading-tight">
                A brighter<br />more creative you.
              </span>
              <span className="text-xs text-[#888888] dark:text-[#C49B27] inline-block mt-0.5">
                ♡
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

