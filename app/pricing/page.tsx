'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider, useAuth } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

function PricingContent() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
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

    if (planId === 'author-single') {
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
        setSuccessMessage(`Plan successfully upgraded to ${data.subscriptionTier.toUpperCase()}!`);
      } else {
        setErrorMessage(data.error || 'Upgrade failed. Please try again.');
      }
    } catch {
      setErrorMessage('Network connection error.');
    } finally {
      setUpgradingTier(null);
    }
  };

  const atelierPrice = billingCycle === 'annual' ? '$129' : '$159';
  const boutiquePrice = billingCycle === 'annual' ? '$349' : '$399';

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest dark:bg-[#121217] text-on-surface dark:text-[#f1effa] transition-colors">
      <Header />

      <main className="flex-1 w-full pt-10 pb-20">
        {/* Architectural Ambient Gradient */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[980px] h-[480px] bg-gradient-to-b from-secondary/10 via-surface-container-low/40 to-transparent blur-3xl pointer-events-none -z-10" />

          {/* Editorial Header Section */}
          <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-8 pb-14 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container dark:bg-white/5 border border-surface-container-highest dark:border-white/10 text-on-surface-variant dark:text-neutral-400 mb-6 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#fcba64]" />
              <span className="font-label-caps text-label-caps tracking-widest text-on-surface dark:text-[#f1effa]">
                TRANSPARENT ATELIER PRICING
              </span>
            </div>

            <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-primary dark:text-[#f1effa] tracking-tight max-w-4xl mx-auto mb-6">
              Unrestricted Authorship.<br />
              <span className="italic font-title-editorial text-secondary dark:text-[#fcba64]">
                No Royalty Traps.
              </span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              You retain 100% of your copyright, royalties, and generated master files. Transparent plans for independent novelists, boutique imprints, and creative studios.
            </p>

            {/* Billing Cycle Toggle Switch */}
            <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-surface-container dark:bg-white/5 shadow-xs border border-surface-container-highest dark:border-white/10">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full font-label-ui text-label-ui transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-primary dark:bg-white text-on-primary dark:text-black shadow-xs font-semibold'
                    : 'text-on-surface-variant dark:text-neutral-400 hover:text-primary dark:hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-full font-label-ui text-label-ui transition-all flex items-center gap-2 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-primary dark:bg-white text-on-primary dark:text-black shadow-xs font-semibold'
                    : 'text-on-surface-variant dark:text-neutral-400 hover:text-primary dark:hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="font-label-caps text-label-caps bg-secondary-container dark:bg-amber-950 text-secondary dark:text-amber-300 px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Notifications */}
          {successMessage && (
            <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-center font-label-ui text-sm">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-center font-label-ui text-sm">
              {errorMessage}
            </div>
          )}

          {/* Pricing Cards Grid */}
          <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              
              {/* Card 1: Free Starter */}
              <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest dark:bg-[#181820] border border-surface-container-highest dark:border-white/10 p-8 lg:p-10 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400 uppercase tracking-wider">
                      Evaluation / Starter
                    </span>
                    <span className="material-symbols-outlined text-outline">menu_book</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary dark:text-[#f1effa] mb-2">
                    Free Starter
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant dark:text-neutral-400 mb-6 leading-relaxed">
                    Test the publishing studio risk-free. Create your first book and experience the reading folio.
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-8 pb-8 border-b border-surface-container-highest dark:border-white/10">
                    <span className="font-display-hero text-display-hero-mobile sm:text-display-hero text-primary dark:text-[#f1effa] font-title-editorial">
                      $0
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400">
                      / forever free
                    </span>
                  </div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-neutral-400 uppercase mb-4 tracking-wider font-semibold">
                    Included Features
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-[20px] shrink-0">check_circle</span>
                      <span className="font-body-md text-body-md text-on-surface dark:text-[#f1effa]">
                        <strong>1 Complete Book</strong> (up to 16 pages)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-[20px] shrink-0">check_circle</span>
                      <span className="font-body-md text-body-md text-on-surface dark:text-[#f1effa]">
                        4 Illustrated Plates &amp; Cover Art
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-[20px] shrink-0">check_circle</span>
                      <span className="font-body-md text-body-md text-on-surface dark:text-[#f1effa]">
                        1 Free PDF &amp; EPUB 3.0 Export
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-[20px] shrink-0">check_circle</span>
                      <span className="font-body-md text-body-md text-on-surface dark:text-[#f1effa]">
                        Private Interactive Web Reader
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-[20px] shrink-0">check_circle</span>
                      <span className="font-body-md text-body-md text-on-surface dark:text-[#f1effa]">
                        Notes Ingestion (.txt, .md, .pdf references)
                      </span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSelectPlan('free')}
                  className="w-full py-3.5 px-6 rounded-lg text-center font-label-ui text-label-ui text-primary dark:text-black bg-surface-container-low dark:bg-white hover:bg-surface-container-high transition-colors font-semibold active:scale-[0.99] cursor-pointer"
                >
                  Start Creating Free
                </button>
              </div>

              {/* Card 2: Pro Creator (Featured Elevation) */}
              <div className="relative flex flex-col justify-between rounded-xl bg-primary dark:bg-[#000000] text-on-primary border border-secondary/30 dark:border-white/20 p-8 lg:p-10 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
                {/* Ambient Gold Foil Halo Effect */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#fcba64] to-transparent" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-label-caps text-label-caps px-3 py-1 rounded-full bg-secondary-container text-secondary dark:bg-amber-950 dark:text-amber-300 font-semibold tracking-wider">
                      MOST POPULAR • CREATOR BEST VALUE
                    </span>
                    <span className="material-symbols-outlined text-[#fcba64]">auto_awesome</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-white mb-2">
                    Pro Creator
                  </h3>
                  <p className="font-body-md text-body-md text-neutral-300 mb-6 leading-relaxed">
                    For active authors, teachers, and creators publishing complete books ready for Amazon KDP &amp; Apple Books.
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-8 pb-8 border-b border-white/10">
                    <span className="font-display-hero text-display-hero-mobile sm:text-display-hero text-white font-title-editorial">
                      {billingCycle === 'annual' ? '$12' : '$15'}
                    </span>
                    <span className="font-body-sm text-body-sm text-neutral-400">
                      / month {billingCycle === 'annual' ? 'billed annually ($144/yr)' : 'billed monthly'}
                    </span>
                  </div>
                  <p className="font-label-caps text-label-caps text-[#fcba64] uppercase mb-4 tracking-wider font-semibold">
                    Creator Privileges
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#fcba64] text-[20px] shrink-0">verified</span>
                      <span className="font-body-md text-body-md text-white">
                        <strong>15 Complete Books</strong> per month (up to 64 pages each)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#fcba64] text-[20px] shrink-0">verified</span>
                      <span className="font-body-md text-body-md text-white">
                        <strong>UNLIMITED EPUB &amp; 300 DPI PDF Exports</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#fcba64] text-[20px] shrink-0">verified</span>
                      <span className="font-body-md text-body-md text-white">
                        Up to 60 Style-Consistent Illustrated Plates / mo
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#fcba64] text-[20px] shrink-0">verified</span>
                      <span className="font-body-md text-body-md text-white">
                        100% Commercial Copyright Retention (Sell on KDP/IngramSpark)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#fcba64] text-[20px] shrink-0">verified</span>
                      <span className="font-body-md text-body-md text-white">
                        In-Reader AI Chapter Revision Dock
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#fcba64] text-[20px] shrink-0">verified</span>
                      <span className="font-body-md text-body-md text-white">
                        Zero Watermarks / Clean Custom Colophon
                      </span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSelectPlan('creator')}
                  disabled={upgradingTier === 'creator'}
                  className="w-full py-3.5 px-6 rounded-lg text-center font-label-ui text-label-ui text-black bg-[#fcba64] hover:bg-[#ffddb6] transition-all shadow-md font-semibold active:scale-[0.99] cursor-pointer"
                >
                  {upgradingTier === 'creator' ? 'Activating Pro...' : 'Upgrade to Pro Creator ($15/mo)'}
                </button>
              </div>

              {/* Card 3: Premium Atelier */}
              <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest dark:bg-[#181820] border border-surface-container-highest dark:border-white/10 p-8 lg:p-10 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400 uppercase tracking-wider">
                      Power Publishing &amp; Imprints
                    </span>
                    <span className="material-symbols-outlined text-outline">domain</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary dark:text-[#f1effa] mb-2">
                    Premium Atelier
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant dark:text-neutral-400 mb-6 leading-relaxed">
                    Designed for serial authors, design agencies, and boutique publishers scaling continuous catalogs.
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-8 pb-8 border-b border-surface-container-highest dark:border-white/10">
                    <span className="font-display-hero text-display-hero-mobile sm:text-display-hero text-primary dark:text-[#f1effa] font-title-editorial">
                      {billingCycle === 'annual' ? '$32' : '$39'}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400">
                      / month {billingCycle === 'annual' ? 'billed annually ($384/yr)' : 'billed monthly'}
                    </span>
                  </div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-neutral-400 uppercase mb-4 tracking-wider font-semibold">
                    Atelier Power Privileges
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-[20px] shrink-0">check_circle</span>
                      <span className="font-body-md text-body-md text-on-surface dark:text-[#f1effa]">
                        <strong>50 Books</strong> per month (up to 160 pages each)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-[20px] shrink-0">check_circle</span>
                      <span className="font-body-md text-body-md text-on-surface dark:text-[#f1effa]">
                        <strong>UNLIMITED All Exports</strong> (PDF, EPUB, Markdown archive)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-[20px] shrink-0">check_circle</span>
                      <span className="font-body-md text-body-md text-on-surface dark:text-[#f1effa]">
                        250 High-Res AI Visual Plates / mo with Character Bible Locks
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-[20px] shrink-0">check_circle</span>
                      <span className="font-body-md text-body-md text-on-surface dark:text-[#f1effa]">
                        Priority High-Speed AI Processing Queue
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-[20px] shrink-0">check_circle</span>
                      <span className="font-body-md text-body-md text-on-surface dark:text-[#f1effa]">
                        Custom Publisher Imprint, Colophon &amp; ISBN Ingestion
                      </span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSelectPlan('pro')}
                  disabled={upgradingTier === 'pro'}
                  className="w-full py-3.5 px-6 rounded-lg text-center font-label-ui text-label-ui text-primary dark:text-black bg-surface-container-low dark:bg-white hover:bg-surface-container-high transition-colors font-semibold active:scale-[0.99] cursor-pointer"
                >
                  {upgradingTier === 'pro' ? 'Activating Premium...' : 'Join Premium Atelier ($39/mo)'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}

export default function PricingPage() {
  return (
    <AuthProvider>
      <PricingContent />
    </AuthProvider>
  );
}
