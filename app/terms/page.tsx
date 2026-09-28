'use client';

import React from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] antialiased selection:bg-[#F2EFE9]">
      <Header />

        <main className="flex-1 max-w-[840px] mx-auto w-full px-6 py-14 sm:py-20">
          {/* Header */}
          <div className="mb-12 pb-8 border-b border-[#F0F0F0]">
            <span className="text-[12px] font-semibold uppercase tracking-widest text-[#777777] mb-3 block">
              Terms & Conditions
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#111111] font-normal tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-base sm:text-lg text-[#666666] font-light">
              Guidelines and legal terms governing the use of BookGenie.
            </p>
            <p className="text-xs text-[#999999] mt-3 font-mono">
              Last updated: September 2026
            </p>
          </div>

          {/* 16 Numbered Sections */}
          <div className="space-y-10 text-sm sm:text-base text-[#444444] font-light leading-relaxed">
            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, or using the BookGenie platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the platform immediately.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                2. Using BookGenie
              </h2>
              <p>
                BookGenie provides an automated book creation and design experience that transforms concepts and outlines into structured, illustrated, and downloadable eBooks in PDF and EPUB formats. You agree to use the service in compliance with all relevant local and international laws.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                3. User Accounts
              </h2>
              <p>
                To save publications, manage bookshelf items, and download commercial-grade files, you must create an account. You are responsible for safeguarding your login credentials and for all activities that occur under your account. Notify us immediately of any unauthorized access.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                4. User Content
              </h2>
              <p>
                You retain all rights to the prompts, manuscript excerpts, storylines, characters, and reference materials that you submit to BookGenie. By submitting content, you grant BookGenie a limited license solely to process and render your books as instructed.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                5. Book Ownership
              </h2>
              <p>
                As between you and BookGenie, you own the books you generate. You are free to read, archive, share, print, and distribute your finished books, subject to the license tier you selected upon creation.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                6. Commercial Use
              </h2>
              <p>
                Books created under paid plans (such as Book, Book Plus, and Creator tiers) include full commercial use rights. You may sell, monetize, distribute, and license these finished books across third-party marketplaces, bookstores, and digital distribution channels.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                7. Prohibited Content
              </h2>
              <p>
                You may not use BookGenie to produce, store, or distribute material that promotes violence, hate speech, unlawful harassment, defamatory falsehoods, non-consensual imagery, or material that infringes upon third-party copyrights or trademarks.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                8. Payments and Subscriptions
              </h2>
              <p>
                Paid tiers are billed in advance per book or on a monthly subscription schedule as specified at checkout. All prices are listed in Indian Rupees (₹) or local currency equivalents. You authorize BookGenie and our payment processors to charge your payment method for chosen plans.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                9. Refunds
              </h2>
              <p>
                Refunds are governed by our separate Refund Policy. Because digital books and rendering consume immediate compute resources, refunds are evaluated based on service delivery status and technical failure cases.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                10. Service Availability
              </h2>
              <p>
                We strive for continuous, uninterrupted availability. However, maintenance windows, internet anomalies, and third-party infrastructure events may cause temporary downtime. We do not guarantee uninterrupted or error-free operation.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                11. Intellectual Property
              </h2>
              <p>
                The BookGenie logo, interface styling, website code, brand marks, and underlying software are the proprietary intellectual property of BookGenie and its licensors. You may not reverse-engineer, copy, or scrape the platform interface.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                12. Third-Party Services
              </h2>
              <p>
                The platform may interact with third-party providers for authentication, cloud storage, payment handling, and font delivery. Your use of these services is subject to their respective terms and privacy policies.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                13. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by applicable law, BookGenie and its directors, employees, or partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                14. Account Termination
              </h2>
              <p>
                You may close your account at any time. We reserve the right to suspend or terminate accounts that violate these terms, engage in abusive generation behavior, or attempt to circumvent security mechanisms.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                15. Changes to the Service
              </h2>
              <p>
                We may periodically update our features, interfaces, and pricing tiers to reflect improvements in publishing tools. Notice of material modifications will be posted to the website or sent via email.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                16. Contact
              </h2>
              <p>
                If you have questions or concerns regarding these Terms of Service, please reach out to our legal department at{' '}
                <a href="mailto:legal@bookgenie.com" className="text-[#111111] underline underline-offset-4 hover:opacity-80">
                  legal@bookgenie.com
                </a>.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-[#F0F0F0] text-xs text-[#888888] font-light">
            Note: This document establishes the terms of service for the BookGenie publishing platform. Please ensure legal review for your target operating territories before formal commercial launch.
          </div>
        </main>

        <Footer />
      </div>
  );
}
