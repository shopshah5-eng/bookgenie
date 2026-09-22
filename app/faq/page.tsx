'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/Button';
import { ChevronDown, Sparkles, ArrowRight } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What kinds of books can I create with BookGenie?',
      a: 'BookGenie is completely book-type agnostic. You can create illustrated children’s picture books, fiction novels, coloring books, step-by-step educational guides, course workbooks, recipe collections, historical accounts, guided reflection journals, and business manuals.',
    },
    {
      q: 'Can I upload my own notes, drafts, or PDFs as source material?',
      a: 'Yes. On the Create page, you can attach PDF, DOCX, TXT, Markdown, or image files. BookGenie extracts your notes and uses them as primary source material to structure chapters and write content.',
    },
    {
      q: 'Can I generate books in languages other than English?',
      a: 'Yes. BookGenie supports multilingual generation, including English, Hindi, Spanish, French, German, Japanese, and more. Both narrative text and chapter headings are tailored to the selected language.',
    },
    {
      q: 'Can I commercially publish and sell the generated books on Amazon KDP or Gumroad?',
      a: 'Yes! Subscribers on our Creator and Pro plans receive full commercial rights to all generated content, layouts, and illustrations. You can sell your books as digital ebooks (PDF/EPUB) or publish physical print copies.',
    },
    {
      q: 'How long does book generation take?',
      a: 'Most books are completely written, illustrated, and formatted in 1 to 3 minutes. Because BookGenie uses an independent server-side queue, you never have to worry about connection drops interrupting your book.',
    },
    {
      q: 'How does natural-language AI editing work?',
      a: 'In the digital reader, simply click the floating revision bar (“✨ What would you like to change?”) and describe what you want in plain English (e.g., “Make Chapter 2 simpler for children and add an illustration of the sunset”). BookGenie modifies only the requested pages and creates a new version snapshot.',
    },
    {
      q: 'What downloadable file formats do you provide?',
      a: 'Every completed book compiles on demand into two standard formats: a high-resolution, print-ready PDF with typographic margins and page numbers, and a standard EPUB3 file compatible with Apple Books, Kindle, Kobo, and e-readers.',
    },
    {
      q: 'How does BookGenie ensure character consistency across illustrations?',
      a: 'For children’s and illustrated books, BookGenie automatically crafts an internal Character Bible (specifying species, clothing, color palette, and personality). This bible is injected into image prompts so characters look consistent throughout.',
    },
    {
      q: 'Are my books and uploads private?',
      a: 'Yes. All uploads, book drafts, and assets are stored in private, encrypted buckets. Other users cannot view or access your books unless you explicitly generate a private sharing link.',
    },
    {
      q: 'Can I cancel or switch my plan at any time?',
      a: 'Yes. You can manage, upgrade, or cancel your subscription at any time with a single click from your account settings. There are no long-term contracts or cancellation fees.',
    },
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
        <Header />

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F3EA] text-[#8C5F2E] border border-[#E8DCCB] text-[11px] font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Frequently Asked Questions
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A1612] tracking-tight mb-4">
              Everything You Need to Know
            </h1>
            <p className="text-sm sm:text-base text-[#6B635B]">
              Common questions regarding AI generation, licensing, formats, and customization.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4 mb-16">
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-[#EFECE6] overflow-hidden transition-colors shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-[#1A1612] hover:text-[#9A6F3C] transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#9E968E] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#9A6F3C]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-[#6B635B] leading-relaxed border-t border-[#F4F1EA] pt-4">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-3xl bg-white border border-[#EFECE6] p-8 text-center shadow-xs">
            <h3 className="text-xl font-serif font-bold text-[#1A1612] mb-1">
              Still have questions?
            </h3>
            <p className="text-xs sm:text-sm text-[#6B635B] mb-4">
              Our support team is always ready to assist your creative journey.
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
