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
  Tag,
  Flame,
  Award,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import {
  CANONICAL_PLANS,
  ORDERED_PLAN_IDS,
  calculateSinglePlanPrice,
  type PlanId,
} from '@/lib/payments/plans';
import { validateCoupon } from '@/lib/payments/coupons';
import { getAnnualDiscountPercent } from '@/lib/payments/preorder';

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

  // Stepped Pre-Order campaign status (First 100 Founding Authors)
  const [preorderStatus, setPreorderStatus] = useState<{
    totalClaimed: number;
    maxSpots: number;
    remainingTotal: number;
    isPreorderActive: boolean;
    activeTier?: {
      tierNumber: number;
      tierName: string;
      discountPercent: number;
      tierRange: string;
      spotsInTier: number;
      remainingInTier: number;
      nextTierPercent: number;
    };
  }>({
    totalClaimed: 0,
    maxSpots: 100,
    remainingTotal: 100,
    isPreorderActive: true,
    activeTier: {
      tierNumber: 1,
      tierName: 'Tier 1: Super Early Bird',
      discountPercent: 50,
      tierRange: 'Spots 1 – 25',
      spotsInTier: 25,
      remainingInTier: 25,
      nextTierPercent: 40,
    },
  });

  // Coupon / Affiliate discount state
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    percent: number;
    isAffiliate: boolean;
    message: string;
  } | null>(null);
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Billing interval toggle for subscriptions: 'monthly' | 'quarterly' | 'annual'
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'quarterly' | 'annual'>('quarterly');

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

    // Fetch real-time stepped pre-order campaign status and auto-apply tier discount
    fetch('/api/preorder/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.totalClaimed === 'number') {
          setPreorderStatus(data);

          // If pre-order is active and no custom referral code exists, auto-apply the active stepped discount!
          if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const incomingRef = urlParams.get('ref') || urlParams.get('aff') || urlParams.get('coupon') || localStorage.getItem('bookgenie_ref');

            if (!incomingRef && data.isPreorderActive && data.activeTier) {
              const activePercent = data.activeTier.discountPercent;
              const autoRes = validateCoupon('FOUNDER', 1000, activePercent);
              if (autoRes.valid) {
                setAppliedCoupon({
                  code: `FOUNDER${activePercent}`,
                  percent: activePercent,
                  isAffiliate: false,
                  message: `⚡ ${data.activeTier.tierName} Active: ${activePercent}% discount automatically applied!`,
                });
                setCouponFeedback({
                  type: 'success',
                  text: `⚡ ${data.activeTier.tierName}: ${activePercent}% discount automatically applied! (Only ${data.activeTier.remainingInTier} spots left at this price)`,
                });
              }
            }
          }
        }
      })
      .catch(() => {});

    // Capture affiliate / referral code from URL parameters (?ref=... or ?coupon=...)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const incomingRef = urlParams.get('ref') || urlParams.get('aff') || urlParams.get('coupon');
      const cleanRef = incomingRef || localStorage.getItem('bookgenie_ref');

      if (cleanRef) {
        const uppercase = cleanRef.trim().toUpperCase();
        setCouponInput(uppercase);
        localStorage.setItem('bookgenie_ref', uppercase);
        document.cookie = `bookgenie_ref=${encodeURIComponent(uppercase)}; path=/; max-age=5184000; SameSite=Lax`;

        // Automatically validate & apply 10% discount
        const res = validateCoupon(uppercase, 1000);
        if (res.valid) {
          setAppliedCoupon({
            code: res.code,
            percent: res.discountPercent,
            isAffiliate: res.isAffiliate,
            message: res.message,
          });
          setCouponFeedback({ type: 'success', text: res.message });
        }
      }
    }
  }, [user]);

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) {
      setAppliedCoupon(null);
      setCouponFeedback(null);
      return;
    }

    const res = validateCoupon(couponInput.trim(), 1000);
    if (res.valid) {
      setAppliedCoupon({
        code: res.code,
        percent: res.discountPercent,
        isAffiliate: res.isAffiliate,
        message: res.message,
      });
      setCouponFeedback({ type: 'success', text: res.message });
      localStorage.setItem('bookgenie_ref', res.code);
      document.cookie = `bookgenie_ref=${encodeURIComponent(res.code)}; path=/; max-age=5184000; SameSite=Lax`;
    } else {
      setAppliedCoupon(null);
      setCouponFeedback({ type: 'error', text: res.message });
    }
  };

  const handleChoosePlan = async (planId: PlanId) => {
    setConfigError(null);
    setSuccessMessage(null);

    // Free plan handler: scroll smoothly to the home screen book generator card
    if (planId === 'free') {
      if (!user) {
        openAuthModal('signup', '/#creator-card');
        return;
      }
      const el = document.getElementById('creator-card');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push('/#creator-card');
      }
      return;
    }

    // Paid plans require user session
    if (!user) {
      openAuthModal('signup', '/#pricing');
      return;
    }

    setLoadingPlanId(planId);

    try {
      // 1. Create server-side Razorpay order with optional coupon / affiliate code
      const requestPayload: {
        planId: PlanId;
        pages?: number;
        interval?: 'monthly' | 'quarterly' | 'annual';
        couponCode?: string;
        affiliateRef?: string;
      } = {
        planId,
      };

      if (planId === 'single') {
        requestPayload.pages = customPages;
      } else if (planId === 'pro' || planId === 'creator') {
        requestPayload.interval = billingInterval;
      }

      if (appliedCoupon?.code) {
        requestPayload.couponCode = appliedCoupon.code;
        requestPayload.affiliateRef = appliedCoupon.code;
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
        currency: orderData.currency || 'USD',
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

          {/* 3-Interval Billing Toggle: Monthly, 3-Month Founder Pass, Annual */}
          <div className="mt-8 inline-flex items-center p-1 rounded-full bg-[#F5F5F3] border border-[#EAEAEA] text-xs font-medium">
            <button
              type="button"
              onClick={() => setBillingInterval('monthly')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                billingInterval === 'monthly'
                  ? 'bg-[#111111] text-white font-semibold shadow-xs'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingInterval('quarterly')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                billingInterval === 'quarterly'
                  ? 'bg-[#9A6F3C] text-white font-semibold shadow-xs'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <span>3-Month Founder Pass</span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                {preorderStatus.activeTier?.discountPercent ?? 50}% OFF
              </span>
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
                {getAnnualDiscountPercent(preorderStatus.activeTier?.discountPercent ?? 50)}% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Stepped Tier Pre-Order Launch Banner (Option C) */}
        {preorderStatus.isPreorderActive && (
          <div className="max-w-4xl mx-auto mb-10 p-6 rounded-3xl bg-gradient-to-br from-[#FDFBF7] via-[#FFFDF9] to-[#F7F2E8] border border-[#EFECE6] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-[#9A6F3C]/15 text-[#9A6F3C]">
                  <Flame className="w-5 h-5 text-[#9A6F3C]" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#9A6F3C] text-white text-[11px] font-bold uppercase tracking-wider">
                      {preorderStatus.activeTier?.tierName || 'Tier 1: 50% OFF'}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      Price Rises in {preorderStatus.activeTier?.remainingInTier ?? 11} orders
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1A1612] tracking-tight mt-1">
                    First 100 Founding Authors: Stepped Early Bird Deal
                  </h3>
                  <p className="text-xs text-[#6B635B]">
                    ⚡ First 100 users lock in this benefit for their first 3 months! Price increases every 25 orders.
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0 bg-white/70 p-3 rounded-xl border border-[#EFECE6]">
                <div className="flex items-center justify-between sm:justify-end gap-2 mb-1">
                  <span className="text-xs font-bold text-[#9A6F3C] uppercase tracking-wider block">
                    {preorderStatus.activeTier?.remainingInTier ?? 11} of 25 Left in This Tier
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mb-2">
                  Total: {preorderStatus.totalClaimed} of 100 claimed
                </p>
                <Link
                  href="/launch"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9A6F3C] hover:text-[#845D30] transition-colors"
                >
                  View Launch Countdown Page →
                </Link>
              </div>
            </div>

            {/* Stepped Tier Visual Ladder */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { num: 1, range: 'Spots 1–25', disc: '50% OFF', label: 'Super Early' },
                { num: 2, range: 'Spots 26–50', disc: '40% OFF', label: 'Early Bird' },
                { num: 3, range: 'Spots 51–75', disc: '30% OFF', label: 'Founder' },
                { num: 4, range: 'Spots 76–100', disc: '20% OFF', label: 'Final Call' },
              ].map((tier) => {
                const isCurrent = (preorderStatus.activeTier?.tierNumber ?? 1) === tier.num;
                const isPassed = (preorderStatus.activeTier?.tierNumber ?? 1) > tier.num;

                return (
                  <div
                    key={tier.num}
                    className={`p-2.5 rounded-xl border transition-all text-center ${
                      isCurrent
                        ? 'bg-white border-[#9A6F3C] shadow-xs ring-1 ring-[#9A6F3C]'
                        : isPassed
                        ? 'bg-neutral-100/60 border-neutral-200 opacity-60'
                        : 'bg-white/40 border-[#EFECE6]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-0.5">
                      <span>{tier.range}</span>
                      {isCurrent && (
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <div className={`text-xs sm:text-sm font-bold ${isCurrent ? 'text-[#9A6F3C]' : 'text-neutral-700'}`}>
                      {tier.disc}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-medium">
                      {isCurrent ? '⚡ ACTIVE NOW' : isPassed ? 'Sold Out' : 'Upcoming'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#EFECE6] rounded-full h-2 overflow-hidden mb-3">
              <div
                className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#9A6F3C] via-[#B88746] to-[#D4A559]"
                style={{ width: `${Math.min((preorderStatus.totalClaimed / preorderStatus.maxSpots) * 100, 100)}%` }}
              />
            </div>

            {/* Founder Perks Pill List */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#EFECE6] text-[11px] font-medium text-[#1A1612] shadow-2xs">
                <Award className="w-3.5 h-3.5 text-[#9A6F3C]" /> Gold Founding Author Badge
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#EFECE6] text-[11px] font-medium text-[#1A1612] shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-[#9A6F3C]" /> Priority GPU Generation Queue
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#EFECE6] text-[11px] font-medium text-[#1A1612] shadow-2xs">
                <Tag className="w-3.5 h-3.5 text-[#9A6F3C]" /> Auto-Applied at Checkout
              </span>
            </div>
          </div>
        )}

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
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('creator-card');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  Start Creating Your eBook Now →
                </button>
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

            // Compute display price and applicable discount percent based on interval
            const activeSteppedPercent = preorderStatus.activeTier?.discountPercent ?? 50;
            const effectiveDiscountPercent =
              billingInterval === 'annual'
                ? getAnnualDiscountPercent(appliedCoupon?.percent ?? activeSteppedPercent)
                : (appliedCoupon?.percent ?? activeSteppedPercent);

            const baseDisplayPrice =
              isSingle
                ? singlePricing.priceUsd
                : plan.billingType === 'free'
                ? 0
                : billingInterval === 'quarterly'
                ? (plan.quarterlyPriceUsd ?? plan.priceUsd * 3)
                : billingInterval === 'annual'
                ? (plan.annualAmountCents ? plan.annualAmountCents / 100 : (plan.annualPriceUsd ?? 15) * 12)
                : plan.priceUsd;

            const hasDiscount = Boolean((appliedCoupon || preorderStatus.isPreorderActive) && baseDisplayPrice > 0);
            const discountedDisplayPrice = hasDiscount
              ? Math.max(Number((baseDisplayPrice * (1 - effectiveDiscountPercent / 100)).toFixed(2)), 1)
              : baseDisplayPrice;

            const billingSubtext =
              plan.billingType === 'free'
                ? 'forever'
                : plan.billingType === 'one_time'
                ? 'one-time payment'
                : billingInterval === 'quarterly'
                ? isPro
                  ? '/ 3 mos ($9.50/mo)'
                  : isCreator
                  ? '/ 3 mos ($19.50/mo)'
                  : '/ 3 months'
                : billingInterval === 'annual'
                ? isPro
                  ? '/ year ($10.50/mo)'
                  : isCreator
                  ? '/ year ($21.70/mo)'
                  : '/ year'
                : '/ month (first 3 mos)';

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
                    className={`flex items-baseline gap-1.5 my-3 pb-3 border-b ${
                      isCreator ? 'border-white/10' : 'border-[#F0F0F0]'
                    }`}
                  >
                    {hasDiscount ? (
                      <>
                        <span className="text-3xl font-extrabold tracking-tight text-[#9A6F3C]">
                          ${discountedDisplayPrice % 1 === 0 ? discountedDisplayPrice : discountedDisplayPrice.toFixed(2)}
                        </span>
                        <span className="text-sm line-through text-neutral-400 font-medium">
                          ${baseDisplayPrice}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#9A6F3C]/10 text-[#9A6F3C] uppercase tracking-wide">
                          -{effectiveDiscountPercent}%
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-extrabold tracking-tight">
                        ${baseDisplayPrice}
                      </span>
                    )}
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
                        id="pricing-custom-pages-slider"
                        aria-label="Target book length in pages"
                        type="range"
                        min="20"
                        max="200"
                        step="5"
                        value={customPages}
                        onChange={(e) => setCustomPages(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#EAEAEA] rounded-lg appearance-none cursor-pointer accent-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                      />
                      <div className="flex justify-between text-[10px] text-[#888888] mt-1 font-mono">
                        <span>50p ($9)</span>
                        <span>100p ($14)</span>
                        <span>200p ($24)</span>
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
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('creator-card');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full py-2.5 px-4 rounded-full text-center text-xs font-semibold block transition-colors cursor-pointer ${
                        isCreator
                          ? 'bg-neutral-800 text-neutral-300 border border-white/20 hover:bg-neutral-700'
                          : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
                      }`}
                    >
                      Active Plan ✓ (Create on Homepage)
                    </button>
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
                            ? `Get Book ($${discountedDisplayPrice % 1 === 0 ? discountedDisplayPrice : discountedDisplayPrice.toFixed(2)})`
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

        {/* Coupon & Promotional Code Box (Below Pricing Plans) */}
        <div className="mt-12 max-w-lg mx-auto p-6 rounded-2xl bg-[#FAF9F6] border border-[#EAEAEA] shadow-2xs text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EAEAEA] text-xs font-semibold text-[#1A1612] mb-3">
            <Tag className="w-3.5 h-3.5 text-[#9A6F3C]" />
            <span>Have a Coupon or Affiliate Code?</span>
          </div>
          <p className="text-xs text-[#6B635B] mb-4">
            Enter your code below to claim an extra discount or support your favorite creator partner.
          </p>
          <form
            onSubmit={handleApplyCoupon}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-[#EFECE6] shadow-xs focus-within:border-[#9A6F3C] transition-colors"
          >
            <Tag className="w-4 h-4 text-[#9A6F3C] ml-2 shrink-0" />
            <input
              type="text"
              placeholder="Enter coupon code (e.g. FOUNDER10 or creator code)"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              className="flex-1 bg-transparent border-none text-xs sm:text-sm font-mono text-[#111111] placeholder:text-neutral-400 focus:outline-none px-1"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#111111] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
            >
              {appliedCoupon ? 'Applied' : 'Apply Code'}
            </button>
          </form>

          {couponFeedback && (
            <div
              className={`mt-3 text-center text-xs font-medium ${
                couponFeedback.type === 'success' ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {couponFeedback.text}
            </div>
          )}
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
