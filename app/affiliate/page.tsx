'use client';

import React, { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, DollarSign, Users, Award, CheckCircle2, ArrowRight, Copy, Check, Tag, Link as LinkIcon, Building } from 'lucide-react';

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
      title: '10% Monthly Recurring Commission',
      desc: 'Earn 10% cash every single month on subscriptions, plus 10% on one-time book purchases and founder passes referred by your link or promo code.',
      icon: <DollarSign className="w-6 h-6 text-[#9A6F3C]" />,
    },
    {
      title: 'Direct Bank & UPI Transfers ($10 Min)',
      desc: 'No complicated points or waiting months. Add your Bank Account or UPI ID to your dashboard and withdraw your earnings with a low $10 minimum threshold.',
      icon: <Building className="w-6 h-6 text-[#9A6F3C]" />,
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
      <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans selection:bg-[#111111] selection:text-white">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] text-[#9A6F3C] border border-[#EAEAEA] text-xs font-semibold tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Affiliate Atelier
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111111] tracking-tight font-normal mb-4">
              Earn with BookGenie
            </h1>
            <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
              Partner with the leading luxury digital publishing platform. Share BookGenie with your audience and build recurring monthly revenue.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/affiliate/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-all shadow-xs"
              >
                <span>Go to Affiliate Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="#apply"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#EAEAEA] text-xs font-semibold hover:border-[#111111] transition-all text-[#111111] bg-white"
              >
                <span>New Partner? Apply Below</span>
              </a>
            </div>
          </div>

          {/* Benefits Grid (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="p-7 rounded-2xl bg-white border border-[#EAEAEA] hover:border-[#CCCCCC] shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] flex items-center justify-center border border-[#EAEAEA] mb-5">
                    {b.icon}
                  </div>
                  <h3 className="font-serif text-lg text-[#111111] font-semibold mb-2">
                    {b.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Application Form Card */}
          <div id="apply" className="max-w-xl mx-auto rounded-2xl bg-white border border-[#EAEAEA] p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] text-center scroll-mt-24">
            {applied && partnerData ? (
              <div className="py-4 space-y-5 text-left">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-xl sm:text-2xl text-[#111111] font-semibold">
                    You&apos;re an Official BookGenie Partner!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#666666] mt-1">
                    Your unique audience coupon and affiliate tracking link are ready to share immediately.
                  </p>
                </div>

                {/* Personalized Coupon Box */}
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAEAEA] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#666666]">
                    <span className="flex items-center gap-1 font-semibold text-[#9A6F3C]">
                      <Tag className="w-3.5 h-3.5" /> Your Audience 10% Coupon Code:
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">10% CASH COMMISSION</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-[#EAEAEA]">
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
                  <p className="text-[11px] text-[#888888]">
                    Share this code on YouTube, Twitter, Instagram, or TikTok. When your followers enter it at checkout, they save 10% and you earn 10% cash commission.
                  </p>
                </div>

                {/* Direct Referral Link Box */}
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAEAEA] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#666666]">
                    <span className="flex items-center gap-1 font-semibold text-[#9A6F3C]">
                      <LinkIcon className="w-3.5 h-3.5" /> Your Direct Tracking Link:
                    </span>
                    <span className="text-[11px] font-mono text-[#888888]">60-day cookie</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-[#EAEAEA]">
                    <span className="text-xs font-mono truncate text-[#666666] px-1 select-all">
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
                  <p className="text-[11px] text-[#888888]">
                    Anyone clicking this link has your promo code and 10% discount automatically pre-applied on the pricing table.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="/affiliate/dashboard"
                    className="w-full py-3 px-4 rounded-xl bg-[#111111] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-xs"
                  >
                    <span>Open Your Partner Dashboard &amp; Configure Payouts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : applied ? (
              <div className="py-8 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl text-[#111111] font-semibold">
                  Application Received!
                </h3>
                <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto">
                  Thank you for applying to the BookGenie Partner Program. Your application has been logged.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-2xl text-[#111111] font-semibold mb-2">
                  Apply to Become an Affiliate Partner
                </h2>
                <p className="text-xs sm:text-sm text-[#666666] mb-6">
                  Fill out the form below to receive your unique referral link and promotional toolkit.
                </p>

                {error && (
                  <div className="p-3.5 mb-4 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl">
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
                    <label htmlFor="affiliate-email" className="block text-xs font-semibold text-[#111111] mb-1.5 uppercase tracking-wider">
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
                    <label htmlFor="affiliate-website" className="block text-xs font-semibold text-[#111111] mb-1.5 uppercase tracking-wider">
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
                    className="w-full mt-2 font-semibold bg-[#111111] hover:bg-black text-white rounded-full shadow-xs"
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
