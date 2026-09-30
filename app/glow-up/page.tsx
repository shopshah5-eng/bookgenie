'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { Footer } from '@/components/landing/Footer';
import { EBOOK_CATALOG } from '@/lib/ebooks/catalog';
import { EbookCheckoutModal } from '@/components/ebooks/EbookCheckoutModal';
import { OrderLookupSection } from '@/components/ebooks/OrderLookupSection';
import {
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Download,
  Dumbbell,
  Droplets,
  Moon,
  Flame,
  Shirt,
  CalendarCheck,
} from 'lucide-react';

export default function GlowUpStandalonePage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const glowUp = EBOOK_CATALOG['glow-up'];

  const pillars = [
    {
      icon: Moon,
      title: '1. Sleep & Recovery Architecture',
      desc: '7–8 hours strictly in a cool, dark room. Melatonin optimization 45 min before bed. No blue light.',
    },
    {
      icon: Droplets,
      title: '2. Deep Hydration & Electrolytes',
      desc: '3.5 to 4 liters of water daily with cellular morning mineral kickstart to eliminate face puffiness.',
    },
    {
      icon: Flame,
      title: '3. Simplified Skincare Stack',
      desc: 'Gentle cleanser, hyaluronic/niacinamide moisturizer, and mineral SPF 50 in AM. Retinol 3x/week in PM.',
    },
    {
      icon: Dumbbell,
      title: '4. Frame Realignment & Lifting',
      desc: '4 lifting sessions weekly + 10k daily steps. Daily posture correction (dead hangs, wall slides, face pulls).',
    },
    {
      icon: Shirt,
      title: '5. Grooming, Wardrobe & Scent',
      desc: 'Bone-structure haircut consult, precision beard trimming, fit-first wardrobe rules, and signature pulse-point fragrance.',
    },
    {
      icon: CalendarCheck,
      title: '6. The 100-Point Daily Scorecard',
      desc: 'A simple daily accountability system to score at least 80 points daily and lock in compound progress.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1A1612] antialiased flex flex-col selection:bg-amber-100 selection:text-amber-900">
      <MinimalHeader />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-5 sm:px-6 py-12 sm:py-16">
        {/* Top Product Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Official 2026 Men’s Transformation Field Guide</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1A1612] tracking-tight leading-[1.15] mb-5">
            30 Day Glow Up: <span className="text-[#9A6F3C] italic font-serif">Man Plan</span>
          </h1>

          <p className="text-base sm:text-lg text-[#6B635B] font-light leading-relaxed max-w-2xl mx-auto mb-8">
            A practical, no-fluff field manual to dramatically sharpen your skin, fitness, posture,
            grooming, nutrition, and everyday presence in 30 days.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#6B635B]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#9A6F3C]" /> 40 Pages Comprehensive PDF
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#9A6F3C]" /> Instant Direct Download
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#9A6F3C]" /> 100% DRM-Free
            </span>
          </div>
        </div>

        {/* Featured Showcase Card */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-7 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50/50 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Book Cover Mockup */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-52 sm:w-60 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.12)] border border-[#EAEAEA] bg-neutral-100 group">
                <Image
                  src={glowUp.coverImage}
                  alt={glowUp.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Product Details & Purchase CTA */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-[11px] font-bold tracking-wide uppercase mb-3">
                  {glowUp.badge}
                </span>

                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1612] mb-2 leading-snug">
                  Transform Your Appearance, Energy & Presence
                </h2>

                <p className="text-sm text-[#6B635B] font-light mb-6 leading-relaxed">
                  Real transformation isn’t about 50 complicated hacks. It’s about compounding the 5
                  highest-leverage habits that change facial bone definition, skin clarity, and physical presence.
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-[#1A1612]">
                    ₹{glowUp.priceInr}
                  </span>
                  <span className="text-lg text-neutral-400 line-through">₹499</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    70% Launch Special
                  </span>
                </div>

                <div className="space-y-2 mb-8 text-xs sm:text-sm text-[#1A1612]">
                  {glowUp.highlights.slice(0, 4).map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-[#9A6F3C] font-bold shrink-0">✓</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Buy CTA */}
              <div>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-[#1A1612] hover:bg-[#2D2721] text-white text-base font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Get 30 Day Glow Up Now — ₹149</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-[#8A8077]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Razorpay
                  </span>
                  <span>•</span>
                  <span>UPI, Cards, NetBanking</span>
                  <span>•</span>
                  <span>Instant Direct PDF</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Core Pillars Breakdown */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1612] mb-3">
              The 6 Transformation Pillars
            </h2>
            <p className="text-sm text-[#6B635B] font-light max-w-xl mx-auto">
              Every section is engineered as an actionable daily field guide without fluff.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#EAEAEA] p-6 hover:border-[#9A6F3C]/40 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#9A6F3C] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-normal text-[#1A1612] mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#6B635B] font-normal leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Second Buy Trigger Banner */}
        <div className="bg-gradient-to-br from-amber-50/60 via-white to-amber-50/40 rounded-3xl border border-amber-200/80 p-8 sm:p-12 text-center mb-16 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1612] mb-4">
            Start Your 30-Day Protocol Today
          </h2>
          <p className="text-sm text-[#6B635B] font-light max-w-lg mx-auto mb-8">
            One-time ₹149 payment. Immediate access to the complete 40-page blueprint, 4-week protocol,
            and printable daily scorecards.
          </p>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="inline-flex items-center gap-2 py-4 px-8 rounded-full bg-[#1A1612] hover:bg-[#2D2721] text-white font-semibold text-sm sm:text-base transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download 30 Day Glow Up (PDF) — ₹149</span>
          </button>
        </div>

        {/* Order Lookup / Re-download Section */}
        <div className="mb-12">
          <OrderLookupSection />
        </div>

        {/* Back Link */}
        <div className="text-center pb-8">
          <Link
            href="/digital-blueprint"
            className="text-xs text-[#8A8077] hover:text-[#1A1612] transition-colors underline underline-offset-4"
          >
            ← View full BookGenie digital publishing catalog
          </Link>
        </div>
      </main>

      <Footer />

      {/* Checkout Modal */}
      <EbookCheckoutModal
        isOpen={isCheckoutOpen}
        product={glowUp}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
