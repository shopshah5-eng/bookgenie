'use client';

import React from 'react';
import Image from 'next/image';
import { BookDocument, BookPageDocument, ContentBlock } from '@/lib/book/types';
import { BookOpen, Sparkles } from 'lucide-react';

interface BookSpreadViewerProps {
  book: BookDocument;
  currentPageIndex: number;
  zoom?: number;
  onPageSelect?: (pageIndex: number) => void;
}

export function BookSpreadViewer({
  book,
  currentPageIndex,
  zoom = 1,
  onPageSelect,
}: BookSpreadViewerProps) {
  const pages = book.pages || [];
  const totalPages = pages.length;

  // If on cover or mobile, we show single page; on desktop when not cover, show spread
  const isCover = currentPageIndex === 0;
  const leftPage = pages[currentPageIndex] || null;
  const rightPage = !isCover && currentPageIndex + 1 < totalPages ? pages[currentPageIndex + 1] : null;

  return (
    <div
      className="w-full h-full flex items-center justify-center p-4 sm:p-8 transition-transform duration-200 select-none overflow-auto"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
    >
      {/* If Cover Page */}
      {isCover ? (
        <div className="relative group max-w-sm sm:max-w-md w-full aspect-[3/4] bg-white rounded-r-xl border border-[#EAEAEA] shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300">
          {/* Spine effect */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/25 via-black/10 to-transparent z-10" />

          {book.coverUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 340px, 460px"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/20" />
              <div className="absolute bottom-10 left-8 right-8 text-white z-10">
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-white/80 block mb-2">
                  Front Cover
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight drop-shadow-sm mb-2">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <p className="text-xs sm:text-sm text-white/90 font-medium">
                    {book.subtitle}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#FDFBF7]">
              <BookOpen className="w-12 h-12 text-[#9A6F3C] mb-4 stroke-[1.5]" />
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#111111] mb-2">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="text-sm text-[#666666] mb-6">{book.subtitle}</p>
              )}
              <span className="text-[11px] font-semibold text-[#888888] tracking-widest uppercase">
                Front Cover
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Open Book Spread (Left & Right Pages) */
        <div className="flex flex-col md:flex-row items-stretch max-w-4xl w-full bg-white rounded-xl border border-[#EAEAEA] shadow-[0_24px_60px_rgba(0,0,0,0.08)] overflow-hidden min-h-[500px] sm:min-h-[580px]">
          {/* Left Page */}
          <div className="flex-1 p-8 sm:p-12 relative flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#F0F0F0] bg-[#FFFFFF] shadow-[inset_-12px_0_15px_-8px_rgba(0,0,0,0.04)]">
            <div className="overflow-y-auto max-h-[500px] pr-2 scrollbar-thin">
              {renderPageContent(leftPage, book)}
            </div>

            {/* Bottom Page Number */}
            <div className="pt-6 border-t border-[#F5F5F5] flex items-center justify-between text-[11px] text-[#999999] font-medium">
              <span className="truncate max-w-[180px]">{book.title}</span>
              <span>Page {leftPage ? leftPage.pageNumber : currentPageIndex + 1}</span>
            </div>
          </div>

          {/* Right Page (If available) */}
          <div className="flex-1 p-8 sm:p-12 relative flex flex-col justify-between bg-[#FFFFFF] shadow-[inset_12px_0_15px_-8px_rgba(0,0,0,0.04)]">
            <div className="overflow-y-auto max-h-[500px] pr-2 scrollbar-thin">
              {rightPage ? (
                renderPageContent(rightPage, book)
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#999999]">
                  <BookOpen className="w-8 h-8 stroke-[1.5] mb-2 opacity-50" />
                  <p className="text-xs">End of Book Publication</p>
                </div>
              )}
            </div>

            {/* Bottom Page Number */}
            <div className="pt-6 border-t border-[#F5F5F5] flex items-center justify-between text-[11px] text-[#999999] font-medium">
              <span>{rightPage ? `Page ${rightPage.pageNumber}` : ''}</span>
              <span className="truncate max-w-[180px]">{book.subtitle || 'BookGenie Edition'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderPageContent(page: BookPageDocument | null, book: BookDocument) {
  if (!page) {
    return (
      <div className="text-center py-20 text-[#888888] text-xs">
        Page content ready
      </div>
    );
  }

  // Cover Page
  if (page.pageType === 'cover') {
    return (
      <div className="text-center py-8">
        <h2 className="font-serif text-2xl font-bold text-[#111111] mb-2">
          {book.title}
        </h2>
        {book.subtitle && (
          <p className="text-sm text-[#666666] mb-6">{book.subtitle}</p>
        )}
      </div>
    );
  }

  // Title Page
  if (page.pageType === 'title') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#888888] mb-4">
          Book Publication
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#111111] mb-3">
          {book.title}
        </h1>
        {book.subtitle && (
          <p className="text-sm text-[#666666] mb-8 italic">{book.subtitle}</p>
        )}
        <div className="w-10 h-[1px] bg-[#EAEAEA] my-4" />
        <span className="text-[11px] text-[#999999]">
          BookGenie Editorial Edition
        </span>
      </div>
    );
  }

  // Standard or Illustrated Content
  return (
    <div className="space-y-4">
      {/* Chapter / Page Title */}
      {page.title && (
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-1">
            Chapter {page.chapterIndex || 1}
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#111111] tracking-tight">
            {page.title}
          </h2>
        </div>
      )}

      {/* Blocks Rendering */}
      {page.blocks && page.blocks.length > 0 ? (
        page.blocks.map((block, idx) => (
          <div key={block.id || idx}>
            {block.type === 'heading' && (
              <h3 className="font-serif text-lg font-semibold text-[#111111] mt-3 mb-1">
                {block.text}
              </h3>
            )}

            {block.type === 'paragraph' && (
              <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#2A2A2A] font-sans">
                {block.text}
              </p>
            )}

            {block.type === 'quote' && (
              <blockquote className="pl-4 border-l-2 border-[#111111] italic text-[13px] text-[#444444] my-3">
                &ldquo;{block.text}&rdquo;
              </blockquote>
            )}

            {block.type === 'image' && (
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-neutral-100 my-3 border border-black/5">
                {block.url ? (
                  <>
                    <Image
                      src={block.url}
                      alt={block.caption || 'Book illustration'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 400px"
                    />
                    {block.caption && (
                      <div className="absolute bottom-1.5 left-2 right-2 text-[10px] text-white/90 drop-shadow-sm bg-black/40 px-2 py-0.5 rounded">
                        {block.caption}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-stone-50 border border-stone-200/60 rounded-lg">
                    <p className="text-xs text-stone-500 font-medium">Illustration asset pending or not generated</p>
                    {block.caption && (
                      <p className="text-[11px] text-stone-400 mt-1 italic">{block.caption}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {block.type === 'bullet_list' && block.items && (
              <ul className="list-disc pl-5 text-[13px] text-[#333333] space-y-1">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p className="text-[13px] leading-relaxed text-[#333333]">
          {page.title || 'Content structured beautifully.'}
        </p>
      )}
    </div>
  );
}
