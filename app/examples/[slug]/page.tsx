'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { getOceanWondersDemoBook } from '@/app/api/books/[id]/route';
import { Button } from '@/components/ui/Button';
import { BookOpen, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Sparkles, Download } from 'lucide-react';

export default function ExampleBookPreview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const book = getOceanWondersDemoBook();
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);

  const activePage = book.pages[currentPageIndex] || book.pages[0];
  const totalPages = book.pages.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EE] text-[#1A1612]">
      {/* Showcase Demo Notice Banner */}
      <div className="bg-[#9A6F3C] text-white px-4 py-2.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>
              Curated Sample Preview: <strong>{book.title}</strong> (4 of 28 Pages · Read-Only Demonstration)
            </span>
          </span>
          <Link href="/create?prompt=Create a children's book like Ocean Wonders">
            <span className="underline font-bold hover:text-amber-200 cursor-pointer">
              Generate a book like this →
            </span>
          </Link>
        </div>
      </div>

      {/* Top Header */}
      <header className="w-full bg-[#FDFBF7] border-b border-[#EFECE6] px-4 sm:px-8 h-18 flex items-center justify-between">
        <Link
          href="/examples"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B635B] hover:text-[#1A1612] py-1.5 px-3 rounded-xl border border-[#EFECE6] bg-white shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Examples</span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href="/api/books/demo-ocean-wonders/export?format=pdf"
            download
            className="inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border border-[#EFECE6] bg-white hover:bg-[#FDFBF7] shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#9A6F3C]" />
            <span>Download Sample PDF</span>
          </a>

          <Link href="/create">
            <Button variant="primary" size="sm">
              Create Your Own Book <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Reader Body */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-8 flex flex-col justify-between my-auto">
        <div className="relative w-full bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-12 shadow-[0_16px_50px_rgba(45,38,32,0.06)] flex flex-col justify-between min-h-[480px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4F1EA] mb-6 text-xs text-[#9E968E]">
            <span className="font-serif italic text-[#8C5F2E]">{book.title}</span>
            <span className="font-semibold text-[#6B635B] bg-[#F5EFE6] px-2.5 py-1 rounded-full border border-[#E8DFC8]">
              Preview — Page {activePage.pageNumber} of 28 (Showcase Excerpt)
            </span>
          </div>

          <div className="space-y-4 my-auto">
            {activePage.title && (
              <h2 className="font-serif font-bold text-2xl text-[#1A1612]">
                {activePage.title}
              </h2>
            )}

            {activePage.blocks.map((b) => {
              if (b.type === 'heading') {
                return (
                  <h3 key={b.id} className="font-serif font-bold text-xl text-[#1A1612]">
                    {b.text}
                  </h3>
                );
              }
              if (b.type === 'paragraph') {
                return (
                  <p key={b.id} className="text-sm sm:text-base text-[#2D2620] leading-relaxed">
                    {b.text}
                  </p>
                );
              }
              if (b.type === 'quote') {
                return (
                  <blockquote key={b.id} className="border-l-3 border-[#9A6F3C] pl-4 py-1 italic text-[#6B635B] bg-[#FBF9F4] rounded-r-lg">
                    {b.text}
                  </blockquote>
                );
              }
              if (b.type === 'list' && b.items) {
                return (
                  <ul key={b.id} className="space-y-1.5 text-sm text-[#2D2620]">
                    {b.items.map((it, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#9A6F3C]">•</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (b.type === 'image') {
                return (
                  <div key={b.id} className="my-4 p-4 rounded-2xl bg-[#F8F4EC] border border-[#EAE1D0] text-center">
                    <span className="text-xs font-semibold text-[#8C5F2E]">
                      [Illustration: {b.caption || 'Ocean coral reef scene'}]
                    </span>
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div className="pt-4 border-t border-[#F4F1EA] flex items-center justify-between text-xs text-[#9E968E]">
            <span>Ocean Wonders • Curated 4-Page Showcase Excerpt (Full Book: 28 Pages)</span>
            <span className="font-serif italic text-[#8C5F2E]">BookGenie Studio</span>
          </div>
        </div>

        {/* Page Nav Controls */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={() => setCurrentPageIndex((p) => Math.max(p - 1, 0))}
            disabled={currentPageIndex === 0}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1A1612] disabled:opacity-40 hover:text-[#9A6F3C] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-xs sm:text-sm font-semibold text-[#6B635B] px-4 py-1.5 bg-white rounded-full border border-[#EFECE6] shadow-2xs">
            Preview — Page {activePage.pageNumber} of 28 (Showcase Excerpt {currentPageIndex + 1}/4)
          </span>
          <button
            onClick={() => setCurrentPageIndex((p) => Math.min(p + 1, totalPages - 1))}
            disabled={currentPageIndex === totalPages - 1}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1A1612] disabled:opacity-40 hover:text-[#9A6F3C] transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
