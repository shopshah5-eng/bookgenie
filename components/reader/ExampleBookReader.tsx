'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { BookDocument } from '@/lib/book/types';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Sparkles, Download } from 'lucide-react';

interface ExampleBookReaderProps {
  book: BookDocument;
}

export function ExampleBookReader({ book }: ExampleBookReaderProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const activePage = book.pages[currentPageIndex] || book.pages[0];
  const totalPages = book.pages.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#111111]">
      {/* Showcase Demo Notice Banner */}
      <div className="bg-[#111111] text-white px-4 py-2.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Interactive Showcase: <strong>{book.title}</strong> ({totalPages} Pages Sample Edition)
            </span>
          </span>
          <Link href={`/create?prompt=A book titled ${encodeURIComponent(book.title)}&type=${book.bookType}`}>
            <span className="underline font-semibold hover:text-amber-300 cursor-pointer">
              Generate a book like this →
            </span>
          </Link>
        </div>
      </div>

      {/* Top Header */}
      <header className="w-full bg-white border-b border-[#EAEAEA] px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link
          href="/examples"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-[#111111] py-1.5 px-3 rounded-lg border border-[#EAEAEA] bg-white shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Examples</span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={`/api/books/${book.id}/export?format=pdf`}
            download
            className="inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-[#EAEAEA] bg-white hover:bg-[#F9F9F8] shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#9A6F3C]" />
            <span className="hidden sm:inline">Download Sample PDF</span>
            <span className="sm:hidden">PDF</span>
          </a>

          <Link href="/create">
            <Button variant="primary" size="sm" className="bg-[#111111] hover:bg-[#222222] text-white">
              Create Your Book <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Reader Body */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-8 flex flex-col justify-between my-auto">
        <div className="relative w-full bg-white rounded-2xl border border-[#EAEAEA] p-6 sm:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[500px]">
          {/* Top reader metadata */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F0EE] mb-6 text-xs text-[#888888]">
            <span className="font-serif italic text-[#111111]">{book.title}</span>
            <span className="font-semibold text-[#555555] bg-[#F5F5F3] px-2.5 py-1 rounded-full border border-[#EAEAEA]">
              Page {activePage.pageNumber} of {totalPages}
            </span>
          </div>

          <div className="space-y-4 my-auto">
            {activePage.pageType === 'cover' && book.coverUrl && (
              <div className="relative aspect-[3/4] max-w-[220px] mx-auto rounded-lg overflow-hidden shadow-md border border-[#EAEAEA] mb-6">
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Accessible H1 on the reader page */}
            {activePage.pageType === 'cover' ? (
              <div className="text-center space-y-2 mb-6">
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#111111]">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <p className="text-xs sm:text-sm text-[#666666] font-medium max-w-md mx-auto">
                    {book.subtitle}
                  </p>
                )}
              </div>
            ) : (
              activePage.title && (
                <h1 className="font-serif font-bold text-2xl text-[#111111]">
                  {activePage.title}
                </h1>
              )
            )}

            {activePage.blocks.map((b) => {
              if (b.type === 'heading') {
                return (
                  <h2 key={b.id} className="font-serif font-bold text-xl text-[#111111] mt-4">
                    {b.text}
                  </h2>
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
                  <blockquote key={b.id} className="border-l-2 border-[#111111] pl-4 py-1 italic text-[#555555] bg-[#F9F9F8] rounded-r-sm">
                    {b.text}
                  </blockquote>
                );
              }
              if (b.type === 'list' && b.items) {
                return (
                  <ul key={b.id} className="space-y-1.5 text-sm text-[#2D2620]">
                    {b.items.map((it, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#111111]">•</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (b.type === 'image') {
                return (
                  <div key={b.id} className="my-4 p-4 rounded-xl bg-[#F8F8F6] border border-[#EAEAEA] text-center">
                    <span className="text-xs font-semibold text-[#555555]">
                      [Illustration: {b.caption || 'Storybook illustration'}]
                    </span>
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div className="pt-4 border-t border-[#F0F0EE] flex items-center justify-between text-xs text-[#888888] mt-8">
            <span>{book.title} • {totalPages} Pages Preview</span>
            <span className="font-serif italic text-[#111111]">BookGenie Studio</span>
          </div>
        </div>

        {/* Page Nav Controls */}
        <nav aria-label="Book page navigation" className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={() => setCurrentPageIndex((p) => Math.max(p - 1, 0))}
            disabled={currentPageIndex === 0}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#111111] disabled:opacity-30 hover:text-[#9A6F3C] transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-xs sm:text-sm font-semibold text-[#555555] px-4 py-1.5 bg-white rounded-full border border-[#EAEAEA] shadow-2xs">
            Page {activePage.pageNumber} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPageIndex((p) => Math.min(p + 1, totalPages - 1))}
            disabled={currentPageIndex === totalPages - 1}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#111111] disabled:opacity-30 hover:text-[#9A6F3C] transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      </main>
    </div>
  );
}
