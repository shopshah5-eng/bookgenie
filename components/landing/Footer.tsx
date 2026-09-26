'use client';

import React from 'react';
import Link from 'next/link';
import { MonogramLogo } from '@/components/brand/MonogramLogo';

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low dark:bg-[#0d0d11] border-t border-surface-container-highest dark:border-white/10 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand Colophon Column */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-3">
              <MonogramLogo />
            </Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 max-w-sm mb-4 leading-relaxed">
              An expansive atelier where digital precision meets the tactile gravitas of fine bookmaking. Algorithmic intelligence tailored for distinguished authors and boutique publishers.
            </p>
            <span className="inline-flex items-center font-label-caps text-label-caps text-secondary dark:text-[#fcba64] uppercase tracking-widest bg-surface-container dark:bg-white/5 border border-surface-container-highest dark:border-white/10 px-3 py-1 rounded">
              Folio Edition • v3.0
            </span>
          </div>

          {/* Product */}
          <div>
            <span className="block font-label-caps text-label-caps text-on-surface dark:text-[#f1effa] uppercase tracking-wider mb-4 font-semibold">
              Product
            </span>
            <ul className="space-y-2.5">
              <li>
                <Link href="/create" className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 hover:text-on-surface dark:hover:text-white transition-colors">
                  Atelier Studio
                </Link>
              </li>
              <li>
                <Link href="/examples" className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 hover:text-on-surface dark:hover:text-white transition-colors">
                  Reader Folio
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 hover:text-on-surface dark:hover:text-white transition-colors">
                  Typesetting Engine
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 hover:text-on-surface dark:hover:text-white transition-colors">
                  Editions &amp; Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Creation Pipeline */}
          <div>
            <span className="block font-label-caps text-label-caps text-on-surface dark:text-[#f1effa] uppercase tracking-wider mb-4 font-semibold">
              Creation Pipeline
            </span>
            <ul className="space-y-2.5">
              <li>
                <Link href="/create" className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 hover:text-on-surface dark:hover:text-white transition-colors">
                  Manuscript Ingestion
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 hover:text-on-surface dark:hover:text-white transition-colors">
                  Algorithmic Proofing
                </Link>
              </li>
              <li>
                <Link href="/examples" className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 hover:text-on-surface dark:hover:text-white transition-colors">
                  Curated Showcase
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 hover:text-on-surface dark:hover:text-white transition-colors">
                  Print-Ready Exports
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Atelier */}
          <div>
            <span className="block font-label-caps text-label-caps text-on-surface dark:text-[#f1effa] uppercase tracking-wider mb-4 font-semibold">
              Legal &amp; Atelier
            </span>
            <ul className="space-y-2.5">
              <li>
                <Link href="/terms" className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 hover:text-on-surface dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 hover:text-on-surface dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 hover:text-on-surface dark:hover:text-white transition-colors">
                  Cookie Directives
                </Link>
              </li>
              <li>
                <Link href="/colophon" className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 hover:text-on-surface dark:hover:text-white transition-colors">
                  Colophon
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Colophon line */}
        <div className="pt-6 border-t border-surface-container-highest dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400">
            © 2026 BookGenie Studio. All rights reserved. Precision AI Publishing.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400">
              Typography: Playfair Display &amp; Plus Jakarta Sans
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
