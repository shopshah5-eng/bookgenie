'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A1612]/45 backdrop-blur-md"
          />

          {/* Modal Container: Bottom Sheet on Mobile, Centered Card on Desktop */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={cn(
              'relative z-10 w-full max-w-lg bg-white sm:rounded-2xl rounded-t-2xl border border-[#EFECE6] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col',
              className
            )}
          >
            {/* Mobile Drag/Indicator handle */}
            <div className="sm:hidden w-12 h-1.5 bg-[#E8E4DC] rounded-full mx-auto mb-4" />

            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 text-[#9E968E] hover:text-[#1A1612] hover:bg-[#F6F2EA] rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="overflow-y-auto pr-0.5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
