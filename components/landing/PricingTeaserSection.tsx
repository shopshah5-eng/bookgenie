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
          {/* Single Book Tier */}
          <div className="bg-surface-container-low dark:bg-[#1a1b22] p-8 rounded-xl border border-surface-container-highest dark:border-white/10 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="font-headline-sm text-headline-sm text-primary dark:text-[#f1effa]">
                  Creator Edition
                </h3>
                <div className="font-headline-lg text-headline-lg text-primary dark:text-[#f1effa]">
                  $49
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 mb-6">
                Complete autonomous synthesis and master proofing for a single finished volume.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 font-body-sm text-body-sm text-on-surface dark:text-[#f1effa]">
                  <span className="material-symbols-outlined text-[18px] text-secondary dark:text-[#fcba64]">check</span>
                  <span>Print-Ready CMYK PDF (Interior + Spine)</span>
                </li>
                <li className="flex items-center gap-3 font-body-sm text-body-sm text-on-surface dark:text-[#f1effa]">
                  <span className="material-symbols-outlined text-[18px] text-secondary dark:text-[#fcba64]">check</span>
                  <span>EPUB3 Standard Validation</span>
                </li>
                <li className="flex items-center gap-3 font-body-sm text-body-sm text-on-surface dark:text-[#f1effa]">
                  <span className="material-symbols-outlined text-[18px] text-secondary dark:text-[#fcba64]">check</span>
                  <span>24 Style-Consistent Illustrated Plates</span>
                </li>
              </ul>
            </div>
            <Link
              href="/create"
              className="w-full py-3 rounded-full bg-surface-container dark:bg-white/10 text-on-surface dark:text-[#f1effa] hover:bg-surface-variant dark:hover:bg-white/15 font-label-ui text-label-ui transition-colors text-center inline-block"
            >
              Synthesize Single Book
            </Link>
          </div>

          {/* Studio Atelier Tier */}
          <div className="bg-primary dark:bg-[#000000] text-on-primary p-8 rounded-xl border border-primary/20 dark:border-white/15 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-headline-sm text-white">
                    Studio Atelier
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-white font-label-caps text-[10px] uppercase tracking-wider">
                    Unrestricted
                  </span>
                </div>
                <div className="font-headline-lg text-headline-lg text-white">
                  $129 <span className="font-body-sm text-body-sm text-neutral-400 font-normal">/mo</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-neutral-300 mb-6">
                For active authors, independent presses, and design studios producing regular catalog titles.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 font-body-sm text-body-sm text-white">
                  <span className="material-symbols-outlined text-[18px] text-[#fcba64]">check</span>
                  <span>Unlimited Folio Syntheses &amp; Re-typesetting</span>
                </li>
                <li className="flex items-center gap-3 font-body-sm text-body-sm text-white">
                  <span className="material-symbols-outlined text-[18px] text-[#fcba64]">check</span>
                  <span>Custom Font License Ingestion &amp; OpenType ligatures</span>
                </li>
                <li className="flex items-center gap-3 font-body-sm text-body-sm text-white">
                  <span className="material-symbols-outlined text-[18px] text-[#fcba64]">check</span>
                  <span>IngramSpark Direct Automated Submission API</span>
                </li>
              </ul>
            </div>
            <Link
              href="/create"
              className="w-full py-3 rounded-full bg-white text-black hover:bg-neutral-100 font-label-ui text-label-ui transition-colors text-center inline-block"
            >
              Join Studio Atelier
            </Link>
          </div>
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
