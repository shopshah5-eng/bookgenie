'use client';

import React from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function PrivacyPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-surface dark:bg-[#0f1015] text-on-surface dark:text-[#f3f0f7] transition-colors">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="mb-10 pb-6 border-b border-outline-variant/20 dark:border-white/10">
            <span className="font-label-caps text-secondary dark:text-secondary-fixed text-xs tracking-widest uppercase mb-2 block">
              Legal & Compliance
            </span>
            <h1 className="font-headline-lg text-3xl sm:text-4xl text-on-surface dark:text-[#f3f0f7] mb-3">
              Privacy Policy
            </h1>
            <p className="font-code-spec text-xs text-outline tracking-wider">
              Last Updated: July 2026 • BookGenie Atelier Publishing Protocol
            </p>
          </div>

          <div className="space-y-8 font-body-md text-sm sm:text-base text-on-surface-variant dark:text-[#c4c7c5] leading-relaxed">
            <section className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5">
              <h2 className="font-title-editorial text-lg text-on-surface dark:text-white mb-2">1. Information We Collect</h2>
              <p>We collect your email address, account name, user-submitted prompts, uploaded document files, and generation history solely to provide you with the BookGenie publishing experience.</p>
            </section>
            <section className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5">
              <h2 className="font-title-editorial text-lg text-on-surface dark:text-white mb-2">2. How Your Content Is Processed</h2>
              <p>Uploaded documents and prompts are transmitted to our server-side AI processing pipeline via secure HTTPS encryption. Your uploaded source materials are stored in private, isolated storage buckets and are never used to train public machine learning models.</p>
            </section>
            <section className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5">
              <h2 className="font-title-editorial text-lg text-on-surface dark:text-white mb-2">3. Storage & Data Security</h2>
              <p>We implement Row Level Security (RLS) policies within our PostgreSQL database so that only your authenticated account can view, modify, or export your books and assets.</p>
            </section>
            <section className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5">
              <h2 className="font-title-editorial text-lg text-on-surface dark:text-white mb-2">4. Your Data Rights</h2>
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
