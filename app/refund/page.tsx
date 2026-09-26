import type { Metadata } from 'next';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Refund Policy | BookGenie',
  description: 'BookGenie refund terms, beta testing policies, and subscription cancellation guidelines.',
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app/refund',
  },
};

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#0f1015] text-on-surface dark:text-[#f3f0f7] transition-colors">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="mb-10 pb-6 border-b border-outline-variant/20 dark:border-white/10">
          <span className="font-label-caps text-secondary dark:text-secondary-fixed text-xs tracking-widest uppercase mb-2 block">
            Commerce & Guarantees
          </span>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-on-surface dark:text-[#f3f0f7] mb-3">
            Refund & Cancellation Policy
          </h1>
          <p className="font-code-spec text-xs text-outline tracking-wider">
            Last Updated: September 2026 • BookGenie Atelier Guarantee
          </p>
        </div>

        <div className="space-y-8 font-body-md text-sm sm:text-base text-on-surface-variant dark:text-[#c4c7c5] leading-relaxed">
          <section className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5">
            <h2 className="font-title-editorial text-lg text-on-surface dark:text-white mb-2">1. Public Beta Access Terms</h2>
            <p>During our current public beta phase, access to Creator and Pro capabilities is offered without mandatory billing or recurring charges. In this period, users do not incur fees and no refunds are necessary.</p>
          </section>
          <section className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5">
            <h2 className="font-title-editorial text-lg text-on-surface dark:text-white mb-2">2. Production Billing & Guarantees</h2>
            <p>Upon official public launch of our automated payment gateway, all initial paid tier subscriptions will include a 7-day money-back guarantee. If you are not satisfied with generation quality or formatting, you may request a refund within 7 days of purchase.</p>
          </section>
          <section className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5">
            <h2 className="font-title-editorial text-lg text-on-surface dark:text-white mb-2">3. How to Contact Support</h2>
            <p>For inquiries regarding subscriptions, account management, or billing questions, contact our editorial team at support@bookgenie.ai.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
