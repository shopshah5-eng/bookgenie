'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle2, Loader2, Sparkles, ArrowRight, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import confetti from 'canvas-confetti';

export interface GenerationProgressModalProps {
  isOpen: boolean;
  bookId: string | null;
  jobId: string | null;
  onClose?: () => void;
}

export function GenerationProgressModal({
  isOpen,
  bookId,
  jobId,
}: GenerationProgressModalProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(10);
  const [stage, setStage] = useState('planning');
  const [status, setStatus] = useState('processing');
  const [stepsCompleted, setStepsCompleted] = useState<string[]>([
    'Analyzing prompt & creative tone',
  ]);
  const [error, setError] = useState<string | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [currentActivity, setCurrentActivity] = useState('Conducting deep research & structuring chapter outlines...');

  // Live stopwatch timer
  useEffect(() => {
    if (!isOpen || status === 'completed') return;
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, status]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isOpen || !jobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/books/${bookId}/status?jobId=${jobId}`);
        if (!res.ok) return;

        const data = await res.json();
        setProgress(data.progress || 15);
        setStage(data.stage || 'planning');
        setStatus(data.status || 'processing');

        if (data.stage === 'planning') {
          setCurrentActivity('Synthesizing research, thesis statement & chapter outlines...');
        } else if (data.stage === 'writing') {
          setCurrentActivity(`Authoring narrative chapter prose & educational sections (${data.progress}%)...`);
        } else if (data.stage === 'generating_visuals') {
          setCurrentActivity('Generating high-resolution book cover & interior illustration plates...');
        } else if (data.stage === 'designing') {
          setCurrentActivity('Typesetting dual-page galley proofs & running headers...');
        } else if (data.status === 'completed') {
          setCurrentActivity('Compilation complete! Master book edition ready.');
        }

        if (data.stepsCompleted && data.stepsCompleted.length > 0) {
          setStepsCompleted(data.stepsCompleted);
        }

        if (data.status === 'completed') {
          clearInterval(interval);
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#9A6F3C', '#E8DCCB', '#C27351', '#34A853'],
            });
          } catch {
            // Safe fallback
          }
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setError(data.error || 'Generation failed during processing.');
        }
      } catch (err) {
        console.warn('Status poll warning:', err);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [isOpen, bookId, jobId]);

  const stageDescriptions: Record<string, string> = {
    planning: 'Crafting the book blueprint, chapters & visual outline...',
    writing: 'Writing your narrative content chapter-by-chapter...',
    generating_visuals: 'Rendering luxury cover art and interior illustrations...',
    designing: 'Composing elegant page typography & layout blocks...',
    completed: 'Final quality control passed. Your book is ready!',
    failed: 'An unexpected issue occurred during publishing.',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-[#1A1612]/55 backdrop-blur-md"
      />

      {/* Editorial Studio Animation Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="relative z-10 w-full max-w-lg bg-surface dark:bg-[#161720] rounded-3xl border border-outline-variant/30 dark:border-white/10 p-7 sm:p-9 shadow-2xl overflow-hidden flex flex-col text-center"
      >
        {status !== 'completed' ? (
          <>
            {/* Animated Clockwise Circular Progress Ring (0-100%) */}
            <div className="relative mx-auto my-6 flex items-center justify-center">
              {/* Outer pulsing glow */}
              <div className="absolute w-44 h-44 rounded-full bg-secondary/10 dark:bg-[#fcba64]/10 blur-xl animate-pulse" />

              <svg className="w-40 h-40 transform -rotate-90">
                {/* Background Ring Track */}
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  className="stroke-surface-container dark:stroke-white/10"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Animated Clockwise Progress Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  className="stroke-secondary dark:stroke-[#fcba64] transition-all duration-700 ease-out"
                  strokeWidth="8"
                  strokeDasharray={427.26}
                  strokeDashoffset={427.26 - (427.26 * Math.min(progress, 100)) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Inside Circle: Percentage & Stopwatch Elapsed Timer */}
              <div className="absolute flex flex-col items-center justify-center select-none">
                <span className="font-display-hero text-3xl sm:text-4xl font-bold text-primary dark:text-[#f1effa] font-title-editorial">
                  {Math.round(progress)}%
                </span>
                <div className="flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-surface-container dark:bg-white/10 border border-surface-container-highest dark:border-white/10 text-[11px] font-code-spec text-on-surface-variant dark:text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#fcba64] animate-ping" />
                  <span>{formatTime(secondsElapsed)} elapsed</span>
                </div>
              </div>
            </div>

            <span className="font-label-caps text-xs uppercase tracking-widest text-secondary dark:text-[#fcba64] mb-1.5 block">
              Autonomous Creation Studio • Live Synthesis
            </span>

            <h3 className="font-headline-sm text-2xl text-on-surface dark:text-[#f3f0f7] tracking-tight mb-2">
              {stage === 'planning'
                ? 'Deep Research & Narrative Blueprinting'
                : stage === 'writing'
                ? 'Authoring High-Fidelity Prose & Chapters'
                : stage === 'generating_visuals'
                ? 'Synthesizing Cover Art & Visual Plates'
                : stage === 'designing'
                ? 'Typesetting Archival Spreads & Galley Proofs'
                : 'Finalizing Master Publication Package'}
            </h3>

            {/* What AI Is Doing Now - Animated Pill */}
            <div className="mx-auto mb-6 px-4 py-2 rounded-xl bg-surface-container-low dark:bg-white/5 border border-surface-container-highest dark:border-white/10 flex items-center justify-center gap-2 max-w-md shadow-xs">
              <Sparkles className="w-4 h-4 text-secondary dark:text-[#fcba64] animate-spin" />
              <p className="font-body-md text-xs sm:text-sm text-on-surface dark:text-[#f1effa] font-medium truncate">
                {currentActivity || stageDescriptions[stage] || stageDescriptions.planning}
              </p>
            </div>

            {/* Live Step-by-Step Production Log */}
            <div className="w-full bg-surface-container-low dark:bg-[#12131a] rounded-2xl border border-outline-variant/30 dark:border-white/10 p-4 text-left max-h-44 overflow-y-auto space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-outline dark:text-neutral-400 block font-semibold">
                  Live Studio Execution Pipeline
                </span>
                <span className="text-[10px] font-code-spec text-secondary dark:text-[#fcba64]">
                  Step {stepsCompleted.length} of 5
                </span>
              </div>
              {stepsCompleted.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-xs text-on-surface dark:text-white font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{step}</span>
                </div>
              ))}
              {status === 'processing' && (
                <div className="flex items-center gap-2.5 text-xs text-secondary dark:text-[#fcba64] font-medium animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span className="truncate">{currentActivity || 'Processing next editorial pipeline task...'}</span>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs text-left">
                {error}
              </div>
            )}
          </>
        ) : (
          /* =========================================================================
             STAGE: COMPLETED (YOUR BOOK IS READY)
             ========================================================================= */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-secondary-container/30 text-secondary dark:text-secondary-fixed flex items-center justify-center mb-4 border border-secondary/20 shadow-sm">
              <Sparkles className="w-8 h-8 stroke-[2]" />
            </div>

            <span className="font-label-caps text-xs uppercase tracking-widest text-secondary dark:text-secondary-fixed mb-1 block">
              ✦ FOLIO REGISTERED & COMPLETE ✦
            </span>

            <h3 className="font-headline-sm text-3xl text-on-surface dark:text-white tracking-tight mb-2">
              Your Folio is Ready
            </h3>

            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant dark:text-[#c4c7c5] mb-8 max-w-sm">
              All chapters, page blocks, and archival illustrations have been generated and assembled.
            </p>

            {/* 3 Primary Actions: READ, DOWNLOAD, SHARE */}
            <div className="w-full space-y-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push(`/book/${bookId}`)}
                className="w-full text-base font-semibold shadow-md py-3.5 bg-primary hover:bg-primary-hover text-on-primary"
              >
                Inspect Folio in Atelier Reader <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`/api/books/${bookId}/export?format=pdf`}
                  download
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface dark:text-white transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-secondary dark:text-secondary-fixed" />
                  <span>Download PDF</span>
                </a>

                <a
                  href={`/api/books/${bookId}/export?format=epub`}
                  download
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface dark:text-white transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-secondary dark:text-secondary-fixed" />
                  <span>Download EPUB</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'My BookGenie Book',
                      url: `${window.location.origin}/book/${bookId}`,
                    });
                  } else {
                    navigator.clipboard.writeText(`${window.location.origin}/book/${bookId}`);
                    alert('Book link copied to clipboard!');
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Archival Link</span>
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
