'use client';

import React from 'react';
import Link from 'next/link';

export function PricingTeaserSection() {
  return (
    <section className="w-full py-24 bg-surface-container-lowest dark:bg-[#121217]" id="pricing">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary dark:text-[#fcba64] block mb-2">
          Simple Atelier Pricing
        </span>
        <h2 className="font-headline-lg text-headline-lg text-primary dark:text-[#f1effa] tracking-tight mb-4">
          Unrestricted Authorship
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-neutral-400 max-w-lg mx-auto mb-14">
          Clear, transparent access without recurring seat locks or print markups.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Free Starter Tier */}
          <div className="bg-surface-container-low dark:bg-[#1a1b22] p-8 rounded-xl border border-surface-container-highest dark:border-white/10 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="font-headline-sm text-headline-sm text-primary dark:text-[#f1effa]">
                  Free Starter
                </h3>
                <div className="font-headline-lg text-headline-lg text-primary dark:text-[#f1effa]">
                  $0
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 mb-6">
                Generate your first full book and read it in the dual-page folio reader with zero commitment.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 font-body-sm text-body-sm text-on-surface dark:text-[#f1effa]">
                  <span className="material-symbols-outlined text-[18px] text-secondary dark:text-[#fcba64]">check</span>
                  <span>1 Finished Book (Up to 16 Pages)</span>
                </li>
                <li className="flex items-center gap-3 font-body-sm text-body-sm text-on-surface dark:text-[#f1effa]">
                  <span className="material-symbols-outlined text-[18px] text-secondary dark:text-[#fcba64]">check</span>
                  <span>4 Illustrated Plates &amp; Cover Art</span>
                </li>
                <li className="flex items-center gap-3 font-body-sm text-body-sm text-on-surface dark:text-[#f1effa]">
                  <span className="material-symbols-outlined text-[18px] text-secondary dark:text-[#fcba64]">check</span>
                  <span>1 Free PDF &amp; EPUB 3.0 Download</span>
                </li>
                <li className="flex items-center gap-3 font-body-sm text-body-sm text-on-surface dark:text-[#f1effa]">
                  <span className="material-symbols-outlined text-[18px] text-secondary dark:text-[#fcba64]">check</span>
                  <span>Private Interactive Web Reader</span>
                </li>
              </ul>
            </div>
            <Link
              href="/create"
              className="w-full py-3 rounded-full bg-surface-container dark:bg-white/10 text-on-surface dark:text-[#f1effa] hover:bg-surface-variant dark:hover:bg-white/15 font-label-ui text-label-ui transition-colors text-center inline-block font-semibold"
            >
              Start Creating Free
            </Link>
          </div>

          {/* Pro Creator Tier */}
          <div className="bg-primary dark:bg-[#000000] text-on-primary p-8 rounded-xl border border-primary/20 dark:border-white/15 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-headline-sm text-white">
                    Pro Creator
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-white font-label-caps text-[10px] uppercase tracking-wider font-semibold">
                    Best Value
                  </span>
                </div>
                <div className="font-headline-lg text-headline-lg text-white">
                  $15 <span className="font-body-sm text-body-sm text-neutral-400 font-normal">/mo</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-neutral-300 mb-6">
                For active authors, teachers, and creators publishing books ready for Amazon KDP &amp; Apple Books.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 font-body-sm text-body-sm text-white">
                  <span className="material-symbols-outlined text-[18px] text-[#fcba64]">check</span>
                  <span><strong>15 Complete Books</strong> Per Month (up to 64 pages)</span>
                </li>
                <li className="flex items-center gap-3 font-body-sm text-body-sm text-white">
                  <span className="material-symbols-outlined text-[18px] text-[#fcba64]">check</span>
                  <span><strong>UNLIMITED EPUB &amp; 300 DPI PDF Exports</strong></span>
                </li>
                <li className="flex items-center gap-3 font-body-sm text-body-sm text-white">
                  <span className="material-symbols-outlined text-[18px] text-[#fcba64]">check</span>
                  <span>Up to 60 Style-Consistent Illustrated Plates / mo</span>
                </li>
                <li className="flex items-center gap-3 font-body-sm text-body-sm text-white">
                  <span className="material-symbols-outlined text-[18px] text-[#fcba64]">check</span>
                  <span>100% Commercial Rights &amp; No Watermarks</span>
                </li>
              </ul>
            </div>
            <Link
              href="/pricing"
              className="w-full py-3 rounded-full bg-white text-black hover:bg-neutral-100 font-label-ui text-label-ui transition-colors text-center inline-block font-semibold"
            >
              Upgrade to Pro ($15/mo)
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/pricing"
            className="font-label-ui text-sm text-secondary dark:text-[#fcba64] hover:underline inline-flex items-center gap-1.5 font-medium"
          >
            <span>Need high-volume publisher tools? Explore Premium Atelier ($39/mo)</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* Assurance note */}
        <div className="mt-10 flex items-center justify-center gap-2 text-on-surface-variant dark:text-neutral-400 font-code-spec text-code-spec">
          <span className="material-symbols-outlined text-sm text-secondary dark:text-[#fcba64]">verified_user</span>
          <span>100% full copyright retention • Commercial license • Zero royalties retained</span>
        </div>
      </div>
    </section>
  );
}
