'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { Footer } from '@/components/landing/Footer';
import { EBOOK_CATALOG, EbookProduct } from '@/lib/ebooks/catalog';
import { EbookCheckoutModal } from '@/components/ebooks/EbookCheckoutModal';
import { OrderLookupSection } from '@/components/ebooks/OrderLookupSection';
import {
  Download,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Layers,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

export default function DigitalBlueprintStorePage() {
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<EbookProduct | null>(null);

  const starterKit = EBOOK_CATALOG['starter-kit'];
  const blueprint = EBOOK_CATALOG['blueprint'];
  const glowUp = EBOOK_CATALOG['glow-up'];

  return (
    <div className="min-h-screen bg-white text-[#111111] antialiased font-sans flex flex-col selection:bg-[#111111] selection:text-white">
      <MinimalHeader />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>2026 Digital Publishing Masterclass</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1A1612] tracking-tight leading-[1.15] mb-5">
            Turn Your Knowledge & Ideas Into <span className="italic">Recurring Income</span>
          </h1>

          <p className="text-base sm:text-lg text-[#6B635B] font-light leading-relaxed mb-8 max-w-2xl mx-auto">
            Get the exact playbook used to validate, build, price, and sell high-margin digital products
            with organic flywheels and scalable paid ads in 2026.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#7D746B]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-700" /> Instant PDF Delivery
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-700" /> 100% DRM-Free
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-700" /> 34 Comprehensive Chapters
            </span>
          </div>
        </div>

        {/* The Two Ebooks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-stretch">
          {/* EBOOK 1: THE FIRST $100 ONLINE (FREE STARTER KIT) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EBE6DC] p-7 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-bold tracking-wide uppercase">
                  Free Starter Kit
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  100% FREE
                </span>
              </div>

              <div className="relative w-44 sm:w-48 aspect-[2/3] mx-auto rounded-2xl overflow-hidden shadow-lg border border-neutral-200 mb-6 bg-neutral-900 group">
                <Image
                  src={starterKit.coverImage}
                  alt={starterKit.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <h2 className="font-serif text-2xl font-normal text-[#1A1612] text-center mb-2">
                {starterKit.title}
              </h2>
              <p className="text-xs text-[#6B635B] text-center font-light mb-6">
                {starterKit.subtitle}
              </p>

              <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#ECE5D8] mb-6">
                <div className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-2">
                  What’s Inside (12 Pages):
                </div>
                <ul className="space-y-2 text-xs text-[#554E46]">
                  {starterKit.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-800 font-bold">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setSelectedProduct(starterKit)}
              className="w-full py-4 px-6 rounded-2xl bg-[#1A1612] hover:bg-[#2D2721] text-white text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>Download Free Starter Kit (PDF)</span>
            </button>
          </div>

          {/* EBOOK 2: THE DIGITAL PRODUCT PROFIT BLUEPRINT (₹299) */}
          <div className="lg:col-span-7 bg-[#141416] text-white rounded-3xl border border-neutral-800 p-7 sm:p-9 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold tracking-wide uppercase">
                  Complete Master System
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  Instant Access
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                <div className="relative w-40 sm:w-44 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 bg-black shrink-0 group">
                  <Image
                    src={blueprint.coverImage}
                    alt={blueprint.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white leading-snug mb-2">
                    {blueprint.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 font-light mb-4">
                    {blueprint.subtitle}
                  </p>

                  <div className="flex items-baseline justify-center sm:justify-start gap-3 mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-amber-400">
                      ₹{blueprint.priceInr}
                    </span>
                    <span className="text-base text-neutral-500 line-through">₹999</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold">
                      70% Launch Special
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400">
                    One-time payment • Lifetime access • Includes free updates
                  </p>
                </div>
              </div>

              {/* Highlights & Modules */}
              <div className="bg-neutral-900/80 rounded-2xl p-5 border border-neutral-800 mb-6">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>The Master Curriculum (96 Pages, 34 Chapters):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-neutral-300">
                  {blueprint.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">✓</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-neutral-800">
              <button
                onClick={() => setSelectedProduct(blueprint)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-sm sm:text-base font-bold transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Lock className="w-4 h-4 text-neutral-900" />
                <span>Get Instant Access for ₹299</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Razorpay Checkout
                </span>
                <span>•</span>
                <span>UPI, Cards, NetBanking</span>
                <span>•</span>
                <span>Instant Direct Download</span>
              </div>
            </div>
          </div>
        </div>

        {/* EBOOK 3: 30 DAY GLOW UP MAN PLAN (40-PAGE FIELD GUIDE) */}
        {glowUp && (
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#EAE4D8] p-6 sm:p-8 mb-16 shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative w-28 sm:w-32 aspect-[2/3] rounded-2xl overflow-hidden shadow-md border border-black/10 shrink-0 bg-neutral-900 group">
                <Image
                  src={glowUp.coverImage}
                  alt={glowUp.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="max-w-xl">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold tracking-wide uppercase mb-2">
                  {glowUp.badge}
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#1A1612] mb-1">
                  {glowUp.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B635B] font-light mb-4">
                  {glowUp.subtitle}
                </p>
                <div className="flex items-baseline gap-2 mb-3 justify-center sm:justify-start">
                  <span className="text-2xl font-bold text-amber-700">
                    ₹{glowUp.priceInr}
                  </span>
                  <span className="text-xs text-neutral-400 line-through">₹499</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-xs font-bold">
                    70% OFF
                  </span>
                  <span className="text-xs text-[#8A8077] font-medium">• 40 Pages</span>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#554E46]">
                  <span>✓ 40-Page Field Guide</span>
                  <span>•</span>
                  <span>✓ Workout A & B Routine</span>
                  <span>•</span>
                  <span>✓ 30-Day Habit Tracker</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setSelectedProduct(glowUp)}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Lock className="w-4 h-4 text-neutral-900" />
                <span>Get Instant Access for ₹149</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* VERIFY WITH ORDER NUMBER (RE-DOWNLOAD SECTION) */}
        <OrderLookupSection />

        {/* Why This Blueprint Works in 2026 */}
        <div className="bg-white rounded-3xl border border-[#EBE6DC] p-8 sm:p-12 mb-16 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Battle-Tested Blueprint
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1612] font-normal mt-1">
              Engineered For The Real 2026 Creator Economy
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D8]">
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 flex items-center justify-center mb-4 text-amber-900">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-medium text-[#1A1612] mb-1.5">
                The 2-Weekend Validation
              </h4>
              <p className="text-xs text-[#6B635B] font-light leading-relaxed">
                Never spend months building products nobody buys. Use Google Trends, Etsy autocomplete, and 3-star review mining to know demand exists beforehand.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D8]">
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 flex items-center justify-center mb-4 text-amber-900">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-medium text-[#1A1612] mb-1.5">
                Organic Traffic Flywheel
              </h4>
              <p className="text-xs text-[#6B635B] font-light leading-relaxed">
                Master the exact 80/20 content rule: turn 1 pillar post into 5 shorts, 10 Pinterest pins, and an automated email sequence that sells 24/7.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D8]">
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 flex items-center justify-center mb-4 text-amber-900">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-medium text-[#1A1612] mb-1.5">
                8 Illustrated Ad Setups
              </h4>
              <p className="text-xs text-[#6B635B] font-light leading-relaxed">
                Step-by-step walkthroughs for Meta, Google Search, TikTok, and Pinterest with strict testing gates so you never burn money on unprofitable clicks.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Checkout Modal */}
      {selectedProduct && (
        <EbookCheckoutModal
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          initialEmail={user?.email || ''}
        />
      )}
    </div>
  );
}
