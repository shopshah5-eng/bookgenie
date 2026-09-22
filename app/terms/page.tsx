'use client';

import React from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function TermsPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1612] mb-3">
            Terms of Service
          </h1>
          <p className="text-xs text-[#9E968E] mb-8 pb-4 border-b border-[#EFECE6]">
            Last Updated: July 2026
          </p>

          <div className="prose max-w-none text-xs sm:text-sm text-[#4A4036] space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-serif font-bold text-[#1A1612] mb-2">1. Acceptance of Terms</h2>
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
