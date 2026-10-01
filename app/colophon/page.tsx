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
      <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans selection:bg-[#111111] selection:text-white">
        <Header />

        <main className="flex-1 w-full pt-12 pb-24">
          <div className="max-w-4xl mx-auto px-6 sm:px-8">
            {/* Header badge */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#EAEAEA] text-[#9A6F3C] mb-6 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A6F3C]" />
                <span className="text-[11px] font-semibold tracking-widest uppercase">
                  TECHNICAL &amp; TYPOGRAPHIC SPECIFICATION
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111111] font-normal tracking-tight mb-4">
                The Atelier Colophon
              </h1>
              <p className="text-sm sm:text-base text-[#666666] max-w-2xl mx-auto leading-relaxed">
                Details regarding the typography, algorithmic layout mathematics, file formats, and autonomous publishing architecture of BookGenie.
              </p>
            </div>

            {/* Colophon Sections */}
            <div className="space-y-10 border-t border-[#EAEAEA] pt-12">
              
              {/* 1. Typography */}
              <section className="bg-white border border-[#EAEAEA] rounded-2xl p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#9A6F3C] text-2xl">text_fields</span>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#111111] font-semibold">
                    1. Typographic Architecture
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#666666]">
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAEAEA]">
                    <p className="font-serif text-xl text-[#111111] mb-2 font-bold">
                      San Francisco (SF Pro)
                    </p>
                    <p className="text-xs leading-relaxed text-[#666666] mb-2">
                      Primary Display &amp; Editorial Body. Apple&apos;s system typographic standard with supreme legibility, neutral geometry, and balanced rhythm.
                    </p>
                    <span className="text-[10px] uppercase font-mono text-[#9A6F3C] font-semibold">Apple Native // Fluid</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAEAEA]">
                    <p className="text-xl text-[#111111] mb-2 font-semibold">
                      Editorial Sans
                    </p>
                    <p className="text-xs leading-relaxed text-[#666666] mb-2">
                      Modernist Interface &amp; Folio Sans. Precision-engineered sans-serif for running headers, page numbers, callouts, and interactive controls.
                    </p>
                    <span className="text-[10px] uppercase font-mono text-[#9A6F3C] font-semibold">Interface // 9pt / 14pt</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAEAEA]">
                    <p className="text-lg text-[#111111] mb-2 font-mono font-semibold">
                      SF Mono
                    </p>
                    <p className="text-xs leading-relaxed text-[#666666] mb-2">
                      Technical Blueprint &amp; Folio Metas. Monospaced clarity for generation manifests, version tracking, ISBN metadata, and print trim dimensions.
                    </p>
                    <span className="text-[10px] uppercase font-mono text-[#9A6F3C] font-semibold">Monospace Code // 11pt</span>
                  </div>
                </div>
              </section>

              {/* 2. Substrate & Palette */}
              <section className="bg-white border border-[#EAEAEA] rounded-2xl p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#9A6F3C] text-2xl">palette</span>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#111111] font-semibold">
                    2. Substrate Standards &amp; Chromatic System
                  </h2>
                </div>
                <div className="space-y-4 text-[#666666] text-sm leading-relaxed">
                  <p>
                    BookGenie designs publications using warm, non-glare optical substrates inspired by classic letterpress and bookbinding traditions:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-[#EAEAEA] bg-[#FAF7F0] text-[#1A1612]">
                      <div className="w-8 h-8 rounded-full bg-[#FAF7F0] border border-[#E8DFC8] shadow-xs shrink-0" />
                      <div>
                        <p className="font-semibold text-xs text-[#111111]">Warm Ivory</p>
                        <p className="text-[11px] font-mono text-[#666666]">#FAF7F0 / 92% White</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-[#EAEAEA] bg-[#FFFFFF] text-[#111111]">
                      <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#EAEAEA] shadow-xs shrink-0" />
                      <div>
                        <p className="font-semibold text-xs text-[#111111]">Pure White</p>
                        <p className="text-[11px] font-mono text-[#666666]">#FFFFFF / Minimal Canvas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-[#EAEAEA] bg-[#F5F5F0] text-[#111111]">
                      <div className="w-8 h-8 rounded-full bg-[#F5F5F0] border border-[#EAEAEA] shadow-xs shrink-0" />
                      <div>
                        <p className="font-semibold text-xs text-[#111111]">Linen Cream</p>
                        <p className="text-[11px] font-mono text-[#666666]">#F5F5F0 / Subtle Tone</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Output Formats */}
              <section className="bg-white border border-[#EAEAEA] rounded-2xl p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#9A6F3C] text-2xl">print</span>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#111111] font-semibold">
                    3. File Specifications &amp; Open Standards
                  </h2>
                </div>
                <div className="space-y-4 text-[#666666] text-sm leading-relaxed">
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAEAEA]">
                    <h3 className="font-semibold text-[#111111] mb-1">
                      Vector PDF (Print &amp; Digital)
                    </h3>
                    <p className="text-xs leading-relaxed text-[#666666]">
                      Typeset directly via deterministic PDFKit rendering pipelines. Master files include vector font embeddings, running folios, structured block layouts (callouts, bullet lists, dividers), and 300 DPI visual plates ready for KDP or local short-run printers.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAEAEA]">
                    <h3 className="font-semibold text-[#111111] mb-1">
                      EPUB 3.0.1 Packaging
                    </h3>
                    <p className="text-xs leading-relaxed text-[#666666]">
                      Standardized Open Publication Structure (OPS) container complying strictly with IDPF EPUBCheck specifications. Includes valid UUID identifiers, clean navigation tables of contents, semantic XHTML, and reflowable CSS typography for Apple Books and Kindle.
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. Rights & Author Ownership */}
              <section className="bg-white border border-[#EAEAEA] rounded-2xl p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#9A6F3C] text-2xl">verified_user</span>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#111111] font-semibold">
                    4. Intellectual Property &amp; Commercial Rights
                  </h2>
                </div>
                <p className="text-sm text-[#666666] leading-relaxed">
                  Every book generated with BookGenie is 100% the intellectual property of the author. We claim zero royalties, zero publisher commissions, and apply no digital rights management (DRM) or watermarks to exported PDF or EPUB master files.
                </p>
              </section>

            </div>

            {/* Back CTA */}
            <div className="text-center pt-14">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 bg-[#111111] text-white hover:bg-black px-7 py-3 rounded-full text-sm font-semibold shadow-xs transition-colors cursor-pointer"
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
