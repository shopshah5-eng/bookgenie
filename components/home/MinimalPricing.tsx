'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

export function MinimalPricing() {
  const { user, openAuthModal } = useAuth();

  const handleAction = (planId: string) => {
    if (!user) {
      openAuthModal('signup');
      return;
    }
    // If logged in, scroll to the book creator prompt card smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const plans = [
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
      popular: false,
    },
    {
      id: 'book',
      name: 'BOOK',
      price: '₹199',
      period: '/ book',
      description: 'For creating individual books.',
      features: [
        'Up to 30 pages',
        'Premium book design',
        'PDF + EPUB',
        'No watermark',
        'Commercial use',
      ],
      buttonText: 'Create a Book',
      popular: true,
    },
    {
      id: 'book-plus',
      name: 'BOOK PLUS',
      price: '₹399',
      period: '/ book',
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
      popular: false,
    },
    {
      id: 'creator',
      name: 'CREATOR',
      price: '₹799',
      period: '/ month',
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
      popular: false,
    },
  ];

  return (
    <section className="w-full py-20 bg-white border-b border-[#0000000a] scroll-mt-20" id="pricing">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight mb-3">
            Simple pricing for beautiful books.
          </h2>
          <p className="text-sm sm:text-base text-[#666666] font-light leading-relaxed">
            Choose the plan that fits how you create.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-2xl p-7 transition-all ${
                plan.popular
                  ? 'border-2 border-[#111111] shadow-[0_8px_30px_rgba(0,0,0,0.06)] bg-white'
                  : 'border border-[#EAEAEA] bg-white hover:border-[#D0D0CE]'
              }`}
            >
              {/* Popular Tag */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3.5 py-1 rounded-full bg-[#111111] text-white text-[10px] font-semibold tracking-wider uppercase shadow-xs">
                    POPULAR
                  </span>
                </div>
              )}

              <div>
                <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider block mb-2">
                  {plan.name}
                </span>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-normal font-sans text-[#111111] tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-xs text-[#777777] font-light">
                      {plan.period}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#666666] mb-6 font-light">
                  {plan.description}
                </p>

                <div className="pt-4 border-t border-[#F0F0F0] mb-6">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#999999] block mb-3">
                    INCLUDES:
                  </span>
                  <ul className="space-y-2.5 text-xs text-[#333333] font-light">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5 stroke-[2]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleAction(plan.id)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    plan.popular
                      ? 'bg-[#111111] text-white hover:bg-[#222222] shadow-xs'
                      : 'border border-[#E5E5E5] text-[#111111] hover:border-[#111111] bg-white'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
