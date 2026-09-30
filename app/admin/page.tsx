'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Users,
  BookOpen,
  Activity,
  DollarSign,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cpu,
  Layers,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface AdminMetrics {
  users: {
    total: number;
    tierBreakdown: Record<string, number>;
    recent: Array<{
      id: string;
      email: string;
      full_name?: string;
      tier: string;
      created_at: string;
    }>;
  };
  books: {
    total: number;
    last24h: number;
    recent: Array<{
      id: string;
      user_id: string;
      title: string;
      book_type: string;
      plan_id: string;
      status: string;
      page_count?: number;
      created_at: string;
    }>;
  };
  jobs: {
    total: number;
    active: number;
    completed: number;
    failed: number;
    recent: Array<{
      id: string;
      book_id: string;
      type: string;
      status: string;
      stage: string;
      progress: number;
      error_message?: string;
      created_at: string;
    }>;
  };
  revenue: {
    totalPaise: number;
    totalEstimatedUsd: number;
    recentPurchases: Array<{
      id: string;
      user_id: string;
      plan_id: string;
      amount: number;
      currency: string;
      status: string;
      created_at: string;
    }>;
  };
  providers: {
    text: {
      provider: string;
      modelStandard: string;
      modelPremium: string;
      configured: boolean;
      status: string;
    };
    image: {
      provider: string;
      geminiConfigured: boolean;
      status: string;
    };
    database: {
      provider: string;
      status: string;
      error?: string;
    };
    payments: {
      provider: string;
      configured: boolean;
      status: string;
    };
  };
}

