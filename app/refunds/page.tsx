'use client';

import React from 'react';
import Link from 'next/link';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { MinimalFooter } from '@/components/home/MinimalFooter';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function RefundsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans antialiased">
      <MinimalHeader />

        <main className="flex-1 max-w-[800px] w-full mx-auto px-6 pt-12 sm:pt-16 pb-24">
          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] leading-tight text-[#111111] font-normal tracking-tight mb-3">
              Refund Policy
            </h1>
            <p className="text-sm sm:text-base text-[#666666]">
              We want BookGenie to be simple and transparent.
            </p>
          </div>

          <div className="w-12 h-[1px] bg-[#EAEAEA] mx-auto mb-12" />

          {/* Policy Sections */}
          <div className="space-y-10 text-[14px] sm:text-[15px] text-[#2A2A2A] leading-relaxed">
            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#111111] mb-3">
                Digital Products and Generated Books
              </h2>
              <p>
                Due to the immediate delivery of digital publications, completed books that have been successfully generated, formatted, and downloaded are generally non-refundable once accessed. However, if you experience substantial quality issues or unresolvable formatting errors, our support team is available to review your case and issue a credit or refund.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#111111] mb-3">
                Subscription Refunds &amp; Cancellations
              </h2>
              <p>
                You may cancel your Creator monthly plan at any time through your account settings. Cancellation stops future recurring charges while maintaining access through the remainder of your active billing period. If you were billed in error or experienced an unintended renewal within 48 hours of billing, you may request a full refund.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#111111] mb-3">
                Technical Generation Failures
              </h2>
              <p>
                If a book generation job fails to complete due to server errors, model timeouts, or system interruptions, we automatically credit your generation quota. If our platform cannot successfully fulfill your book project after multiple attempts, you are entitled to a complete refund for that publication pass.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#111111] mb-3">
                Duplicate Charges
              </h2>
              <p>
                If you observe any duplicate or erroneous transactions on your payment method, notify us immediately. Verified accidental double charges are reversed and refunded within 1–2 business days.
              </p>
            </section>

            <section className="bg-[#FAF9F6] p-7 rounded-2xl border border-[#EAEAEA]">
              <h2 className="font-serif text-xl font-normal text-[#111111] mb-3">
                How to Request a Refund
              </h2>
              <p className="mb-4">
                To request a refund or account credit, please follow these steps:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-[#444444]">
                <li>Contact our support team via our <Link href="/contact" className="underline text-[#111111]">Contact Page</Link>.</li>
                <li>Provide your registered account email address.</li>
                <li>Include your transaction ID or receipt reference.</li>
                <li>Provide a brief explanation of the technical or billing issue encountered.</li>
              </ol>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#111111] mb-3">
                Response &amp; Processing Timeframe
              </h2>
              <p>
                Our billing team investigates every refund inquiry personally. You will receive an initial response within 1–2 business days. Approved refunds are credited directly back to your original payment method within 5–7 business days depending on your banking institution.
              </p>
            </section>
          </div>
        </main>

        <MinimalFooter />
      </div>
  );
}
