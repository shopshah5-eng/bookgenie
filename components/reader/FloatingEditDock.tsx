'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronUp, ChevronDown, Loader2, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface FloatingEditDockProps {
  currentPageNumber: number;
  totalPages: number;
  onRegenerate: (instruction: string, pageNumber?: number) => Promise<void>;
  isUpdating: boolean;
  versionNumber: number;
}

export function FloatingEditDock({
  currentPageNumber,
  totalPages,
  onRegenerate,
  isUpdating,
  versionNumber,
}: FloatingEditDockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [pageTarget, setPageTarget] = useState<string>(currentPageNumber.toString());
  const [justUpdated, setJustUpdated] = useState(false);

  // Sync active page when user flips pages
  React.useEffect(() => {
    setPageTarget(currentPageNumber.toString());
  }, [currentPageNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;

    const parsedPage = parseInt(pageTarget, 10);
    const target = isNaN(parsedPage) ? undefined : parsedPage;

    await onRegenerate(instruction, target);
    setInstruction('');
    setIsExpanded(false);
    setJustUpdated(true);
    setTimeout(() => setJustUpdated(false), 3500);
  };

  return (
    <div
      className={`fixed z-40 pointer-events-none transition-all ${
        isExpanded
          ? 'inset-x-0 bottom-0 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl sm:px-4 w-full'
          : 'bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4'
      }`}
    >
      <div className="pointer-events-auto">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* =========================================================================
               COLLAPSED STATE: Minimalist luxury floating pill
               ========================================================================= */
            <motion.div
              key="collapsed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={() => setIsExpanded(true)}
              className="group mx-auto max-w-sm flex items-center justify-between gap-3 px-5 py-3 rounded-full bg-white/95 backdrop-blur-md border border-[#EAE3D5] text-[#1A1612] shadow-xl hover:shadow-2xl cursor-pointer transition-all hover:border-[#9A6F3C] active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#F8F3EA] text-[#8C5F2E] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-tight">
                  ✨ What would you like to change?
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isUpdating ? (
                  <span className="text-[11px] text-[#9A6F3C] font-semibold flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Updating...
                  </span>
                ) : justUpdated ? (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> v{versionNumber} Active
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-[#8C5F2E] px-2 py-0.5 rounded-full bg-[#F9F4EC] border border-[#E8DFC8]">
                    v{versionNumber}
                  </span>
                )}
                <ChevronUp className="w-4 h-4 text-[#9E968E] group-hover:text-[#1A1612] transition-transform" />
              </div>
            </motion.div>
          ) : (
            /* =========================================================================
               EXPANDED STATE: Bottom sheet on mobile, centered card on desktop
               ========================================================================= */
            <motion.div
              key="expanded"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl rounded-b-none sm:rounded-b-3xl border border-[#EFECE6] p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F4F1EA] mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#9A6F3C]" />
                  <span className="text-sm font-bold font-serif text-[#1A1612]">
                    Natural-Language Revision
                  </span>
                  <span className="text-[10px] text-[#9E968E]">
                    (Creates Version {versionNumber + 1})
                  </span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 text-[#9E968E] hover:text-[#1A1612] rounded-full hover:bg-[#F6F2EA]"
                  aria-label="Collapse prompt dock"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-[#6B635B] shrink-0">
                    Target Page (optional):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={pageTarget}
                    onChange={(e) => setPageTarget(e.target.value)}
                    placeholder="e.g. 12"
                    className="w-16 px-2 py-1 text-xs text-center font-semibold rounded-lg border border-[#EFECE6] bg-[#FDFBF7] focus:outline-none focus:border-[#9A6F3C]"
                  />
                  <span className="text-[11px] text-[#9E968E]">
                    (Leave blank for whole-book adjustment)
                  </span>
                </div>

                <textarea
                  rows={3}
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Tell BookGenie what you'd like to change... e.g. 'Make this section easier to understand and add a small illustration of the fox.'"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EFECE6] bg-[#FDFBF7] text-[#1A1612] placeholder:text-[#9E968E] focus:outline-none focus:border-[#9A6F3C] resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#9E968E] italic">
                    Text modifications modify text only; illustrations regenerate only if requested.
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={isUpdating}
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1" /> Regenerate
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
