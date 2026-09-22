'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight, PenTool, Layout, Download, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Describe Your Vision',
      subtitle: 'Prompt or attach source materials',
      description:
        'Tell BookGenie your concept, genre, and target audience, or upload existing notes, drafts, or PDFs. BookGenie acts as an editorial director to blueprint your book.',
      icon: <PenTool className="w-6 h-6 text-[#9A6F3C]" />,
      details: [
        'Automatic book-type and tone detection',
        'Support for PDF, DOCX, TXT, and image source material',
        'Selection of visual aesthetics and storytelling styles',
      ],
    },
    {
      num: '02',
      title: 'AI Writes, Illustrates & Formats',
      subtitle: 'The intelligent publishing studio',
      description:
        'Rather than generating a giant uncontrolled block of text, BookGenie crafts a structured blueprint, writes chapter-by-chapter, and renders high-resolution illustrations.',
      icon: <Layout className="w-6 h-6 text-[#9A6F3C]" />,
      details: [
        'Multi-tier AI router optimizes cost and literary depth',
        'Character consistency bibles for children’s & illustrated books',
        'Automated semantic quality control and layout assembly',
      ],
    },
    {
      num: '03',
      title: 'Read, Revise & Download',
      subtitle: 'Print-ready PDF & standard EPUB3',
      description:
        'Flip through your generated book in the interactive studio reader. Use natural language to refine any page, then download publication-ready files immediately.',
      icon: <Download className="w-6 h-6 text-[#9A6F3C]" />,
      details: [
        'Floating AI edit dock: change text or visuals in plain English',
        'Deterministic version snapshotting with instant rollback',
        'One canonical BookDocument compiles to both PDF and EPUB',
      ],
    },
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          {/* Headline */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F3EA] text-[#8C5F2E] border border-[#E8DCCB] text-[11px] font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> The Production Loop
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A1612] tracking-tight mb-4">
              How BookGenie Works
            </h1>
            <p className="text-sm sm:text-base text-[#6B635B]">
              From a single sentence to a professionally structured, illustrated ebook in minutes.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex flex-col justify-between p-8 rounded-3xl bg-white border border-[#EFECE6] shadow-sm hover:border-[#9A6F3C]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-serif font-bold text-[#9A6F3C]">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#F8F3EA] flex items-center justify-center border border-[#E8DCCB]">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[#1A1612] mb-1">
                    {step.title}
                  </h3>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#8C5F2E] block mb-3">
                    {step.subtitle}
                  </span>

                  <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4F1EA] space-y-2">
                  {step.details.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#2D2620]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-[#F6EEE0] to-[#EAE0D0] p-8 sm:p-12 text-center border border-[#E2D4BF] max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1612] mb-2">
              Ready to create your first book?
            </h2>
            <p className="text-xs sm:text-sm text-[#6B635B] mb-6">
              Zero writing, design, or prompt engineering experience needed.
            </p>
            <Link href="/create">
              <Button size="lg" variant="primary">
                Create My Book Now <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </main>

        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
