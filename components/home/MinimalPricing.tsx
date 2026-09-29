'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { CANONICAL_PLANS, ORDERED_PLAN_IDS, type PlanId } from '@/lib/payments/plans';

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

    // Free plan handler
    if (planId === 'free') {
      if (!user) {
        openAuthModal('signup', '/create');
        return;
      }
      router.push('/create');
      return;
    }

    // Paid plan handlers require authentication
    if (!user) {
      openAuthModal('signup', `/#pricing`);
      return;
    }

    setLoadingPlanId(planId);

    try {
      // 1. Create server-side Razorpay order
      const orderRes = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        if (orderRes.status === 503 || orderData.error === 'PAYMENTS_NOT_CONFIGURED') {
          setConfigError(
            orderData.message ||
              'Payments are not configured yet. Please configure Razorpay keys to enable paid checkout.'
          );
        } else {
          setConfigError(orderData.message || 'Failed to initiate checkout. Please try again.');
        }
        setLoadingPlanId(null);
        return;
      }

      // 2. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setConfigError('Could not load secure Razorpay checkout. Check your internet connection.');
        setLoadingPlanId(null);
        return;
      }

      // 3. Launch Razorpay modal
      const plan = CANONICAL_PLANS[planId];
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'BookGenie Atelier',
        description: `${plan.name} Plan`,
        order_id: orderData.orderId,
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
        },
        theme: {
          color: '#111111',
        },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          setLoadingPlanId(planId);
          try {
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                planId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.verified) {
              setCurrentTier(planId);
              setSuccessMessage(
                `Payment confirmed! You now have access to the ${plan.name} plan.`
              );
            } else {
              setConfigError(
                verifyData.message || 'Payment signature could not be verified by the server.'
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
            Simple, transparent publishing plans.
          </h2>
          <p className="text-sm sm:text-base text-[#666666] mt-3 font-sans leading-relaxed">
            Start creating free, or upgrade with one-time credits or pro subscription for commercial publishing.
          </p>
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

        {/* 3 Plans Grid: FREE, PRO, CREATOR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {ORDERED_PLAN_IDS.map((planId) => {
            const plan = CANONICAL_PLANS[planId];
            const isCreator = plan.id === 'creator';
            const isPro = plan.id === 'pro';
            const isCurrent = user && currentTier === plan.id;
            const isLoading = loadingPlanId === plan.id;

            return (
              <div
                key={plan.id}
                className={`flex flex-col justify-between rounded-2xl p-7 transition-all duration-200 ${
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
                    className={`text-2xl font-bold tracking-tight mb-1 ${
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
                      ₹{plan.priceInr}
                    </span>
                    <span
                      className={`text-xs ${
                        isCreator ? 'text-neutral-400' : 'text-[#777777]'
                      }`}
                    >
                      {plan.billingType === 'subscription'
                        ? '/ month'
                        : plan.billingType === 'one_time'
                        ? 'one-time'
                        : 'forever'}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-xs mb-5 leading-relaxed min-h-[36px] ${
                      isCreator ? 'text-neutral-300' : 'text-[#666666]'
                    }`}
                  >
                    {plan.description}
                  </p>

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
                            ? 'Start Free'
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

      </div>
    </section>
  );
}
