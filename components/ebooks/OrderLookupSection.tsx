'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  KeyRound,
  Download,
  CheckCircle2,
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface VerifiedOrder {
  orderCode: string;
  slug: string;
  title: string;
  subtitle?: string;
  coverImage?: string;
  pageCount?: number;
  amount: number;
  createdAt: string;
  downloadUrl: string;
}

interface StoredPurchase {
  orderCode: string;
  slug: string;
  title: string;
  downloadUrl?: string;
  purchasedAt?: string;
}

export function OrderLookupSection() {
  const [orderQuery, setOrderQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifiedOrder, setVerifiedOrder] = useState<VerifiedOrder | null>(null);
  const [recentPurchases, setRecentPurchases] = useState<StoredPurchase[]>([]);

  // Load any previously completed orders from localStorage on this device
  useEffect(() => {
    try {
      const raw = localStorage.getItem('bookgenie_purchased_orders');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentPurchases(parsed.slice(0, 3));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleVerify = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const target = (customQuery || orderQuery).trim();
    if (!target) {
      setError('Please enter your Order Number (e.g. BG-XXXX-XXXX-XXXX) or Payment ID.');
      return;
    }

    setError(null);
    setIsVerifying(true);
    setVerifiedOrder(null);

    try {
      const res = await fetch('/api/ebooks/verify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode: target }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'No matching order found. Please check your order code.');
      }

      setVerifiedOrder(data);

      // Keep recent purchases synced
      try {
        const raw = localStorage.getItem('bookgenie_purchased_orders');
        const list: StoredPurchase[] = raw ? JSON.parse(raw) : [];
        if (!list.some((item) => item.orderCode === data.orderCode)) {
          list.unshift({
            orderCode: data.orderCode,
            slug: data.slug,
            title: data.title,
            downloadUrl: data.downloadUrl,
            purchasedAt: data.createdAt,
          });
          localStorage.setItem('bookgenie_purchased_orders', JSON.stringify(list.slice(0, 10)));
          setRecentPurchases(list.slice(0, 3));
        }
      } catch {
        // ignore
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not verify order. Please try again.';
      setError(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section
      id="verify-order"
      className="w-full bg-white rounded-3xl border border-[#EBE6DC] p-6 sm:p-10 mb-16 shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
    >
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-3">
            <KeyRound className="w-3.5 h-3.5 text-amber-700" />
            <span>Customer Portal</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1612] font-normal tracking-tight mb-2">
            Already Purchased? <span className="italic">Verify &amp; Re-Download</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6B635B] font-light leading-relaxed max-w-lg mx-auto">
            Closed your browser or switching devices? Enter your unique Order Number or Razorpay Payment ID to immediately download your eBook without paying again.
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={(e) => handleVerify(e)} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Enter Order Code (e.g. BG-9K2M-4F8X-7W3Q or pay_...)"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-300 focus:border-[#1A1612] focus:ring-1 focus:ring-[#1A1612] text-xs sm:text-sm font-mono outline-none transition-all placeholder:font-sans placeholder:text-neutral-400 uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="py-3.5 px-7 rounded-2xl bg-[#1A1612] hover:bg-[#2D2721] disabled:bg-neutral-400 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Verify Order</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-0.5">Verification Failed</p>
              <p className="font-light">{error}</p>
            </div>
          </div>
        )}

        {/* VERIFIED SUCCESS CARD */}
        {verifiedOrder && (
          <div className="p-6 rounded-3xl bg-[#FAF8F5] border-2 border-emerald-500/30 mb-6 shadow-sm animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Purchase Verified • Lifetime Access Granted</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-5">
              {verifiedOrder.coverImage && (
                <div className="relative w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden shadow-md border border-black/10 shrink-0 bg-neutral-900">
                  <Image
                    src={verifiedOrder.coverImage}
                    alt={verifiedOrder.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1A1612] mb-1">
                  {verifiedOrder.title}
                </h3>
                {verifiedOrder.subtitle && (
                  <p className="text-xs text-[#6B635B] font-light mb-2">
                    {verifiedOrder.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#7A7067] mb-2">
                  <span className="font-mono font-medium text-neutral-900 bg-white border border-[#EAE4D8] px-2.5 py-0.5 rounded-lg">
                    {verifiedOrder.orderCode}
                  </span>
                  <span>•</span>
                  <span>₹{verifiedOrder.amount} Paid</span>
                  {verifiedOrder.pageCount && (
                    <>
                      <span>•</span>
                      <span>{verifiedOrder.pageCount} Pages</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <a
              href={verifiedOrder.downloadUrl}
              download
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>Download {verifiedOrder.title} (PDF)</span>
            </a>
          </div>
        )}

        {/* DEVICE RECENT PURCHASES QUICK RESTORE */}
        {recentPurchases.length > 0 && !verifiedOrder && (
          <div className="pt-4 border-t border-[#F0ECE4]">
            <div className="flex items-center gap-1.5 text-xs text-[#7A7067] font-medium mb-3">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Purchased on this device recently:</span>
            </div>

            <div className="space-y-2">
              {recentPurchases.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE5D8] hover:border-amber-400 transition-colors gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1A1612] truncate">{p.title}</p>
                    <p className="text-[11px] font-mono text-neutral-500 truncate">{p.orderCode}</p>
                  </div>

                  <button
                    onClick={() => {
                      setOrderQuery(p.orderCode);
                      handleVerify(undefined, p.orderCode);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white border border-neutral-300 hover:border-neutral-900 text-[11px] font-semibold text-neutral-800 shrink-0 cursor-pointer transition-colors"
                  >
                    Re-Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#8A8077]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% Guaranteed Lifetime Download Access
          </span>
          <span>•</span>
          <span>Unguessable 64-bit entropy security</span>
          <span>•</span>
          <span>No login password required</span>
        </div>
      </div>
    </section>
  );
}
