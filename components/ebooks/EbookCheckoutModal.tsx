'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  CheckCircle,
  Download,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Copy,
  Check,
  KeyRound,
} from 'lucide-react';
import type { EbookProduct } from '@/lib/ebooks/catalog';

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

interface EbookCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: EbookProduct;
  initialEmail?: string;
  isOwner?: boolean;
}

export function EbookCheckoutModal({
  isOpen,
  onClose,
  product,
  isOwner = false,
}: EbookCheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderCode, setOrderCode] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    orderId?: string;
    paymentId?: string;
    orderCode?: string;
  }>({});

  if (!isOpen) return null;

  const handleCopyOrderCode = () => {
    if (!orderCode) return;
    navigator.clipboard.writeText(orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFreeDownload = () => {
    const a = document.createElement('a');
    a.href = `/api/ebooks/download/${product.slug}`;
    a.download = `${product.title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsCompleted(true);
    setDownloadUrl(`/api/ebooks/download/${product.slug}`);
    setOrderCode('FREE-EDITION');
  };

  const handlePaidCheckout = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      // 1. Create Razorpay order on server (no email required)
      const res = await fetch('/api/ebooks/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: product.id }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.message || 'Failed to initialize payment.');
      }

      // 2. Load script
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        throw new Error('Unable to connect to secure payment gateway. Please check your connection.');
      }

      // 3. Open Razorpay live checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'BookGenie eBook Store',
        description: product.title,
        image: product.coverImage || '/images/ebooks/blueprint-cover.jpg',
        order_id: orderData.orderId,
        theme: {
          color: '#111111',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4. Verify signature on backend & obtain unguessable Order Code
            const verifyRes = await fetch('/api/ebooks/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                bookId: product.id,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.message || 'Payment signature verification failed.');
            }

            const code = verifyData.orderCode || `BG-${response.razorpay_payment_id.slice(-8).toUpperCase()}`;
            setOrderCode(code);
            setDownloadUrl(verifyData.downloadUrl);
            setPaymentDetails({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              orderCode: code,
            });
            setIsCompleted(true);

            // Save purchase in browser localStorage so return visits instantly recognize the order
            try {
              const raw = localStorage.getItem('bookgenie_purchased_orders');
              const list = raw ? JSON.parse(raw) : [];
              list.unshift({
                orderCode: code,
                paymentId: response.razorpay_payment_id,
                slug: product.slug,
                title: product.title,
                downloadUrl: verifyData.downloadUrl,
                purchasedAt: new Date().toISOString(),
              });
              localStorage.setItem('bookgenie_purchased_orders', JSON.stringify(list.slice(0, 10)));
            } catch (storageErr) {
              console.warn('LocalStorage save notice:', storageErr);
            }
          } catch (verifyErr: unknown) {
            const message = verifyErr instanceof Error ? verifyErr.message : 'Verification failed. Please contact support.';
            setError(message);
          } finally {
            setIsProcessing(false);
          }
        },
      };

      if (!window.Razorpay) {
        throw new Error('Razorpay failed to load.');
      }
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp: unknown) => {
        const errorData = resp as { error?: { description?: string } } | undefined;
        setError(errorData?.error?.description || 'Payment was cancelled or failed.');
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden text-[#111111] max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ---------------- SUCCESS & DIRECT DOWNLOAD SCREEN ---------------- */}
        {isCompleted ? (
          <div className="p-8 sm:p-10 flex flex-col items-center text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-700 shadow-sm animate-in zoom-in duration-300">
              <CheckCircle className="w-8 h-8 stroke-[2]" />
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold tracking-wide uppercase mb-2">
              Payment Confirmed
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#111111] mb-2">
              Thank You! Your eBook is Ready.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mb-6 font-light max-w-md">
              Download your full original PDF edition instantly below. You can also re-download anytime using your unique Order Number.
            </p>

            {/* UNGUESSABLE ORDER CODE CALLOUT BOX */}
            {orderCode && orderCode !== 'FREE-EDITION' && (
              <div className="w-full bg-[#FAF8F5] border-2 border-amber-300/80 rounded-2xl p-5 mb-6 text-left shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-700" />
                    Your Unguessable Order Number
                  </span>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 border border-amber-200 px-2 py-0.5 rounded-full">
                    Keep this safe
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white border border-amber-200 rounded-xl px-4 py-3 gap-2">
                  <span className="font-mono text-base sm:text-lg font-bold text-neutral-900 tracking-wider select-all">
                    {orderCode}
                  </span>
                  <button
                    onClick={handleCopyOrderCode}
                    className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <p className="text-[12px] text-neutral-600 mt-2.5 font-light leading-relaxed">
                  💡 <strong>Never lose access:</strong> If you close this website and return later, simply paste this Order Number in the <em>&ldquo;Verify with Order Number&rdquo;</em> section on our website to re-download without paying again!
                </p>
              </div>
            )}

            {/* DIRECT INSTANT DOWNLOAD BUTTON */}
            <div className="w-full mb-6">
              <a
                href={downloadUrl || `/api/ebooks/download/${product.slug}${orderCode ? `?orderCode=${encodeURIComponent(orderCode)}` : ''}`}
                download
                className="w-full py-4 px-6 rounded-2xl bg-[#111111] hover:bg-[#222222] text-white text-sm sm:text-base font-semibold transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                <span>Download eBook Now (PDF)</span>
              </a>
              <p className="text-[11px] text-neutral-500 mt-2">
                Format: {product.details.format} • {product.details.fileSize} • 100% DRM-Free
              </p>
            </div>

            {/* Transaction metadata */}
            {paymentDetails.paymentId && (
              <div className="w-full pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-1">
                <span>Payment ID: {paymentDetails.paymentId}</span>
                <span>Secured by Razorpay</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-6 text-xs text-neutral-600 hover:text-neutral-900 underline underline-offset-4 cursor-pointer"
            >
              Done & Return to Store
            </button>
          </div>
        ) : (
          /* ---------------- DIRECT CHECKOUT MODAL ---------------- */
          <div className="p-6 sm:p-8 overflow-y-auto">
            {/* Header info */}
            <div className="flex items-start gap-4 mb-6">
              <div className="relative w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden border border-neutral-200 shrink-0 shadow-sm bg-neutral-100">
                <Image
                  src={product.coverImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold tracking-wide uppercase mb-1.5">
                  {product.badge}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-medium text-[#111111] leading-snug mb-1">
                  {product.title}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-2 mb-2 font-light">
                  {product.subtitle}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-2">
                  {product.isFree ? (
                    <span className="text-2xl font-bold text-emerald-700">FREE</span>
                  ) : (
                    <>
                      <span className="text-2xl sm:text-3xl font-bold text-[#111111]">
                        ₹{product.priceInr}
                      </span>
                      {product.originalPriceInr && (
                        <span className="text-sm text-neutral-400 line-through">
                          ₹{product.originalPriceInr}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        70% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3.5 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            {/* Highlights */}
            <div className="bg-[#FAF9F6] border border-[#EFECE6] rounded-2xl p-4 mb-6">
              <div className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>What’s Inside ({product.pageCount} Pages)</span>
              </div>
              <ul className="space-y-1.5">
                {product.highlights.slice(0, 4).map((item, idx) => (
                  <li key={idx} className="text-xs text-neutral-600 flex items-start gap-2">
                    <span className="text-amber-700 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instant Actions (No email required) */}
            {product.isFree ? (
              <div>
                <button
                  onClick={handleFreeDownload}
                  className="w-full py-4 px-6 rounded-2xl bg-[#111111] hover:bg-[#222222] text-white text-sm sm:text-base font-semibold transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Instant Free Download (PDF)</span>
                </button>
                <div className="mt-3 text-center text-xs text-neutral-500">
                  No credit card required • Instant access
                </div>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={handlePaidCheckout}
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-2xl bg-[#111111] hover:bg-[#222222] disabled:bg-neutral-400 text-white text-sm sm:text-base font-semibold transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connecting to Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Pay ₹{product.priceInr} &amp; Download Instantly</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                <div className="mt-4 flex flex-col items-center justify-center gap-1.5 text-[11px] text-neutral-500 text-center">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      100% Secure Razorpay Checkout
                    </span>
                    <span>•</span>
                    <span>Instant Direct Download</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    UPI, Credit/Debit Cards, NetBanking • No account or email needed
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
