'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { FloatingEditDock } from '@/components/reader/FloatingEditDock';
import { MonogramLogo } from '@/components/brand/MonogramLogo';
import type { BookDocument, BookPageDocument } from '@/lib/book/types';

interface BookReaderClientProps {
  initialBook: BookDocument;
  bookId: string;
}

export function BookReaderClient({ initialBook, bookId }: BookReaderClientProps) {
  const [book, setBook] = useState<BookDocument>(initialBook);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [paperTheme, setPaperTheme] = useState<'ivory' | 'linen' | 'charcoal'>('ivory');
  const [fontFamily, setFontFamily] = useState<'garamond' | 'modern'>('garamond');

  // Keyboard navigation: ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPageIndex > 0) {
        setCurrentPageIndex((prev) => prev - 1);
      } else if (e.key === 'ArrowRight' && currentPageIndex < book.pages.length - 1) {
        setCurrentPageIndex((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [book.pages.length, currentPageIndex]);

  const handlePrevPage = () => {
    if (currentPageIndex > 0) setCurrentPageIndex((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPageIndex < book.pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handleRegenerate = async (instruction: string, targetPage?: number) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/books/${bookId}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction,
          targetPageNumbers: targetPage ? [targetPage] : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBook(data.book);
      }
    } catch (err) {
      console.error('Revision error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNextPage();
    } else if (diff < -50) {
      handlePrevPage();
    }
    setTouchStartX(null);
  };

  const handleShare = async () => {
    let shareUrl = `${window.location.origin}/shared/${book?.shareToken || bookId}`;

    try {
      const res = await fetch(`/api/books/${bookId}/share`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.shareUrl) {
          shareUrl = data.shareUrl;
          setBook({ ...book, isShared: true, shareToken: data.shareToken });
        }
      }
    } catch (shareErr) {
      console.warn('Share token creation notice:', shareErr);
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: book?.title || 'BookGenie Publication',
          text: `Read "${book?.title}" created with BookGenie AI`,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled
      }
    }
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const activePage: BookPageDocument = book.pages[currentPageIndex] || book.pages[0];
  const totalPages = book.pages.length;

  const paperClasses = {
    ivory: 'bg-[#FAF7F0] text-[#1A1612] border-[#E8DFC8]',
    linen: 'bg-[#FCFBF9] text-[#18181B] border-[#E5E5EA]',
    charcoal: 'bg-[#1E1E24] text-[#E4E1E6] border-[#33333F]',
  }[paperTheme];

  return (
    <div
      className="min-h-screen flex flex-col bg-surface-container dark:bg-[#0e0e14] text-on-surface dark:text-[#f1effa] relative overflow-x-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Atelier Top Sub-Header Toolbar */}
      <header className="sticky top-0 z-30 w-full bg-surface-container-lowest/95 dark:bg-[#121217]/95 backdrop-blur-md border-b border-surface-container-highest dark:border-white/10 px-4 sm:px-8 h-16 flex items-center justify-between shadow-xs">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 text-xs font-label-ui text-on-surface-variant hover:text-on-surface dark:hover:text-white transition-colors py-1.5 px-3 rounded-full border border-surface-container-highest dark:border-white/10 bg-surface-container-low dark:bg-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Studio</span>
          </Link>

          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-secondary dark:bg-[#fcba64] shrink-0" />
            <h1 className="font-headline-sm text-[15px] sm:text-[16px] text-primary dark:text-[#f1effa] truncate max-w-[140px] sm:max-w-xs">
              {book.title}
            </h1>
            <span className="text-outline-variant font-code-spec text-code-spec hidden sm:inline">/</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 truncate hidden sm:inline">
              Chapter {activePage.chapterIndex || 1}
            </span>
          </div>

          <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-surface-container dark:bg-white/10 font-label-caps text-[10px] text-secondary dark:text-[#fcba64] uppercase tracking-wider">
            Proof Rev. {book.versionNumber || 1}
          </span>
        </div>

        {/* Right Controls: Paper substrate, Font, Share, Export */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Paper Substrate Switcher */}
          <div className="hidden sm:flex items-center bg-surface-container dark:bg-white/5 rounded-full p-1 gap-1 border border-surface-container-highest dark:border-white/10">
            <button
              onClick={() => setPaperTheme('ivory')}
              className={`w-5 h-5 rounded-full bg-[#FAF7F0] shadow-2xs transition-all ${
                paperTheme === 'ivory' ? 'ring-2 ring-secondary dark:ring-[#fcba64] scale-110' : ''
              }`}
              title="Crisp Ivory Paper"
            />
            <button
              onClick={() => setPaperTheme('linen')}
              className={`w-5 h-5 rounded-full bg-[#FCFBF9] shadow-2xs transition-all ${
                paperTheme === 'linen' ? 'ring-2 ring-secondary dark:ring-[#fcba64] scale-110' : ''
              }`}
              title="Linen White Paper"
            />
            <button
              onClick={() => setPaperTheme('charcoal')}
              className={`w-5 h-5 rounded-full bg-[#1E1E24] shadow-2xs transition-all ${
                paperTheme === 'charcoal' ? 'ring-2 ring-secondary dark:ring-[#fcba64] scale-110' : ''
              }`}
              title="Muted Charcoal Paper"
            />
          </div>

          {/* Font Typeface Switcher */}
          <div className="hidden md:flex items-center bg-surface-container dark:bg-white/5 rounded-full p-0.5 border border-surface-container-highest dark:border-white/10">
            <button
              onClick={() => setFontFamily('garamond')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-label-ui transition-all ${
                fontFamily === 'garamond'
                  ? 'bg-primary dark:bg-white text-on-primary dark:text-black shadow-xs font-semibold'
                  : 'text-on-surface-variant dark:text-neutral-400'
              }`}
            >
              Garamond
            </button>
            <button
              onClick={() => setFontFamily('modern')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-label-ui transition-all ${
                fontFamily === 'modern'
                  ? 'bg-primary dark:bg-white text-on-primary dark:text-black shadow-xs font-semibold'
                  : 'text-on-surface-variant dark:text-neutral-400'
              }`}
            >
              Modern
            </button>
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-surface-container-highest dark:border-white/10 bg-surface-container-lowest dark:bg-white/5 hover:bg-surface-container dark:hover:bg-white/10 text-xs font-label-ui text-on-surface dark:text-[#f1effa] transition-all shadow-xs cursor-pointer"
          >
            {copySuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-secondary dark:text-[#fcba64]" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* PDF Download */}
          <a
            href={`/api/books/${bookId}/export?format=pdf`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-surface-container-highest dark:border-white/10 bg-surface-container-lowest dark:bg-white/5 hover:bg-surface-container dark:hover:bg-white/10 text-xs font-label-ui text-on-surface dark:text-[#f1effa] transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-secondary dark:text-[#fcba64]" />
            <span className="hidden sm:inline">Download</span> PDF
          </a>

          {/* EPUB Download */}
          <a
            href={`/api/books/${bookId}/export?format=epub`}
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary dark:bg-white text-on-primary dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 text-xs font-label-ui font-semibold shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5 text-secondary-container dark:text-amber-600" />
            <span className="hidden sm:inline">Download</span> EPUB
          </a>
        </div>
      </header>

      {/* Main Digital Reader Arena */}
      <main className="flex-1 flex flex-col items-center justify-between p-4 sm:p-8 max-w-5xl mx-auto w-full">
        {/* Folio Leaf Container */}
        <div
          className={`relative w-full max-w-3xl min-h-[580px] sm:min-h-[640px] rounded-2xl border shadow-2xl p-6 sm:p-14 flex flex-col justify-between my-auto transition-all ${paperClasses} ${
            fontFamily === 'garamond' ? 'font-serif' : 'font-sans'
          }`}
        >
          {isUpdating && (
            <div className="absolute inset-0 bg-surface-container-lowest/80 dark:bg-black/80 backdrop-blur-xs rounded-2xl z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-full bg-surface-container dark:bg-white/10 text-secondary dark:text-[#fcba64] flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <span className="text-sm font-headline-sm font-bold mb-1">
                Refining Leaf {activePage.pageNumber}...
              </span>
              <p className="font-body-sm text-xs opacity-75">
                Executing precision typographical revision.
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activePage.pageNumber}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col justify-between"
            >
              {/* Top Running Header */}
              <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-8 font-code-spec text-[11px] opacity-75 uppercase tracking-widest">
                <span className="truncate max-w-[200px]">
                  {book.title} • {activePage.pageType === 'cover' ? 'Frontispiece' : `Chapter ${activePage.chapterIndex || 1}`}
                </span>
                <span className="font-semibold">Folio {activePage.pageNumber}</span>
              </div>

              {/* Main Reading Flow */}
              <div className="space-y-5 my-auto">
                {activePage.title && (
                  <div className="text-center mb-8">
                    <span className="font-label-caps text-label-caps text-secondary dark:text-[#fcba64] uppercase tracking-widest block mb-1">
                      {activePage.pageType === 'cover' ? 'Master Edition' : `Chapter ${activePage.chapterIndex || 1}`}
                    </span>
                    <h2 className="font-headline-md text-headline-md tracking-tight leading-tight">
                      {activePage.title}
                    </h2>
                  </div>
                )}

                {activePage.blocks.map((block, bIdx) => {
                  if (block.type === 'heading') {
                    return (
                      <h3
                        key={block.id}
                        className="font-headline-sm text-headline-sm mt-6 mb-3 tracking-tight"
                      >
                        {block.text}
                      </h3>
                    );
                  }
                  if (block.type === 'quote') {
                    return (
                      <blockquote
                        key={block.id}
                        className="border-l-2 border-secondary dark:border-[#fcba64] pl-5 py-2 my-4 text-base italic opacity-90"
                      >
                        {block.text}
                      </blockquote>
                    );
                  }
                  if (block.type === 'paragraph') {
                    const text = block.text || '';
                    const isFirstParagraph = bIdx === 0 || (bIdx === 1 && activePage.title);
                    return (
                      <p
                        key={block.id}
                        className="text-[16px] sm:text-[17px] leading-[29px] text-justify tracking-[-0.005em]"
                      >
                        {isFirstParagraph && text.length > 20 ? (
                          <>
                            <span className="float-left text-[52px] leading-[44px] pt-1 pr-3 font-serif font-medium text-primary dark:text-[#fcba64] select-none">
                              {text.charAt(0)}
                            </span>
                            <span>{text.slice(1)}</span>
                          </>
                        ) : (
                          text
                        )}
                      </p>
                    );
                  }
                  if (block.type === 'list' && block.items) {
                    return (
                      <ul
                        key={block.id}
                        className="space-y-2 text-sm sm:text-base my-4 pl-4"
                      >
                        {block.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="text-secondary dark:text-[#fcba64] font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (block.type === 'image') {
                    const imgUrl =
                      (block as any).url ||
                      (block as any).imageUrl ||
                      (activePage.pageType === 'cover' ? book.coverUrl : undefined);
                    return (
                      <div
                        key={block.id}
                        className="my-6 p-3 sm:p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col items-center text-center overflow-hidden"
                      >
                        {imgUrl ? (
                          <div className="w-full rounded-lg overflow-hidden mb-2 max-h-72 sm:max-h-84 flex items-center justify-center bg-black/5 dark:bg-white/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={block.caption || 'Plate Illustration'}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 text-secondary dark:text-[#fcba64] flex items-center justify-center mb-2 shadow-2xs">
                            <BookOpen className="w-5 h-5 stroke-[1.8]" />
                          </div>
                        )}
                        <span className="font-label-caps text-label-caps text-secondary dark:text-[#fcba64] uppercase tracking-wider mb-0.5">
                          {block.caption ? 'Illustrated Plate' : 'Editorial Plate'}
                        </span>
                        <p className="font-body-sm text-[12px] opacity-80 italic max-w-sm">
                          {block.caption || 'Archival plate synthesized for this leaf'}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Bottom Archival Folio Guide */}
              <div className="pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between font-code-spec text-[11px] opacity-75">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#fcba64]" />
                  <span>Knuth-Plass Balanced</span>
                </span>
                <span>Signature A • Sheet {activePage.pageNumber}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Clean Center Paginated Navigation Controls */}
        <div className="flex items-center gap-6 mt-6 pb-20 select-none">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            aria-label="Previous page"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-label-ui font-semibold text-on-surface dark:text-[#f1effa] disabled:opacity-30 disabled:cursor-not-allowed hover:text-secondary dark:hover:text-[#fcba64] transition-colors min-h-[44px] min-w-[44px] justify-center cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-300 px-4 py-1.5 bg-surface-container-lowest dark:bg-[#1a1b22] rounded-full border border-surface-container-highest dark:border-white/10 shadow-xs">
            Folio {activePage.pageNumber} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPageIndex === totalPages - 1}
            aria-label="Next page"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-label-ui font-semibold text-on-surface dark:text-[#f1effa] disabled:opacity-30 disabled:cursor-not-allowed hover:text-secondary dark:hover:text-[#fcba64] transition-colors min-h-[44px] min-w-[44px] justify-center cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Floating Natural Language AI Edit Dock */}
      <FloatingEditDock
        currentPageNumber={activePage.pageNumber}
        totalPages={totalPages}
        onRegenerate={handleRegenerate}
        isUpdating={isUpdating}
        versionNumber={book.versionNumber || 1}
      />
    </div>
  );
}
