'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/Button';
import { ChevronDown, Sparkles, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'What kinds of books can I create with BookGenie?',
      a: 'BookGenie is completely book-type agnostic. You can create illustrated children’s picture books, fiction novels, coloring books, step-by-step educational guides, course workbooks, recipe collections, historical accounts, guided reflection journals, and business manuals. Every book adheres to canonical typography, margins, and page structures tailored to that genre.',
    },
    {
      q: 'Can I upload my own notes, drafts, or PDFs as source material?',
      a: 'Yes. On the Create studio page, you can attach PDF, DOCX, TXT, Markdown, or image files. BookGenie extracts your notes, outlines, and research, using them as primary source material to structure chapters and write content while preserving your voice and key factual details.',
    },
    {
      q: 'Are my books, uploads, and data strictly private?',
      a: 'Yes. All uploads, book drafts, and generated assets are stored in private, isolated storage buckets with strict Row Level Security (RLS). We never share, sell, or use your uploaded drafts or generated manuscripts to train public foundation models. Only you can view or edit your books, unless you explicitly generate a private read-only sharing link.',
    },
    {
      q: 'Can I generate books in languages other than English?',
      a: 'Yes. BookGenie natively supports multilingual generation, including English, Spanish, French, German, Hindi, Japanese, Italian, and Portuguese. Both narrative prose, character dialogue, and chapter headings are written naturally in the selected language.',
    },
    {
      q: 'Can I commercially publish and sell the generated books on Amazon KDP or Gumroad?',
      a: 'Yes! Subscribers on our Creator and Pro plans receive 100% full commercial rights and intellectual property ownership over all generated text, layouts, and illustrations. You can distribute your books as digital ebooks (EPUB), sell physical paperbacks via Amazon KDP or IngramSpark (using our print-ready PDF), or sell directly to your audience.',
    },
    {
      q: 'How long does book generation take?',
      a: 'Most books are completely planned, written, illustrated, and formatted in 1 to 3 minutes. BookGenie runs generation in background workers with real-time status polling, so even if your browser connection drops, your book continues processing on the server until complete.',
    },
    {
      q: 'How does natural-language AI editing and revision work?',
      a: 'In the digital reader, click the floating revision bar (“✨ What would you like to change?”) and describe your edit in plain English (e.g., “Make Chapter 2 simpler for early readers and add an illustration of the sunset”). BookGenie surgically modifies only the requested pages and automatically preserves previous version snapshots in case you ever want to revert.',
    },
    {
      q: 'What downloadable file formats do you provide?',
      a: 'Every completed book compiles on demand into two industry-standard formats: a high-resolution, print-ready PDF with proper typographic margins and headers, and a validated EPUB3 binary file ready for Apple Books, Kindle, Kobo, and modern e-readers.',
    },
    {
      q: 'How does BookGenie ensure character consistency across illustrations?',
      a: 'For children’s and illustrated books, BookGenie automatically crafts an internal Character Bible (specifying species, clothing, color palette, facial features, and personality). This bible is injected into every subsequent illustration prompt so your characters look consistent from chapter to chapter.',
    },
    {
      q: 'Can I cancel or switch my plan at any time?',
      a: 'Yes. You can manage, upgrade, downgrade, or cancel your subscription at any time with a single click from your account billing settings. There are no long-term contracts, hidden lock-ins, or cancellation fees.',
    },
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
        <Header />

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F3EA] text-[#8C5F2E] border border-[#E8DCCB] text-[11px] font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Frequently Asked Questions
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A1612] tracking-tight mb-4">
              Everything You Need to Know
            </h1>
            <p className="text-sm sm:text-base text-[#6B635B]">
              Comprehensive answers regarding AI generation, data privacy, commercial publishing, and supported formats.
            </p>
          </div>

          {/* Privacy & Security Guarantee Callout */}
          <div className="mb-10 rounded-2xl bg-[#F5EFE6] border border-[#E8DFC8] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#8C5F2E] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#1A1612] text-base mb-1">
                Data Privacy & Commercial Rights Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed">
                Your uploaded documents and generated books are 100% private to your account. We never train public AI models on your creative manuscripts or source notes. All Creator and Pro books carry full commercial publishing licenses.
              </p>
            </div>
          </div>

          {/* Accessible, Crawlable Accordion List via Semantic <details> */}
          <div className="space-y-4 mb-16">
            {faqs.map((item, idx) => (
              <details
                key={idx}
                open={idx < 3}
                className="group rounded-2xl bg-white border border-[#EFECE6] open:border-[#9A6F3C]/40 open:shadow-md transition-all duration-200 overflow-hidden"
              >
                <summary className="w-full list-none cursor-pointer p-5 sm:p-6 flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-[#1A1612] group-hover:text-[#9A6F3C] transition-colors select-none">
                  <span>{item.q}</span>
                  <ChevronDown className="w-5 h-5 text-[#9E968E] shrink-0 transition-transform duration-200 group-open:rotate-180 group-open:text-[#9A6F3C]" />
                </summary>

                <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-[#6B635B] leading-relaxed border-t border-[#F4F1EA] pt-4">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="rounded-3xl bg-white border border-[#EFECE6] p-8 text-center shadow-xs">
            <h3 className="text-xl font-serif font-bold text-[#1A1612] mb-1">
              Still have questions?
            </h3>
            <p className="text-xs sm:text-sm text-[#6B635B] mb-4">
              Our editorial support team is ready to help you publish your book.
            </p>
            <Link href="/contact">
              <Button variant="secondary" size="md">
                Contact Support Team →
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
