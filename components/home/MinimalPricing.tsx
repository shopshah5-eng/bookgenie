'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check,
  Sparkles,
  AlertCircle,
  Loader2,
  Sliders,
  ShieldCheck,
  BookOpen,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import {
  CANONICAL_PLANS,
  ORDERED_PLAN_IDS,
  calculateSinglePlanPrice,
  type PlanId,
} from '@/lib/payments/plans';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: (response: unknown) => void) => void;
    };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function MinimalPricing() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Billing interval toggle for subscriptions: 'monthly' | 'annual'
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');

  // Interactive page count slider for the One-Time Single Book plan
  const [customPages, setCustomPages] = useState<number>(50);
  const singlePricing = calculateSinglePlanPrice(customPages);

  useEffect(() => {
    if (user) {
      fetch('/api/subscription/upgrade')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.tier) setCurrentTier(data.tier);
        })
        .catch(() => {});
    }
  }, [user]);

  const handleChoosePlan = async (planId: PlanId) => {
    setConfigError(null);
    setSuccessMessage(null);

    // Free plan handler: navigate directly to studio
    if (planId === 'free') {
      if (!user) {
        openAuthModal('signup', '/create');
        return;
      }
      router.push('/create');
      return;
    }

    // Paid plans require user session
    if (!user) {
      openAuthModal('signup', '/#pricing');
      return;
    }

    setLoadingPlanId(planId);

    try {
      // 1. Create server-side Razorpay order
      const requestPayload: { planId: PlanId; pages?: number; interval?: 'monthly' | 'annual' } = {
        planId,
      };

      if (planId === 'single') {
        requestPayload.pages = customPages;
      } else if (planId === 'pro' || planId === 'creator') {
        requestPayload.interval = billingInterval;
      }

      const orderRes = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        if (orderRes.status === 503 || orderData.error === 'PAYMENTS_NOT_CONFIGURED') {
          setConfigError(
            orderData.message ||
              'Payments are currently being configured. Free generation is available now.'
          );
        } else {
          setConfigError(orderData.message || 'Failed to initiate checkout. Please try again.');
        }
        setLoadingPlanId(null);
        return;
      }

      // 2. Load Razorpay secure checkout script
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setConfigError('Could not load secure checkout. Check your internet connection.');
        setLoadingPlanId(null);
        return;
      }

      // 3. Open Razorpay Checkout modal
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'BookGenie Publishing',
        description: `${orderData.planName} (${orderData.maxPages ? `${orderData.maxPages} pages` : 'Complete plan'})`,
        order_id: orderData.orderId,
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
        },
        theme: {
          color: '#111111',
        },
        handler: async function (response: {
          razorpay_payment_id?: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) {
          try {
            setLoadingPlanId(planId);
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id || orderData.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                planId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setSuccessMessage(
                `Payment verified! Your ${orderData.planName} entitlement has been activated.`
              );
              setCurrentTier(planId);
              router.refresh();
            } else {
              setConfigError(
                verifyData.message || 'Payment signature could not be verified by server.'
              );
            }
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            setConfigError('Verification failed. If your account was charged, please contact support.');
          } finally {
            setLoadingPlanId(null);
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingPlanId(null);
          },
        },
      });

      rzp.open();
    } catch (err) {
      console.error('Checkout error:', err);
      setConfigError('An unexpected error occurred while initiating checkout.');
      setLoadingPlanId(null);
    }
  };

  return (
    <section className="w-full py-20 bg-white border-b border-[#0000000a] scroll-mt-20" id="pricing">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F5F3] text-[#666666] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#EAEAEA]">
            Plans &amp; Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#111111] tracking-tight leading-tight">
            Predictable, transparent publishing.
          </h2>
          <p className="text-sm sm:text-base text-[#666666] mt-3 font-sans leading-relaxed">
            Start free, purchase single books with custom length, or subscribe for high-volume publishing.
          </p>

          {/* Monthly / Annual Billing Toggle */}
          <div className="mt-8 inline-flex items-center p-1 rounded-full bg-[#F5F5F3] border border-[#EAEAEA] text-xs font-medium">
            <button
              type="button"
              onClick={() => setBillingInterval('monthly')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                billingInterval === 'monthly'
                  ? 'bg-white text-[#111111] font-semibold shadow-xs'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingInterval('annual')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                billingInterval === 'annual'
                  ? 'bg-[#111111] text-white font-semibold shadow-xs'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Global Alert Banners */}
        {configError && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">Notice</p>
              <p className="mt-0.5 text-amber-800">{configError}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-3">
            <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-950">Success</p>
              <p className="mt-0.5 text-emerald-800">{successMessage}</p>
              <div className="mt-2">
                <Link
                  href="/create"
                  className="inline-block px-3 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors"
                >
                  Start Creating Now →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 4 Plans Grid: FREE, ONE-TIME BOOK, PRO, CREATOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {ORDERED_PLAN_IDS.map((planId) => {
            const plan = CANONICAL_PLANS[planId];
            const isCreator = plan.id === 'creator';
            const isPro = plan.id === 'pro';
            const isSingle = plan.id === 'single';
            const isCurrent = user && currentTier === plan.id;
            const isLoading = loadingPlanId === plan.id;

            // Compute display price based on interval or slider
            const displayPrice =
              isSingle
                ? singlePricing.priceInr
                : billingInterval === 'annual' && plan.annualPriceInr
                ? plan.annualPriceInr
                : plan.priceInr;

            const billingSubtext =
              plan.billingType === 'free'
                ? 'forever'
                : plan.billingType === 'one_time'
                ? 'one-time payment'
                : billingInterval === 'annual'
                ? '/ month (billed yearly)'
                : '/ month';

            return (
              <div
                key={plan.id}
                className={`flex flex-col justify-between rounded-2xl p-6 transition-all duration-200 ${
                  isCreator
                    ? 'border border-[#111111] bg-[#111111] text-white shadow-xl relative'
                    : isPro
                    ? 'border-2 border-[#111111] bg-white text-[#111111] shadow-lg relative'
                    : 'border border-[#EAEAEA] bg-white text-[#111111] hover:border-[#111111]/30 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isCreator
                          ? 'bg-white/15 text-white'
                          : isPro
                          ? 'bg-[#111111] text-white'
                          : isSingle
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-[#F0F0F0] text-[#666666]'
                      }`}
                    >
                      {plan.badge || plan.name}
                    </span>
                    {isPro && <Sparkles className="w-4 h-4 text-amber-500" />}
                    {isCreator && <Sparkles className="w-4 h-4 text-amber-300" />}
                  </div>

                  {/* Plan Name */}
                  <h3
                    className={`text-xl font-bold tracking-tight mb-1 ${
                      isCreator ? 'text-white' : 'text-[#111111]'
                    }`}
                  >
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div
                    className={`flex items-baseline gap-1 my-3 pb-3 border-b ${
                      isCreator ? 'border-white/10' : 'border-[#F0F0F0]'
                    }`}
                  >
                    <span className="text-3xl font-extrabold tracking-tight">
                      ₹{displayPrice}
                    </span>
                    <span
                      className={`text-xs ${
                        isCreator ? 'text-neutral-400' : 'text-[#777777]'
                      }`}
                    >
                      {billingSubtext}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-xs mb-4 leading-relaxed min-h-[34px] ${
                      isCreator ? 'text-neutral-300' : 'text-[#666666]'
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Interactive Page Slider for Single Book Plan */}
                  {isSingle && (
                    <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAEAEA] mb-5">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#111111] mb-1.5">
                        <span className="flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5 text-[#666666]" />
                          Page Target:
                        </span>
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {customPages} pages
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="200"
                        step="5"
                        value={customPages}
                        onChange={(e) => setCustomPages(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#EAEAEA] rounded-lg appearance-none cursor-pointer accent-[#111111]"
                      />
                      <div className="flex justify-between text-[10px] text-[#888888] mt-1 font-mono">
                        <span>50p (₹299)</span>
                        <span>100p (₹399)</span>
                        <span>200p (₹599)</span>
                      </div>
                    </div>
                  )}

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 mb-6 text-xs">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isCreator
                              ? 'text-amber-300'
                              : isPro
                              ? 'text-[#111111]'
                              : 'text-neutral-700'
                          }`}
                        />
                        <span className={isCreator ? 'text-neutral-200' : 'text-neutral-800'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA */}
                <div>
                  {isCurrent ? (
                    <Link
                      href="/create"
                      className={`w-full py-2.5 px-4 rounded-full text-center text-xs font-semibold block transition-colors ${
                        isCreator
                          ? 'bg-neutral-800 text-neutral-300 border border-white/20'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      Active Plan ✓
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleChoosePlan(plan.id)}
                      disabled={isLoading}
                      className={`w-full py-2.5 px-4 rounded-full text-center text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 ${
                        isCreator
                          ? 'bg-white text-[#111111] hover:bg-neutral-100 shadow-sm'
                          : isPro
                          ? 'bg-[#111111] text-white hover:bg-neutral-900 shadow-sm'
                          : isSingle
                          ? 'bg-[#111111] text-white hover:bg-[#222222] shadow-sm'
                          : 'bg-[#F5F5F3] text-[#111111] hover:bg-[#EAEAEA]'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>
                          {plan.id === 'free'
                            ? 'Start Free (20 Pages)'
                            : isSingle
                            ? `Get Book (₹${displayPrice})`
                            : `Choose ${plan.name}`}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison & Value Highlights */}
        <div className="mt-16 pt-12 border-t border-[#EAEAEA]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#EAEAEA] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#111111]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#111111] mb-1">
                  100% Commercial Ownership
                </h4>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Every paid ebook includes full commercial rights. Sell on Amazon KDP, Gumroad, or your own site without royalties.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#EAEAEA] flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-[#111111]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#111111] mb-1">
                  Dual PDF &amp; EPUB Exports
                </h4>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Export both print-ready PDF vector layouts and reflowable EPUB3 files compatible with Kindle, Apple Books, and Kobo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#EAEAEA] flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-[#111111]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#111111] mb-1">
                  Revision &amp; Style Refinement
                </h4>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Paid tiers unlock our AI refinement dock. Request edits, regenerate illustrations, and fine-tune text page by page.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Guarantee & Security Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-[#FAF9F6] border border-[#EAEAEA] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-[#666666] shrink-0" />
            <p className="text-xs text-[#666666]">
              <strong className="text-[#111111]">Need a custom volume or university license?</strong> We support bulk publishing pipelines with dedicated API access.
            </p>
          </div>
          <Link
            href="/contact"
            className="text-xs font-semibold text-[#111111] hover:underline shrink-0"
          >
            Contact Publishing Team →
          </Link>
        </div>
      </div>
    </section>
  );
}
