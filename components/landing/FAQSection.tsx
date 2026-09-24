'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What types of books can BookGenie create?',
      a: 'BookGenie supports a wide range of publication genres including literary & genre fiction, illustrated children’s storybooks, non-fiction guides, instructional workbooks, artisanal cookbooks, poetry collections, and journals. Each format applies dedicated layout math and typography rules tailored to that genre.',
    },
    {
      q: 'Can I upload my own manuscript or existing notes?',
      a: 'Yes. You can paste an outline or upload existing files (.txt, .docx, .md, or .pdf). BookGenie can either act as a structural editor and book designer for your pre-written text, or help you expand rough drafts into polished, publication-ready chapters.',
    },
    {
      q: 'Do I own the full commercial rights to my generated book?',
      a: 'Yes, 100%. You retain full intellectual property and commercial copyright for all generated text, artwork, and exported files. You are free to sell your book on Amazon KDP, Apple Books, your own Shopify store, or through traditional distributors with zero royalties owed to BookGenie.',
    },
    {
      q: 'Are the exported PDFs ready for Amazon KDP and IngramSpark?',
      a: 'Yes. Our export engine compiles print-ready 300 DPI CMYK PDFs with exact trim sizes, gutter margins, and bleed specifications required by print-on-demand services like Amazon KDP, IngramSpark, and Barnes & Noble Press.',
    },
    {
      q: 'How does the 7-stage publishing and quality check work?',
      a: 'The BookGenie pipeline deterministically moves through 7 stages: Input, Plan (blueprint & pacing), Write (multi-tier prose), Art (cohesive visual consistency), Design (typesetting & drop caps), Verify (semantic QC, orphan/widow suppression), and Publish (PDF & EPUB3 packaging). You can inspect and adjust your book at every milestone.',
    },
    {
      q: 'Can I edit and refine chapters after generation?',
      a: 'Absolutely. Inside the BookGenie Studio, you can manually rewrite prose, adjust formatting, request targeted AI revisions on specific paragraphs, or regenerate illustrations until the edition matches your exact vision.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-14 sm:py-20 bg-white dark:bg-[#0A0A0A] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F3F3F1] dark:bg-[#1E1E1E] text-[#666666] dark:text-[#A0A0A0] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mb-3 border border-[#E5E5E5] dark:border-[#2C2C2C]">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            Frequently asked questions.
          </h2>
          <p className="text-sm sm:text-base text-[#666666] dark:text-[#999999] mt-2 font-sans">
            Everything you need to know about formats, ownership, and the publishing pipeline.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#141414] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif font-bold text-sm sm:text-base text-[#111111] dark:text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#666666] dark:text-[#A0A0A0] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-[13px] text-[#555555] dark:text-[#AAAAAA] leading-relaxed border-t border-[#EFEFEF] dark:border-[#222222] pt-4 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Link */}
        <div className="text-center mt-10">
          <p className="text-xs text-[#777777] dark:text-[#888888]">
            Have a custom question or publishing requirement?{' '}
            <Link href="/contact" className="font-semibold text-[#111111] dark:text-white hover:underline inline-flex items-center gap-1">
              <span>Contact our editorial team</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}
