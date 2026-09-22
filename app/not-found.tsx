'use client';

import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/Button';
import { BookX, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#F8F3EA] border border-[#E8DCCB] flex items-center justify-center mb-6 shadow-xs">
            <BookX className="w-8 h-8 text-[#9A6F3C]" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F3EA] text-[#8C5F2E] border border-[#E8DCCB] text-[11px] font-semibold uppercase tracking-wider mb-4">
            404 • Page Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1612] tracking-tight mb-3">
            This Book or Page Does Not Exist
          </h1>
          <p className="text-sm sm:text-base text-[#6B635B] mb-8 leading-relaxed">
            The publication or URL you are trying to reach has moved, expired, or hasn&apos;t been published yet.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link href="/">
              <Button variant="secondary" size="lg">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="primary" size="lg">
                <Sparkles className="w-4 h-4 mr-1.5" /> Create a New Book
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
