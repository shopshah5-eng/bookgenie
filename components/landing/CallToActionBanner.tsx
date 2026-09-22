'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { BookOpen, ArrowRight } from 'lucide-react';

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
    <section className="py-14 sm:py-16 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#F6EEE0] via-[#F2E8D7] to-[#ECE1CE] border border-[#E2D4BF] p-8 sm:p-12 overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#C9B79B_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          {/* Left Decorative Book Graphic */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <div className="w-16 h-20 bg-white/90 border border-[#DDD3C0] rounded-r-lg rounded-l-xs shadow-md flex items-center justify-center text-[#8C5F2E] transform -rotate-6">
              <BookOpen className="w-8 h-8 stroke-[1.8]" />
            </div>
            <div className="w-16 h-22 bg-[#FDFBF7] border border-[#DDD3C0] rounded-r-lg rounded-l-xs shadow-md flex items-center justify-center text-[#8C5F2E] transform rotate-3">
              <BookOpen className="w-8 h-8 stroke-[1.8]" />
            </div>
          </div>

          {/* Center Text */}
          <div className="relative z-10 text-center md:text-left max-w-xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1A1612] tracking-tight mb-2 leading-tight">
              Ready to create your book?
            </h2>
            <p className="text-sm sm:text-base text-[#6B635B]">
              Join thousands of creators and bring your ideas to life.
            </p>
          </div>

          {/* Right Action + Note */}
          <div className="relative z-10 flex flex-col items-center md:items-end shrink-0">
            <Button
              onClick={handleStart}
              size="lg"
              className="px-8 py-3.5 text-base shadow-md font-semibold"
            >
              Get started free <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <span className="text-[11px] text-[#8C8275] mt-2 font-medium">
              No credit card required.
            </span>
            <span className="text-xs font-serif italic text-[#8C5F2E] mt-3 hidden sm:inline">
              Better ideas. Brighter tomorrows ♡
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
