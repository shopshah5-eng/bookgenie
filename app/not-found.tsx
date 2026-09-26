import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/Button';
import { BookX, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#0f1015] text-on-surface dark:text-[#f3f0f7] transition-colors">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary-container/20 dark:bg-white/5 border border-secondary/20 flex items-center justify-center mb-6 shadow-xs">
          <BookX className="w-8 h-8 text-secondary dark:text-secondary-fixed" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/30 text-secondary dark:text-secondary-fixed border border-secondary/20 text-xs font-label-caps tracking-widest uppercase mb-4">
          404 • Folio Uncataloged
        </span>
        <h1 className="font-headline-lg text-3xl sm:text-4xl text-on-surface dark:text-[#f3f0f7] tracking-tight mb-3">
          This Page or Publication Does Not Exist
        </h1>
        <p className="font-body-md text-sm sm:text-base text-on-surface-variant dark:text-[#c4c7c5] mb-8 leading-relaxed">
          The publication or URL you are trying to reach has moved, expired, or was typed incorrectly.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/">
            <Button variant="secondary" size="lg" className="border-outline-variant/30 text-on-surface dark:text-white hover:bg-surface-container">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
            </Button>
          </Link>
          <Link href="/create">
            <Button variant="primary" size="lg" className="bg-primary hover:bg-primary-hover text-on-primary shadow-sm font-semibold">
              <Sparkles className="w-4 h-4 mr-1.5 text-secondary-fixed" /> Open Studio Atelier
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
