import type { Metadata } from 'next';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Cookie Policy | BookGenie',
  description: 'Understand how BookGenie uses essential cookies for secure authentication and user preferences.',
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app/cookies',
  },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#0f1015] text-on-surface dark:text-[#f3f0f7] transition-colors">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="mb-10 pb-6 border-b border-outline-variant/20 dark:border-white/10">
          <span className="font-label-caps text-secondary dark:text-secondary-fixed text-xs tracking-widest uppercase mb-2 block">
            Storage & Sessions
          </span>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-on-surface dark:text-[#f3f0f7] mb-3">
            Cookie Policy
          </h1>
          <p className="font-code-spec text-xs text-outline tracking-wider">
            Last Updated: September 2026 • BookGenie Atelier Session Standard
          </p>
        </div>

        <div className="space-y-8 font-body-md text-sm sm:text-base text-on-surface-variant dark:text-[#c4c7c5] leading-relaxed">
          <section className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5">
            <h2 className="font-title-editorial text-lg text-on-surface dark:text-white mb-2">1. What Are Cookies</h2>
            <p>Cookies are small text files placed on your device to help web applications operate efficiently, remember your preferences, and maintain secure authenticated sessions.</p>
          </section>
          <section className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5">
            <h2 className="font-title-editorial text-lg text-on-surface dark:text-white mb-2">2. How We Use Cookies</h2>
            <p>We use essential cookies strictly to maintain user authentication via Supabase Auth and preserve theme preferences (such as dark mode and reader substrate). We do not use intrusive third-party cross-site advertising cookies.</p>
          </section>
          <section className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5">
            <h2 className="font-title-editorial text-lg text-on-surface dark:text-white mb-2">3. Managing Preferences</h2>
            <p>You can adjust your cookie settings through your browser preferences. Disabling essential cookies may impair your ability to stay signed in while generating books.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
