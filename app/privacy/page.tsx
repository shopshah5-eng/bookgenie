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
              <p>We collect your email address, account identifier, prompts, attached manuscript notes, generated chapter prose, and book artifacts solely to render and maintain your private library.</p>
            </section>
            <section className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5">
              <h2 className="font-title-editorial text-lg text-on-surface dark:text-white mb-2">2. AI Sub-Processors &amp; Zero-Training Guarantee</h2>
              <p>
                Prompts and chapter blueprints are routed securely to our AI inferencing providers—primarily OpenRouter and Google Cloud Gemini API—exclusively for synchronous generation. Under commercial API developer terms, customer prompts and generated outputs are <strong>not used to train or refine public frontier models</strong>.
              </p>
            </section>
            <section className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5">
              <h2 className="font-title-editorial text-lg text-on-surface dark:text-white mb-2">3. Data Retention &amp; Storage Architecture</h2>
              <p>
                All account data, book blueprints, and generated pages are persisted in managed PostgreSQL databases configured with Row Level Security (RLS) policies. Completed user books remain available as long as your account remains active. Temporary synthesis scratch files and uncompleted generation jobs are automatically purged after 30 days.
              </p>
            </section>
            <section className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5">
              <h2 className="font-title-editorial text-lg text-on-surface dark:text-white mb-2">4. Deletion Rights &amp; Privacy Contact</h2>
              <p>
                You retain complete control of your data. You may delete individual books directly from your library, or submit a full data deletion request by emailing our privacy team at <a href="mailto:privacy@bookgenie.ai" className="text-secondary dark:text-[#fcba64] underline">privacy@bookgenie.ai</a>. All account records and associated storage buckets are purged within 14 business days of verified request.
              </p>
            </section>
          </div>
        </main>
        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
