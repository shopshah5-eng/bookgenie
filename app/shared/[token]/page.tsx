'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Sparkles,
  ArrowRight,
  Loader2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { BookDocument, BookPageDocument } from '@/lib/book/types';

export default function SharedBookPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  const [book, setBook] = useState<BookDocument | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  // Touch swipe tracking coordinates
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Fetch sanitized public BookDocument
  useEffect(() => {
    const fetchSharedBook = async () => {
      try {
        const res = await fetch(`/api/shared/${token}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data);
        }
      } catch (err) {
        console.error('Failed to load shared book:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedBook();
  }, [token]);

  // Keyboard navigation: ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!book) return;
      if (e.key === 'ArrowLeft' && currentPageIndex > 0) {
        setCurrentPageIndex((prev) => prev - 1);
      } else if (e.key === 'ArrowRight' && currentPageIndex < book.pages.length - 1) {
        setCurrentPageIndex((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [book, currentPageIndex]);

  const handlePrevPage = () => {
    if (currentPageIndex > 0) setCurrentPageIndex((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (book && currentPageIndex < book.pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  // Touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      // Swiped left -> next page
      handleNextPage();
    } else if (diff < -50) {
      // Swiped right -> prev page
      handlePrevPage();
    }
    setTouchStartX(null);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: book?.title || 'BookGenie Edition',
          text: `Read "${book?.title}" created with BookGenie AI`,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or unsupported
      }
    }
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#9A6F3C] mb-3" />
        <p className="text-sm font-serif italic text-[#6B635B]">
          Opening shared publication...
        </p>
      </div>
    );
  }

  if (!book || !book.pages || book.pages.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#1A1612] mb-2">
          Publication Not Found
        </h2>
        <p className="text-sm text-[#6B635B] mb-6 max-w-md">
          This shared publication may have been set to private, expired, or does not exist.
        </p>
        <Link href="/">
          <Button variant="primary">Explore BookGenie</Button>
        </Link>
      </div>
    );
  }

  const activePage: BookPageDocument = book.pages[currentPageIndex] || book.pages[0];
  const totalPages = book.pages.length;

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F8F5EE] text-[#1A1612] relative overflow-x-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Editorial Header */}
      <header className="sticky top-0 z-30 w-full bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EFECE6] px-4 sm:px-8 h-18 flex items-center justify-between shadow-2xs">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#F8F3EA] text-[#8C5F2E] border border-[#E8DCCB] flex items-center justify-center shadow-2xs">
            <BookOpen className="w-4.5 h-4.5 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-serif font-bold text-[#1A1612] tracking-tight group-hover:text-[#9A6F3C] transition-colors">
              BookGenie
            </span>
            <span className="text-[10px] text-[#9E968E] uppercase tracking-wider">
              Public Reader
            </span>
          </div>
        </Link>

        {/* Center: Book Title (Desktop) */}
        <div className="hidden lg:flex flex-col items-center text-center">
          <h1 className="text-sm font-bold font-serif text-[#1A1612] truncate max-w-sm">
            {book.title}
          </h1>
          <span className="text-[10px] text-[#9E968E]">
            {book.bookType} • {totalPages} pages • {book.language}
          </span>
        </div>

        {/* Right Actions: Share, Download, Create */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={handleShare}
            aria-label="Share this book"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#EFECE6] bg-white hover:bg-[#FDFBF7] text-xs font-semibold text-[#1A1612] transition-all shadow-2xs min-h-[40px]"
          >
            {copySuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#9A6F3C]" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          <a
            href={`/api/books/${book.id}/export?format=pdf`}
            download
            aria-label="Download PDF"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#EFECE6] bg-white hover:bg-[#FDFBF7] text-xs font-semibold text-[#1A1612] transition-all shadow-2xs min-h-[40px]"
          >
            <Download className="w-3.5 h-3.5 text-[#9A6F3C]" />
            <span className="hidden sm:inline">Download</span> PDF
          </a>

          <Link href="/create">
            <Button variant="primary" className="text-xs px-3.5 py-2 min-h-[40px]">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>Create Free</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Digital Reader Arena */}
      <main className="flex-1 flex flex-col items-center justify-between p-4 sm:p-8 max-w-4xl mx-auto w-full">
        {/* Book Title on Mobile */}
        <div className="lg:hidden text-center mb-4">
          <h2 className="text-base font-serif font-bold text-[#1A1612]">
            {book.title}
          </h2>
          <span className="text-xs text-[#9E968E]">
            {book.bookType} • {totalPages} pages
          </span>
        </div>

        {/* Centered High-Resolution Book Page Presentation Card */}
        <div className="relative w-full max-w-2xl min-h-[520px] sm:min-h-[580px] bg-white rounded-3xl border border-[#E8DFC8] shadow-[0_16px_50px_rgba(45,38,32,0.06)] p-6 sm:p-12 flex flex-col justify-between my-auto transition-all">
          {/* Subtle Paper Texture Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#9A6F3C]/40 via-[#9A6F3C]/80 to-[#9A6F3C]/40 rounded-t-3xl" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activePage.pageNumber}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col justify-between"
            >
              {/* Header / Chapter Label */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F4F1EA] mb-6 text-xs text-[#9E968E]">
                <span className="font-serif italic text-[#8C5F2E]">
                  {book.title}
                </span>
                <span className="font-mono text-[11px]">
                  Page {activePage.pageNumber}
                </span>
              </div>

              {/* Main Page Blocks */}
              <div className="space-y-4 my-auto">
                {activePage.title && (
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1A1612] leading-tight">
                    {activePage.title}
                  </h3>
                )}

                {activePage.blocks.map((block) => {
                  if (block.type === 'heading') {
                    return (
                      <h4
                        key={block.id}
                        className="font-serif font-bold text-lg sm:text-xl text-[#1A1612] mt-4 mb-2"
                      >
                        {block.text}
                      </h4>
                    );
                  }
                  if (block.type === 'quote') {
                    return (
                      <blockquote
                        key={block.id}
                        className="border-l-3 border-[#9A6F3C] pl-4 py-1 my-3 text-sm sm:text-base font-serif italic text-[#6B635B] bg-[#FBF9F4] rounded-r-xl"
                      >
                        {block.text}
                      </blockquote>
                    );
                  }
                  if (block.type === 'paragraph') {
                    return (
                      <p
                        key={block.id}
                        className="text-sm sm:text-base text-[#2D2620] leading-relaxed font-normal"
                      >
                        {block.text}
                      </p>
                    );
                  }
                  if (block.type === 'list' && block.items) {
                    return (
                      <ul
                        key={block.id}
                        className="space-y-2 text-xs sm:text-sm text-[#2D2620] my-3 pl-2"
                      >
                        {block.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#9A6F3C] font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (block.type === 'image') {
                    const imgUrl = (block as any).url || (block as any).imageUrl || (activePage.pageType === 'cover' ? book.coverUrl : undefined);
                    return (
                      <div
                        key={block.id}
                        className="my-5 p-3 sm:p-4 rounded-2xl bg-[#F8F4EC] border border-[#EAE1D0] flex flex-col items-center text-center overflow-hidden"
                      >
                        {imgUrl ? (
                          <div className="w-full rounded-xl overflow-hidden mb-2 max-h-72 sm:max-h-80 flex items-center justify-center bg-stone-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={block.caption || 'Book illustration'}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white text-[#8C5F2E] flex items-center justify-center mb-2 shadow-2xs">
                            <BookOpen className="w-5 h-5 stroke-[1.8]" />
                          </div>
                        )}
                        <span className="text-xs font-semibold text-[#8C5F2E] mb-0.5">
                          {block.caption ? 'Illustration' : 'Illustrated Artwork'}
                        </span>
                        <p className="text-[11px] text-[#6B635B] italic max-w-sm">
                          {block.caption || 'Scene artwork generated for this chapter'}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Page Footer */}
              <div className="pt-4 border-t border-[#F4F1EA] flex items-center justify-between text-xs text-[#9E968E]">
                <span>Chapter {activePage.chapterIndex || 1}</span>
                <span className="font-serif italic text-[#8C5F2E]">
                  BookGenie Public Reader
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Clean Center Paginated Navigation Controls: Previous | Page X of Y | Next */}
        <div className="flex items-center gap-6 mt-6 pb-12 select-none">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            aria-label="Previous page"
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1A1612] disabled:text-[#C5BEB3] disabled:cursor-not-allowed hover:text-[#9A6F3C] transition-colors min-h-[44px] min-w-[44px] justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs sm:text-sm font-semibold text-[#6B635B] px-3 py-1 bg-white rounded-full border border-[#EFECE6] shadow-2xs">
            Page {activePage.pageNumber} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPageIndex === totalPages - 1}
            aria-label="Next page"
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1A1612] disabled:text-[#C5BEB3] disabled:cursor-not-allowed hover:text-[#9A6F3C] transition-colors min-h-[44px] min-w-[44px] justify-center"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Floating CTA Banner for Public Readers */}
      <footer className="w-full bg-[#FDFBF7] border-t border-[#EFECE6] py-3 px-4 text-center">
        <p className="text-xs text-[#6B635B]">
          Want to turn your ideas or notes into a book?{' '}
          <Link href="/create" className="text-[#8C5F2E] font-semibold hover:underline">
            Create your own book with BookGenie AI →
          </Link>
        </p>
      </footer>
    </div>
  );
}
