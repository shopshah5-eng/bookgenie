'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { BookSpreadViewer } from '@/components/preview/BookSpreadViewer';
import { EditAssistantPanel } from '@/components/preview/EditAssistantPanel';
import { BookDocument, BookPageDocument } from '@/lib/book/types';
import {
  ArrowLeft,
  Download,
  RotateCcw,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  AlertCircle,
  Save,
} from 'lucide-react';

export default function BookPreviewEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const bookId = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();

  const [book, setBook] = useState<BookDocument | null>(null);
  const [history, setHistory] = useState<BookDocument[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessingEdit, setIsProcessingEdit] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState<boolean>(false);
  const [downloadTargetFormat, setDownloadTargetFormat] = useState<'pdf' | 'epub'>('pdf');

  // Load book initial state
  useEffect(() => {
    let isMounted = true;

    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${bookId}`);
        if (res.ok) {
          const data = await res.json();
          const bookData = data.book || data;
          if (isMounted && bookData) {
            setBook(bookData);
          }
        }
      } catch (err) {
        console.error('Failed to load book for preview:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBook();

    return () => {
      isMounted = false;
    };
  }, [bookId]);

  // Warn before leaving if unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Apply natural-language edit instruction
  const handleApplyInstruction = async (instruction: string) => {
    if (!book) return;
    setIsProcessingEdit(true);

    // Save previous version to local history stack for instant Undo
    setHistory((prev) => [...prev, JSON.parse(JSON.stringify(book))]);

    try {
      const res = await fetch(`/api/books/${bookId}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction,
          targetPageNumbers:
            instruction.toLowerCase().includes('cover')
              ? [1]
              : instruction.toLowerCase().includes('this page') ||
                instruction.toLowerCase().includes('this chapter')
              ? [currentPageIndex + 1]
              : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.book) {
          setBook(data.book);
          setHasUnsavedChanges(true);
        }
      } else {
        alert('Could not apply edit instruction. Please try a different phrasing.');
      }
    } catch (err) {
      console.error('Edit error:', err);
      alert('Network issue applying edit.');
    } finally {
      setIsProcessingEdit(false);
    }
  };

  // Undo Last Change
  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setBook(previous);
  };

  // Regenerate Current Page specifically
  const handleRegenerateCurrentPage = async () => {
    if (!book || isProcessingEdit) return;
    setIsProcessingEdit(true);

    setHistory((prev) => [...prev, JSON.parse(JSON.stringify(book))]);

    try {
      const res = await fetch(`/api/books/${bookId}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction: `Enhance, polish and regenerate the content and layout of page ${currentPageIndex + 1}.`,
          targetPageNumbers: [currentPageIndex + 1],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.book) {
          setBook(data.book);
          setHasUnsavedChanges(true);
        }
      }
    } catch (err) {
      console.error('Page regeneration error:', err);
    } finally {
      setIsProcessingEdit(false);
    }
  };

  // Save Changes
  const handleSaveChanges = async () => {
    if (!book) return;
    setSaveStatus('Saving changes...');

    try {
      const res = await fetch(`/api/books/${bookId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookData: book }),
      });

      if (res.ok) {
        setHasUnsavedChanges(false);
        setSaveStatus('Changes saved successfully.');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('Failed to save.');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch {
      setSaveStatus('Save error.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Download Trigger
  const triggerDownload = async (format: 'pdf' | 'epub') => {
    if (hasUnsavedChanges) {
      setDownloadTargetFormat(format);
      setDownloadModalOpen(true);
      return;
    }

    executeDownload(format);
  };

  const executeDownload = async (format: 'pdf' | 'epub') => {
    try {
      const res = await fetch(`/api/books/${bookId}/export?format=${format}`);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(book?.title || 'book').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert(`Could not download ${format.toUpperCase()}. Please try again.`);
    }
  };

  const pages = book?.pages || [];
  const totalPages = pages.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-6">
        <div className="w-8 h-8 border-2 border-neutral-300 border-t-[#111111] rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#888888]">Loading eBook Preview &amp; Editor...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-xl font-serif text-[#111111] mb-2">Book Not Found</h2>
        <p className="text-sm text-[#666666] mb-6">This publication does not exist or has expired.</p>
        <Link
          href="/my-ebooks"
          className="px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-medium"
        >
          Back to My eBooks
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#111111] font-sans antialiased flex flex-col selection:bg-neutral-200">
      {/* 1. Header (Matching Section 5) */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#0000000d]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Back button + Logo + Book Title + Status Badge */}
          <div className="flex items-center gap-3.5 overflow-hidden">
            <Link
              href="/my-ebooks"
              className="p-2 rounded-lg hover:bg-black/5 text-[#666666] hover:text-[#111111] transition-colors shrink-0"
              title="Back to My eBooks"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link href="/" className="flex items-center gap-1.5 shrink-0 select-none">
              <svg
                className="w-4 h-4 text-[#111111]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 1-4 4v14a3 3 0 0 0 3-3h7z" />
              </svg>
              <span className="font-semibold text-sm tracking-tight text-[#111111] hidden sm:inline">
                BookGenie
              </span>
            </Link>

            <span className="text-[#CCCCCC] hidden sm:inline">/</span>

            <span className="font-serif text-sm sm:text-base font-semibold text-[#111111] truncate max-w-[160px] sm:max-w-[260px]">
              {book.title}
            </span>

            {/* Editing Mode Badge */}
            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[#444444] text-[10px] font-semibold tracking-wide uppercase shrink-0">
              Editing Mode
            </span>

            {/* Unsaved changes badge */}
            {hasUnsavedChanges && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold tracking-wide uppercase shrink-0 animate-pulse">
                Unsaved changes
              </span>
            )}

            {saveStatus && (
              <span className="text-xs text-emerald-700 font-medium shrink-0">
                {saveStatus}
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Regenerate Page */}
            <button
              onClick={handleRegenerateCurrentPage}
              disabled={isProcessingEdit}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAEAEA] bg-white text-[#111111] hover:border-[#111111] text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
              title="Regenerate the currently selected page"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate Page</span>
            </button>

            {/* Download PDF */}
            <button
              onClick={() => triggerDownload('pdf')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAEAEA] bg-white text-[#111111] hover:border-[#111111] text-xs font-semibold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#666666]" />
              <span>Download PDF</span>
            </button>

            {/* Download EPUB */}
            <button
              onClick={() => triggerDownload('epub')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAEAEA] bg-white text-[#111111] hover:border-[#111111] text-xs font-semibold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#666666]" />
              <span>Download EPUB</span>
            </button>

            {/* Save Changes (Primary Button) */}
            <button
              onClick={handleSaveChanges}
              disabled={isProcessingEdit}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                hasUnsavedChanges
                  ? 'bg-[#111111] hover:bg-[#222222] text-white ring-2 ring-black/10'
                  : 'bg-[#111111] text-white hover:bg-[#222222]'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main 3-Column Studio Body */}
      <div className="flex-1 flex overflow-hidden max-w-[1600px] w-full mx-auto">
        {/* LEFT COLUMN: Page Thumbnails Sidebar (Matching Section 6) */}
        <aside className="w-56 lg:w-64 bg-white border-r border-[#EAEAEA] hidden md:flex flex-col shrink-0 select-none overflow-hidden">
          <div className="p-3.5 border-b border-[#F0F0F0] flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888]">
              Page Thumbnails
            </span>
            <span className="text-[11px] text-[#999999]">{totalPages} Pages</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
            {pages.map((p, idx) => {
              const isSelected = currentPageIndex === idx;
              let label = p.title || `Page ${p.pageNumber}`;
              if (idx === 0) label = 'Front Cover';
              else if (p.pageType === 'title') label = 'Title Page';
              else if (p.pageType === 'toc') label = 'Contents';

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-[#111111] bg-[#F7F7F7] shadow-xs'
                      : 'border-[#EAEAEA] bg-white hover:border-[#CCCCCC]'
                  }`}
                >
                  {/* Miniature Thumbnail */}
                  <div className="w-9 h-12 rounded bg-neutral-100 border border-black/5 shrink-0 flex items-center justify-center overflow-hidden relative">
                    {idx === 0 && book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt="Cover thumb"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-[#888888]">
                        {p.pageNumber}
                      </span>
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <span className="block text-[11px] font-semibold text-[#111111] truncate">
                      {label}
                    </span>
                    <span className="block text-[10px] text-[#888888]">
                      Page {p.pageNumber}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* CENTER-LEFT: Edit Assistant Panel (Matching Section 7 & 11) */}
        <section className="w-full md:w-80 lg:w-96 bg-white shrink-0 hidden sm:flex flex-col overflow-hidden">
          <EditAssistantPanel
            onApplyInstruction={handleApplyInstruction}
            isProcessing={isProcessingEdit}
            hasRevisions={history.length > 0}
            onUndoLastChange={handleUndo}
            currentPageNumber={currentPageIndex + 1}
          />
        </section>

        {/* CENTER/RIGHT: Live Book Preview (Matching Section 14) */}
        <main className="flex-1 flex flex-col justify-between overflow-hidden bg-[#FDFBF7]">
          {/* Main Book View Container */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            <BookSpreadViewer
              book={book}
              currentPageIndex={currentPageIndex}
              zoom={zoom}
              onPageSelect={(idx) => setCurrentPageIndex(idx)}
            />
          </div>

          {/* BOTTOM CONTROLS & THUMBNAIL STRIP (Matching Section 15 & 16) */}
          <div className="bg-white border-t border-[#EAEAEA] p-3 sm:px-6 flex flex-col gap-2 shrink-0 select-none">
            {/* Control Bar */}
            <div className="flex items-center justify-between">
              {/* Page Nav */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPageIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentPageIndex === 0}
                  className="px-3 py-1.5 rounded-lg border border-[#EAEAEA] bg-white text-[#111111] hover:border-[#111111] disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <span className="text-xs font-semibold text-[#111111] px-2">
                  Page {currentPageIndex + 1} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPageIndex((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={currentPageIndex >= totalPages - 1}
                  className="px-3 py-1.5 rounded-lg border border-[#EAEAEA] bg-white text-[#111111] hover:border-[#111111] disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Zoom & Fullscreen Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.7))}
                  className="p-1.5 rounded-lg border border-[#EAEAEA] hover:border-[#111111] text-[#666666] hover:text-[#111111] transition-all cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <span className="text-[11px] font-semibold text-[#666666] w-10 text-center">
                  {Math.round(zoom * 100)}%
                </span>

                <button
                  onClick={() => setZoom((prev) => Math.min(prev + 0.1, 1.4))}
                  className="p-1.5 rounded-lg border border-[#EAEAEA] hover:border-[#111111] text-[#666666] hover:text-[#111111] transition-all cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <div className="h-4 w-[1px] bg-[#EAEAEA] mx-1" />

                <button
                  onClick={() => setZoom(1)}
                  className="px-2 py-1 rounded border border-[#EAEAEA] text-[10px] font-semibold hover:border-[#111111] transition-all cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Horizontal Synchronized Thumbnail Strip */}
            <div className="flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-thin">
              {pages.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`h-11 px-2.5 rounded-lg border text-[11px] font-semibold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentPageIndex === idx
                      ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                      : 'border-[#EAEAEA] bg-[#FAF9F6] text-[#666666] hover:border-[#111111]'
                  }`}
                >
                  <span>{idx === 0 ? 'Cover' : p.pageNumber}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Unsaved Changes Download Warning Modal */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <AlertCircle className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-semibold text-[#111111] mb-2 font-serif">
              You have unsaved changes
            </h3>
            <p className="text-xs sm:text-sm text-[#666666] mb-6">
              Would you like to save your recent changes before downloading, or download the previous saved version?
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={async () => {
                  await handleSaveChanges();
                  setDownloadModalOpen(false);
                  executeDownload(downloadTargetFormat);
                }}
                className="w-full py-3 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
              >
                Save Changes &amp; Download
              </button>

              <button
                onClick={() => {
                  setDownloadModalOpen(false);
                  executeDownload(downloadTargetFormat);
                }}
                className="w-full py-2.5 rounded-xl border border-[#EAEAEA] hover:border-[#111111] text-[#111111] text-xs font-semibold transition-all cursor-pointer"
              >
                Download Previous Saved Version
              </button>

              <button
                onClick={() => setDownloadModalOpen(false)}
                className="text-xs text-[#888888] hover:text-[#111111] py-1 text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
