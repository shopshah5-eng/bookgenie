'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function ColophonPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-surface-container-lowest dark:bg-[#121217] text-on-surface dark:text-[#f1effa] transition-colors">
        <Header />

        <main className="flex-1 w-full pt-12 pb-24">
          <div className="max-w-4xl mx-auto px-6 sm:px-8">
            {/* Header badge */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container dark:bg-white/5 border border-surface-container-highest dark:border-white/10 text-on-surface-variant dark:text-neutral-400 mb-6 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#fcba64]" />
                <span className="font-label-caps text-label-caps tracking-widest text-on-surface dark:text-[#f1effa]">
                  TECHNICAL &amp; TYPOGRAPHIC SPECIFICATION
                </span>
              </div>
              <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-primary dark:text-[#f1effa] tracking-tight mb-4">
                The Atelier Colophon
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                Details regarding the typography, algorithmic layout mathematics, file formats, and autonomous publishing architecture of BookGenie.
              </p>
            </div>

            {/* Colophon Sections */}
            <div className="space-y-12 border-t border-surface-container-highest dark:border-white/10 pt-12">
              
              {/* 1. Typography */}
              <section className="bg-surface-container-low dark:bg-[#1a1b22] border border-surface-container-highest dark:border-white/10 rounded-2xl p-8 sm:p-10 shadow-xs">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-2xl">text_fields</span>
                  <h2 className="font-headline-sm text-2xl text-primary dark:text-[#f1effa]">
                    1. Typographic Architecture
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body-md text-sm text-on-surface-variant dark:text-neutral-300">
                  <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-black/30 border border-surface-container-highest dark:border-white/10">
                    <p className="font-title-editorial text-2xl text-primary dark:text-[#f1effa] mb-2 font-bold">
                      Cormorant Garamond
                    </p>
                    <p className="text-xs leading-relaxed text-on-surface-variant dark:text-neutral-400 mb-2">
                      Primary Display &amp; Classical Editorial Body. A traditional serif with delicate contrast, optimized for immersive long-form reading and chapter headings.
                    </p>
                    <span className="font-code-spec text-[10px] uppercase text-secondary dark:text-[#fcba64]">Primary Serif // 16pt / 26pt</span>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-black/30 border border-surface-container-highest dark:border-white/10">
                    <p className="font-headline-sm text-xl text-primary dark:text-[#f1effa] mb-2 font-semibold font-sans">
                      Plus Jakarta Sans
                    </p>
                    <p className="text-xs leading-relaxed text-on-surface-variant dark:text-neutral-400 mb-2">
                      Modernist Interface &amp; Folio Sans. Precision engineered geometric sans-serif for running headers, page numbers, callouts, and interactive controls.
                    </p>
                    <span className="font-code-spec text-[10px] uppercase text-secondary dark:text-[#fcba64]">Interface Sans // 9pt / 14pt</span>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-black/30 border border-surface-container-highest dark:border-white/10">
                    <p className="font-code-spec text-lg text-primary dark:text-[#f1effa] mb-2 font-mono">
                      JetBrains Mono
                    </p>
                    <p className="text-xs leading-relaxed text-on-surface-variant dark:text-neutral-400 mb-2">
                      Technical Blueprint &amp; Folio Metas. Monospaced clarity for generation manifests, version tracking, ISBN metadata, and print trim dimensions.
                    </p>
                    <span className="font-code-spec text-[10px] uppercase text-secondary dark:text-[#fcba64]">Monospace Code // 11pt</span>
                  </div>
                </div>
              </section>

              {/* 2. Substrate & Palette */}
              <section className="bg-surface-container-low dark:bg-[#1a1b22] border border-surface-container-highest dark:border-white/10 rounded-2xl p-8 sm:p-10 shadow-xs">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-2xl">palette</span>
                  <h2 className="font-headline-sm text-2xl text-primary dark:text-[#f1effa]">
                    2. Substrate Standards &amp; Chromatic System
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant dark:text-neutral-300 font-body-md text-sm leading-relaxed">
                  <p>
                    BookGenie designs publications using warm, non-glare optical substrates inspired by classic letterpress and bookbinding traditions:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-surface-container-highest dark:border-white/10 bg-[#FAF7F0] text-[#1A1612]">
                      <div className="w-8 h-8 rounded-full bg-[#FAF7F0] border border-[#E8DFC8] shadow-xs shrink-0" />
                      <div>
                        <p className="font-semibold text-xs">Warm Ivory</p>
                        <p className="font-code-spec text-[11px] text-[#6B635B]">#FAF7F0 / 92% White</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-surface-container-highest dark:border-white/10 bg-[#FCFBF9] text-[#18181B]">
                      <div className="w-8 h-8 rounded-full bg-[#FCFBF9] border border-[#E5E5EA] shadow-xs shrink-0" />
                      <div>
                        <p className="font-semibold text-xs">Linen Cream</p>
                        <p className="font-code-spec text-[11px] text-[#6B635B]">#FCFBF9 / Standard Folio</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-surface-container-highest dark:border-white/10 bg-[#1E1E24] text-[#E4E1E6]">
                      <div className="w-8 h-8 rounded-full bg-[#1E1E24] border border-[#33333F] shadow-xs shrink-0" />
                      <div>
                        <p className="font-semibold text-xs text-white">Muted Charcoal</p>
                        <p className="font-code-spec text-[11px] text-neutral-400">#1E1E24 / Night Reading</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Output Formats */}
              <section className="bg-surface-container-low dark:bg-[#1a1b22] border border-surface-container-highest dark:border-white/10 rounded-2xl p-8 sm:p-10 shadow-xs">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-2xl">print</span>
                  <h2 className="font-headline-sm text-2xl text-primary dark:text-[#f1effa]">
                    3. File Specifications &amp; Open Standards
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant dark:text-neutral-300 font-body-md text-sm leading-relaxed">
                  <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-black/30 border border-surface-container-highest dark:border-white/10">
                    <h3 className="font-semibold text-primary dark:text-[#f1effa] mb-1">
                      Vector PDF (Print &amp; Digital)
                    </h3>
                    <p className="text-xs leading-relaxed text-on-surface-variant dark:text-neutral-400">
                      Typeset directly via deterministic PDFKit rendering pipelines. Master files include vector font embeddings, running folios, structured block layouts (callouts, bullet lists, dividers), and 300 DPI visual plates ready for KDP or local short-run printers.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-black/30 border border-surface-container-highest dark:border-white/10">
                    <h3 className="font-semibold text-primary dark:text-[#f1effa] mb-1">
                      EPUB 3.0.1 Packaging
                    </h3>
                    <p className="text-xs leading-relaxed text-on-surface-variant dark:text-neutral-400">
                      Standardized Open Publication Structure (OPS) container complying strictly with IDPF EPUBCheck specifications. Includes valid UUID identifiers, clean navigation tables of contents, semantic XHTML, and reflowable CSS typography for Apple Books and Kindle.
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. Rights & Author Ownership */}
              <section className="bg-surface-container-low dark:bg-[#1a1b22] border border-surface-container-highest dark:border-white/10 rounded-2xl p-8 sm:p-10 shadow-xs">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-2xl">verified_user</span>
                  <h2 className="font-headline-sm text-2xl text-primary dark:text-[#f1effa]">
                    4. Intellectual Property &amp; Commercial Rights
                  </h2>
                </div>
                <p className="font-body-md text-sm text-on-surface-variant dark:text-neutral-300 leading-relaxed">
                  Every book generated with BookGenie is 100% the intellectual property of the author. We claim zero royalties, zero publisher commissions, and apply no digital rights management (DRM) or watermarks to exported PDF or EPUB master files.
                </p>
              </section>

            </div>

            {/* Back CTA */}
            <div className="text-center pt-14">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 bg-primary dark:bg-white text-on-primary dark:text-black px-7 py-3 rounded-full font-label-ui text-sm shadow-xs hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium cursor-pointer"
              >
                <span>Return to Creation Studio</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
