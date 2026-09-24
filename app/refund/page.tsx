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
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mb-3">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-[#888888] mb-8 pb-4 border-b border-[#F0F0EE]">
          Last Updated: September 2026
        </p>

        <div className="prose max-w-none text-xs sm:text-sm text-[#333333] space-y-6 leading-relaxed">
          <section>
            <h2 className="text-lg font-serif font-bold text-[#111111] mb-2">1. Public Beta Access Terms</h2>
            <p>During our current public beta phase, access to Creator and Pro capabilities is offered without mandatory billing or recurring charges. In this period, users do not incur fees and no refunds are necessary.</p>
          </section>
          <section>
            <h2 className="text-lg font-serif font-bold text-[#111111] mb-2">2. Production Billing & Guarantees</h2>
            <p>Upon official public launch of our automated payment gateway, all initial paid tier subscriptions will include a 7-day money-back guarantee. If you are not satisfied with generation quality or formatting, you may request a refund within 7 days of purchase.</p>
          </section>
          <section>
            <h2 className="text-lg font-serif font-bold text-[#111111] mb-2">3. How to Contact Support</h2>
            <p>For inquiries regarding subscriptions, account management, or billing questions, contact our editorial team at support@bookgenie.ai.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
