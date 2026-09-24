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
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mb-3">
          Cookie Policy
        </h1>
        <p className="text-xs text-[#888888] mb-8 pb-4 border-b border-[#F0F0EE]">
          Last Updated: September 2026
        </p>

        <div className="prose max-w-none text-xs sm:text-sm text-[#333333] space-y-6 leading-relaxed">
          <section>
            <h2 className="text-lg font-serif font-bold text-[#111111] mb-2">1. What Are Cookies</h2>
            <p>Cookies are small text files placed on your device to help web applications operate efficiently, remember your preferences, and maintain secure authenticated sessions.</p>
          </section>
          <section>
            <h2 className="text-lg font-serif font-bold text-[#111111] mb-2">2. How We Use Cookies</h2>
            <p>We use essential cookies strictly to maintain user authentication via Supabase Auth and preserve theme preferences (such as dark mode). We do not use intrusive third-party cross-site advertising cookies.</p>
          </section>
          <section>
            <h2 className="text-lg font-serif font-bold text-[#111111] mb-2">3. Managing Preferences</h2>
            <p>You can adjust your cookie settings through your browser preferences. Disabling essential cookies may impair your ability to stay signed in while generating books.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
