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
        className="relative z-10 w-full max-w-lg bg-[#FDFBF7] rounded-3xl border border-[#EFECE6] p-7 sm:p-9 shadow-2xl overflow-hidden flex flex-col text-center"
      >
        {status !== 'completed' ? (
          <>
            {/* Animated Book Studio Icon */}
            <div className="relative mx-auto mb-5">
              <motion.div
                animate={{
                  rotate: [0, -4, 4, 0],
                  y: [0, -3, 0],
                }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-[#F8F3EA] text-[#8C5F2E] border border-[#E8DCCB] flex items-center justify-center shadow-sm"
              >
                <BookOpen className="w-8 h-8 stroke-[1.8]" />
              </motion.div>
              <div className="absolute -top-1.5 -right-1.5">
                <span className="flex h-4 w-4 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9A6F3C] opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#9A6F3C]" />
                </span>
              </div>
            </div>

            <span className="text-[11px] uppercase tracking-widest text-[#9A6F3C] font-semibold mb-1">
              Publishing Studio In Action
            </span>

            <h3 className="text-2xl font-serif font-bold text-[#1A1612] tracking-tight mb-2">
              {stage === 'planning'
                ? 'Crafting Book Blueprint'
                : stage === 'writing'
                ? 'Writing Your Book'
                : stage === 'generating_visuals'
                ? 'Creating Illustrations'
                : stage === 'designing'
                ? 'Designing Page Blocks'
                : 'Publishing Your Book'}
            </h3>

            <p className="text-xs sm:text-sm text-[#6B635B] mb-6 min-h-[40px] flex items-center justify-center">
              {stageDescriptions[stage] || stageDescriptions.planning}
            </p>

            {/* Editorial Gold Progress Bar */}
            <div className="w-full bg-[#EFECE6] rounded-full h-2.5 mb-6 overflow-hidden p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#A87B45] to-[#8C5F2E]"
                initial={{ width: '10%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.5 }}
              />
            </div>

            {/* Live Real-time Steps Feedback */}
            <div className="w-full bg-white rounded-2xl border border-[#EFECE6] p-4 text-left max-h-40 overflow-y-auto space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#9E968E] font-bold block mb-2">
                Live Studio Progress
              </span>
              {stepsCompleted.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-xs text-[#1A1612] font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{step}</span>
                </div>
              ))}
              {status === 'processing' && (
                <div className="flex items-center gap-2.5 text-xs text-[#9A6F3C] font-medium animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span>Working on next section...</span>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs text-left">
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
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-200 shadow-sm">
              <Sparkles className="w-8 h-8 stroke-[2]" />
            </div>

            <span className="text-[11px] uppercase tracking-widest text-emerald-700 font-bold mb-1">
              ✦ PUBLISHING COMPLETE ✦
            </span>

            <h3 className="text-3xl font-serif font-bold text-[#1A1612] tracking-tight mb-2">
              Your book is ready!
            </h3>

            <p className="text-xs sm:text-sm text-[#6B635B] mb-8 max-w-sm">
              All chapters, page blocks, and illustrations have been generated and assembled.
            </p>

            {/* 3 Primary Actions: READ, DOWNLOAD, SHARE */}
            <div className="w-full space-y-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push(`/book/${bookId}`)}
                className="w-full text-base font-semibold shadow-md py-3.5"
              >
                Read My Book <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`/api/books/${bookId}/export?format=pdf`}
                  download
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#EFECE6] bg-white hover:bg-[#F9F7F2] text-xs font-semibold text-[#1A1612] transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#9A6F3C]" />
                  <span>Download PDF</span>
                </a>

                <a
                  href={`/api/books/${bookId}/export?format=epub`}
                  download
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#EFECE6] bg-white hover:bg-[#F9F7F2] text-xs font-semibold text-[#1A1612] transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#9A6F3C]" />
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
                className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#6B635B] hover:text-[#1A1612] transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Book Link</span>
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
