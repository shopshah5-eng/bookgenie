'use client';

import React from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function RefundPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1612] mb-3">
            Refund Policy
          </h1>
          <p className="text-xs text-[#9E968E] mb-8 pb-4 border-b border-[#EFECE6]">
            Last Updated: July 2026
          </p>

          <div className="prose max-w-none text-xs sm:text-sm text-[#4A4036] space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-serif font-bold text-[#1A1612] mb-2">1. 7-Day Money-Back Guarantee</h2>
              <p>We want you to be completely satisfied with BookGenie. If you subscribe to our Creator or Pro tier and find that the platform does not meet your publishing needs, you are eligible for a full refund within 7 days of initial purchase.</p>
            </section>
            <section>
              <h2 className="text-lg font-serif font-bold text-[#1A1612] mb-2">2. How to Request a Refund</h2>
              <p>To request a refund, please contact us at support@bookgenie.ai with your account email and purchase receipt. Refunds are processed through your original payment method within 5–7 business days.</p>
            </section>
            <section>
              <h2 className="text-lg font-serif font-bold text-[#1A1612] mb-2">3. Subscription Cancellation</h2>
              <p>You can cancel your recurring subscription at any time. When cancelled, your plan remains active until the end of your current billing cycle, with no subsequent charges.</p>
            </section>
          </div>
        </main>
        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
