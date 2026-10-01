'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Genesis & Premise Ingestion',
      subtitle: 'Prompt, Outline, or Attached Notes',
      description:
        'Supply your core thesis, outline fragment, or research archive. The Atelier editorial director classifies taxonomy, builds character consistency bibles, and establishes typographic parameters.',
      iconName: 'edit_note',
      details: [
        'Automatic book-type and tone vector detection',
        'Support for PDF, DOCX, TXT, and Markdown knowledge ingestion',
        'Pre-flight tone calibration: McCarthy Noir, Subtle Academic, Lyrical',
      ],
    },
    {
      num: '02',
      title: 'Algorithmic Synthesis & Proofing',
      subtitle: 'Chapter Engine + Latent Plate Diffusion',
      description:
        'Autonomous multi-stage generation writes chapter-by-chapter with Knuth-Plass line breaks, 4px baseline grids, and synchronized diffusion plates that maintain likeness and lighting fidelity.',
      iconName: 'auto_awesome',
      details: [
        'Multi-tier synthesis router optimizes cost and literary depth',
        'Character consistency bibles for children’s & illustrated books',
        'Automated semantic quality control and mathematical margin assembly',
      ],
    },
    {
      num: '03',
      title: 'Typeset Reader & Press Compilation',
      subtitle: 'Print-Ready CMYK PDF + Validated EPUB3',
      description:
        'Inspect your live volume in the dual-leaf Atelier reader. Refine any page using conversational editorial prompts, then compile ISO-compliant EPUB3 binaries and 300 DPI press PDFs.',
      iconName: 'print',
      details: [
        'Floating natural-language revision dock with instant rollback',
        'True spine bulk calculation based on paper caliper thickness',
        'Zero DRM lock-in with 100% full commercial rights retention',
      ],
    },
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans selection:bg-[#111111] selection:text-white">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          {/* Headline */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] text-[#9A6F3C] border border-[#EAEAEA] text-[11px] font-semibold uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A6F3C]" />
              The Atelier Publishing Pipeline
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111] tracking-tight leading-tight mb-4">
              How BookGenie Works
            </h1>
            <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-xl mx-auto">
              From a single premise to an archival, collector-grade volume in minutes.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex flex-col justify-between p-8 rounded-2xl bg-white border border-[#EAEAEA] hover:border-[#CCCCCC] shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl sm:text-4xl font-normal text-[#9A6F3C]">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] flex items-center justify-center border border-[#EAEAEA] text-[#111111]">
                      <span className="material-symbols-outlined text-[24px]">{step.iconName}</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#111111] mb-1">
                    {step.title}
                  </h3>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#9A6F3C] block mb-3">
                    {step.subtitle}
                  </span>

                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mb-6">
                    {step.description}
                  </p>

                  <ul className="space-y-2.5 pt-4 border-t border-[#EAEAEA] text-xs">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[#444444]">
                        <span className="material-symbols-outlined text-[16px] text-[#9A6F3C] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action Banner */}
          <div className="bg-[#FAF9F6] rounded-2xl border border-[#EAEAEA] p-8 sm:p-12 text-center max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#111111] mb-3 tracking-tight">
              Ready to assemble your first master volume?
            </h2>
            <p className="text-sm text-[#666666] mb-6 max-w-lg">
              Open the Creation Studio, enter your premise, and experience deterministic algorithmic publishing.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-[#111111] text-white hover:bg-black px-6 py-3 rounded-full text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span>Launch Studio Workbench</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </main>

        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
