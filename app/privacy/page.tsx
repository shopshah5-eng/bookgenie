'use client';

import React from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function PrivacyPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1612] mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#9E968E] mb-8 pb-4 border-b border-[#EFECE6]">
            Last Updated: July 2026
          </p>

          <div className="prose max-w-none text-xs sm:text-sm text-[#4A4036] space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-serif font-bold text-[#1A1612] mb-2">1. Information We Collect</h2>
              <p>We collect your email address, account name, user-submitted prompts, uploaded document files, and generation history to provide you with the BookGenie publishing experience.</p>
            </section>
            <section>
              <h2 className="text-lg font-serif font-bold text-[#1A1612] mb-2">2. How Your Content Is Processed</h2>
              <p>Uploaded documents and prompts are transmitted to our server-side AI processing pipeline via secure HTTPS encryption. Your uploaded source materials are stored in private, isolated storage buckets and are never used to train public machine learning models.</p>
            </section>
            <section>
              <h2 className="text-lg font-serif font-bold text-[#1A1612] mb-2">3. Storage & Data Security</h2>
              <p>We implement Row Level Security (RLS) policies within our PostgreSQL database so that only your authenticated account can view, modify, or export your books and assets.</p>
            </section>
            <section>
              <h2 className="text-lg font-serif font-bold text-[#1A1612] mb-2">4. Your Data Rights</h2>
              <p>You have the right to request deletion of your account, generated books, and all associated file uploads at any time through our contact channels.</p>
            </section>
          </div>
        </main>
        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
