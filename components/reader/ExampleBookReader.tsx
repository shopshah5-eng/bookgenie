'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { BookDocument } from '@/lib/book/types';
import { Button } from '@/components/ui/Button';
import { MonogramLogo } from '@/components/brand/MonogramLogo';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Sparkles, Download, BookOpen, Layers } from 'lucide-react';

interface ExampleBookReaderProps {
  book: BookDocument;
}

export function ExampleBookReader({ book }: ExampleBookReaderProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [paperTheme, setPaperTheme] = useState<'ivory' | 'linen' | 'charcoal'>('ivory');
  const [fontMode, setFontMode] = useState<'editorial' | 'modern'>('editorial');

  const activePage = book.pages[currentPageIndex] || book.pages[0];
  const totalPages = book.pages.length;

  const themeStyles = {
    ivory: {
      bg: 'bg-[#FDFBF7]',
      card: 'bg-[#FFFFFF] border-[#EFECE6] text-[#1A1612]',
      border: 'border-[#EFECE6]',
      textMuted: 'text-[#7B7369]',
      accent: '#9A6F3C',
    },
    linen: {
      bg: 'bg-[#F4EFE6]',
      card: 'bg-[#FAF6F0] border-[#E5DDCF] text-[#2C241E]',
      border: 'border-[#E5DDCF]',
      textMuted: 'text-[#877869]',
      accent: '#8C5F2E',
    },
    charcoal: {
      bg: 'bg-[#121216]',
      card: 'bg-[#1A1A22] border-[#2E2E3C] text-[#EDEDF2]',
      border: 'border-[#2E2E3C]',
      textMuted: 'text-[#9A9AB0]',
      accent: '#E6C687',
    },
  }[paperTheme];

  return (
    <div className={`min-h-screen flex flex-col ${themeStyles.bg} transition-colors duration-300 font-sans`}>
      {/* Top Banner Notice */}
      <div className="bg-[#121318] text-[#EFECE6] px-4 py-2.5 text-xs font-medium border-b border-white/10">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
            <span className="font-label-caps tracking-wider uppercase text-[11px] text-secondary-fixed">
              Atelier Showcase Gallery
            </span>
            <span className="hidden sm:inline text-white/50">•</span>
            <span className="hidden sm:inline">
              Curated Folio: <strong className="text-white font-title-editorial">{book.title}</strong> ({totalPages} Pages Master Edition)
            </span>
          </span>
          <Link href={`/create?prompt=A book titled ${encodeURIComponent(book.title)}&type=${book.bookType}`}>
            <span className="inline-flex items-center gap-1 font-semibold text-secondary-fixed hover:text-white transition-colors cursor-pointer text-xs">
              Synthesize Similar Folio <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* Top Header */}
      <header className="w-full bg-surface dark:bg-[#15161e] border-b border-outline-variant/30 px-4 sm:px-8 h-16 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/examples"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface py-1.5 px-3 rounded-xl border border-outline-variant/30 bg-surface-container-low transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Showcase</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 border-l border-outline-variant/30 pl-3">
            <MonogramLogo size={22} iconOnly />
            <span className="font-headline-sm text-sm font-bold text-on-surface">BookGenie Atelier</span>
          </div>
        </div>

        {/* Reader Substrate & Typography Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 text-xs">
            <button
              onClick={() => setPaperTheme('ivory')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                paperTheme === 'ivory' ? 'bg-surface shadow-2xs text-on-surface font-semibold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Ivory
            </button>
            <button
              onClick={() => setPaperTheme('linen')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                paperTheme === 'linen' ? 'bg-surface shadow-2xs text-on-surface font-semibold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Linen
            </button>
            <button
              onClick={() => setPaperTheme('charcoal')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                paperTheme === 'charcoal' ? 'bg-[#2A2B35] shadow-2xs text-white font-semibold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Charcoal
            </button>
          </div>

          <button
            onClick={() => setFontMode(f => f === 'editorial' ? 'modern' : 'editorial')}
            className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface-variant hover:text-on-surface font-mono"
            title="Toggle between Playfair Editorial and Modern Sans"
          >
            {fontMode === 'editorial' ? 'Serif' : 'Sans'}
          </button>

          <a
            href={`/api/books/${book.id}/export?format=pdf`}
            download
            className="inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl border border-secondary/30 bg-secondary-container/20 text-secondary dark:text-secondary-fixed hover:bg-secondary-container/30 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Folio</span>
            <span className="sm:hidden">PDF</span>
          </a>

          <Link href="/create">
            <Button variant="primary" size="sm" className="bg-primary hover:bg-primary-hover text-on-primary font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-secondary-fixed" />
              <span>Create Folio</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Reader Body */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8 flex flex-col justify-between my-auto">
        <div className={`relative w-full rounded-3xl border ${themeStyles.border} ${themeStyles.card} p-6 sm:p-14 shadow-2xl flex flex-col justify-between min-h-[580px] transition-all duration-300`}>
          {/* Folio Archival Header */}
          <div className={`flex items-center justify-between pb-4 border-b ${themeStyles.border} mb-8 text-xs font-label-caps uppercase tracking-widest ${themeStyles.textMuted}`}>
            <span className="italic normal-case font-title-editorial tracking-normal text-sm font-semibold">{book.title}</span>
            <span className="font-code-spec px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-current/10">
              Folio {activePage.pageNumber} / {totalPages}
            </span>
          </div>

          <div className="space-y-6 my-auto">
            {activePage.pageType === 'cover' && book.coverUrl && (
              <div className="relative aspect-[3/4] max-w-[240px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 mb-8 transform hover:scale-[1.02] transition-transform">
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Accessible Heading */}
            {activePage.pageType === 'cover' ? (
              <div className="text-center space-y-3 mb-6">
                <span className="font-label-caps text-xs tracking-widest text-secondary uppercase block">
                  BookGenie Atelier Edition
                </span>
                <h1 className={`font-headline-lg text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${fontMode === 'modern' ? 'font-sans' : 'font-serif'}`}>
                  {book.title}
                </h1>
                {book.subtitle && (
                  <p className={`text-sm sm:text-base ${themeStyles.textMuted} font-serif italic max-w-md mx-auto`}>
                    {book.subtitle}
                  </p>
                )}
              </div>
            ) : (
              activePage.title && (
                <div className="mb-6">
                  <span className="font-label-caps text-xs tracking-widest text-secondary uppercase block mb-1">
                    Chapter Folio
                  </span>
                  <h1 className={`font-headline-lg text-2xl sm:text-3xl font-bold tracking-tight ${fontMode === 'modern' ? 'font-sans' : 'font-serif'}`}>
                    {activePage.title}
                  </h1>
                </div>
              )
            )}

            {activePage.blocks.map((b, blockIdx) => {
              if (b.type === 'heading') {
                return (
                  <h2 key={b.id} className={`font-title-editorial text-xl sm:text-2xl font-bold mt-6 ${fontMode === 'modern' ? 'font-sans' : 'font-serif'}`}>
                    {b.text}
                  </h2>
                );
              }
              if (b.type === 'paragraph') {
                const text = b.text || '';
                const isFirstParagraph = blockIdx === 0 && activePage.pageType !== 'cover';
                return (
                  <p key={b.id} className={`text-sm sm:text-base leading-relaxed ${themeStyles.card} border-0 ${fontMode === 'modern' ? 'font-sans' : 'font-serif text-[17px] leading-[1.8]'}`}>
                    {isFirstParagraph && text.length > 0 ? (
                      <>
                        <span className="float-left text-4xl sm:text-5xl leading-none font-serif font-bold mr-2 mt-1 text-secondary">
                          {text.charAt(0)}
                        </span>
                        {text.slice(1)}
                      </>
                    ) : (
                      text
                    )}
                  </p>
                );
              }
              if (b.type === 'quote') {
                return (
                  <blockquote key={b.id} className={`border-l-2 border-secondary pl-5 py-2 italic ${themeStyles.textMuted} bg-black/5 dark:bg-white/5 rounded-r-xl my-4 font-serif`}>
                    "{b.text}"
                  </blockquote>
                );
              }
              if (b.type === 'list' && b.items) {
                return (
                  <ul key={b.id} className="space-y-2 text-sm sm:text-base pl-2">
                    {b.items.map((it, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-secondary font-bold">•</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (b.type === 'image') {
                return (
                  <div key={b.id} className={`my-6 p-6 rounded-2xl bg-black/5 dark:bg-white/5 border ${themeStyles.border} text-center`}>
                    <span className="font-label-caps text-xs tracking-wider text-secondary">
                      [Archival Plate: {b.caption || 'Illustration Plate'}]
                    </span>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Archival Folio Footer */}
          <div className={`pt-4 border-t ${themeStyles.border} flex items-center justify-between text-xs font-code-spec ${themeStyles.textMuted} mt-10`}>
            <span>{book.title} • {totalPages} Pages Registered</span>
            <span className="font-title-editorial italic normal-case text-sm">BookGenie Atelier</span>
          </div>
        </div>

        {/* Page Nav Controls */}
        <nav aria-label="Book page navigation" className="flex items-center justify-between max-w-sm mx-auto w-full mt-6">
          <button
            onClick={() => setCurrentPageIndex((p) => Math.max(p - 1, 0))}
            disabled={currentPageIndex === 0}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-on-surface disabled:opacity-30 hover:text-secondary transition-colors cursor-pointer disabled:cursor-not-allowed px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="font-code-spec text-xs text-on-surface-variant px-3 py-1 bg-surface-container rounded-full border border-outline-variant/30">
            {activePage.pageNumber} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPageIndex((p) => Math.min(p + 1, totalPages - 1))}
            disabled={currentPageIndex === totalPages - 1}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-on-surface disabled:opacity-30 hover:text-secondary transition-colors cursor-pointer disabled:cursor-not-allowed px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      </main>
    </div>
  );
}
