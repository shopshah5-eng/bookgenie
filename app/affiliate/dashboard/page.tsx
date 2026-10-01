'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  Tag,
  Copy,
  Check,
  CreditCard,
  Building,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ExternalLink,
  Users,
  Calendar,
  Sparkles,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { MinimalFooter } from '@/components/home/MinimalFooter';

interface ReferredOrder {
  id: string;
  date: string;
  planName: string;
  interval: string;
  orderAmountUsd: number;
  commissionUsd: number;
  status: string;
}

interface DashboardData {
  partner: {
    email: string;
    name: string;
    couponCode: string;
    referralUrl: string;
    commissionRatePercent: number;
  };
  metrics: {
    totalEarningsUsd: number;
    availableBalanceUsd: number;
    paidOutUsd: number;
    minPayoutUsd: number;
    isEligibleForPayout: boolean;
    totalReferredOrders: number;
  };
  payoutSettings: {
    method: 'upi' | 'bank' | 'paypal';
    upiId: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    paypalEmail: string;
    isConfigured: boolean;
  };
  orders: ReferredOrder[];
}

export default function AffiliateDashboardPage() {
  const { user, openAuthModal } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Copy states
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Payout Method form state
  const [payoutMethod, setPayoutMethod] = useState<'upi' | 'bank' | 'paypal'>('upi');
  const [upiId, setUpiId] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Request payout state
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [payoutFeedback, setPayoutFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch real affiliate data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/affiliate/dashboard');
      if (res.status === 401) {
        setLoading(false);
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to load affiliate metrics.');
      }
      setData(json);

      // Pre-fill form from saved settings
      if (json.payoutSettings) {
        setPayoutMethod(json.payoutSettings.method || 'upi');
        setUpiId(json.payoutSettings.upiId || '');
        setAccountHolderName(json.payoutSettings.accountHolderName || '');
        setBankName(json.payoutSettings.bankName || '');
        setAccountNumber(json.payoutSettings.accountNumber || '');
        setIfscCode(json.payoutSettings.ifscCode || '');
        setPaypalEmail(json.payoutSettings.paypalEmail || '');
      }
    } catch (err) {
      console.error('Fetch dashboard error:', err);
      setError(err instanceof Error ? err.message : 'Could not fetch affiliate data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Handle saving Payout details
  const handleSavePayoutSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsFeedback(null);

    try {
      const payload: Record<string, string> = { method: payoutMethod };
      if (payoutMethod === 'upi') {
        payload.upiId = upiId;
        payload.accountHolderName = accountHolderName;
      } else if (payoutMethod === 'bank') {
        payload.accountHolderName = accountHolderName;
        payload.bankName = bankName;
        payload.accountNumber = accountNumber;
        payload.ifscCode = ifscCode;
      } else {
        payload.paypalEmail = paypalEmail;
      }

      const res = await fetch('/api/affiliate/payout-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.message || 'Failed to update payout settings.');
      }

      setSettingsFeedback({
        type: 'success',
        message: resJson.message || 'Payout details saved successfully!',
      });
      fetchDashboardData();
    } catch (err) {
      setSettingsFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save payout settings.',
      });
    } finally {
      setSavingSettings(false);
    }
  };

  // Handle Request Payout
  const handleRequestPayout = async () => {
    setRequestingPayout(true);
    setPayoutFeedback(null);

    try {
      const res = await fetch('/api/affiliate/request-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.message || 'Failed to process payout request.');
      }

      setPayoutFeedback({
        type: 'success',
        message: resJson.message,
      });
      fetchDashboardData();
    } catch (err) {
      setPayoutFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Payout request failed.',
      });
    } finally {
      setRequestingPayout(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
        <MinimalHeader />
        <main className="flex-1 max-w-xl mx-auto px-6 py-24 text-center">
          <div className="p-8 rounded-3xl bg-white border border-[#EFECE6] shadow-md">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#9A6F3C]/15 text-[#9A6F3C] flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1612] mb-2">
              Affiliate Partner Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#6B635B] mb-6 leading-relaxed">
              Sign in to track your referrals, view real-time monthly recurring commissions, and configure direct bank or UPI payouts.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <button
                type="button"
                onClick={() => openAuthModal('signin', '/affiliate/dashboard')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Sign In to Dashboard
              </button>
              <Link
                href="/affiliate"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-[#EFECE6] text-xs font-semibold text-[#1A1612] hover:bg-neutral-50 transition-colors text-center"
              >
                Learn About Partner Program
              </Link>
            </div>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  const referralUrl = data?.partner.referralUrl || `${typeof window !== 'undefined' ? window.location.origin : 'https://bookgenie-app.netlify.app'}/?ref=${data?.partner.couponCode || 'PARTNER10'}`;
  const couponCode = data?.partner.couponCode || 'PARTNER10';
  const availableBalance = data?.metrics.availableBalanceUsd ?? 0;
  const isEligible = availableBalance >= 10;
  const progressPercent = Math.min((availableBalance / 10) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612] font-sans selection:bg-[#111111] selection:text-white">
      <MinimalHeader />

      <main className="flex-1 max-w-[1240px] mx-auto w-full px-6 py-10 sm:py-14">
        {/* Page Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9A6F3C]/10 border border-[#9A6F3C]/20 text-[#9A6F3C] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Partner Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1612]">
              Affiliate Earnings Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#6B635B] mt-1">
              Welcome back, <strong>{data?.partner.name || user.email}</strong>. Track your clicks, monthly recurring commissions, and bank transfer payouts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/#pricing"
              className="text-xs font-semibold text-[#6B635B] hover:text-[#1A1612] px-3.5 py-2 rounded-full border border-[#EFECE6] bg-white transition-colors"
            >
              View Public Pricing
            </Link>
            <Link
              href="/launch"
              className="text-xs font-bold text-white bg-[#9A6F3C] hover:bg-[#845D30] px-4 py-2 rounded-full shadow-xs transition-colors"
            >
              View Launch Pre-Order Deals →
            </Link>
          </div>
        </div>

        {/* Top 4 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 1. Total Lifetime Earnings */}
          <div className="p-5 rounded-2xl bg-white border border-[#EFECE6] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-medium">Total Lifetime Earnings</span>
              <DollarSign className="w-4 h-4 text-[#9A6F3C]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1A1612] font-mono">
                ${data ? data.metrics.totalEarningsUsd.toFixed(2) : '0.00'}
              </div>
              <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-semibold mt-1 inline-block">
                10% Cash on every customer
              </span>
            </div>
          </div>

          {/* 2. Available for Payout */}
          <div className="p-5 rounded-2xl bg-white border border-[#EFECE6] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-medium">Available for Payout</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-mono">
                ${data ? data.metrics.availableBalanceUsd.toFixed(2) : '0.00'}
              </div>
              <span className="text-[11px] text-[#6B635B] mt-1 block">
                Min. threshold: $10.00
              </span>
            </div>
          </div>

          {/* 3. Paid Out Transfer */}
          <div className="p-5 rounded-2xl bg-white border border-[#EFECE6] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-medium">Transferred to Bank/UPI</span>
              <CheckCircle2 className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1A1612] font-mono">
                ${data ? data.metrics.paidOutUsd.toFixed(2) : '0.00'}
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Direct bank &amp; UPI transfers
              </span>
            </div>
          </div>

          {/* 4. Total Referred Orders */}
          <div className="p-5 rounded-2xl bg-white border border-[#EFECE6] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-medium">Referred Orders</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1A1612] font-mono">
                {data ? data.metrics.totalReferredOrders : 0}
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Real captured purchases
              </span>
            </div>
          </div>
        </div>

        {/* Minimum Payout Notification & Withdrawal Card */}
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-white to-[#FDFBF7] border-2 border-[#9A6F3C]/30 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="p-2.5 rounded-2xl bg-[#9A6F3C]/15 text-[#9A6F3C] shrink-0 mt-0.5">
                <Award className="w-5 h-5 text-[#9A6F3C]" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#9A6F3C] text-white text-[10px] font-bold uppercase tracking-wider">
                    Minimum Payout: $10.00
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'}`}>
                    {isEligible ? 'Payout Ready ✓' : `$${(10 - availableBalance).toFixed(2)} needed to reach $10 minimum`}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1A1612] tracking-tight mt-1">
                  Direct Bank &amp; UPI Transfer Policy
                </h3>
                <p className="text-xs text-[#6B635B] mt-0.5 leading-relaxed max-w-2xl">
                  Once your balance reaches the <strong>$10.00 minimum payout threshold</strong>, you can request an instant transfer directly to your saved Bank Account or UPI ID. Monthly recurring commissions clear automatically every month!
                </p>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-end">
              <button
                type="button"
                onClick={handleRequestPayout}
                disabled={!isEligible || requestingPayout}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-bold hover:bg-[#222222] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {requestingPayout ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Payout...</span>
                  </>
                ) : (
                  <>
                    <span>Request Payout Transfer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
              <span className="text-[10px] text-neutral-400 mt-1">
                {data?.payoutSettings.isConfigured ? 'Payout method configured ✓' : '⚠️ Payout details required below'}
              </span>
            </div>
          </div>

          {/* Progress bar towards $10 */}
          <div className="w-full bg-[#EFECE6] rounded-full h-2.5 overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#9A6F3C] to-emerald-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span>$0.00</span>
            <span>Current: ${availableBalance.toFixed(2)} / $10.00 minimum</span>
            <span>$10.00+</span>
          </div>

          {payoutFeedback && (
            <div
              className={`mt-4 p-3 rounded-xl text-xs font-medium ${
                payoutFeedback.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border border-rose-200 text-rose-900'
              }`}
            >
              {payoutFeedback.message}
            </div>
          )}
        </div>

        {/* 2-Column Section: Share Links & Payout Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Unique Links & Promotional Toolkit (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#EFECE6] shadow-xs">
              <h2 className="text-lg font-bold text-[#1A1612] mb-1">
                Your Promotional Links &amp; Codes
              </h2>
              <p className="text-xs text-[#6B635B] mb-5">
                Share these with your audience. Any customer purchasing through your link or applying your code earns you a <strong>10% commission</strong>.
              </p>

              {/* Unique Audience Coupon Code */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EFECE6] mb-4">
                <div className="flex items-center justify-between text-xs text-[#6B635B] mb-2">
                  <span className="font-semibold flex items-center gap-1.5 text-[#9A6F3C]">
                    <Tag className="w-3.5 h-3.5" /> Your Audience 10% Coupon Code
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Saves them 10%
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-[#EFECE6]">
                  <code className="text-base sm:text-lg font-mono font-bold text-[#9A6F3C] px-2 tracking-wider">
                    {couponCode}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(couponCode);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#111111] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              {/* Direct Tracking Link */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EFECE6]">
                <div className="flex items-center justify-between text-xs text-[#6B635B] mb-2">
                  <span className="font-semibold flex items-center gap-1.5 text-[#9A6F3C]">
                    <ExternalLink className="w-3.5 h-3.5" /> Your Direct Tracking Link
                  </span>
                  <span className="text-[10px] text-neutral-400">60-day cookie window</span>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-[#EFECE6]">
                  <span className="text-xs font-mono text-neutral-700 truncate px-2 select-all">
                    {referralUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(referralUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#9A6F3C] text-white text-xs font-semibold hover:bg-[#845D30] transition-colors cursor-pointer shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Monthly Commission Schedule Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-[#EFECE6] shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-[#1A1612] mb-1">
                Monthly Commission Schedule by Customer Plan
              </h2>
              <p className="text-xs text-[#6B635B] mb-4">
                You earn on every plan interval your customer chooses:
              </p>

              <div className="space-y-2.5 text-xs">
                {/* PRO Monthly */}
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EFECE6] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1A1612] block">PRO Plan (Monthly Recurring)</span>
                    <span className="text-[11px] text-[#6B635B]">Customer pays $9.50 – $19.00 / month</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#9A6F3C] font-mono block">
                      $0.95 to $1.90 / mo
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Every month active</span>
                  </div>
                </div>

                {/* CREATOR Monthly */}
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EFECE6] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1A1612] block">CREATOR Plan (Monthly Recurring)</span>
                    <span className="text-[11px] text-[#6B635B]">Customer pays $19.50 – $39.00 / month</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#9A6F3C] font-mono block">
                      $1.95 to $3.90 / mo
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Every month active</span>
                  </div>
                </div>

                {/* 3-Month Founder Pass */}
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EFECE6] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1A1612] block">3-Month Founder Pass (Upfront)</span>
                    <span className="text-[11px] text-[#6B635B]">Customer pays $28.50 – $58.50 upfront</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#9A6F3C] font-mono block">
                      $2.85 to $5.85
                    </span>
                    <span className="text-[10px] text-neutral-500">10% upfront cash</span>
                  </div>
                </div>

                {/* Annual Plan */}
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EFECE6] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1A1612] block">Annual Subscription (12 Months)</span>
                    <span className="text-[11px] text-[#6B635B]">Customer pays $126.00 – $260.40 upfront</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-700 font-mono block">
                      $12.60 to $26.04
                    </span>
                    <span className="text-[10px] text-neutral-500">Full annual lump-sum</span>
                  </div>
                </div>

                {/* Single Book */}
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EFECE6] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1A1612] block">Single One-Time Book</span>
                    <span className="text-[11px] text-[#6B635B]">Customer pays $4.50 – $9.00+</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#1A1612] font-mono block">
                      $0.45 to $0.90+
                    </span>
                    <span className="text-[10px] text-neutral-500">Per book sold</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payout Settings (Bank Details / UPI ID) (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-white border border-[#EFECE6] shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base sm:text-lg font-bold text-[#1A1612]">
                  Payout Method Settings
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  $10 Min Payout
                </span>
              </div>
              <p className="text-xs text-[#6B635B] mb-5">
                Add your <strong>Bank Account</strong> or <strong>UPI ID</strong> below to receive direct transfers once your earnings reach $10.00.
              </p>

              {/* Method Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#FAF9F6] border border-[#EFECE6] mb-5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPayoutMethod('upi')}
                  className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    payoutMethod === 'upi' ? 'bg-[#111111] text-white shadow-xs' : 'text-[#6B635B] hover:text-[#1A1612]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMethod('bank')}
                  className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    payoutMethod === 'bank' ? 'bg-[#111111] text-white shadow-xs' : 'text-[#6B635B] hover:text-[#1A1612]'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Bank Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMethod('paypal')}
                  className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    payoutMethod === 'paypal' ? 'bg-[#111111] text-white shadow-xs' : 'text-[#6B635B] hover:text-[#1A1612]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>PayPal</span>
                </button>
              </div>

              <form onSubmit={handleSavePayoutSettings} className="space-y-3.5 text-xs">
                {payoutMethod === 'upi' && (
                  <>
                    <div>
                      <label className="block font-semibold text-[#1A1612] mb-1">
                        UPI ID (e.g. Google Pay, PhonePe, Paytm)
                      </label>
                      <input
                        type="text"
                        placeholder="yourname@okhdfcbank or user@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value.trim())}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-[#EFECE6] bg-[#FAF9F6] focus:bg-white focus:border-[#9A6F3C] outline-none text-[#1A1612] font-mono transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1A1612] mb-1">
                        Account Holder Name (matching UPI)
                      </label>
                      <input
                        type="text"
                        placeholder="Full Legal Name"
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-[#EFECE6] bg-[#FAF9F6] focus:bg-white focus:border-[#9A6F3C] outline-none text-[#1A1612] transition-all"
                      />
                    </div>
                  </>
                )}

                {payoutMethod === 'bank' && (
                  <>
                    <div>
                      <label className="block font-semibold text-[#1A1612] mb-1">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        placeholder="As shown on passbook or statement"
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-[#EFECE6] bg-[#FAF9F6] focus:bg-white focus:border-[#9A6F3C] outline-none text-[#1A1612] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1A1612] mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. HDFC Bank, ICICI Bank, Chase"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-[#EFECE6] bg-[#FAF9F6] focus:bg-white focus:border-[#9A6F3C] outline-none text-[#1A1612] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1A1612] mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="Bank Account Number (8-30 digits)"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.trim())}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-[#EFECE6] bg-[#FAF9F6] focus:bg-white focus:border-[#9A6F3C] outline-none text-[#1A1612] font-mono transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1A1612] mb-1">
                        IFSC Code / SWIFT Routing Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. HDFC0001234 or SWIFT code"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase().trim())}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-[#EFECE6] bg-[#FAF9F6] focus:bg-white focus:border-[#9A6F3C] outline-none text-[#1A1612] font-mono uppercase transition-all"
                      />
                    </div>
                  </>
                )}

                {payoutMethod === 'paypal' && (
                  <div>
                    <label className="block font-semibold text-[#1A1612] mb-1">
                      PayPal Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="paypal@yourdomain.com"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value.trim())}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#EFECE6] bg-[#FAF9F6] focus:bg-white focus:border-[#9A6F3C] outline-none text-[#1A1612] transition-all"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="w-full py-2.5 rounded-xl bg-[#111111] text-white font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {savingSettings ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Payout Details...</span>
                    </>
                  ) : (
                    <span>Save Payout Method</span>
                  )}
                </button>

                {settingsFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium ${
                      settingsFeedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {settingsFeedback.message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Live Referred Orders Table */}
        <div className="p-6 rounded-3xl bg-white border border-[#EFECE6] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#1A1612]">
                Referred Orders &amp; Commission Ledger
              </h2>
              <p className="text-xs text-[#6B635B] mt-0.5">
                Real captured purchases generated by your audience coupon code or link.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#9A6F3C] bg-[#9A6F3C]/10 px-3 py-1 rounded-full">
              {data ? data.orders.length : 0} Orders Tracked
            </span>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-[#6B635B]">
              <Loader2 className="w-5 h-5 animate-spin text-[#9A6F3C]" />
              <span className="text-xs">Loading live earnings ledger...</span>
            </div>
          ) : data && data.orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EFECE6] text-neutral-500 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Plan Type</th>
                    <th className="py-3 px-3">Order Price</th>
                    <th className="py-3 px-3">Your Commission (10%)</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6]">
                  {data.orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3.5 px-3 font-mono text-neutral-600">
                        {new Date(ord.date).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#1A1612]">
                        {ord.id.slice(0, 10)}...
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-[#1A1612]">
                        {ord.planName}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-neutral-600">
                        ${ord.orderAmountUsd.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">
                        +${ord.commissionUsd.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-500 bg-[#FAF9F6] rounded-2xl border border-[#EFECE6] p-6">
              <Users className="w-8 h-8 text-neutral-400 mx-auto mb-2 opacity-60" />
              <h4 className="text-sm font-bold text-[#1A1612]">No Referred Orders Yet</h4>
              <p className="text-xs text-[#6B635B] mt-1 max-w-md mx-auto">
                Share your coupon code <strong>{couponCode}</strong> or your referral link on YouTube, your blog, newsletter, or social channels. When your first customer checks out, your 10% cash commission will appear here immediately!
              </p>
            </div>
          )}
        </div>
      </main>

      <MinimalFooter />
    </div>
  );
}
