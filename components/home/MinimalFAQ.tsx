'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface FAQItem {
  id: string;
  q: string;
  a: string;
}

export function MinimalFAQ() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'q-1': false,
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const leftCol: FAQItem[] = [
    {
      id: 'q-1',
      q: 'What is BookGenie?',
      a: 'BookGenie is an autonomous publishing platform that turns your ideas or raw manuscripts into complete, beautifully formatted, and professionally typeset eBooks in minutes.',
    },
    {
      id: 'q-2',
      q: 'Do I own the eBook I generate?',
      a: 'Yes, 100%. You retain full copyright, royalties, and commercial ownership of all text, illustrations, and master files created with BookGenie. Zero royalties or commissions are claimed.',
    },
    {
      id: 'q-3',
      q: 'What file format will I receive?',
      a: 'You can download print-ready 300 DPI vector PDFs and valid reflowable EPUB 3.0 files compatible with Apple Books, Amazon Kindle, and all standard e-readers.',
    },
  ];

  const rightCol: FAQItem[] = [
    {
      id: 'q-4',
      q: 'How does it work?',
      a: "Enter a prompt describing your book topic, set your desired page count, and click generate. BookGenie structures the chapters, writes the manuscript, styles the pages, and delivers a finished publication.",
    },
    {
      id: 'q-5',
      q: 'How does pricing work?',
      a: 'You can start completely free—create and read your first book with 0 credit card required. When you want to publish commercially or scale volume, upgrade to our Pro ($15/mo) or Premium ($39/mo) plans for unlimited downloads, commercial rights, and extended capacities.',
    },
    {
      id: 'q-6',
      q: 'Can I use the eBook for commercial purposes?',
      a: 'Yes. You are free to publish and sell your eBooks on Amazon KDP, Gumroad, your own storefront, or distribute them commercially anywhere you choose.',
    },
  ];

  return (
    <section className="w-full py-20 bg-white" id="faq">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#666666] uppercase block mb-3">
              FAQ
            </span>
            <h2 className="font-serif text-[34px] sm:text-[42px] text-[#111111] leading-tight tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <Link
            href="/faq"
            className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-medium text-[#111111] border border-[#EAEAEA] rounded-full px-4 py-2 hover:border-[#111111] transition-all"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2-Column Accordion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {leftCol.map((item) => {
              const isOpen = !!openIds[item.id];
              return (
                <div
                  key={item.id}
                  className="border border-[#EAEAEA] rounded-xl overflow-hidden bg-white transition-all"
                >
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full p-4.5 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="text-[14px] sm:text-[15px] font-semibold text-[#111111] leading-tight">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#888888] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4.5 sm:px-5 pb-5 pt-1 text-[13px] text-[#666666] leading-relaxed border-t border-[#F5F5F5]">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {rightCol.map((item) => {
              const isOpen = !!openIds[item.id];
              return (
                <div
                  key={item.id}
                  className="border border-[#EAEAEA] rounded-xl overflow-hidden bg-white transition-all"
                >
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full p-4.5 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="text-[14px] sm:text-[15px] font-semibold text-[#111111] leading-tight">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#888888] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4.5 sm:px-5 pb-5 pt-1 text-[13px] text-[#666666] leading-relaxed border-t border-[#F5F5F5]">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View All */}
        <div className="sm:hidden text-center mt-6">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#111111] border border-[#EAEAEA] rounded-full px-5 py-2.5"
          >
            <span>View All Questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
