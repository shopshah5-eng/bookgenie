'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

export function MinimalPricing() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handleAction = (planId: string) => {
    if (!user) {
      openAuthModal('signup', '/pricing');
      return;
    }
    router.push('/pricing');
  };

  return (
    <section className="w-full py-20 bg-white border-b border-[#0000000a]" id="pricing">
      <div className="max-w-[1240px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F5F3] text-[#666666] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#EAEAEA]">
            Plans &amp; Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#111111] tracking-tight leading-tight">
            Simple, transparent publishing plans.
          </h2>
          <p className="text-sm sm:text-base text-[#666666] mt-3 font-sans leading-relaxed">
            Start creating free, purchase a single book pass with no subscription, or unlock recurring volume for active publishing.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center gap-1.5 p-1 rounded-full bg-[#F5F5F3] border border-[#EAEAEA]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#111111] shadow-xs font-semibold'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-white text-[#111111] shadow-xs font-semibold'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#111111] text-white">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Card 1: Free Starter */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#EAEAEA] bg-white p-6 transition-all duration-200 hover:border-[#111111]/30 hover:shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
                  Discovery
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#111111] mb-1">
                Free Starter
              </h3>
              <p className="text-xs text-[#666666] mb-5 leading-relaxed">
                Test the studio risk-free. Create your first book and experience the reading folio.
              </p>
              <div className="flex items-baseline gap-1 mb-5 pb-5 border-b border-[#F0F0F0]">
                <span className="text-3xl font-serif font-bold text-[#111111]">$0</span>
                <span className="text-xs text-[#888888]">/ forever free</span>
              </div>
              <ul className="space-y-3 mb-6 text-xs text-[#333333]">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span><strong>1 Complete Book</strong> (up to 16 pages)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span>4 Illustrated Plates &amp; Cover Art</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span>Interactive Reading Folio</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span>Notes &amp; Outline Ingestion</span>
                </li>
              </ul>
            </div>
            <Link
              href="/create"
              className="w-full py-2.5 px-4 rounded-full text-center text-xs font-semibold text-[#111111] bg-[#F5F5F3] hover:bg-[#EAEAEA] transition-colors cursor-pointer"
            >
              Start Free
            </Link>
          </div>

          {/* Card 2: Single Book Pass (No subscription) */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-[#111111] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-[#111111] uppercase tracking-wider">
                  Pay As You Go
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F5F3] text-[#111111] font-semibold">
                  No Subscription
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#111111] mb-1">
                Single Book Pass
              </h3>
              <p className="text-xs text-[#666666] mb-5 leading-relaxed">
                Ideal for a single gift, memoir, or lead magnet. Buy once, own forever.
              </p>
              <div className="flex items-baseline gap-1 mb-5 pb-5 border-b border-[#F0F0F0]">
                <span className="text-3xl font-serif font-bold text-[#111111]">$19</span>
                <span className="text-xs text-[#888888]">/ one-time payment</span>
              </div>
              <ul className="space-y-3 mb-6 text-xs text-[#333333]">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span><strong>1 Complete Book</strong> (up to 120 pages)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span>300 DPI Press PDF + EPUB3</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span>100% Commercial Rights</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span>In-Reader Chapter Revision Dock</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span>Zero Watermarks &amp; Clean Colophon</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleAction('author-single')}
              className="w-full py-2.5 px-4 rounded-full text-center text-xs font-semibold text-white bg-[#111111] hover:bg-black transition-colors cursor-pointer shadow-xs"
            >
              Get Single Pass ($19)
            </button>
          </div>

          {/* Card 3: Pro Creator (Most Popular) */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-[#111111] bg-[#111111] text-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white uppercase tracking-wider">
                  Most Popular
                </span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-1">
                Pro Creator
              </h3>
              <p className="text-xs text-[#AAAAAA] mb-5 leading-relaxed">
                For active authors and creators publishing full series for Amazon KDP.
              </p>
              <div className="flex items-baseline gap-1 mb-5 pb-5 border-b border-white/10">
                <span className="text-3xl font-serif font-bold text-white">
                  {billingCycle === 'annual' ? '$12' : '$15'}
                </span>
                <span className="text-xs text-[#AAAAAA]">
                  / month {billingCycle === 'annual' ? '($144/yr)' : ''}
                </span>
              </div>
              <ul className="space-y-3 mb-6 text-xs text-[#DDDDDD]">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><strong>15 Books</strong> / month (up to 64 pages)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><strong>Unlimited PDF &amp; EPUB Exports</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>Full Commercial Rights</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>In-Reader Revision Dock</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>Permanent Bookshelf Storage</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleAction('creator')}
              className="w-full py-2.5 px-4 rounded-full text-center text-xs font-semibold text-[#111111] bg-white hover:bg-[#F0F0F0] transition-colors cursor-pointer"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Card 4: Premium Atelier */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#EAEAEA] bg-white p-6 transition-all duration-200 hover:border-[#111111]/30 hover:shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
                  Imprint / Agency
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#111111] mb-1">
                Premium Atelier
              </h3>
              <p className="text-xs text-[#666666] mb-5 leading-relaxed">
                For serial publishers and marketing agencies scaling continuous catalogs.
              </p>
              <div className="flex items-baseline gap-1 mb-5 pb-5 border-b border-[#F0F0F0]">
                <span className="text-3xl font-serif font-bold text-[#111111]">
                  {billingCycle === 'annual' ? '$32' : '$39'}
                </span>
                <span className="text-xs text-[#888888]">
                  / month {billingCycle === 'annual' ? '($384/yr)' : ''}
                </span>
              </div>
              <ul className="space-y-3 mb-6 text-xs text-[#333333]">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span><strong>50 Books</strong> / mo (up to 300 pages)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span><strong>250 Visual Plates</strong> with character lock</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span>Priority Studio Queue</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span>Custom Imprint &amp; ISBN Ingestion</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span>Markdown &amp; Raw Assets Archive</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleAction('pro')}
              className="w-full py-2.5 px-4 rounded-full text-center text-xs font-semibold text-[#111111] bg-[#F5F5F3] hover:bg-[#EAEAEA] transition-colors cursor-pointer"
            >
              Join Atelier
            </button>
          </div>

        </div>

        {/* Bottom Banner to Full Pricing & Publishing Services */}
        <div className="mt-12 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#111111] hover:underline"
          >
            <span>Need Amazon KDP pre-press packages or physical print-on-demand hardcovers? View full details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
