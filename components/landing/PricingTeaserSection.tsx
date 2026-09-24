'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export function PricingTeaserSection() {
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
    <section id="pricing" className="py-14 sm:py-20 bg-white dark:bg-[#0A0A0A] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            Start creating today.
          </h2>
          <p className="text-sm sm:text-base text-[#666666] dark:text-[#999999] mt-2 font-sans">
            Build your blueprint and preview your book for free. Upgrade only when you are ready to export bookstore-ready files.
          </p>
        </div>

        {/* 2-Tier Compact Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Free Tier */}
          <div className="p-7 sm:p-8 rounded-3xl border border-[#EAEAEA] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#141414] flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif font-bold text-xl text-[#111111] dark:text-white">
                  Creator Free
                </h3>
                <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-white dark:bg-[#222222] border border-[#E5E5E5] dark:border-[#333333] text-[#666666] dark:text-[#AAAAAA]">
                  No Card Required
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-4">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-white">$0</span>
                <span className="text-xs text-[#888888]">/ free forever</span>
              </div>

              <p className="text-xs text-[#666666] dark:text-[#999999] mb-6">
                Perfect for ideation, blueprinting, and testing your book concept in the studio.
              </p>

              <div className="space-y-3 pt-4 border-t border-[#EFEFEF] dark:border-[#222222]">
                {[
                  'Architectural blueprint & chapter arc generator',
                  'First 2 complete chapters generation',
                  'Standard resolution interior artwork preview',
                  'Interactive dual-page web reader preview',
                  'Save project to personal bookshelf',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-[#444444] dark:text-[#CCCCCC]">
                    <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center gap-2 mt-8 w-full px-5 py-3 rounded-full text-xs font-semibold bg-white dark:bg-[#1C1C1C] text-[#111111] dark:text-white border border-[#D5D5D5] dark:border-[#333333] hover:border-[#111111] dark:hover:border-white transition-all shadow-2xs cursor-pointer"
            >
              <span>Start Free Blueprint</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pro Tier */}
          <div className="p-7 sm:p-8 rounded-3xl border border-[#111111] dark:border-white bg-[#111111] dark:bg-[#181818] text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif font-bold text-xl text-white">
                  Author Studio Pro
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#9A6F3C] text-white">
                  <Sparkles className="w-3 h-3" />
                  <span>Most Popular</span>
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-4">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-white">$29</span>
                <span className="text-xs text-[#AAAAAA]">/ per completed book</span>
              </div>

              <p className="text-xs text-[#CCCCCC] mb-6">
                Full production generation with high-resolution artwork and commercial press files.
              </p>

              <div className="space-y-3 pt-4 border-t border-white/15">
                {[
                  'Full manuscript generation (up to 350+ pages)',
                  'Cohesive 4K cover and interior illustration engine',
                  'Press-ready 300 DPI CMYK PDF with bleed margins',
                  'Validated W3C EPUB3 file for Apple Books & Kindle',
                  '100% commercial distribution & copyright rights',
                  'Unlimited targeted AI revisions and text edits',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-[#EAEAEA]">
                    <Check className="w-3.5 h-3.5 text-[#34D399] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.push('/pricing')}
              className="inline-flex items-center justify-center gap-2 mt-8 w-full px-5 py-3 rounded-full text-xs font-semibold bg-white text-black hover:bg-neutral-100 transition-all shadow-sm cursor-pointer"
            >
              <span>Get Author Studio Pro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* View Complete Breakdown Link */}
        <div className="text-center mt-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white transition-colors"
          >
            <span>Compare full plan features, subscription bundles, and print specifications</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </section>
  );
}
