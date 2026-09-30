'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Download, Sparkles, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { EBOOK_CATALOG, EbookProduct } from '@/lib/ebooks/catalog';
import { EbookCheckoutModal } from './EbookCheckoutModal';

interface CuratedEbooksSectionProps {
  userEmail?: string;
  isOwner?: boolean;
}

export function CuratedEbooksSection({ userEmail = '', isOwner = false }: CuratedEbooksSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<EbookProduct | null>(null);
  const starterKit = EBOOK_CATALOG['starter-kit'];
  const blueprint = EBOOK_CATALOG['blueprint'];
  const glowUp = EBOOK_CATALOG['glow-up'];

  return (
    <section className="mb-14 pb-12 border-b border-[#EAEAEA]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Featured Digital Editions</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#111111] font-normal tracking-tight">
            Curated Master Editions & Field Guides (2026)
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] font-light mt-1">
            Official companion guides, profit blueprints, and actionable field playbooks.
          </p>
        </div>

        {isOwner && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-medium self-start sm:self-auto shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>VIP Publisher: {userEmail}</span>
          </div>
        )}
      </div>

      {/* Three Ebook Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CARD 1: THE FIRST $100 ONLINE (FREE) */}
        <div className="bg-[#FAF8F5] rounded-3xl border border-[#EAE4D8] hover:border-amber-300 transition-all p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between group">
          <div>
            <div className="flex items-start gap-4 mb-5">
              {/* Cover */}
              <div className="relative w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden shadow-md shrink-0 border border-black/10 bg-neutral-900">
                <Image
                  src={starterKit.coverImage}
                  alt={starterKit.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Header details */}
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-[10px] font-bold tracking-wide uppercase mb-1">
                  {starterKit.badge}
                </span>
                <h3 className="font-serif text-lg font-normal text-[#111111] leading-snug mb-1">
                  {starterKit.title}
                </h3>
                <p className="text-xs text-[#7A7067] line-clamp-2 mb-2 font-light">
                  {starterKit.subtitle}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-emerald-700">FREE</span>
                  <span className="text-xs text-neutral-400 line-through">₹499</span>
                  <span className="text-xs text-[#8A8077] font-medium">• 12p</span>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <ul className="space-y-1.5 mb-5 pt-3 border-t border-[#ECE5D8]">
              {starterKit.highlights.slice(0, 3).map((h, i) => (
                <li key={i} className="text-xs text-[#554E46] flex items-start gap-2">
                  <span className="text-amber-700 font-bold">✓</span>
                  <span className="line-clamp-2">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action */}
          <div className="pt-3 border-t border-[#ECE5D8]">
            <a
              href="/api/ebooks/download/starter-kit"
              download
              className="w-full py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>Download Free PDF</span>
            </a>
          </div>
        </div>

        {/* CARD 2: THE DIGITAL PRODUCT PROFIT BLUEPRINT (₹299) */}
        <div className="bg-[#121215] text-white rounded-3xl border border-neutral-800 hover:border-amber-500/50 transition-all p-6 shadow-[0_4px_24px_rgba(0,0,0,0.12)] flex flex-col justify-between group relative overflow-hidden">
          {/* Subtle gold ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-start gap-4 mb-5 relative z-10">
              {/* Cover */}
              <div className="relative w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden shadow-lg shrink-0 border border-amber-500/30 bg-black">
                <Image
                  src={blueprint.coverImage}
                  alt={blueprint.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Header details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold tracking-wide uppercase">
                    {blueprint.badge}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-normal text-white leading-snug mb-1">
                  {blueprint.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2 mb-2 font-light">
                  {blueprint.subtitle}
                </p>

                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-amber-400">
                    ₹{blueprint.priceInr}
                  </span>
                  <span className="text-xs text-neutral-500 line-through">₹999</span>
                  <span className="text-xs text-neutral-400">• 96p</span>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <ul className="space-y-1.5 mb-5 pt-3 border-t border-neutral-800 relative z-10">
              {blueprint.highlights.slice(0, 3).map((h, i) => (
                <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span className="line-clamp-2">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action */}
          <div className="pt-3 border-t border-neutral-800 relative z-10 flex flex-col gap-2">
            {isOwner ? (
              <a
                href="/api/ebooks/download/blueprint"
                download
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs font-bold text-center transition-all inline-flex items-center justify-center gap-1.5"
                title="Direct VIP Download"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Owner PDF (Instant VIP)</span>
              </a>
            ) : (
              <button
                onClick={() => setSelectedProduct(blueprint)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Lock className="w-3.5 h-3.5 text-neutral-900" />
                <span>Checkout — ₹299</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* CARD 3: 30 DAY GLOW UP MAN PLAN (40-PAGE FIELD GUIDE) */}
        <div className="bg-[#FAF8F5] rounded-3xl border border-[#EAE4D8] hover:border-amber-400 transition-all p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between group">
          <div>
            <div className="flex items-start gap-4 mb-5">
              {/* Cover */}
              <div className="relative w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden shadow-md shrink-0 border border-black/10 bg-neutral-900">
                <Image
                  src={glowUp.coverImage}
                  alt={glowUp.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Header details */}
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-[10px] font-bold tracking-wide uppercase mb-1">
                  {glowUp.badge}
                </span>
                <h3 className="font-serif text-lg font-normal text-[#111111] leading-snug mb-1">
                  {glowUp.title}
                </h3>
                <p className="text-xs text-[#7A7067] line-clamp-2 mb-2 font-light">
                  {glowUp.subtitle}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-emerald-700">FREE</span>
                  <span className="text-xs text-neutral-400 line-through">₹699</span>
                  <span className="text-xs text-[#8A8077] font-medium">• 40 Pages</span>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <ul className="space-y-1.5 mb-5 pt-3 border-t border-[#ECE5D8]">
              {glowUp.highlights.slice(0, 3).map((h, i) => (
                <li key={i} className="text-xs text-[#554E46] flex items-start gap-2">
                  <span className="text-amber-700 font-bold">✓</span>
                  <span className="line-clamp-2">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action */}
          <div className="pt-3 border-t border-[#ECE5D8]">
            <a
              href="/api/ebooks/download/glow-up"
              download
              className="w-full py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>Download 40-Page Field Guide</span>
            </a>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedProduct && (
        <EbookCheckoutModal
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          initialEmail={userEmail}
          isOwner={isOwner}
        />
      )}
    </section>
  );
}
