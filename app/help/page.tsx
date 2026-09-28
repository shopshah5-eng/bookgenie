'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { MinimalFooter } from '@/components/home/MinimalFooter';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Search, ChevronDown, ChevronUp, BookOpen, HelpCircle } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Getting Started',
  'Creating a Book',
  'Editing Your Book',
  'Downloads',
  'Account & Billing',
  'My eBooks',
];

const FAQS = [
  {
    category: 'Creating a Book',
    q: 'How do I create an eBook?',
    a: 'Simply enter your book prompt or creative idea on the BookGenie homepage, select your desired number of pages, and click "Generate Your eBook". BookGenie will structure your chapters, write the content, render cover artwork, and compile your publication.',
  },
  {
    category: 'Creating a Book',
    q: 'How long does book creation take?',
    a: 'Book creation typically takes between 2 to 4 minutes depending on the requested page count, chapter scale, and illustration complexity.',
  },
  {
    category: 'Editing Your Book',
    q: 'Can I change my book after it is created?',
    a: 'Yes. Once your book finishes, you are taken directly to the Preview & Edit studio. You can describe changes in natural language (e.g., "Change the cover style", "Make the main character a girl", "Add more details to Chapter 2") and BookGenie will update the affected content and visuals.',
  },
  {
    category: 'Downloads',
    q: 'Can I download my book as PDF?',
    a: 'Yes. Every generated book can be downloaded as an editorial-grade, print-ready PDF with high-resolution typography and layout composition.',
  },
  {
    category: 'Downloads',
    q: 'Can I download my book as EPUB?',
    a: 'Yes. BookGenie produces valid EPUB3 digital files formatted for Apple Books, Amazon Kindle, Kobo, and standard e-readers.',
  },
  {
    category: 'My eBooks',
    q: 'Where can I find my previous books?',
    a: 'All books you have generated are saved in your account and accessible anytime under "My eBooks" in the top navigation.',
  },
  {
    category: 'Getting Started',
    q: 'How does page count work?',
    a: 'You can choose between 10 to 300 pages depending on your plan. BookGenie automatically balances chapter lengths, headings, and illustrations to meet your target page count.',
  },
  {
    category: 'Getting Started',
    q: 'What happens if my generation fails?',
    a: 'If a network interruption or generation error occurs, your prompt and current stage are saved. You can click "Try Again" on the generation screen or retry from your My eBooks dashboard without losing your progress.',
  },
  {
    category: 'Account & Billing',
    q: 'How do I cancel my subscription?',
    a: 'You can manage or cancel your subscription at any time under your profile settings or by contacting our support team. You will retain access through the end of your billing cycle.',
  },
  {
    category: 'Account & Billing',
    q: 'How do I request a refund?',
    a: 'Please visit our Refund Policy page or message us via the Contact page with your account email and transaction details. We review and process valid refund requests promptly.',
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesQuery =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans antialiased">
      <MinimalHeader />

        <main className="flex-1 max-w-[1240px] w-full mx-auto px-6 pt-12 sm:pt-16 pb-24">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] leading-tight text-[#111111] font-normal tracking-tight mb-3">
              How can we help?
            </h1>
            <p className="text-sm sm:text-base text-[#666666]">
              Find answers about creating, editing, downloading and managing your books.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-md mx-auto mb-10 relative">
            <div className="relative">
              <Search className="w-4 h-4 text-[#888888] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the Help Center..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#EAEAEA] bg-white text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Categories Filter Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white border border-[#EAEAEA] text-[#666666] hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="max-w-3xl mx-auto space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, idx) => {
                const isOpen = expandedIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#EAEAEA] rounded-2xl bg-white overflow-hidden transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                  >
                    <button
                      onClick={() => setExpandedIndex(isOpen ? null : idx)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/50 transition-colors"
                    >
                      <span className="text-[15px] font-semibold text-[#111111] font-sans">
                        {item.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#888888] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#888888] shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-[13px] sm:text-[14px] text-[#666666] leading-relaxed border-t border-[#F5F5F5]">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-14 text-[#888888]">
                <p className="text-sm">No answers found matching your query.</p>
                <Link
                  href="/contact"
                  className="text-xs font-semibold text-[#111111] underline mt-2 inline-block"
                >
                  Contact support directly
                </Link>
              </div>
            )}
          </div>
        </main>

        <MinimalFooter />
      </div>
  );
}
