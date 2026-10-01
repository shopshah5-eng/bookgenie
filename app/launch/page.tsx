'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Flame,
  Check,
  Tag,
  ShieldCheck,
  Zap,
  Award,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { type PlanId } from '@/lib/payments/plans';
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

export default function LaunchPage() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  // 7-day Countdown Timer State
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 6,
    hours: 21,
    minutes: 45,
    seconds: 30,
  });

  // Billing Interval: 'monthly' | 'quarterly' (3-Month Founder Pass) | 'annual'
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'quarterly' | 'annual'>('quarterly');

  // Stepped Pre-Order Status (First 100 Founding Authors)
  const [preorderStatus, setPreorderStatus] = useState<{
    totalClaimed: number;
    maxSpots: number;
    remainingTotal: number;
    isPreorderActive: boolean;
    activeTier: {
      tierNumber: number;
      tierName: string;
      discountPercent: number;
      tierRange: string;
      spotsInTier: number;
      remainingInTier: number;
      nextTierPercent: number;
    };
  }>({
    totalClaimed: 14,
    maxSpots: 100,
    remainingTotal: 86,
    isPreorderActive: true,
    activeTier: {
      tierNumber: 1,
      tierName: 'Tier 1: Super Early Bird',
      discountPercent: 50,
      tierRange: 'Spots 1 – 25',
      spotsInTier: 25,
      remainingInTier: 11,
      nextTierPercent: 40,
    },
  });

  // Coupon / Affiliate input
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    percent: number;
    isAffiliate: boolean;
    message: string;
  } | null>(null);
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Checkout loading and error states
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  // Real-time 7-day countdown clock logic
  useEffect(() => {
    // 7 days target timestamp
    const launchTarget = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = Math.max(launchTarget - now, 0);

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch real-time pre-order status
  useEffect(() => {
    fetch('/api/preorder/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.totalClaimed === 'number') {
          setPreorderStatus(data);
        }
      })
      .catch(() => {});

    // Check URL for referral codes
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const incomingRef = urlParams.get('ref') || urlParams.get('aff') || urlParams.get('coupon') || localStorage.getItem('bookgenie_ref');

      if (incomingRef) {
        const uppercase = incomingRef.trim().toUpperCase();
        setCouponInput(uppercase);
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
  }, []);

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) {
      setAppliedCoupon(null);
      setCouponFeedback(null);
      return;
    }

    const res = validateCoupon(couponInput.trim(), 1000, preorderStatus.activeTier.discountPercent);
    if (res.valid) {
      setAppliedCoupon({
        code: res.code,
        percent: res.discountPercent,
        isAffiliate: res.isAffiliate,
        message: res.message,
      });
      setCouponFeedback({ type: 'success', text: res.message });
      localStorage.setItem('bookgenie_ref', res.code);
    } else {
      setAppliedCoupon(null);
      setCouponFeedback({ type: 'error', text: res.message });
    }
  };

  // Direct subscription checkout trigger
  const handleSubscribe = async (planId: PlanId) => {
    setCheckoutError(null);
    setCheckoutSuccess(null);

    if (planId === 'free') {
      router.push('/#creator-card');
      return;
    }

    if (!user) {
      openAuthModal('signup', '/launch');
      return;
    }

    setLoadingPlanId(planId);

    try {
      const requestPayload: {
        planId: PlanId;
        interval?: 'monthly' | 'quarterly' | 'annual';
        couponCode?: string;
        affiliateRef?: string;
      } = {
        planId,
        interval: billingInterval,
      };

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
          setCheckoutError(orderData.message || 'Payments are currently being configured for launch.');
        } else {
          setCheckoutError(orderData.message || 'Failed to initiate launch checkout. Please try again.');
        }
        setLoadingPlanId(null);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setCheckoutError('Could not load secure checkout. Check your internet connection.');
        setLoadingPlanId(null);
        return;
      }

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'USD',
        name: 'BookGenie Publishing',
        description: `${orderData.planName} (Founding Author Pass)`,
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
              setCheckoutSuccess(
                `🎉 Congratulations! You are officially Founding Author #${verifyData.founderNumber || 15}! Your ${orderData.planName} pass is active for the first 3 months.`
              );
            } else {
              setCheckoutError(verifyData.message || 'Payment signature could not be verified by server.');
            }
          } catch (err) {
            console.error('Launch verification error:', err);
            setCheckoutError('Verification error. If your card was charged, contact support.');
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
      console.error('Launch checkout error:', err);
      setCheckoutError('An unexpected error occurred while initiating checkout.');
      setLoadingPlanId(null);
    }
  };

  // Determine active discount percentages
  const baseDiscount = preorderStatus.activeTier.discountPercent; // e.g. 50%
  const annualDiscount = getAnnualDiscountPercent(baseDiscount); // e.g. 30%

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FDFBF7] text-[#1A1612] font-sans selection:bg-[#111111] selection:text-white">
      {/* Dynamic Background Glowing Mesh (behind white blur) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-200/40 via-amber-100/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-amber-300/25 via-stone-200/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] rounded-full bg-gradient-to-t from-amber-100/30 via-neutral-100/40 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navigation Bar with Frosted Glass Blur */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-white/60 shadow-2xs">
        <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group select-none">
            <svg
              className="w-5 h-5 text-[#111111]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 1-4 4v14a3 3 0 0 0 3-3h7z" />
            </svg>
            <span className="font-semibold text-lg tracking-tight text-[#111111] font-sans">
              BookGenie
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-medium text-[#6B635B] hover:text-[#1A1612] px-3 py-1.5 rounded-full transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/affiliate"
              className="text-xs font-semibold text-[#9A6F3C] bg-[#9A6F3C]/10 border border-[#9A6F3C]/20 px-3.5 py-1.5 rounded-full hover:bg-[#9A6F3C]/20 transition-all"
            >
              Affiliate Program (10% Cash)
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero with White Blur Frosted Glass Card Container */}
      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-12 sm:py-16">
        {/* White Blur Hero Wrapper */}
        <div className="backdrop-blur-2xl bg-white/80 rounded-3xl border border-white/90 shadow-2xl p-6 sm:p-10 lg:p-12 mb-12">
          {/* Eyebrow Pill */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[#9A6F3C] text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Platform Pre-Launch</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-normal text-[#1A1612] tracking-tight leading-[1.12]">
              We are launching BookGenie <span className="italic font-serif">within a week.</span>
            </h1>
            <p className="font-sans text-sm sm:text-base text-[#6B635B] mt-4 max-w-2xl mx-auto leading-relaxed">
              Unlock autonomous AI book writing, commercial cover design, and instant EPUB/PDF publishing.
              Secure your lifetime Founding Author status before the public release.
            </p>
          </div>

          {/* 7-Day Live Countdown Clock */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#9A6F3C] uppercase tracking-wider mb-3">
              <Clock className="w-4 h-4 text-[#9A6F3C]" />
              <span>Public Release Countdown</span>
            </div>
            <div className="grid grid-cols-4 gap-3 sm:gap-4 text-center">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Minutes', val: timeLeft.minutes },
                { label: 'Seconds', val: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-md bg-white/90 rounded-2xl p-3 sm:p-4 border border-[#EFECE6] shadow-sm"
                >
                  <div className="text-2xl sm:text-4xl font-extrabold text-[#1A1612] font-mono tracking-tight">
                    {String(item.val).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#6B635B] mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live 100-User Counter Card */}
          <div className="max-w-3xl mx-auto p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-white to-[#FDFBF7] border border-[#EFECE6] shadow-md mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="p-3 rounded-2xl bg-[#9A6F3C]/15 text-[#9A6F3C] shrink-0">
                  <Flame className="w-6 h-6 text-[#9A6F3C]" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#9A6F3C] text-white text-[11px] font-bold uppercase tracking-wider">
                      {preorderStatus.activeTier.tierName}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {preorderStatus.activeTier.remainingInTier} Spots Left at {baseDiscount}% OFF
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1612] tracking-tight mt-1">
                    First 100 Founding Authors Tracker
                  </h3>
                  <p className="text-xs text-[#6B635B]">
                    Every 25 orders, the price increases for future members. Lock in maximum savings today.
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0 bg-white p-3 rounded-xl border border-[#EFECE6] shadow-2xs">
                <span className="text-sm font-extrabold text-[#9A6F3C] block font-mono">
                  {preorderStatus.totalClaimed} / {preorderStatus.maxSpots} Claimed
                </span>
                <span className="text-[11px] text-neutral-500 font-medium">
                  {preorderStatus.remainingTotal} Founder spots remaining
                </span>
              </div>
            </div>

            {/* Stepped Progress Bar */}
            <div className="w-full bg-[#EFECE6] rounded-full h-2.5 overflow-hidden mb-4">
              <div
                className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#9A6F3C] via-[#B88746] to-[#E3BA73]"
                style={{ width: `${Math.min((preorderStatus.totalClaimed / preorderStatus.maxSpots) * 100, 100)}%` }}
              />
            </div>

            {/* Stepped Tier Visual Ladder */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              {[
                { num: 1, range: 'Spots 1–25', disc: '50% OFF', name: 'Super Early' },
                { num: 2, range: 'Spots 26–50', disc: '40% OFF', name: 'Early Bird' },
                { num: 3, range: 'Spots 51–75', disc: '30% OFF', name: 'Founder' },
                { num: 4, range: 'Spots 76–100', disc: '20% OFF', name: 'Final Call' },
              ].map((tier) => {
                const isCurrent = preorderStatus.activeTier.tierNumber === tier.num;
                const isPassed = preorderStatus.activeTier.tierNumber > tier.num;

                return (
                  <div
                    key={tier.num}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-white border-[#9A6F3C] ring-2 ring-[#9A6F3C]/40 shadow-sm'
                        : isPassed
                        ? 'bg-neutral-100/70 border-neutral-200 opacity-60'
                        : 'bg-white/60 border-[#EFECE6]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-0.5">
                      <span>{tier.range}</span>
                      {isCurrent && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                    </div>
                    <div className={`text-sm font-bold ${isCurrent ? 'text-[#9A6F3C]' : 'text-[#1A1612]'}`}>
                      {tier.disc}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-medium">
                      {isCurrent ? '⚡ ACTIVE NOW' : isPassed ? 'Sold Out' : 'Upcoming'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EXPLICIT MANDATORY USER BENEFIT LINE */}
          <div className="max-w-3xl mx-auto mb-10 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-center shadow-xs">
            <p className="text-sm sm:text-base font-bold text-[#1A1612] leading-snug">
              ⚡ <span className="text-[#9A6F3C]">Special Launch Privilege:</span> First 100 users lock in this benefit for their first 3 months with this discounted plan!
            </p>
            <p className="text-xs text-[#6B635B] mt-1">
              Whether you choose the Monthly plan or the exclusive 3-Month Founder Pass, your discounted rate is guaranteed for the full 3-month period.
            </p>
          </div>

          {/* 3 Interval Toggle: Monthly, 3-Month Founder Pass, Annual */}
          <div className="flex flex-col items-center justify-center mb-10">
            <span className="text-xs font-semibold text-[#6B635B] uppercase tracking-wider mb-2">
              Select Your Billing Schedule
            </span>
            <div className="inline-flex p-1.5 rounded-full bg-[#FAF9F6] border border-[#EFECE6] shadow-xs text-xs font-semibold">
              <button
                type="button"
                onClick={() => setBillingInterval('monthly')}
                className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                  billingInterval === 'monthly'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-[#6B635B] hover:text-[#1A1612]'
                }`}
              >
                Monthly Plan ({baseDiscount}% OFF for 3 mos)
              </button>

              <button
                type="button"
                onClick={() => setBillingInterval('quarterly')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all cursor-pointer ${
                  billingInterval === 'quarterly'
                    ? 'bg-[#9A6F3C] text-white shadow-xs'
                    : 'text-[#6B635B] hover:text-[#1A1612]'
                }`}
              >
                <span>3-Month Founder Pass</span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  First 100 Only
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBillingInterval('annual')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all cursor-pointer ${
                  billingInterval === 'annual'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-[#6B635B] hover:text-[#1A1612]'
                }`}
              >
                <span>Annual Plan</span>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  {annualDiscount}% OFF
                </span>
              </button>
            </div>
          </div>

          {/* Global Alert Messages */}
          {checkoutError && (
            <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-950">Notice</p>
                <p className="mt-0.5 text-amber-800">{checkoutError}</p>
              </div>
            </div>
          )}

          {checkoutSuccess && (
            <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-3">
              <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-950">Success</p>
                <p className="mt-0.5 text-emerald-800">{checkoutSuccess}</p>
              </div>
            </div>
          )}

          {/* Pricing Plans Grid: PRO (Most Popular), CREATOR (Scale), SINGLE (One-Time) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* 1. SINGLE BOOK PLAN */}
            <div className="flex flex-col justify-between rounded-2xl p-6 bg-white border border-[#EFECE6] shadow-sm hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-neutral-100 text-neutral-700">
                    One-Time Book
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#1A1612] mb-1">
                  Single Book Pass
                </h3>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 my-3 pb-3 border-b border-[#F0F0F0]">
                  <span className="text-3xl font-extrabold text-[#9A6F3C]">
                    ${(9 * (1 - baseDiscount / 100)).toFixed(2)}
                  </span>
                  <span className="text-sm line-through text-neutral-400 font-medium">
                    $9.00
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#9A6F3C]/10 text-[#9A6F3C] uppercase">
                    -{baseDiscount}%
                  </span>
                  <span className="text-xs text-[#6B635B] ml-auto">one-time</span>
                </div>

                <p className="text-xs text-[#6B635B] mb-5 leading-relaxed">
                  Publish a complete, high-quality digital book up to 50 pages with full commercial rights.
                </p>

                <ul className="space-y-2.5 mb-6 text-xs text-neutral-800">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#9A6F3C] shrink-0 mt-0.5" />
                    <span>1 complete ebook up to 50 pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#9A6F3C] shrink-0 mt-0.5" />
                    <span>PDF + EPUB universal downloads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#9A6F3C] shrink-0 mt-0.5" />
                    <span>100% Commercial rights (KDP/Gumroad)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#9A6F3C] shrink-0 mt-0.5" />
                    <span>Studio artwork &amp; cover generation</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSubscribe('single')}
                disabled={loadingPlanId === 'single'}
                className="w-full py-3 px-4 rounded-full text-center text-xs font-semibold bg-[#111111] text-white hover:bg-[#222222] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-sm"
              >
                {loadingPlanId === 'single' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Opening Checkout...</span>
                  </>
                ) : (
                  <span>Direct Pre-Order Single (${(9 * (1 - baseDiscount / 100)).toFixed(2)})</span>
                )}
              </button>
            </div>

            {/* 2. PRO PLAN (Featured Founder Pass) */}
            <div className="flex flex-col justify-between rounded-2xl p-6 bg-gradient-to-b from-[#FFFDF9] to-white border-2 border-[#9A6F3C] shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#9A6F3C] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Founding Author Favorite</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#9A6F3C]/15 text-[#9A6F3C]">
                    Pro Founder Tier
                  </span>
                  <Sparkles className="w-4 h-4 text-[#9A6F3C]" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#1A1612] mb-1">
                  PRO Plan
                </h3>

                {/* Price Display based on billingInterval */}
                <div className="flex items-baseline gap-2 my-3 pb-3 border-b border-[#F0F0F0]">
                  {billingInterval === 'quarterly' ? (
                    <>
                      <span className="text-3xl font-extrabold text-[#9A6F3C]">
                        ${(57 * (1 - baseDiscount / 100)).toFixed(2)}
                      </span>
                      <span className="text-sm line-through text-neutral-400 font-medium">
                        $57.00
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#9A6F3C]/10 text-[#9A6F3C] uppercase">
                        -{baseDiscount}%
                      </span>
                      <span className="text-xs text-[#6B635B] ml-auto">for 3 months ($9.50/mo)</span>
                    </>
                  ) : billingInterval === 'monthly' ? (
                    <>
                      <span className="text-3xl font-extrabold text-[#9A6F3C]">
                        ${(19 * (1 - baseDiscount / 100)).toFixed(2)}
                      </span>
                      <span className="text-sm line-through text-neutral-400 font-medium">
                        $19.00
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#9A6F3C]/10 text-[#9A6F3C] uppercase">
                        -{baseDiscount}%
                      </span>
                      <span className="text-xs text-[#6B635B] ml-auto">/mo for first 3 mos</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold text-[#9A6F3C]">
                        ${(180 * (1 - annualDiscount / 100)).toFixed(2)}
                      </span>
                      <span className="text-sm line-through text-neutral-400 font-medium">
                        $180.00
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase">
                        -{annualDiscount}%
                      </span>
                      <span className="text-xs text-[#6B635B] ml-auto">/yr ($10.50/mo)</span>
                    </>
                  )}
                </div>

                <p className="text-xs text-[#6B635B] mb-5 leading-relaxed">
                  Ideal for independent authors, educators, and content creators building an active publication catalog.
                </p>

                <ul className="space-y-2.5 mb-6 text-xs text-neutral-800">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#9A6F3C] shrink-0 mt-0.5" />
                    <span className="font-semibold">20 complete books per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#9A6F3C] shrink-0 mt-0.5" />
                    <span>Up to 100 pages per publication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#9A6F3C] shrink-0 mt-0.5" />
                    <span>Commercial licensing &amp; watermark-free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#9A6F3C] shrink-0 mt-0.5" />
                    <span>Priority GPU generation queue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-[#9A6F3C] shrink-0 mt-0.5" />
                    <span className="font-medium text-[#9A6F3C]">Guaranteed discount locked for first 3 months</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSubscribe('pro')}
                disabled={loadingPlanId === 'pro'}
                className="w-full py-3 px-4 rounded-full text-center text-xs font-bold bg-[#9A6F3C] text-white hover:bg-[#845D30] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-md"
              >
                {loadingPlanId === 'pro' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Opening Checkout...</span>
                  </>
                ) : (
                  <span>
                    Direct Subscribe PRO (
                    {billingInterval === 'quarterly'
                      ? `$${(57 * (1 - baseDiscount / 100)).toFixed(2)} / 3 mos`
                      : billingInterval === 'monthly'
                      ? `$${(19 * (1 - baseDiscount / 100)).toFixed(2)} / mo`
                      : `$${(180 * (1 - annualDiscount / 100)).toFixed(2)} / yr`}
                    )
                  </span>
                )}
              </button>
            </div>

            {/* 3. CREATOR PLAN (High Volume) */}
            <div className="flex flex-col justify-between rounded-2xl p-6 bg-[#111111] text-white border border-[#222222] shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-white/15 text-white">
                    Agency &amp; VIP
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white mb-1">
                  CREATOR Plan
                </h3>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 my-3 pb-3 border-b border-white/10">
                  {billingInterval === 'quarterly' ? (
                    <>
                      <span className="text-3xl font-extrabold text-amber-400">
                        ${(117 * (1 - baseDiscount / 100)).toFixed(2)}
                      </span>
                      <span className="text-sm line-through text-neutral-500 font-medium">
                        $117.00
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 uppercase">
                        -{baseDiscount}%
                      </span>
                      <span className="text-xs text-neutral-400 ml-auto">for 3 months</span>
                    </>
                  ) : billingInterval === 'monthly' ? (
                    <>
                      <span className="text-3xl font-extrabold text-amber-400">
                        ${(39 * (1 - baseDiscount / 100)).toFixed(2)}
                      </span>
                      <span className="text-sm line-through text-neutral-500 font-medium">
                        $39.00
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 uppercase">
                        -{baseDiscount}%
                      </span>
                      <span className="text-xs text-neutral-400 ml-auto">/mo for 3 mos</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold text-amber-400">
                        ${(372 * (1 - annualDiscount / 100)).toFixed(2)}
                      </span>
                      <span className="text-sm line-through text-neutral-500 font-medium">
                        $372.00
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 uppercase">
                        -{annualDiscount}%
                      </span>
                      <span className="text-xs text-neutral-400 ml-auto">/yr ($21.70/mo)</span>
                    </>
                  )}
                </div>

                <p className="text-xs text-neutral-300 mb-5 leading-relaxed">
                  For publishing studios, digital marketers, and serial authors requiring maximum capacity.
                </p>

                <ul className="space-y-2.5 mb-6 text-xs text-neutral-200">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span className="font-semibold">50 complete books per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>Up to 200 pages per book</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>Publishing-grade HD illustrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>Fastest VIP priority GPU cluster</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span className="text-amber-300 font-medium">Locked in discount for first 3 months</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSubscribe('creator')}
                disabled={loadingPlanId === 'creator'}
                className="w-full py-3 px-4 rounded-full text-center text-xs font-bold bg-white text-[#111111] hover:bg-neutral-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-sm"
              >
                {loadingPlanId === 'creator' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Opening Checkout...</span>
                  </>
                ) : (
                  <span>
                    Direct Subscribe CREATOR (
                    {billingInterval === 'quarterly'
                      ? `$${(117 * (1 - baseDiscount / 100)).toFixed(2)} / 3 mos`
                      : billingInterval === 'monthly'
                      ? `$${(39 * (1 - baseDiscount / 100)).toFixed(2)} / mo`
                      : `$${(372 * (1 - annualDiscount / 100)).toFixed(2)} / yr`}
                    )
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Promotional Coupon & Affiliate Code Box */}
          <div className="mt-12 max-w-lg mx-auto p-5 rounded-2xl bg-white/80 border border-[#EFECE6] shadow-xs text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDFBF7] border border-[#EFECE6] text-xs font-semibold text-[#1A1612] mb-2">
              <Tag className="w-3.5 h-3.5 text-[#9A6F3C]" />
              <span>Affiliate or Referral Code</span>
            </div>
            <p className="text-xs text-[#6B635B] mb-3">
              Invited by a partner? Enter their coupon code below to attribute commission and lock in benefits.
            </p>
            <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-[#EFECE6] focus-within:border-[#9A6F3C]">
              <Tag className="w-4 h-4 text-[#9A6F3C] ml-2 shrink-0" />
              <input
                type="text"
                placeholder="Enter promo code (e.g. FOUNDER10 or partner code)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="flex-1 bg-transparent border-none text-xs sm:text-sm font-mono text-[#111111] placeholder:text-neutral-400 focus:outline-none px-1"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#111111] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
              >
                {appliedCoupon ? 'Applied ✓' : 'Apply'}
              </button>
            </form>

            {couponFeedback && (
              <div className={`mt-2.5 text-xs font-medium ${couponFeedback.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>
                {couponFeedback.text}
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="mt-12 pt-8 border-t border-[#EFECE6] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-6 h-6 text-[#9A6F3C] mb-2" />
              <h4 className="text-xs font-bold text-[#1A1612]">100% Commercial Rights</h4>
              <p className="text-[11px] text-[#6B635B] mt-0.5">Sell freely on Amazon, Apple Books, or Gumroad</p>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-6 h-6 text-[#9A6F3C] mb-2" />
              <h4 className="text-xs font-bold text-[#1A1612]">Priority GPU Generation</h4>
              <p className="text-[11px] text-[#6B635B] mt-0.5">Skip the waitlist with high-speed parallel rendering</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-6 h-6 text-[#9A6F3C] mb-2" />
              <h4 className="text-xs font-bold text-[#1A1612]">3-Month Price Lock</h4>
              <p className="text-[11px] text-[#6B635B] mt-0.5">Your stepped discount is guaranteed for your first 3 months</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
