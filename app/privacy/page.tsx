'use client';

import React from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function PrivacyPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#111111] antialiased selection:bg-[#F2EFE9]">
        <Header />

        <main className="flex-1 max-w-[840px] mx-auto w-full px-6 py-14 sm:py-20">
          {/* Header */}
          <div className="mb-12 pb-8 border-b border-[#F0F0F0]">
            <span className="text-[12px] font-semibold uppercase tracking-widest text-[#777777] mb-3 block">
              Legal & Transparency
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#111111] font-normal tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg text-[#666666] font-light">
              Your privacy matters to us.
            </p>
            <p className="text-xs text-[#999999] mt-3 font-mono">
              Last updated: September 2026
            </p>
          </div>

          {/* Sections 1 to 10 */}
          <div className="space-y-10 text-sm sm:text-base text-[#444444] font-light leading-relaxed">
            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                1. Information We Collect
              </h2>
              <p className="mb-3">
                We collect information necessary to provide and refine our book creation service. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#555555]">
                <li><strong className="font-medium text-[#111111]">Account Information:</strong> Name, email address, password hash, and profile preferences when you register.</li>
                <li><strong className="font-medium text-[#111111]">Book Prompts and Content:</strong> The descriptions, concepts, character details, chapter instructions, and revision notes you provide.</li>
                <li><strong className="font-medium text-[#111111]">Uploaded Files:</strong> Manuscripts, outlines, or visual references you upload to guide book styling.</li>
                <li><strong className="font-medium text-[#111111]">Payment Information:</strong> Billing address, transaction history, and purchase records. Payment cards are processed securely by our certified payment providers.</li>
                <li><strong className="font-medium text-[#111111]">Usage Information:</strong> Actions taken within the platform, pages viewed, features accessed, and generation timestamps.</li>
                <li><strong className="font-medium text-[#111111]">Technical Information:</strong> IP address, browser type, device specifications, and operating system details.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                2. How We Use Information
              </h2>
              <p className="mb-3">
                Your data is utilized strictly for direct platform operations:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#555555]">
                <li><strong className="font-medium text-[#111111]">Account Management:</strong> Authenticating users, managing subscriptions, and maintaining your bookshelf.</li>
                <li><strong className="font-medium text-[#111111]">Book Creation:</strong> Transforming prompts into structured book chapters, typography, and page compositions.</li>
                <li><strong className="font-medium text-[#111111]">File Generation:</strong> Compiling complete, publication-ready PDF and EPUB files.</li>
                <li><strong className="font-medium text-[#111111]">Customer Support:</strong> Investigating inquiries, resolving generation issues, and delivering technical assistance.</li>
                <li><strong className="font-medium text-[#111111]">Security &amp; Abuse Prevention:</strong> Guarding against unauthorized access, fraudulent charges, and abusive traffic.</li>
                <li><strong className="font-medium text-[#111111]">Service Improvement:</strong> Measuring system uptime, export speeds, and reliability to improve your experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                3. Book Content
              </h2>
              <p>
                Your book concepts, written outlines, and completed chapters are your private intellectual property. BookGenie processes your content exclusively to fulfill your book creation instructions. Customer prompts and generated book manuscripts are never sold or rented to third-party data brokers.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                4. File Storage
              </h2>
              <p>
                Generated books, downloadable PDFs, EPUB files, and cover assets are hosted in secured cloud storage buckets equipped with encrypted storage at rest. Your bookshelf remains accessible in your authenticated account until you elect to delete individual books or close your account.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                5. Payments
              </h2>
              <p>
                All payment transactions are handled through PCI-DSS compliant payment gateways. BookGenie does not store raw credit card numbers or debit card CVV codes on our servers. We receive only transaction tokens, card brand, expiration date, and billing identifiers to verify transaction validity.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                6. Cookies
              </h2>
              <p className="mb-2">
                We use cookies and comparable storage technologies for essential functionality:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#555555]">
                <li><strong className="font-medium text-[#111111]">Required Cookies:</strong> Secure session identification, authentication tokens, and CSRF protection.</li>
                <li><strong className="font-medium text-[#111111]">Functional Cookies:</strong> Preserving layout choices, theme mode, and reading state.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                7. Data Security
              </h2>
              <p>
                We enforce multi-tiered security safeguards, including HTTPS TLS encryption in transit, AES-256 encryption at rest, Row Level Security (RLS) policies within our database, and continuous automated threat mitigation. Access to administrative systems is restricted strictly to authorized engineering personnel.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                8. Data Retention
              </h2>
              <p>
                We retain account credentials and created eBooks for the lifetime of your active account. If an account is closed or a book is deleted by the author, associated book metadata and storage files are permanently expunged within 30 calendar days.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                9. User Rights
              </h2>
              <p>
                Regardless of your jurisdiction, BookGenie provides you with rights to view, export, update, or purge your personal data. You may download all completed books in standard formats (PDF, EPUB) at any time. To request a full archival export or permanent account erasure, contact our privacy desk.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#111111] font-normal mb-3">
                10. Contact
              </h2>
              <p>
                For questions regarding this Privacy Policy or your personal information, please write to our privacy officer at{' '}
                <a href="mailto:privacy@bookgenie.com" className="text-[#111111] underline underline-offset-4 hover:opacity-80">
                  privacy@bookgenie.com
                </a>.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-[#F0F0F0] text-xs text-[#888888] font-light">
            Note: This policy provides operational transparency for the BookGenie publishing experience. Before production commercial release, it may be supplemented with regional statutory notices.
          </div>
        </main>

        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
