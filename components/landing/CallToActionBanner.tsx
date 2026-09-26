'use client';

import React from 'react';
import Link from 'next/link';

export function CallToActionBanner() {
  return (
    <section className="w-full py-24 bg-surface-container-low dark:bg-[#1a1b22]/50 text-center relative overflow-hidden border-t border-surface-container-highest dark:border-white/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-surface-container-lowest dark:bg-white/10 shadow-xs flex items-center justify-center mb-6 text-primary dark:text-[#fcba64]">
          <span className="material-symbols-outlined text-2xl">history_edu</span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-primary dark:text-[#f1effa] tracking-tight mb-4">
          Your next volume begins with a single premise.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-neutral-400 max-w-lg mb-8 leading-relaxed">
          No design software required. Type your outline, select your paper trim, and watch the atelier assemble your master edition.
        </p>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-primary dark:bg-white text-on-primary dark:text-black px-8 py-4 rounded-full font-label-ui text-label-ui shadow-md hover:shadow-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all cursor-pointer"
        >
          <span>Launch Studio Workbench</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
