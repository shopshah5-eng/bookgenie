'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import {
  BookOpen,
  FileText,
  Clock,
  FileCheck,
  Check,
  Image as ImageIcon,
  Layout,
  Settings,
  Download,
  ArrowRight,
  Eye,
  RotateCcw,
} from 'lucide-react';

interface GenerationStatusData {
  id?: string;
  bookId: string;
  status: string;
  stage: string;
  progress: number;
  title?: string;
  subtitle?: string;
  cover_url?: string;
  page_count?: number;
  stepsCompleted?: string[];
  error?: string;
}

export default function BookGeneratingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const bookId = resolvedParams.id;
  const router = useRouter();
  const { user, openAuthModal, signOut } = useAuth();
  const [initialPages, setInitialPages] = useState<number>(16);
  const [jobIdParam, setJobIdParam] = useState<string>('');

  const [data, setData] = useState<GenerationStatusData>({
    bookId,
    status: 'queued',
    stage: 'planning',
    progress: 5,
    title: 'Creating your eBook...',
    page_count: 16,
  });

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingEpub, setIsDownloadingEpub] = useState(false);

  // Extract initial parameters from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const jId = params.get('jobId');
      if (jId) setJobIdParam(jId);

      const pCount = params.get('pages');
      if (pCount) {
        const parsed = parseInt(pCount, 10);
        if (!isNaN(parsed) && parsed > 0) {
          setInitialPages(parsed);
          setData((prev) => ({ ...prev, page_count: parsed }));
        }
      }
    }
  }, []);

  // Poll status endpoint every 1.5 seconds
  useEffect(() => {
    let isMounted = true;
    let pollInterval: any;

    const fetchStatus = async () => {
      try {
        const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const currentJobId = jobIdParam || searchParams?.get('jobId') || '';
        const statusUrl = currentJobId
          ? `/api/books/${bookId}/status?jobId=${currentJobId}`
          : `/api/books/${bookId}/status`;

        const res = await fetch(statusUrl);
        if (!res.ok) {
          // If status endpoint returns 404, check if book exists directly in books table
          const bookRes = await fetch(`/api/books/${bookId}`);
          if (bookRes.ok) {
            const b = await bookRes.json();
            if (isMounted) {
              const isBookDone = b.status === 'completed';
              setData((prev) => ({
                ...prev,
                status: b.status || (isBookDone ? 'completed' : prev.status),
                stage: b.status || (isBookDone ? 'completed' : prev.stage),
                progress: typeof b.progress === 'number' ? b.progress : (isBookDone ? 100 : prev.progress),
                title: b.title || prev.title,
                subtitle: b.subtitle || prev.subtitle,
                cover_url: b.coverUrl || b.cover_url || prev.cover_url,
                page_count: b.pageCount || b.page_count || prev.page_count || 16,
              }));
              if (isBookDone) {
                clearInterval(pollInterval);
                setTimeout(() => {
                  router.push(`/book/${bookId}/preview`);
                }, 600);
              }
            }
          }
          return;
        }

        const json = await res.json();
        if (isMounted) {
          setData((prev) => ({
            ...prev,
            status: json.status || prev.status,
            stage: json.stage || prev.stage,
            progress: typeof json.progress === 'number' ? json.progress : prev.progress,
            title: json.title && json.title !== 'Untitled eBook' ? json.title : prev.title,
            subtitle: json.subtitle || prev.subtitle,
            cover_url: json.cover_url || json.coverUrl || prev.cover_url,
            page_count: json.page_count || json.pageCount || prev.page_count || 16,
            error: json.error,
          }));
          setIsLoadingInitial(false);
        }

        if (json.status === 'completed' || json.stage === 'completed' || json.progress >= 100) {
          clearInterval(pollInterval);
          setTimeout(() => {
            router.push(`/book/${bookId}/preview`);
          }, 600);
        } else if (json.status === 'failed') {
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.warn('Poll status error:', err);
      }
    };

    fetchStatus();
    pollInterval = setInterval(fetchStatus, 1500);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [bookId, jobIdParam]);

  const isCompleted = data.status === 'completed' || data.stage === 'completed' || data.progress >= 100;
  const isFailed = data.status === 'failed' || data.stage === 'failed';

  // Determine current timeline active index (0 to 4)
  // Stages:
  // 0: Writing Content
  // 1: Creating Illustrations
  // 2: Designing Pages
  // 3: Finalizing
  // 4: Almost Done / Preparing Downloads
  let activeTimelineStep = 0;
  if (isCompleted) {
    activeTimelineStep = 5; // all complete
  } else if (data.stage === 'finalizing' || data.progress >= 90) {
    activeTimelineStep = 4;
  } else if (data.stage === 'designing' || data.progress >= 80) {
    activeTimelineStep = 2;
  } else if (data.stage === 'illustrations' || data.progress >= 65) {
    activeTimelineStep = 1;
  } else {
    activeTimelineStep = 0;
  }

  // Calculate stage progress for Item 1 (Writing your content)
  let writingProgress = 0;
  if (isCompleted || activeTimelineStep > 0) {
    writingProgress = 100;
  } else {
    // 0% to 65% scaled to stage
    writingProgress = Math.min(Math.max(Math.round((data.progress / 65) * 100), 15), 98);
  }

  const handleDownload = async (format: 'pdf' | 'epub') => {
    if (format === 'pdf') setIsDownloadingPdf(true);
    if (format === 'epub') setIsDownloadingEpub(true);

    try {
      const response = await fetch(`/api/books/${bookId}/export?format=${format}`);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(data.title || 'book').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert(`Could not download ${format.toUpperCase()}. Please try again.`);
    } finally {
      if (format === 'pdf') setIsDownloadingPdf(false);
      if (format === 'epub') setIsDownloadingEpub(false);
    }
  };

  const timelineStages = [
    {
      step: 1,
      title: 'Writing Content',
      subtitle: 'Crafting your book',
    },
    {
      step: 2,
      title: 'Creating Illustrations',
      subtitle: 'Generating visuals',
    },
    {
      step: 3,
      title: 'Designing Pages',
      subtitle: 'Formatting your book',
    },
    {
      step: 4,
      title: 'Finalizing',
      subtitle: 'Putting everything together',
    },
    {
      step: 5,
      title: 'Almost Done',
      subtitle: 'Preparing your downloads',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased flex flex-col selection:bg-neutral-100">
      {/* 1. Header (Matching homepage & reference image) */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#0000000d]">
        <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 group select-none">
            <svg
              className="w-5 h-5 text-[#111111]"
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
            <span className="font-semibold text-lg tracking-tight text-[#111111]">
              BookGenie
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-[14px] font-medium text-[#666666] hover:text-[#111111] transition-colors py-1"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-[14px] font-medium text-[#666666] hover:text-[#111111] transition-colors py-1"
            >
              Pricing
            </Link>
          </nav>

          {/* Right: My eBooks & User Avatar */}
          <div className="flex items-center gap-4">
            <Link
              href="/my-ebooks"
              className="text-[14px] font-medium text-[#111111] hover:text-black transition-colors"
            >
              My eBooks
            </Link>

            {user ? (
              <div className="flex items-center gap-2 pl-2">
                <div className="w-8 h-8 rounded-full bg-white text-[#111111] flex items-center justify-center text-xs font-bold select-none border border-[#EAEAEA] shadow-2xs">
                  {((user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'U')[0]).toUpperCase()}
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-[#888888] hover:text-[#111111] transition-colors hidden sm:inline-block cursor-pointer"
                  title="Sign Out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="text-[13px] font-medium px-4 py-1.5 rounded-full border border-[#EAEAEA] text-[#111111] hover:border-[#111111] transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-6 py-10 sm:py-14">
        {/* Top Eyebrow, Heading, and Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#777777] mb-3">
            {isCompleted ? 'YOUR BOOK IS READY' : 'CREATING YOUR BOOK'}
          </p>
          <h1 className="font-serif text-3xl sm:text-[44px] leading-tight text-[#111111] tracking-tight font-normal mb-3">
            {isCompleted ? 'Your eBook is ready' : 'Your eBook is on its way'}
          </h1>
          <p className="text-sm sm:text-base text-[#666666] font-normal">
            {isCompleted
              ? 'Your book has been written, illustrated and beautifully designed.'
              : "We're writing, designing and illustrating your book. This may take a few minutes."}
          </p>
        </div>

        {/* 5-Stage Horizontal Timeline (as shown in reference image) */}
        {!isFailed && (
          <div className="w-full max-w-4xl mx-auto mb-14 sm:mb-20 px-2 sm:px-6">
            <div className="flex items-start justify-between relative">
              {timelineStages.map((st, idx) => {
                const isStepCompleted = isCompleted || activeTimelineStep > idx;
                const isStepActive = !isCompleted && activeTimelineStep === idx;
                const isUpcoming = !isCompleted && activeTimelineStep < idx;

                return (
                  <div
                    key={st.step}
                    className="flex-1 flex flex-col items-center relative text-center group"
                  >
                    {/* Connecting line to next stage */}
                    {idx < timelineStages.length - 1 && (
                      <div
                        className={`absolute top-4 left-1/2 w-full h-[1.5px] transition-colors duration-500 -z-10 ${
                          isStepCompleted ? 'bg-[#111111]' : 'bg-[#EAEAEA]'
                        }`}
                      />
                    )}

                    {/* Step Circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 mb-3 select-none ${
                        isStepCompleted
                          ? 'bg-[#111111] text-white shadow-xs'
                          : isStepActive
                          ? 'bg-[#111111] text-white ring-4 ring-neutral-100 shadow-xs'
                          : 'bg-white border border-[#E0E0E0] text-[#999999]'
                      }`}
                    >
                      {isStepCompleted ? (
                        <Check className="w-4 h-4 text-white stroke-[2.5]" />
                      ) : (
                        <span>{st.step}</span>
                      )}
                    </div>

                    {/* Step Title & Subtitle */}
                    <span
                      className={`text-[12px] sm:text-[13px] font-semibold leading-snug transition-colors ${
                        isStepActive || isStepCompleted ? 'text-[#111111]' : 'text-[#888888]'
                      }`}
                    >
                      {st.title}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[#999999] hidden sm:block mt-0.5">
                      {st.subtitle}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Failed State Card */}
        {isFailed && (
          <div className="max-w-lg mx-auto bg-white rounded-2xl border border-red-200 p-8 text-center my-10 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-[#111111] mb-2 font-serif">
              Something went wrong while creating your book.
            </h2>
            <p className="text-sm text-[#666666] mb-6">
              {data.error || 'Your written content and ideas are safe. Please try again.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-sm font-medium transition-all"
              >
                Try Again
              </button>
              <Link
                href="/my-ebooks"
                className="px-6 py-3 rounded-xl border border-[#EAEAEA] text-[#111111] hover:border-[#111111] text-sm font-medium transition-all"
              >
                Back to My eBooks
              </Link>
            </div>
          </div>
        )}

        {/* Main Two-Column Layout (Matching the attached screenshot) */}
        {!isFailed && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center max-w-5xl mx-auto">
            {/* LEFT COLUMN: 3D Book Cover Mockup */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative group select-none">
                {/* 3D Perspective Book Container */}
                <div
                  className="relative w-[240px] sm:w-[280px] h-[340px] sm:h-[390px] rounded-r-lg bg-neutral-900 transition-transform duration-700 ease-out"
                  style={{
                    perspective: '1200px',
                    transform: 'rotateY(-4deg) rotateX(1deg)',
                    boxShadow:
                      '0 24px 48px -12px rgba(0, 0, 0, 0.22), 0 10px 20px -8px rgba(0, 0, 0, 0.12), -4px 0 12px rgba(0,0,0,0.15)',
                  }}
                >
                  {/* Hardcover Spine Thickness (Left Edge highlight) */}
                  <div className="absolute -left-[14px] top-0 bottom-0 w-[14px] bg-gradient-to-r from-[#202020] via-[#383838] to-[#1a1a1a] rounded-l-[3px] shadow-inner border-r border-black/20" />

                  {/* Book Page Edges Shadow (Right Edge) */}
                  <div className="absolute right-0 top-1 bottom-1 w-[4px] bg-gradient-to-r from-transparent to-neutral-300 rounded-r-xs opacity-75" />

                  {/* Front Cover Artwork or Skeleton */}
                  {data.cover_url ? (
                    <div className="relative w-full h-full rounded-r-lg overflow-hidden bg-neutral-100">
                      <Image
                        src={data.cover_url}
                        alt={data.title || 'Book Cover'}
                        fill
                        priority
                        className="object-cover transition-opacity duration-700"
                        sizes="(max-width: 640px) 240px, 280px"
                      />
                      {/* Subtle spine shadow crease over the artwork */}
                      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/25 via-black/5 to-transparent pointer-events-none" />
                      {/* Subtle glossy sheen line across the cover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                    </div>
                  ) : (
                    /* Minimal Skeleton Book while Cover is Generating */
                    <div className="w-full h-full bg-[#FAFAF8] rounded-r-lg border border-[#EAEAEA] flex flex-col items-center justify-center p-6 text-center animate-pulse">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4 text-[#888888]">
                        <BookOpen className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <p className="text-[13px] font-medium text-[#777777] mb-1">
                        Creating your cover...
                      </p>
                      <p className="text-[11px] text-[#aaaaaa]">
                        Artwork is being rendered
                      </p>
                    </div>
                  )}
                </div>

                {/* Soft Ambient Floor Cast Shadow */}
                <div
                  className="w-[260px] sm:w-[300px] h-[18px] bg-black/15 mx-auto mt-2 rounded-[100%] blur-[8px] pointer-events-none"
                  style={{ transform: 'scaleX(0.95)' }}
                />
              </div>

              {/* Book Title & Subtitle Underneath Preview */}
              <div className="text-center mt-6 max-w-xs">
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#111111] tracking-tight">
                  {data.title || 'The Little Explorer'}
                </h3>
                {data.subtitle && (
                  <p className="text-[11px] font-medium uppercase tracking-widest text-[#777777] mt-1">
                    {data.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Generation Progress or Completed State */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              {!isCompleted ? (
                <>
                  {/* Item 1: Writing your content */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl transition-all border ${
                      activeTimelineStep === 0
                        ? 'bg-white border-[#EAEAEA] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                        : 'bg-white/60 border-[#F0F0F0]'
                    } flex items-center justify-between gap-4`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          activeTimelineStep === 0 || activeTimelineStep > 0
                            ? 'bg-[#111111] text-white'
                            : 'bg-neutral-100 text-[#888888]'
                        }`}
                      >
                        <FileText className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <div>
                        <h4 className="text-[14px] sm:text-[15px] font-semibold text-[#111111]">
                          Writing your content
                        </h4>
                        <p className="text-[12px] text-[#777777]">
                          Creating well-structured, engaging chapters...
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[12px] font-semibold text-[#111111]">
                        {activeTimelineStep > 0 ? (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          `${writingProgress}%`
                        )}
                      </span>
                      <div className="w-28 sm:w-36 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#111111] rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: activeTimelineStep > 0 ? '100%' : `${writingProgress}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Item 2: Creating illustrations */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl transition-all border ${
                      activeTimelineStep === 1
                        ? 'bg-white border-[#EAEAEA] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                        : 'bg-white/60 border-[#F0F0F0]'
                    } flex items-center justify-between gap-4`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          activeTimelineStep === 1
                            ? 'bg-[#111111] text-white'
                            : activeTimelineStep > 1
                            ? 'bg-neutral-100 text-[#111111]'
                            : 'bg-white border border-[#EAEAEA] text-[#888888]'
                        }`}
                      >
                        <ImageIcon className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <div>
                        <h4 className="text-[14px] sm:text-[15px] font-semibold text-[#111111]">
                          Creating illustrations
                        </h4>
                        <p className="text-[12px] text-[#777777]">
                          Generating unique visuals for your book...
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[12px] text-[#888888] font-medium">
                        {activeTimelineStep > 1 ? (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : activeTimelineStep === 1 ? (
                          <span className="text-[#111111] font-semibold">Creating...</span>
                        ) : (
                          'Pending'
                        )}
                      </span>
                      <div className="w-28 sm:w-36 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#111111] rounded-full transition-all duration-500 ease-out"
                          style={{
                            width:
                              activeTimelineStep > 1
                                ? '100%'
                                : activeTimelineStep === 1
                                ? '65%'
                                : '0%',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Item 3: Designing pages */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl transition-all border ${
                      activeTimelineStep === 2
                        ? 'bg-white border-[#EAEAEA] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                        : 'bg-white/60 border-[#F0F0F0]'
                    } flex items-center justify-between gap-4`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          activeTimelineStep === 2
                            ? 'bg-[#111111] text-white'
                            : activeTimelineStep > 2
                            ? 'bg-neutral-100 text-[#111111]'
                            : 'bg-white border border-[#EAEAEA] text-[#888888]'
                        }`}
                      >
                        <Layout className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <div>
                        <h4 className="text-[14px] sm:text-[15px] font-semibold text-[#111111]">
                          Designing pages
                        </h4>
                        <p className="text-[12px] text-[#777777]">
                          Creating a beautiful and clean layout...
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[12px] text-[#888888] font-medium">
                        {activeTimelineStep > 2 ? (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : activeTimelineStep === 2 ? (
                          <span className="text-[#111111] font-semibold">Designing...</span>
                        ) : (
                          'Pending'
                        )}
                      </span>
                      <div className="w-28 sm:w-36 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#111111] rounded-full transition-all duration-500 ease-out"
                          style={{
                            width:
                              activeTimelineStep > 2
                                ? '100%'
                                : activeTimelineStep === 2
                                ? '75%'
                                : '0%',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Item 4: Finalizing */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl transition-all border ${
                      activeTimelineStep === 3
                        ? 'bg-white border-[#EAEAEA] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                        : 'bg-white/60 border-[#F0F0F0]'
                    } flex items-center justify-between gap-4`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          activeTimelineStep === 3
                            ? 'bg-[#111111] text-white'
                            : activeTimelineStep > 3
                            ? 'bg-neutral-100 text-[#111111]'
                            : 'bg-white border border-[#EAEAEA] text-[#888888]'
                        }`}
                      >
                        <Settings className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <div>
                        <h4 className="text-[14px] sm:text-[15px] font-semibold text-[#111111]">
                          Finalizing
                        </h4>
                        <p className="text-[12px] text-[#777777]">
                          Combining all elements and optimizing...
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[12px] text-[#888888] font-medium">
                        {activeTimelineStep > 3 ? (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : activeTimelineStep === 3 ? (
                          <span className="text-[#111111] font-semibold">Finalizing...</span>
                        ) : (
                          'Pending'
                        )}
                      </span>
                      <div className="w-28 sm:w-36 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#111111] rounded-full transition-all duration-500 ease-out"
                          style={{
                            width:
                              activeTimelineStep > 3
                                ? '100%'
                                : activeTimelineStep === 3
                                ? '80%'
                                : '0%',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Item 5: Preparing download */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl transition-all border ${
                      activeTimelineStep === 4
                        ? 'bg-white border-[#EAEAEA] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                        : 'bg-white/60 border-[#F0F0F0]'
                    } flex items-center justify-between gap-4`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          activeTimelineStep === 4
                            ? 'bg-[#111111] text-white'
                            : 'bg-white border border-[#EAEAEA] text-[#888888]'
                        }`}
                      >
                        <Download className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <div>
                        <h4 className="text-[14px] sm:text-[15px] font-semibold text-[#111111]">
                          Preparing download
                        </h4>
                        <p className="text-[12px] text-[#777777]">
                          Generating PDF and EPUB files...
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[12px] text-[#888888] font-medium">
                        {activeTimelineStep === 4 ? (
                          <span className="text-[#111111] font-semibold">Packaging...</span>
                        ) : (
                          'Pending'
                        )}
                      </span>
                      <div className="w-28 sm:w-36 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#111111] rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: activeTimelineStep === 4 ? '70%' : '0%',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Completed State Action Panel */
                <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex flex-col gap-4 animate-fade-in">
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Book Creation Complete
                    </span>
                    <h3 className="text-2xl font-serif text-[#111111] font-normal">
                      Ready for reading and publishing
                    </h3>
                    <p className="text-sm text-[#666666] mt-1">
                      Your complete publication has been structured, illustrated, and formatted into digital editions.
                    </p>
                  </div>

                  {/* Primary Action: Preview Book */}
                  <Link
                    href={`/book/${bookId}`}
                    className="w-full py-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-[15px] font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <Eye className="w-4 h-4 text-white/90" />
                    <span>Preview Your Book</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>

                  {/* Download Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => handleDownload('pdf')}
                      disabled={isDownloadingPdf}
                      className="py-3.5 px-4 rounded-xl border border-[#EAEAEA] hover:border-[#111111] bg-white text-[#111111] text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#666666]" />
                      <span>{isDownloadingPdf ? 'Preparing PDF...' : 'Download PDF'}</span>
                    </button>

                    <button
                      onClick={() => handleDownload('epub')}
                      disabled={isDownloadingEpub}
                      className="py-3.5 px-4 rounded-xl border border-[#EAEAEA] hover:border-[#111111] bg-white text-[#111111] text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#666666]" />
                      <span>{isDownloadingEpub ? 'Preparing EPUB...' : 'Download EPUB'}</span>
                    </button>
                  </div>

                  {/* Secondary Link to My eBooks */}
                  <div className="text-center pt-2">
                    <Link
                      href="/my-ebooks"
                      className="text-xs font-medium text-[#777777] hover:text-[#111111] underline underline-offset-4 transition-colors"
                    >
                      View My eBooks
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4-Item Information Card (Matching reference image bottom bar) */}
        {!isFailed && (
          <div className="max-w-5xl mx-auto mt-12 sm:mt-16 bg-white border border-[#EAEAEA] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#F0F0F0]">
              {/* Item 1: Book Title */}
              <div className="flex items-center gap-3.5 pt-3 md:pt-0">
                <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] border border-[#EAEAEA] flex items-center justify-center text-[#111111] shrink-0">
                  <BookOpen className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="overflow-hidden">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-[#888888]">
                    Book Title
                  </span>
                  <span className="block text-[13px] sm:text-[14px] font-semibold text-[#111111] truncate">
                    {data.title || 'Untitled eBook'}
                  </span>
                </div>
              </div>

              {/* Item 2: Number of Pages */}
              <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:pl-6">
                <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] border border-[#EAEAEA] flex items-center justify-center text-[#111111] shrink-0">
                  <FileText className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-[#888888]">
                    Number of Pages
                  </span>
                  <span className="block text-[13px] sm:text-[14px] font-semibold text-[#111111]">
                    {data.page_count || 16} pages
                  </span>
                </div>
              </div>

              {/* Item 3: Estimated Time / Status */}
              <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:pl-6">
                <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] border border-[#EAEAEA] flex items-center justify-center text-[#111111] shrink-0">
                  <Clock className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-[#888888]">
                    {isCompleted ? 'Status' : 'Estimated Time'}
                  </span>
                  <span className="block text-[13px] sm:text-[14px] font-semibold text-[#111111]">
                    {isCompleted ? 'Completed' : (data.page_count || 16) <= 20 ? '~30–45 seconds' : '~1–2 minutes'}
                  </span>
                </div>
              </div>

              {/* Item 4: Output Format */}
              <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:pl-6">
                <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] border border-[#EAEAEA] flex items-center justify-center text-[#111111] shrink-0">
                  <FileCheck className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-[#888888]">
                    Output Format
                  </span>
                  <span className="block text-[13px] sm:text-[14px] font-semibold text-[#111111]">
                    PDF &amp; EPUB
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