export default function AdminPage() {
  const { user, isLoading: authLoading, openAuthModal } = useAuth();
  const [data, setData] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<{ status: number; message: string } | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'books'>('overview');

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setErrorStatus(null);
      const res = await fetch('/api/admin/overview');
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        setErrorStatus({
          status: res.status,
          message: errJson.message || 'Access restricted to administrators.',
        });
        setData(null);
        return;
      }
      const json = await res.json();
      setData(json.metrics);
      setLastRefreshed(new Date());
    } catch (err) {
      setErrorStatus({
        status: 500,
        message: err instanceof Error ? err.message : 'Network communication error.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      fetchMetrics();
    }
  }, [authLoading, fetchMetrics]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchMetrics();
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchMetrics]);

  // Unauthorized view
  if (!authLoading && errorStatus) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
        <MinimalHeader />
        <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#9A6F3C] mb-6 shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-[#1A1612] mb-3">
            {errorStatus.status === 401 ? 'Sign In Required' : 'Administrator Access Required'}
          </h1>
          <p className="text-sm text-[#6B635B] max-w-md leading-relaxed mb-8">
            {errorStatus.message}
          </p>

          <div className="bg-white border border-[#EFECE6] rounded-xl p-5 text-left text-xs text-[#6B635B] w-full mb-6 shadow-sm">
            <p className="font-semibold text-[#1A1612] mb-1">To access this control center:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Add your email to <code className="bg-[#F8F6F0] px-1 py-0.5 rounded text-[#9A6F3C] font-mono">ADMIN_EMAILS</code> in your <code className="bg-[#F8F6F0] px-1 py-0.5 rounded font-mono">.env.local</code>.</li>
              <li>Sign in with that authorized account.</li>
            </ol>
          </div>

          <div className="flex items-center gap-4">
            {!user ? (
              <button
                onClick={() => openAuthModal('signin')}
                className="px-5 py-2.5 bg-[#9A6F3C] hover:bg-[#845D30] text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => fetchMetrics()}
                className="px-5 py-2.5 bg-[#9A6F3C] hover:bg-[#845D30] text-white text-sm font-medium rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Retry Authorization
              </button>
            )}
            <Link
              href="/"
              className="px-5 py-2.5 bg-white border border-[#EFECE6] text-[#1A1612] text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
      <MinimalHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Top Control Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-[#EFECE6]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Live Supabase & Provider Telemetry
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A1612] tracking-tight">
              BookGenie Control Center
            </h1>
            <p className="text-xs sm:text-sm text-[#6B635B] mt-1">
              Real-time monitoring of registered accounts, active generation jobs, and AI infrastructure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-[#EFECE6] px-3 py-1.5 rounded-lg text-xs text-[#6B635B] shadow-sm">
              <Clock className="w-3.5 h-3.5 text-[#9A6F3C]" />
              <span>
                {lastRefreshed ? `Updated ${lastRefreshed.toLocaleTimeString()}` : 'Connecting...'}
              </span>
            </div>

            <label className="flex items-center gap-2 text-xs text-[#6B635B] cursor-pointer bg-white border border-[#EFECE6] px-3 py-1.5 rounded-lg shadow-sm hover:border-[#9A6F3C]/40 transition-colors">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#9A6F3C] rounded"
              />
              Auto-refresh (30s)
            </label>

            <button
              onClick={() => fetchMetrics()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#9A6F3C] hover:bg-[#845D30] text-white text-xs font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
          {/* Card 1: Users */}
          <div className="bg-white border border-[#EFECE6] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-[#6B635B] mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
              <div className="p-2 rounded-lg bg-amber-50 text-[#9A6F3C]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-serif font-bold text-[#1A1612]">
              {data ? data.users.total.toLocaleString() : '—'}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#F8F6F0] text-[11px] text-[#6B635B]">
              <span className="px-1.5 py-0.5 rounded bg-stone-100 font-medium text-stone-700">
                {data?.users.tierBreakdown.free ?? 0} Free
              </span>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 font-medium text-blue-700">
                {data?.users.tierBreakdown.single ?? 0} Single
              </span>
              <span className="px-1.5 py-0.5 rounded bg-purple-50 font-medium text-purple-700">
                {data?.users.tierBreakdown.pro ?? 0} Pro
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-50 font-medium text-amber-800">
                {data?.users.tierBreakdown.creator ?? 0} Creator
              </span>
            </div>
          </div>

          {/* Card 2: Books */}
          <div className="bg-white border border-[#EFECE6] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-[#6B635B] mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Books</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-serif font-bold text-[#1A1612]">
              {data ? data.books.total.toLocaleString() : '—'}
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#F8F6F0] text-[11px] text-emerald-700 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{data?.books.last24h ?? 0} books in last 24h</span>
            </div>
          </div>

          {/* Card 3: Generation Pipeline */}
          <div className="bg-white border border-[#EFECE6] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-[#6B635B] mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Generation Pipeline</span>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-serif font-bold text-[#1A1612]">
              {data ? data.jobs.total.toLocaleString() : '—'}
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F8F6F0] text-[11px]">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3 h-3" /> {data?.jobs.completed ?? 0} done
              </span>
              <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                <RefreshCw className="w-3 h-3" /> {data?.jobs.active ?? 0} active
              </span>
              {(data?.jobs.failed ?? 0) > 0 && (
                <span className="inline-flex items-center gap-1 text-rose-700 font-medium">
                  <XCircle className="w-3 h-3" /> {data?.jobs.failed} err
                </span>
              )}
            </div>
          </div>

          {/* Card 4: Revenue */}
          <div className="bg-white border border-[#EFECE6] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-[#6B635B] mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Est. Revenue</span>
              <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-serif font-bold text-[#1A1612]">
              {data ? `₹${(data.revenue.totalPaise / 100).toLocaleString()}` : '—'}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F8F6F0] text-[11px] text-[#6B635B]">
              <span>~${data?.revenue.totalEstimatedUsd ?? 0} USD</span>
              <span className="text-stone-500 font-medium">
                {data?.revenue.recentPurchases.length ?? 0} orders
              </span>
            </div>
          </div>
        </div>

        {/* Infrastructure Status Banner */}
        <div className="bg-white border border-[#EFECE6] rounded-xl p-5 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1A1612] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#9A6F3C]" />
              AI Providers & Infrastructure Health
            </h2>
            <Link
              href="/api/health/providers"
              target="_blank"
              className="text-xs text-[#9A6F3C] hover:text-[#845D30] font-medium inline-flex items-center gap-1"
            >
              Raw Health JSON <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* OpenRouter Text Provider */}
            <div className="border border-[#EFECE6] rounded-lg p-3.5 bg-[#FAF9F5]/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-[#1A1612]">Text Engine (OpenRouter)</span>
                {data?.providers.text.configured ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                    ACTIVE
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold">
                    KEY MISSING
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#6B635B] truncate" title={data?.providers.text.modelStandard}>
                Std: <span className="font-mono text-[#1A1612]">{data?.providers.text.modelStandard || 'default'}</span>
              </p>
              <p className="text-[11px] text-[#6B635B] truncate mt-0.5" title={data?.providers.text.modelPremium}>
                Prem: <span className="font-mono text-[#1A1612]">{data?.providers.text.modelPremium || 'default'}</span>
              </p>
            </div>

            {/* Image Provider */}
            <div className="border border-[#EFECE6] rounded-lg p-3.5 bg-[#FAF9F5]/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-[#1A1612]">Image Generator</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold uppercase">
                  {data?.providers.image.provider || 'gemini'}
                </span>
              </div>
              <p className="text-[11px] text-[#6B635B]">
                Gemini Key: <span className="font-semibold text-[#1A1612]">{data?.providers.image.geminiConfigured ? 'Connected' : 'Fallback'}</span>
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                High-res cover pipeline
              </p>
            </div>

            {/* Supabase Database */}
            <div className="border border-[#EFECE6] rounded-lg p-3.5 bg-[#FAF9F5]/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-[#1A1612]">Supabase Database</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                  CONNECTED
                </span>
              </div>
              <p className="text-[11px] text-[#6B635B]">
                RLS & Security Rules: <span className="font-semibold text-emerald-700">Enforced</span>
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                State: Real-time queryable
              </p>
            </div>

            {/* Razorpay Payments */}
            <div className="border border-[#EFECE6] rounded-lg p-3.5 bg-[#FAF9F5]/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-[#1A1612]">Payment Gateway</span>
                {data?.providers.payments.configured ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                    READY
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-semibold">
                    UNCONFIGURED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#6B635B]">
                Provider: <span className="font-semibold text-[#1A1612]">Razorpay Orders & Webhooks</span>
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                One-time & Subscriptions
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#EFECE6] mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-[#9A6F3C] text-[#9A6F3C]'
                : 'border-transparent text-[#6B635B] hover:text-[#1A1612]'
            }`}
          >
            Recent Activity Feed
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-[#9A6F3C] text-[#9A6F3C]'
                : 'border-transparent text-[#6B635B] hover:text-[#1A1612]'
            }`}
          >
            Registered Users ({data?.users.total ?? 0})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'jobs'
                ? 'border-[#9A6F3C] text-[#9A6F3C]'
                : 'border-transparent text-[#6B635B] hover:text-[#1A1612]'
            }`}
          >
            Generation Jobs ({data?.jobs.total ?? 0})
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'books'
                ? 'border-[#9A6F3C] text-[#9A6F3C]'
                : 'border-transparent text-[#6B635B] hover:text-[#1A1612]'
            }`}
          >
            Publications ({data?.books.total ?? 0})
          </button>
        </div>

        {/* Tab Content 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Generation Jobs */}
            <div className="bg-white border border-[#EFECE6] rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[#1A1612] mb-4 flex items-center justify-between">
                <span>Recent Generation Jobs</span>
                <span className="text-xs text-[#6B635B] font-normal">Last 10 jobs</span>
              </h3>
              <div className="space-y-3">
                {data?.jobs.recent.length === 0 ? (
                  <p className="text-xs text-[#6B635B] py-6 text-center">No generation jobs logged yet.</p>
                ) : (
                  data?.jobs.recent.map((job) => (
                    <div
                      key={job.id}
                      className="p-3 border border-[#EFECE6] rounded-lg text-xs bg-[#FAF9F5]/40 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            job.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : job.status === 'processing'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : job.status === 'failed'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}>
                            {job.status}
                          </span>
                          <span className="font-mono text-stone-600 truncate">{job.type}</span>
                        </div>
                        <p className="text-[11px] text-[#6B635B] truncate">
                          Stage: <span className="font-medium text-[#1A1612]">{job.stage || 'idle'}</span> · Progress: {job.progress}%
                        </p>
                        {job.error_message && (
                          <p className="text-[11px] text-rose-600 truncate mt-0.5" title={job.error_message}>
                            Error: {job.error_message}
                          </p>
                        )}
                      </div>
                      <div className="text-[11px] text-[#6B635B] whitespace-nowrap">
                        {new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Publications */}
            <div className="bg-white border border-[#EFECE6] rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[#1A1612] mb-4 flex items-center justify-between">
                <span>Recent Books Created</span>
                <span className="text-xs text-[#6B635B] font-normal">Last 10 books</span>
              </h3>
              <div className="space-y-3">
                {data?.books.recent.length === 0 ? (
                  <p className="text-xs text-[#6B635B] py-6 text-center">No books generated yet.</p>
                ) : (
                  data?.books.recent.map((book) => (
                    <div
                      key={book.id}
                      className="p-3 border border-[#EFECE6] rounded-lg text-xs bg-[#FAF9F5]/40 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[#1A1612] truncate">{book.title || 'Untitled Book'}</p>
                        <p className="text-[11px] text-[#6B635B] truncate mt-0.5">
                          Genre: <span className="capitalize">{book.book_type}</span> · Plan:{' '}
                          <span className="font-semibold text-[#9A6F3C]">{book.plan_id || 'free'}</span> ·{' '}
                          {book.page_count ?? 0} pages
                        </p>
                      </div>
                      <Link
                        href={`/book/${book.id}/preview`}
                        className="p-1.5 rounded-md hover:bg-stone-100 text-[#9A6F3C] transition-colors"
                        title="View Book Spread"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Registered Users Table */}
        {activeTab === 'users' && (
          <div className="bg-white border border-[#EFECE6] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] border-b border-[#EFECE6] text-[#6B635B] uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">User Email</th>
                    <th className="px-5 py-3.5">Name</th>
                    <th className="px-5 py-3.5">Plan Tier</th>
                    <th className="px-5 py-3.5">User ID</th>
                    <th className="px-5 py-3.5 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6]">
                  {data?.users.recent.map((profile) => (
                    <tr key={profile.id} className="hover:bg-[#FAF9F5]/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-[#1A1612]">{profile.email}</td>
                      <td className="px-5 py-3.5 text-[#6B635B]">{profile.full_name || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] uppercase ${
                          profile.tier === 'creator'
                            ? 'bg-amber-100 text-amber-800'
                            : profile.tier === 'pro'
                            ? 'bg-purple-100 text-purple-800'
                            : profile.tier === 'single' || profile.tier === 'book'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {profile.tier || 'free'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-stone-500 truncate max-w-[120px]">
                        {profile.id}
                      </td>
                      <td className="px-5 py-3.5 text-right text-[#6B635B]">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 3: Jobs Table */}
        {activeTab === 'jobs' && (
          <div className="bg-white border border-[#EFECE6] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] border-b border-[#EFECE6] text-[#6B635B] uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5">Stage</th>
                    <th className="px-5 py-3.5">Progress</th>
                    <th className="px-5 py-3.5">Job ID</th>
                    <th className="px-5 py-3.5 text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6]">
                  {data?.jobs.recent.map((job) => (
                    <tr key={job.id} className="hover:bg-[#FAF9F5]/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] uppercase ${
                          job.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : job.status === 'processing'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : job.status === 'failed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[#1A1612]">{job.type}</td>
                      <td className="px-5 py-3.5 text-[#6B635B]">{job.stage || 'idle'}</td>
                      <td className="px-5 py-3.5">
                        <div className="w-24 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#9A6F3C] h-1.5 rounded-full"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-stone-500 truncate max-w-[100px]">
                        {job.id}
                      </td>
                      <td className="px-5 py-3.5 text-right text-[#6B635B]">
                        {new Date(job.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 4: Publications Table */}
        {activeTab === 'books' && (
          <div className="bg-white border border-[#EFECE6] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] border-b border-[#EFECE6] text-[#6B635B] uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Title</th>
                    <th className="px-5 py-3.5">Genre</th>
                    <th className="px-5 py-3.5">Plan</th>
                    <th className="px-5 py-3.5">Pages</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6]">
                  {data?.books.recent.map((book) => (
                    <tr key={book.id} className="hover:bg-[#FAF9F5]/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-[#1A1612]">
                        <Link href={`/book/${book.id}/preview`} className="hover:text-[#9A6F3C] inline-flex items-center gap-1">
                          {book.title || 'Untitled'}
                          <ExternalLink className="w-3 h-3 text-[#6B635B]" />
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-[#6B635B] capitalize">{book.book_type}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded font-semibold text-[10px] uppercase bg-stone-100 text-stone-700">
                          {book.plan_id || 'free'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#6B635B]">{book.page_count ?? 0}</td>
                      <td className="px-5 py-3.5 text-stone-600">{book.status || 'ready'}</td>
                      <td className="px-5 py-3.5 text-right text-[#6B635B]">
                        {new Date(book.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
