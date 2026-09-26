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
        'Multi-tier AI router optimizes cost and literary depth',
        'Character consistency bibles for children’s & illustrated books',
        'Automated semantic quality control and mathematical margin assembly',
      ],
    },
    {
      num: '03',
      title: 'Typeset Reader & Press Compilation',
      subtitle: 'Print-Ready CMYK PDF + Validated EPUB3',
      description:
        'Inspect your live volume in the dual-leaf Atelier reader. Refine any page using conversational AI prompts, then compile ISO-compliant EPUB3 binaries and 300 DPI press PDFs.',
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
      <div className="min-h-screen flex flex-col bg-surface-container-lowest dark:bg-[#121217] text-on-surface dark:text-[#f1effa] transition-colors">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          {/* Headline */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container dark:bg-white/10 text-secondary dark:text-[#fcba64] border border-surface-container-highest dark:border-white/10 text-[11px] font-label-caps uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#fcba64]" />
              The Atelier Publishing Pipeline
            </span>
            <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-primary dark:text-[#f1effa] tracking-tight leading-none mb-4">
              How BookGenie Works
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-neutral-400">
              From a single premise to an archival, collector-grade volume in minutes.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex flex-col justify-between p-8 rounded-xl bg-surface-container-lowest dark:bg-[#181820] border border-surface-container-highest dark:border-white/10 shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display-hero text-3xl font-bold text-secondary dark:text-[#fcba64]">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-lg bg-surface-container-low dark:bg-white/5 flex items-center justify-center border border-surface-container-highest dark:border-white/10 text-primary dark:text-[#fcba64]">
                      <span className="material-symbols-outlined text-[24px]">{step.iconName}</span>
                    </div>
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-primary dark:text-[#f1effa] mb-1">
                    {step.title}
                  </h3>
                  <span className="font-label-caps text-xs uppercase tracking-wider font-semibold text-secondary dark:text-[#fcba64] block mb-3">
                    {step.subtitle}
                  </span>

                  <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-300 leading-relaxed mb-6">
                    {step.description}
                  </p>

                  <ul className="space-y-2.5 pt-4 border-t border-surface-container-highest dark:border-white/10 text-xs">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-on-surface dark:text-[#f1effa]">
                        <span className="material-symbols-outlined text-[16px] text-secondary dark:text-[#fcba64] shrink-0 mt-0.5">
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
          <div className="bg-surface-container-low dark:bg-[#181820] rounded-2xl border border-surface-container-highest dark:border-white/10 p-8 sm:p-12 text-center max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="font-headline-md text-headline-md text-primary dark:text-[#f1effa] mb-3 tracking-tight">
              Ready to assemble your first master volume?
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-neutral-400 mb-6 max-w-lg">
              Open the Creation Studio, enter your premise, and experience deterministic algorithmic publishing.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-primary dark:bg-white text-on-primary dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 px-6 py-3 rounded-full font-label-ui text-label-ui font-semibold shadow-xs transition-all cursor-pointer"
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
