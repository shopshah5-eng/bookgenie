'use client';

import React from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function TermsPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-surface-container-lowest dark:bg-[#121217] text-on-surface dark:text-[#f1effa] transition-colors">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <h1 className="font-display-hero text-display-hero-mobile md:text-headline-lg text-primary dark:text-[#f1effa] mb-3">
            Terms of Service
          </h1>
          <p className="font-code-spec text-xs text-on-surface-variant dark:text-neutral-400 mb-8 pb-4 border-b border-surface-container-highest dark:border-white/10">
            Last Updated: July 2026
          </p>

          <div className="prose max-w-none font-body-sm text-xs sm:text-sm text-on-surface-variant dark:text-neutral-300 space-y-6 leading-relaxed">
            <section>
              <h2 className="font-headline-sm text-lg font-bold text-primary dark:text-[#f1effa] mb-2">1. Acceptance of Terms</h2>
              <p>By accessing or using BookGenie, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access or use the service.</p>
            </section>
            <section>
              <h2 className="text-lg font-serif font-bold text-[#1A1612] mb-2">2. Nature of Service</h2>
              <p>BookGenie is an AI-assisted publishing platform that processes user prompts and uploaded source materials to generate structured book blueprints, written text, illustrations, and downloadable formats (PDF and EPUB).</p>
            </section>
            <section>
              <h2 className="text-lg font-serif font-bold text-[#1A1612] mb-2">3. Intellectual Property & Commercial Rights</h2>
              <p>You retain full ownership of the prompts and source materials you provide. Creators on active paid tiers (Creator and Pro) receive full commercial rights to publish, distribute, and monetize books generated through their accounts, subject to applicable AI regulations and third-party foundation model terms.</p>
            </section>
            <section>
              <h2 className="text-lg font-serif font-bold text-[#1A1612] mb-2">4. User Conduct & Acceptable Use</h2>
              <p>You agree not to use BookGenie to generate content that is defamatory, hateful, abusive, infringes upon third-party copyrights, or violates local and international laws.</p>
            </section>
            <section>
              <h2 className="text-lg font-serif font-bold text-[#1A1612] mb-2">5. Service Availability</h2>
              <p>While we strive for 99.9% uptime, we cannot guarantee uninterrupted access. We reserve the right to modify or discontinue features to maintain platform performance and security.</p>
            </section>
          </div>
        </main>
        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
