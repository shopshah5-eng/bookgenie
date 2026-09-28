'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { MinimalFooter } from '@/components/home/MinimalFooter';
import { AuthProvider, useAuth } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Check } from 'lucide-react';

function PricingContent() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!user) {
      openAuthModal('signup', '/pricing');
      return;
    }

    if (planId === 'free') {
      router.push('/');
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
        setSuccessMessage(`Plan successfully selected! Start creating your eBook.`);
      } else {
        setErrorMessage(data.error || 'Upgrade failed. Please try again.');
      }
    } catch {
      setErrorMessage('Network connection error.');
    } finally {
      setUpgradingTier(null);
    }
  };

  const pricingPlans = [
    {
      id: 'free',
      name: 'FREE',
      price: '₹0',
      period: '',
      description: 'For trying BookGenie.',
      features: [
        '1 eBook',
        'Up to 10 pages',
        'Standard book design',
        'PDF',
        'BookGenie watermark',
      ],
      buttonText: 'Start Creating',
      isPopular: false,
    },
    {
      id: 'book',
      name: 'BOOK',
      price: '₹199',
      period: ' / book',
      description: 'For creating individual books.',
      features: [
        'Up to 30 pages',
        'Premium book design',
        'PDF + EPUB',
        'No watermark',
        'Commercial use',
      ],
      buttonText: 'Create a Book',
      isPopular: true,
    },
    {
      id: 'book_plus',
      name: 'BOOK PLUS',
      price: '₹399',
      period: ' / book',
      description: 'For larger, more detailed books.',
      features: [
        'Up to 60 pages',
        'Premium book design',
        'PDF + EPUB',
        'No watermark',
        'Commercial use',
        'Enhanced illustrations',
        'Regenerate and refine',
      ],
      buttonText: 'Create a Book',
      isPopular: false,
    },
    {
      id: 'creator',
      name: 'CREATOR',
      price: '₹799',
      period: ' / month',
      description: 'For frequent book creation.',
      features: [
        'Up to 5 books per month',
        'Up to 100 pages per book',
        'PDF + EPUB',
        'No watermark',
        'Commercial use',
        'All available design styles',
        'Faster generation',
        'Priority support',
      ],
      buttonText: 'Start Creating',
      isPopular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans antialiased">
      <MinimalHeader />

      <main className="flex-1 w-full max-w-[1240px] mx-auto px-6 pt-12 sm:pt-16 pb-24">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14 sm:mb-16">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] leading-tight text-[#111111] font-normal tracking-tight mb-3">
            Simple pricing for beautiful books.
          </h1>
          <p className="text-sm sm:text-base text-[#666666]">
            Choose the plan that fits how you create.
          </p>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="max-w-md mx-auto mb-8 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-700 text-center font-medium">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="max-w-md mx-auto mb-8 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600 text-center font-medium">
            {errorMessage}
          </div>
        )}

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-7 flex flex-col justify-between transition-all relative ${
                plan.isPopular
                  ? 'bg-white border-2 border-[#111111] shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
                  : 'bg-white border border-[#EAEAEA] hover:border-[#CCCCCC] shadow-[0_2px_12px_rgba(0,0,0,0.02)]'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-[#111111] text-white text-[10px] font-semibold tracking-wider uppercase shadow-xs">
                    Popular
                  </span>
                </div>
              )}

              <div>
                {/* Plan Name */}
                <h3 className="text-[13px] font-semibold tracking-wider uppercase text-[#777777] mb-3">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl sm:text-4xl font-semibold text-[#111111] font-sans">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-xs text-[#888888] font-medium">
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-[12px] text-[#666666] mb-6 pb-6 border-b border-[#F0F0F0]">
                  {plan.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <span className="text-[11px] font-semibold text-[#111111] uppercase tracking-wider block">
                    Includes:
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-[13px] text-[#333333]">
                        <Check className="w-4 h-4 text-[#111111] shrink-0 stroke-[2] mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={upgradingTier === plan.id}
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-3.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                  plan.isPopular
                    ? 'bg-[#111111] hover:bg-[#222222] text-white shadow-xs'
                    : 'bg-white hover:bg-neutral-50 text-[#111111] border border-[#EAEAEA] hover:border-[#111111]'
                }`}
              >
                {upgradingTier === plan.id ? 'Processing...' : plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </main>

      <MinimalFooter />
    </div>
  );
}

export default function PricingPage() {
  return <PricingContent />;
}
