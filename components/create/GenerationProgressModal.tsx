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
            {/* Animated Book Studio Icon */}
            <div className="relative mx-auto mb-5">
              <motion.div
                animate={{
                  rotate: [0, -3, 3, 0],
                  y: [0, -3, 0],
                }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-secondary-container/30 text-secondary dark:text-secondary-fixed border border-secondary/20 flex items-center justify-center shadow-sm"
              >
                <BookOpen className="w-8 h-8 stroke-[1.8]" />
              </motion.div>
              <div className="absolute -top-1.5 -right-1.5">
                <span className="flex h-4 w-4 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary" />
                </span>
              </div>
            </div>

            <span className="font-label-caps text-xs uppercase tracking-widest text-secondary dark:text-secondary-fixed mb-1 block">
              Atelier Publishing Engine
            </span>

            <h3 className="font-headline-sm text-2xl text-on-surface dark:text-[#f3f0f7] tracking-tight mb-2">
              {stage === 'planning'
                ? 'Crafting Folio Blueprint'
                : stage === 'writing'
                ? 'Composing Editorial Chapters'
                : stage === 'generating_visuals'
                ? 'Synthesizing Archival Plates'
                : stage === 'designing'
                ? 'Typesetting Galley Proofs'
                : 'Publishing Master Edition'}
            </h3>

            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant dark:text-[#c4c7c5] mb-6 min-h-[40px] flex items-center justify-center">
              {stageDescriptions[stage] || stageDescriptions.planning}
            </p>

            {/* Editorial Gold Progress Bar */}
            <div className="w-full bg-surface-container rounded-full h-2.5 mb-6 overflow-hidden p-0.5 border border-outline-variant/30">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-secondary-container to-secondary"
                initial={{ width: '10%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.5 }}
              />
            </div>

            {/* Live Real-time Steps Feedback */}
            <div className="w-full bg-surface-container-low dark:bg-[#12131a] rounded-2xl border border-outline-variant/30 p-4 text-left max-h-40 overflow-y-auto space-y-2">
              <span className="font-label-caps text-[10px] uppercase tracking-wider text-outline block mb-2">
                Live Studio Progress
              </span>
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
                <div className="flex items-center gap-2.5 text-xs text-secondary dark:text-secondary-fixed font-medium animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span>Typesetting next folio section...</span>
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
