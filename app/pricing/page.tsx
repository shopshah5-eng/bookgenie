'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/Button';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      badge: 'For Curious Creators',
      priceINR: '₹0',
      priceUSD: '$0',
      period: 'forever free',
      description: 'Test the power of AI publishing with complete core features.',
      features: [
        '3 generated books per month',
        'Up to 16 pages per book',
        'Standard cover artwork',
        'Digital interactive reader',
        'Basic natural-language revisions',
        'Watermarked sample exports',
      ],
      cta: 'Start Free',
      variant: 'secondary' as const,
    },
    {
      id: 'creator',
      name: 'Creator',
      badge: 'Most Popular',
      priceINR: '₹999',
      priceUSD: '$19',
      period: 'per month',
      description: 'For educators, authors, and entrepreneurs publishing regularly.',
      features: [
        '20 generated books per month',
        'Up to 60 pages per book',
        'High-resolution Gemini illustrations',
        'Full PDF & EPUB downloads (No watermark)',
        'Commercial publishing rights',
        'Unlimited AI revisions & versioning',
        'Character consistency bibles',
      ],
      cta: 'Choose Creator Plan',
      variant: 'primary' as const,
      isPopular: true,
    },
    {
      id: 'pro',
      name: 'Pro Publisher',
      badge: 'For Serious Makers',
      priceINR: '₹2,499',
      priceUSD: '$49',
      period: 'per month',
      description: 'Maximum generation volume, high-capacity pages, and priority AI queue.',
      features: [
        '60 generated books per month',
        'Up to 150 pages per book',
        '50 high-res illustrations / month',
        'Priority server-side generation queue',
        'Full PDF & EPUB with custom print CSS',
        'Full commercial and distribution rights',
        'Early access to coming KDP export templates',
      ],
      cta: 'Choose Pro Plan',
      variant: 'secondary' as const,
    },
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F3EA] text-[#8C5F2E] border border-[#E8DCCB] text-[11px] font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Simple, Transparent Pricing
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A1612] tracking-tight mb-4">
              Invest in Your Publishing Ideas
            </h1>
            <p className="text-sm sm:text-base text-[#6B635B] mb-6">
              Start free, then upgrade as your catalogue of AI-published books expands.
            </p>

            {/* Currency Switcher */}
            <div className="inline-flex items-center p-1 rounded-xl bg-white border border-[#EFECE6] shadow-2xs">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  currency === 'INR'
                    ? 'bg-[#9A6F3C] text-white shadow-2xs'
                    : 'text-[#6B635B] hover:text-[#1A1612]'
                }`}
              >
                ₹ INR (India)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  currency === 'USD'
                    ? 'bg-[#9A6F3C] text-white shadow-2xs'
                    : 'text-[#6B635B] hover:text-[#1A1612]'
                }`}
              >
                $ USD (Global)
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 ${
                  plan.isPopular
                    ? 'bg-white border-2 border-[#9A6F3C] shadow-xl transform md:-translate-y-2'
                    : 'bg-white border border-[#EFECE6] shadow-sm hover:border-[#DDD3C2]'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#9A6F3C] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-xs">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-[#8C5F2E] mb-2">
                    {plan.badge}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#1A1612] mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-[#6B635B] mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-[#F4F1EA]">
                    <span className="text-4xl font-serif font-bold text-[#1A1612]">
                      {currency === 'INR' ? plan.priceINR : plan.priceUSD}
                    </span>
                    <span className="text-xs text-[#9E968E]">/ {plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#2D2620]">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/create" className="w-full">
                  <Button variant={plan.variant} size="lg" className="w-full shadow-xs font-semibold">
                    {plan.cta} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-[#9E968E]">
            All paid subscriptions come with a 7-day money-back guarantee. Cancel anytime with a single click.
          </div>
        </main>

        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
