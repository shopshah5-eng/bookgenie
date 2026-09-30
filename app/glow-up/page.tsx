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
    <div className="min-h-screen bg-[#0D0D0F] text-[#EDECE9] antialiased flex flex-col selection:bg-amber-500/20 selection:text-amber-200">
      <MinimalHeader />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-5 sm:px-6 py-12 sm:py-16">
        {/* Top Product Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Official 2026 Men’s Transformation Field Guide</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.15] mb-5">
            30 Day Glow Up: <span className="text-amber-400 italic font-serif">Man Plan</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto mb-8">
            A practical, no-fluff field manual to dramatically sharpen your skin, fitness, posture,
            grooming, nutrition, and everyday presence in 30 days.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-neutral-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> 40 Pages Comprehensive PDF
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> Instant Direct Download
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> 100% DRM-Free
            </span>
          </div>
        </div>

        {/* Featured Showcase Card */}
        <div className="bg-[#151518] rounded-3xl border border-neutral-800 p-7 sm:p-10 shadow-2xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Book Cover Mockup */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-52 sm:w-60 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-amber-500/30 bg-black group">
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
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold tracking-wide uppercase mb-3">
                  {glowUp.badge}
                </span>

                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white mb-2 leading-snug">
                  Transform Your Appearance, Energy & Presence
                </h2>

                <p className="text-sm text-neutral-300 font-light mb-6 leading-relaxed">
                  Real transformation isn’t about 50 complicated hacks. It’s about compounding the 5
                  highest-leverage habits that change facial bone definition, skin clarity, and physical presence.
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-amber-400">
                    ₹{glowUp.priceInr}
                  </span>
                  <span className="text-lg text-neutral-500 line-through">₹499</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    70% Launch Special
                  </span>
                </div>

                <div className="space-y-2 mb-8 text-xs sm:text-sm text-neutral-300">
                  {glowUp.highlights.slice(0, 4).map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-amber-400 font-bold shrink-0">✓</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Buy CTA */}
              <div>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-base font-bold transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-neutral-900" />
                  <span>Get 30 Day Glow Up Now — ₹149</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
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
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white mb-3">
              The 6 Transformation Pillars
            </h2>
            <p className="text-sm text-neutral-400 font-light max-w-xl mx-auto">
              Every section is engineered as an actionable daily field guide without fluff.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#151518] rounded-2xl border border-neutral-800 p-6 hover:border-amber-500/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-normal text-white mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Second Buy Trigger Banner */}
        <div className="bg-gradient-to-br from-amber-500/20 via-[#151518] to-neutral-900 rounded-3xl border border-amber-500/30 p-8 sm:p-12 text-center mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white mb-4">
            Start Your 30-Day Protocol Today
          </h2>
          <p className="text-sm text-neutral-300 font-light max-w-lg mx-auto mb-8">
            One-time ₹149 payment. Immediate access to the complete 40-page blueprint, 4-week protocol,
            and printable daily scorecards.
          </p>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="inline-flex items-center gap-2 py-4 px-8 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm sm:text-base transition-all shadow-lg cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download 30 Day Glow Up (PDF) — ₹149</span>
          </button>
        </div>

        {/* Order Lookup / Re-download Section */}
        <div className="bg-[#151518] rounded-3xl border border-neutral-800 p-8 sm:p-10 mb-12">
          <OrderLookupSection />
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/digital-blueprint"
            className="text-xs text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
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
