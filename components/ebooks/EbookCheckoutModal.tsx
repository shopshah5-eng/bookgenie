'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  CheckCircle,
  Download,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
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
  initialEmail = '',
  isOwner = false,
}: EbookCheckoutModalProps) {
  const [email, setEmail] = useState(initialEmail);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<{
    orderId?: string;
    paymentId?: string;
    email?: string;
  }>({});

  if (!isOpen) return null;

  const handleFreeDownload = () => {
    const a = document.createElement('a');
    a.href = `/api/ebooks/download/${product.slug}`;
    a.download = `${product.title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsCompleted(true);
    setDownloadUrl(`/api/ebooks/download/${product.slug}`);
    setPaymentDetails({ email: email || 'your email' });
  };

  const handlePaidCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const targetEmail = (email || initialEmail).trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setError('Please provide a valid email address to receive your ebook.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Razorpay order on server
      const res = await fetch('/api/ebooks/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, bookId: product.id }),
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
        name: 'BookGenie Publishing',
        description: product.title,
        image: '/images/ebooks/blueprint-cover.jpg',
        order_id: orderData.orderId,
        prefill: {
          email: targetEmail,
        },
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
            // 4. Verify signature on backend
            const verifyRes = await fetch('/api/ebooks/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                email: targetEmail,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.message || 'Payment signature verification failed.');
            }

            setDownloadUrl(verifyData.downloadUrl);
            setPaymentDetails({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              email: targetEmail,
            });
            setIsCompleted(true);
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
        setError(errorData?.error?.description || 'Payment failed or was cancelled.');
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

        {/* ---------------- THANK YOU SCREEN ---------------- */}
        {isCompleted ? (
          <div className="p-8 sm:p-10 flex flex-col items-center text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-5 text-amber-700 shadow-sm animate-in zoom-in duration-300">
              <CheckCircle className="w-8 h-8 stroke-[2]" />
            </div>

            <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold tracking-wide uppercase mb-2">
              Order Confirmed
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#111111] mb-3">
              Thank You For Your Order!
            </h2>

            {/* Email Sent Callout Banner */}
            <div className="w-full bg-[#FAF8F5] border border-[#EBE4D8] rounded-2xl p-4 sm:p-5 mb-6 text-left flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#DFD7C7] flex items-center justify-center shrink-0 text-amber-800 shadow-2xs">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1612] mb-0.5">
                  This eBook is sent to your email address:
                </p>
                <p className="text-sm font-mono font-medium text-amber-900 break-all">
                  {paymentDetails.email || email || initialEmail || 'your email'}
                </p>
                <p className="text-xs text-[#7A7067] mt-1 font-light">
                  Please check your inbox (and spam/promotions folder) for your receipt and copy.
                </p>
              </div>
            </div>

            {/* Instant Download Action */}
            <div className="w-full mb-6">
              <a
                href={downloadUrl || `/api/ebooks/download/${product.slug}`}
                download
                className="w-full py-4 px-6 rounded-2xl bg-[#111111] hover:bg-[#222222] text-white text-sm sm:text-base font-semibold transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                <span>Download eBook Now (PDF)</span>
              </a>
              <p className="text-[11px] text-neutral-500 mt-2">
                Format: {product.details.format} • {product.details.fileSize} • DRM-Free
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
              Back to My eBooks
            </button>
          </div>
        ) : (
          /* ---------------- CHECKOUT FORM ---------------- */
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

            {/* Owner Bypass Notice if shopshah5@gmail.com */}
            {isOwner && (
              <div className="p-3.5 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                <span>🌟 <strong>Author/Owner Access Granted</strong>: You can download this directly.</span>
                <a
                  href={`/api/ebooks/download/${product.slug}`}
                  download
                  className="px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs inline-flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Free Download</span>
                </a>
              </div>
            )}

            {/* Form */}
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
              <form onSubmit={handlePaidCheckout}>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Your Delivery Email Address <span className="text-amber-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 focus:border-[#111111] focus:ring-1 focus:ring-[#111111] text-sm outline-none transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1.5">
                    The ebook PDF and download link will be delivered to this email.
                  </p>
                </div>

                <button
                  type="submit"
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
                      <span>Pay ₹{product.priceInr} with Razorpay</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    100% Secure Razorpay Checkout
                  </span>
                  <span>•</span>
                  <span>UPI, Cards, NetBanking</span>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
