'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider, useAuth } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Check, Sparkles, BookOpen, PackageCheck, Printer, ShieldCheck } from 'lucide-react';

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

    setUpgradingTier(planId);

    try {
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: planId }),
      });

      const data = await response.json();

      if (response.ok) {
        if (planId === 'author-single') {
          setSuccessMessage('Single Book Pass activated! Redirecting to creator studio...');
          setTimeout(() => router.push('/create'), 1200);
        } else {
          const tierName = (data.subscriptionTier || data.tier || data.profile?.tier || planId).toUpperCase();
          setSuccessMessage(`Plan successfully updated to ${tierName}! Enjoy extended studio features.`);
        }
      } else {
        setErrorMessage(data.error || 'Upgrade failed. Please try again.');
      }
    } catch {
      setErrorMessage('Network connection error.');
    } finally {
      setUpgradingTier(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest dark:bg-[#121217] text-on-surface dark:text-[#f1effa] transition-colors">
      <Header />

      <main className="flex-1 w-full pt-10 pb-20">
        {/* Architectural Ambient Gradient */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[980px] h-[480px] bg-gradient-to-b from-secondary/10 via-surface-container-low/40 to-transparent blur-3xl pointer-events-none -z-10" />

          {/* Editorial Header Section */}
          <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-8 pb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container dark:bg-white/5 border border-surface-container-highest dark:border-white/10 text-on-surface-variant dark:text-neutral-400 mb-6 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#fcba64]" />
              <span className="font-label-caps text-label-caps tracking-widest text-on-surface dark:text-[#f1effa]">
                TRANSPARENT PUBLISHING PLANS
              </span>
            </div>

            <h1 className="font-display-hero text-display-hero-mobile sm:text-display-hero text-primary dark:text-[#f1effa] font-title-editorial mb-4">
              Pure Ownership.{' '}
              <span className="italic font-title-editorial text-secondary dark:text-[#fcba64]">
                Zero Sub-Royalties.
              </span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-neutral-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Retain 100% of your copyright, royalties, and generated files. Choose a single book pass or recurring plans for ongoing publishing volume.
            </p>

            {/* Open Beta Callout Banner */}
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-sm max-w-xl mx-auto mb-8 text-left shadow-xs">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg shrink-0">info</span>
              <span>
                <strong>Live Sandbox Mode:</strong> Selecting any tier activates instant access and higher chapter capacities on your account.
              </span>
            </div>

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

          {/* Pricing Cards Grid - 4 Tiers */}
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              
              {/* Card 1: Free Starter */}
              <div className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest dark:bg-[#181820] border border-surface-container-highest dark:border-white/10 p-6 lg:p-7 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-code-spec text-xs text-on-surface-variant dark:text-neutral-400 uppercase tracking-wider">
                      Discovery
                    </span>
                    <BookOpen className="w-4 h-4 text-outline" />
                  </div>
                  <h3 className="font-headline-md text-xl font-serif text-primary dark:text-[#f1effa] mb-1">
                    Free Starter
                  </h3>
                  <p className="text-xs text-on-surface-variant dark:text-neutral-400 mb-5 leading-relaxed">
                    Test the publishing studio risk-free. Create your first book and experience the reading folio.
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-surface-container-highest dark:border-white/10">
                    <span className="text-3xl font-serif font-bold text-primary dark:text-[#f1effa]">
                      $0
                    </span>
                    <span className="text-xs text-on-surface-variant dark:text-neutral-400">
                      / forever free
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6 text-xs text-on-surface dark:text-[#f1effa]">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-secondary dark:text-[#fcba64] shrink-0" />
                      <span><strong>1 Complete Book</strong> (up to 16 pages)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-secondary dark:text-[#fcba64] shrink-0" />
                      <span>4 Illustrated Plates &amp; Cover Art</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-secondary dark:text-[#fcba64] shrink-0" />
                      <span>Private Interactive Web Reader</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-secondary dark:text-[#fcba64] shrink-0" />
                      <span>Notes &amp; Document Ingestion</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSelectPlan('free')}
                  className="w-full py-3 px-4 rounded-xl text-center text-xs font-semibold text-primary dark:text-black bg-surface-container-low dark:bg-white hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Start Creating Free
                </button>
              </div>

              {/* Card 2: Single Book Pass (Pay-As-You-Go) */}
              <div className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest dark:bg-[#181820] border-2 border-[#111111]/15 dark:border-white/20 p-6 lg:p-7 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-code-spec text-xs font-semibold text-secondary dark:text-[#fcba64] uppercase tracking-wider">
                      Pay As You Go
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium">
                      No Subscription
                    </span>
                  </div>
                  <h3 className="font-headline-md text-xl font-serif text-primary dark:text-[#f1effa] mb-1">
                    Single Book Pass
                  </h3>
                  <p className="text-xs text-on-surface-variant dark:text-neutral-400 mb-5 leading-relaxed">
                    Ideal for single memoirs, gift books, bedtime stories, or lead magnets. Buy once, own forever.
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-surface-container-highest dark:border-white/10">
                    <span className="text-3xl font-serif font-bold text-primary dark:text-[#f1effa]">
                      $19
                    </span>
                    <span className="text-xs text-on-surface-variant dark:text-neutral-400">
                      / one-time payment
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6 text-xs text-on-surface dark:text-[#f1effa]">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-secondary dark:text-[#fcba64] shrink-0" />
                      <span><strong>1 Complete Book</strong> (up to 120 pages)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-secondary dark:text-[#fcba64] shrink-0" />
                      <span>300 DPI Press PDF + EPUB3 Export</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-secondary dark:text-[#fcba64] shrink-0" />
                      <span>100% Commercial License (Sell anywhere)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-secondary dark:text-[#fcba64] shrink-0" />
                      <span>Zero Watermarks &amp; Clean Colophon</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-secondary dark:text-[#fcba64] shrink-0" />
                      <span>In-Reader Chapter Revision Dock</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSelectPlan('author-single')}
                  disabled={upgradingTier === 'author-single'}
                  className="w-full py-3 px-4 rounded-xl text-center text-xs font-semibold text-white bg-[#111111] hover:bg-black transition-colors cursor-pointer"
                >
                  {upgradingTier === 'author-single' ? 'Activating Pass...' : 'Get Single Book Pass ($19)'}
                </button>
              </div>

              {/* Card 3: Pro Creator (Featured Elevation) */}
              <div className="relative flex flex-col justify-between rounded-2xl bg-primary dark:bg-[#000000] text-on-primary border border-secondary/40 dark:border-white/20 p-6 lg:p-7 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#fcba64] to-transparent" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-secondary-container text-secondary dark:bg-amber-950 dark:text-amber-300 font-semibold tracking-wider uppercase">
                      Most Popular
                    </span>
                    <Sparkles className="w-4 h-4 text-[#fcba64]" />
                  </div>
                  <h3 className="font-headline-md text-xl font-serif text-white mb-1">
                    Pro Creator
                  </h3>
                  <p className="text-xs text-neutral-300 mb-5 leading-relaxed">
                    For active authors, teachers, and creators publishing full series ready for Amazon KDP.
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-white/10">
                    <span className="text-3xl font-serif font-bold text-white">
                      {billingCycle === 'annual' ? '$12' : '$15'}
                    </span>
                    <span className="text-xs text-neutral-400">
                      / month {billingCycle === 'annual' ? '($144/yr)' : ''}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6 text-xs text-neutral-200">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#fcba64] shrink-0" />
                      <span><strong>15 Complete Books</strong> / month</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#fcba64] shrink-0" />
                      <span><strong>Unlimited EPUB &amp; 300 DPI PDF</strong></span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#fcba64] shrink-0" />
                      <span>100% Commercial Copyright Retention</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#fcba64] shrink-0" />
                      <span>In-Reader Chapter Revision Dock</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#fcba64] shrink-0" />
                      <span>Persistent Bookshelf Cloud Storage</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSelectPlan('creator')}
                  disabled={upgradingTier === 'creator'}
                  className="w-full py-3 px-4 rounded-xl text-center text-xs font-semibold text-black bg-[#fcba64] hover:bg-[#ffddb6] transition-all cursor-pointer shadow-md"
                >
                  {upgradingTier === 'creator'
                    ? 'Activating Pro...'
                    : billingCycle === 'annual'
                    ? 'Upgrade to Pro ($12/mo)'
                    : 'Upgrade to Pro ($15/mo)'}
                </button>
              </div>

              {/* Card 4: Premium Atelier */}
              <div className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest dark:bg-[#181820] border border-surface-container-highest dark:border-white/10 p-6 lg:p-7 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-code-spec text-xs text-on-surface-variant dark:text-neutral-400 uppercase tracking-wider">
                      Imprint / Agency
                    </span>
                    <ShieldCheck className="w-4 h-4 text-outline" />
                  </div>
                  <h3 className="font-headline-md text-xl font-serif text-primary dark:text-[#f1effa] mb-1">
                    Premium Atelier
                  </h3>
                  <p className="text-xs text-on-surface-variant dark:text-neutral-400 mb-5 leading-relaxed">
                    Designed for serial publishers and marketing agencies scaling continuous volume.
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-surface-container-highest dark:border-white/10">
                    <span className="text-3xl font-serif font-bold text-primary dark:text-[#f1effa]">
                      {billingCycle === 'annual' ? '$32' : '$39'}
                    </span>
                    <span className="text-xs text-on-surface-variant dark:text-neutral-400">
                      / month {billingCycle === 'annual' ? '($384/yr)' : ''}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6 text-xs text-on-surface dark:text-[#f1effa]">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-secondary dark:text-[#fcba64] shrink-0" />
                      <span><strong>50 Books</strong> / mo (up to 300 pages)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-secondary dark:text-[#fcba64] shrink-0" />
                      <span><strong>250 Visual Plates</strong> / mo with character lock</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-secondary dark:text-[#fcba64] shrink-0" />
                      <span>Priority High-Speed Processing Queue</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-secondary dark:text-[#fcba64] shrink-0" />
                      <span>Custom Publisher Imprint &amp; ISBN Ingestion</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-secondary dark:text-[#fcba64] shrink-0" />
                      <span>Full Archive (Markdown, Raw Assets)</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSelectPlan('pro')}
                  disabled={upgradingTier === 'pro'}
                  className="w-full py-3 px-4 rounded-xl text-center text-xs font-semibold text-primary dark:text-black bg-surface-container-low dark:bg-white hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  {upgradingTier === 'pro'
                    ? 'Activating Atelier...'
                    : billingCycle === 'annual'
                    ? 'Join Atelier ($32/mo)'
                    : 'Join Atelier ($39/mo)'}
                </button>
              </div>

            </div>
          </div>

          {/* À La Carte Publishing Services & High-Value Add-Ons */}
          <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-8 pb-20 border-t border-surface-container-highest dark:border-white/10">
            <div className="text-center mb-10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary dark:text-[#fcba64] block mb-2">
                À La Carte Publishing Services
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary dark:text-white">
                Turn Your Digital Files into Tangible Assets
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant dark:text-neutral-400 mt-2">
                No monthly subscription required. Add these publishing services to any book whenever you are ready to distribute.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Service 1 */}
              <div className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#181820] border border-surface-container-highest dark:border-white/10 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-semibold text-base text-primary dark:text-white mb-1">
                    Amazon KDP Press Bundle
                  </h3>
                  <div className="text-lg font-serif font-bold text-secondary dark:text-[#fcba64] mb-3">
                    $49 <span className="text-xs font-normal text-on-surface-variant">/ publication</span>
                  </div>
                  <p className="text-xs text-on-surface-variant dark:text-neutral-400 leading-relaxed mb-4">
                    Full pre-press validation for Amazon KDP: spine thickness mathematical calculation, wraparound cover PDF with barcode zone, and reflowable EPUB3.
                  </p>
                </div>
                <Link
                  href="/create"
                  className="inline-flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold border border-surface-container-highest hover:border-primary dark:hover:border-white transition-colors"
                >
                  Select with Book
                </Link>
              </div>

              {/* Service 2 */}
              <div className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#181820] border border-surface-container-highest dark:border-white/10 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                    <Printer className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-semibold text-base text-primary dark:text-white mb-1">
                    Hardcover Keepsake Print
                  </h3>
                  <div className="text-lg font-serif font-bold text-secondary dark:text-[#fcba64] mb-3">
                    $34.99 <span className="text-xs font-normal text-on-surface-variant">/ printed copy</span>
                  </div>
                  <p className="text-xs text-on-surface-variant dark:text-neutral-400 leading-relaxed mb-4">
                    Casebound archival hardcover printed in full vibrant color on 100gsm satin paper, shipped directly to your door with zero minimum orders.
                  </p>
                </div>
                <Link
                  href="/create"
                  className="inline-flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold border border-surface-container-highest hover:border-primary dark:hover:border-white transition-colors"
                >
                  Order Sample
                </Link>
              </div>

              {/* Service 3 */}
              <div className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#181820] border border-surface-container-highest dark:border-white/10 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-semibold text-base text-primary dark:text-white mb-1">
                    ISBN &amp; Global Registry
                  </h3>
                  <div className="text-lg font-serif font-bold text-secondary dark:text-[#fcba64] mb-3">
                    $29 <span className="text-xs font-normal text-on-surface-variant">/ registration</span>
                  </div>
                  <p className="text-xs text-on-surface-variant dark:text-neutral-400 leading-relaxed mb-4">
                    Official 13-digit ISBN registered to your book title and author imprint, qualifying your volume for worldwide retail catalog distribution.
                  </p>
                </div>
                <Link
                  href="/create"
                  className="inline-flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold border border-surface-container-highest hover:border-primary dark:hover:border-white transition-colors"
                >
                  Assign ISBN
                </Link>
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
