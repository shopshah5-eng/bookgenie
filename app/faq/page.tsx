'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function FAQPage() {
  const faqs = [
    {
      q: 'What kinds of books can I create with BookGenie?',
      a: 'BookGenie is completely book-type agnostic. You can create illustrated children’s picture books, fiction novels, coloring books, step-by-step educational guides, course workbooks, recipe collections, historical accounts, guided reflection journals, and business manuals. Every book adheres to canonical typography, margins, and page structures tailored to that genre.',
    },
    {
      q: 'Can I upload my own notes, drafts, or PDFs as source material?',
      a: 'Yes. On the Create studio page, you can attach text files (.txt, .md) and document references (.pdf, .docx). Plain text and Markdown are extracted directly into the generation context, while document files provide reference structures for chapter synthesis and factual grounding.',
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
      a: 'Yes! Subscribers on all paid tiers (Pro Creator and Premium Atelier) retain 100% commercial rights and intellectual property ownership over all generated text, layouts, and illustrations. You can distribute your books as digital ebooks (EPUB), sell physical paperbacks via Amazon KDP or IngramSpark (using our print-ready PDF), or sell directly to your audience.',
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
      <div className="min-h-screen flex flex-col bg-surface-container-lowest dark:bg-[#121217] text-on-surface dark:text-[#f1effa] transition-colors">
        <Header />

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container dark:bg-white/10 text-secondary dark:text-[#fcba64] border border-surface-container-highest dark:border-white/10 text-[11px] font-label-caps uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#fcba64]" />
              Knowledge &amp; Support
            </span>
            <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-primary dark:text-[#f1effa] tracking-tight leading-none mb-4">
              Frequently Asked Questions
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-neutral-400">
              Clear answers regarding autonomous book generation, licensing, and printing.
            </p>
          </div>

          <div className="space-y-4 mb-16">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-6 rounded-xl bg-surface-container-lowest dark:bg-[#181820] border border-surface-container-highest dark:border-white/10 shadow-xs transition-colors open:bg-surface-container-low dark:open:bg-[#1a1b24]"
              >
                <summary className="flex items-center justify-between cursor-pointer font-headline-sm text-base sm:text-lg text-primary dark:text-[#f1effa] list-none select-none">
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] transition-transform group-open:rotate-180 shrink-0 ml-4">
                    expand_more
                  </span>
                </summary>
                <p className="mt-4 pt-4 border-t border-surface-container-highest dark:border-white/10 font-body-md text-sm sm:text-base text-on-surface-variant dark:text-neutral-300 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          <div className="text-center p-8 bg-surface-container-low dark:bg-[#181820] rounded-2xl border border-surface-container-highest dark:border-white/10">
            <h3 className="font-headline-sm text-lg font-bold text-primary dark:text-[#f1effa] mb-2">
              Have a specific printing or publishing requirement?
            </h3>
            <p className="font-body-sm text-sm text-on-surface-variant dark:text-neutral-400 mb-6">
              Our typographical engineering team is available for custom imprint formats, ISBNs, and distribution specs.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary dark:bg-white text-on-primary dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 px-6 py-2.5 rounded-full font-label-ui text-sm font-semibold transition-all"
            >
              <span>Contact Editorial Atelier</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </main>

        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
