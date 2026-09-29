'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { MinimalFooter } from '@/components/home/MinimalFooter';
import { useAuth } from '@/components/auth/AuthContext';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

function PricingContentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, openAuthModal } = useAuth();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch current active tier
  useEffect(() => {
    let ignore = false;
    if (user) {
      fetch('/api/subscription/upgrade')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!ignore && data?.tier) {
            setCurrentTier(data.tier);
          }
        })
        .catch(() => {});
    }
    return () => {
      ignore = true;
    };
  }, [user]);

  const handleSelectPlan = useCallback(async (planId: 'free' | 'creator' | 'pro') => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!user) {
      openAuthModal('signup', `/pricing?plan=${planId}&autoSelect=true`);
      return;
    }

    if (planId === currentTier) {
      router.push('/create');
      return;
    }

    setUpgradingTier(planId);

    try {
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: planId }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentTier(data.tier || planId);
        const planName = planId === 'pro' ? 'Premium Atelier' : planId === 'creator' ? 'Pro Creator' : 'Free Discovery';
        setSuccessMessage(`Success! Your account is now on the ${planName} plan.`);
      } else {
        setErrorMessage(data.error || data.message || 'Could not update plan. Please try again.');
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setUpgradingTier(null);
    }
  }, [user, currentTier, openAuthModal, router]);

  // Handle autoSelect from query param
  useEffect(() => {
    const requestedPlan = searchParams.get('plan');
    const autoSelect = searchParams.get('autoSelect');
    if (user && autoSelect === 'true' && requestedPlan) {
      const normalized = requestedPlan === 'pro' ? 'pro' : requestedPlan === 'creator' ? 'creator' : 'free';
      const timer = setTimeout(() => {
        handleSelectPlan(normalized as 'free' | 'creator' | 'pro');
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [user, searchParams, handleSelectPlan]);

  const pricingPlans = [
    {
      id: 'free' as const,
      name: 'Free Discovery',
      badge: 'Discovery',
      price: '$0',
      period: ' / forever free',
      description: 'Test the studio risk-free. Create your first book and experience the reading folio.',
      features: [
        '1 Complete Book (up to 16 pages)',
        '4 Illustrated Plates & Cover Art',
        'Interactive Reading Folio',
        'Notes & Outline Ingestion',
        'Standard Layout Styling',
      ],
      buttonText: 'Start Free',
      isPopular: false,
    },
    {
      id: 'creator' as const,
      name: 'Pro Creator',
      badge: 'Most Popular',
      price: billingCycle === 'annual' ? '$12' : '$15',
      period: ` / month ${billingCycle === 'annual' ? '($144/yr)' : ''}`,
      description: 'For authors, creators, and marketers publishing complete books ready for Amazon KDP.',
      features: [
        '15 Books / month (up to 64 pages)',
        'Unlimited PDF & EPUB Exports',
        '100% Commercial Rights',
        'In-Reader Chapter Revision Dock',
        'Permanent Bookshelf Cloud Storage',
        'Fast Generation Priority Queue',
      ],
      buttonText: 'Upgrade to Pro',
      isPopular: true,
    },
    {
      id: 'pro' as const,
      name: 'Premium Atelier',
      badge: 'Imprint & Agency',
      price: billingCycle === 'annual' ? '$32' : '$39',
      period: ` / month ${billingCycle === 'annual' ? '($384/yr)' : ''}`,
      description: 'For serial publishers and marketing agencies scaling continuous publication volume.',
      features: [
        '50 Books / month (up to 300 pages)',
        '250 Visual Plates with character consistency',
        'Priority Studio Processing Queue',
        'Custom Imprint & Publishing Metadata',
        'Markdown & Raw Assets Archive',
        'Dedicated Authoring Pipeline Support',
      ],
      buttonText: 'Join Premium',
      isPopular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans antialiased">
      <MinimalHeader />

      <main className="flex-1 w-full max-w-[1240px] mx-auto px-6 pt-12 sm:pt-16 pb-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F5F3] text-[#666666] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#EAEAEA]">
            Plans &amp; Pricing
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] leading-tight text-[#111111] font-normal tracking-tight mb-3">
            Simple, transparent publishing plans.
          </h1>
          <p className="text-sm sm:text-base text-[#666666]">
            Start creating free, or upgrade to Pro and Premium for high-volume publishing and commercial exports.
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

        {/* Alerts */}
        {successMessage && (
          <div className="max-w-xl mx-auto mb-10 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center shadow-xs flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-xs"
            >
              <span>Start Creating Your eBook Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {errorMessage && (
          <div className="max-w-md mx-auto mb-8 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600 text-center font-medium">
            {errorMessage}
          </div>
        )}

        {/* 3 Canonical Cards Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => {
            const isCurrent = Boolean(user && currentTier === plan.id);
            const isProcessing = Boolean(upgradingTier === plan.id);

            return (
              <div
                key={plan.id}
                className={`flex flex-col justify-between rounded-2xl p-7 transition-all duration-200 ${
                  plan.isPopular
                    ? 'border-2 border-[#111111] bg-[#111111] text-white shadow-xl md:-translate-y-2'
                    : 'border border-[#EAEAEA] bg-white text-[#111111] hover:border-[#111111]/30 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        plan.isPopular
                          ? 'bg-white/15 text-white'
                          : 'bg-[#F5F5F3] text-[#777777]'
                      }`}
                    >
                      {plan.badge}
                    </span>
                    {plan.isPopular && <Sparkles className="w-4 h-4 text-amber-300" />}
                  </div>

                  <h3 className={`text-2xl font-bold mb-1 ${plan.isPopular ? 'text-white' : 'text-[#111111]'}`}>
                    {plan.name}
                  </h3>

                  <p className={`text-xs mb-5 leading-relaxed ${plan.isPopular ? 'text-[#AAAAAA]' : 'text-[#666666]'}`}>
                    {plan.description}
                  </p>

                  <div
                    className={`flex items-baseline gap-1 mb-5 pb-5 border-b ${
                      plan.isPopular ? 'border-white/10' : 'border-[#F0F0F0]'
                    }`}
                  >
                    <span className={`text-3xl font-bold ${plan.isPopular ? 'text-white' : 'text-[#111111]'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-xs ${plan.isPopular ? 'text-[#AAAAAA]' : 'text-[#888888]'}`}>
                      {plan.period}
                    </span>
                  </div>

                  <ul className={`space-y-3 mb-6 text-xs ${plan.isPopular ? 'text-[#DDDDDD]' : 'text-[#333333]'}`}>
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            plan.isPopular ? 'text-amber-300' : 'text-[#111111]'
                          }`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Action CTA */}
                <button
                  type="button"
                  disabled={isProcessing || isCurrent}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3.5 px-4 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-neutral-200 text-neutral-600 cursor-default opacity-80'
                      : plan.isPopular
                      ? 'bg-white hover:bg-neutral-100 text-[#111111] shadow-xs'
                      : 'bg-[#111111] hover:bg-neutral-800 text-white shadow-xs'
                  }`}
                >
                  {isProcessing
                    ? 'Activating Plan...'
                    : isCurrent
                    ? 'Active Plan ✓'
                    : plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <MinimalFooter />
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-[#111111] rounded-full animate-spin" />
        </div>
      }
    >
      <PricingContentInner />
    </Suspense>
  );
}
