import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/Button';
import { BookX, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans selection:bg-[#111111] selection:text-white">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF9F6] border border-[#EAEAEA] flex items-center justify-center mb-6 text-[#111111] shadow-2xs">
          <BookX className="w-7 h-7 text-[#9A6F3C]" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] text-[#9A6F3C] border border-[#EAEAEA] text-xs font-semibold tracking-wider uppercase mb-4">
          404 • Page Not Found
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight mb-3">
          This Page Does Not Exist
        </h1>
        <p className="text-sm sm:text-base text-[#666666] mb-8 leading-relaxed max-w-md">
          The publication or link you are trying to reach has moved, expired, or was typed incorrectly.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#EAEAEA] hover:border-[#111111] text-xs sm:text-sm font-semibold text-[#111111] bg-white transition-all shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#111111] hover:bg-black text-xs sm:text-sm font-semibold text-white transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 mr-1 text-[#9A6F3C]" />
            <span>Create New eBook</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
