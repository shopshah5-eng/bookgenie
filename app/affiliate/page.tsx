'use client';

import React, { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, DollarSign, Users, Award, CheckCircle2, ArrowRight, Copy, Check, Tag, Link as LinkIcon } from 'lucide-react';

export default function AffiliatePage() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [applied, setApplied] = useState(false);
  const [partnerData, setPartnerData] = useState<{ couponCode: string; referralUrl: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setPartnerData({
        couponCode: data.couponCode || 'PARTNER10',
        referralUrl: data.referralUrl || `${typeof window !== 'undefined' ? window.location.origin : 'https://bookgenie.co'}/?ref=${data.couponCode || 'PARTNER10'}`,
      });
      setApplied(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      title: '10% Cash Commission on Every Order',
      desc: 'Earn 10% cash on every single book purchase, bundle, and subscription tier referred by your link or promo code.',
      icon: <DollarSign className="w-6 h-6 text-[#9A6F3C]" />,
    },
    {
      title: 'Custom 10% Audience Coupon Code',
      desc: 'Give your audience an exclusive 10% discount with your personalized coupon (e.g. YOURNAME10). When they save, you earn!',
      icon: <Award className="w-6 h-6 text-[#9A6F3C]" />,
    },
    {
      title: 'Dual Attribution (Link + Code)',
      desc: 'Your referrals are tracked for 60 full days. Even if a user visits on mobile and buys on desktop, your promo code guarantees attribution.',
      icon: <Users className="w-6 h-6 text-[#9A6F3C]" />,
    },
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-surface dark:bg-[#0f1015] text-on-surface dark:text-[#f3f0f7] transition-colors">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/30 text-secondary dark:text-secondary-fixed border border-secondary/20 text-xs font-label-caps tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Affiliate Atelier
            </span>
            <h1 className="font-headline-lg text-3xl sm:text-4xl lg:text-5xl text-on-surface dark:text-[#f3f0f7] tracking-tight mb-4">
              Earn with BookGenie
            </h1>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant dark:text-[#c4c7c5]">
              Partner with the leading luxury digital publishing platform. Share BookGenie with your audience and build recurring monthly revenue.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="p-8 rounded-3xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-secondary-container/20 dark:bg-white/5 flex items-center justify-center border border-secondary/20 mb-5">
                    {b.icon}
                  </div>
                  <h3 className="font-title-editorial text-lg text-on-surface dark:text-white mb-2">
                    {b.title}
                  </h3>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant dark:text-[#c4c7c5] leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Application Form Card */}
          <div className="max-w-xl mx-auto rounded-3xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5 p-8 sm:p-10 shadow-lg text-center">
            {applied && partnerData ? (
              <div className="py-4 space-y-5 text-left">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className="font-headline-sm text-xl sm:text-2xl text-on-surface dark:text-white font-bold">
                    You&apos;re an Official BookGenie Partner!
                  </h3>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant dark:text-[#c4c7c5] mt-1">
                    Your unique audience coupon and affiliate tracking link are ready to share immediately.
                  </p>
                </div>

                {/* Personalized Coupon Box */}
                <div className="p-4 rounded-2xl bg-white dark:bg-black/30 border border-outline-variant/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant dark:text-neutral-400">
                    <span className="flex items-center gap-1 font-semibold text-[#9A6F3C]">
                      <Tag className="w-3.5 h-3.5" /> Your Audience 10% Coupon Code:
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">10% CASH COMMISSION</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/20">
                    <code className="text-sm sm:text-base font-mono font-bold tracking-wider text-[#9A6F3C] px-1">
                      {partnerData.couponCode}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(partnerData.couponCode);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#111111] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Share this code on YouTube, Twitter, Instagram, or TikTok. When your followers enter it at checkout, they save 10% and you earn 10% cash commission.
                  </p>
                </div>

                {/* Direct Referral Link Box */}
                <div className="p-4 rounded-2xl bg-white dark:bg-black/30 border border-outline-variant/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant dark:text-neutral-400">
                    <span className="flex items-center gap-1 font-semibold text-[#9A6F3C]">
                      <LinkIcon className="w-3.5 h-3.5" /> Your Direct Tracking Link:
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">60-day cookie</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/20">
                    <span className="text-xs font-mono truncate text-neutral-600 dark:text-neutral-300 px-1 select-all">
                      {partnerData.referralUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(partnerData.referralUrl);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#9A6F3C] text-white text-xs font-semibold hover:bg-[#845D30] transition-colors cursor-pointer shrink-0"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Anyone clicking this link has your promo code and 10% discount automatically pre-applied on the pricing table.
                  </p>
                </div>
              </div>
            ) : applied ? (
              <div className="py-8 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-headline-sm text-xl text-on-surface dark:text-white">
                  Application Received!
                </h3>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant dark:text-[#c4c7c5] max-w-md mx-auto">
                  Thank you for applying to the BookGenie Partner Program. Your application has been logged.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-headline-sm text-2xl text-on-surface dark:text-white mb-2">
                  Apply to Become an Affiliate Partner
                </h2>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant dark:text-[#c4c7c5] mb-6">
                  Fill out the form below to receive your unique referral link and promotional toolkit.
                </p>

                {error && (
                  <div className="p-3.5 mb-4 text-xs font-medium text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  {/* Invisible honeypot for spam bots */}
                  <input
                    type="text"
                    name="hp_field"
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  <div>
                    <label htmlFor="affiliate-email" className="block text-xs font-semibold text-on-surface dark:text-white mb-1.5 font-label-caps">
                      Your Email Address
                    </label>
                    <Input
                      id="affiliate-email"
                      name="email"
                      type="email"
                      required
                      aria-required="true"
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="affiliate-website" className="block text-xs font-semibold text-on-surface dark:text-white mb-1.5 font-label-caps">
                      Website or Primary Social Channel
                    </label>
                    <Input
                      id="affiliate-website"
                      name="website"
                      type="text"
                      required
                      aria-required="true"
                      placeholder="https://youtube.com/@yourchannel or https://myblog.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    className="w-full mt-2 font-semibold bg-primary hover:bg-primary-hover text-on-primary shadow-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting Application...' : (
                      <>Submit Affiliate Application <ArrowRight className="w-4 h-4 ml-1" /></>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </main>

        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
