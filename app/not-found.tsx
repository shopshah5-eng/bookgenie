import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/Button';
import { BookX, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-center mb-6 shadow-2xs">
          <BookX className="w-8 h-8 text-[#111111]" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F3] text-[#111111] border border-[#E5E5E5] text-[11px] font-semibold uppercase tracking-wider mb-4">
          404 • Page Not Found
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] tracking-tight mb-3">
          This Page or Publication Does Not Exist
        </h1>
        <p className="text-sm sm:text-base text-[#666666] mb-8 leading-relaxed">
          The publication or URL you are trying to reach has moved, expired, or was typed incorrectly.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/">
            <Button variant="secondary" size="lg" className="border-[#E5E5E5] text-[#111111] hover:bg-[#F9F9F8]">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
            </Button>
          </Link>
          <Link href="/create">
            <Button variant="primary" size="lg" className="bg-[#111111] text-white hover:bg-[#222222]">
              <Sparkles className="w-4 h-4 mr-1.5 text-amber-400" /> Create a Book
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
