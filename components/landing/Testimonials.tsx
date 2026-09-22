'use client';

import React from 'react';
import { BookOpen, Sparkles, Lock, Palette, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function Testimonials() {
  const pipelineSteps = [
    {
      step: '01',
      title: 'The Idea',
      description: 'A prompt, outline, or uploaded manuscript notes in any genre.',
      badge: 'INPUT',
    },
    {
      step: '02',
      title: 'Book Blueprint',
      description: 'Algorithmic chapter outlines, pacing curves, and page allocations.',
      badge: 'PLAN',
    },
    {
      step: '03',
      title: 'Prose Crafting',
      description: 'Multi-tier routing tuned to literary fiction, education, or guides.',
      badge: 'WRITE',
    },
    {
      step: '04',
      title: 'Visual Engine',
      description: 'Persistent character bible ensuring cohesive illustration style.',
      badge: 'ART',
    },
    {
      step: '05',
      title: 'Editorial Layout',
      description: 'Drop caps, running headers, typographic scale, and pagination.',
      badge: 'DESIGN',
    },
    {
      step: '06',
      title: 'Quality Check',
      description: 'Semantic QC, orphan suppression, and formatting verification.',
      badge: 'VERIFY',
    },
    {
      step: '07',
      title: 'Bound Volume',
      description: 'Dual-format on demand: print-ready PDF and validated EPUB3.',
      badge: 'PUBLISH',
    },
  ];

  const useCases = [
    {
      title: 'Educators & Course Creators',
      category: 'Workbooks & Textbooks',
      initial: 'E',
      avatarBg: 'bg-[#C27351]',
      content:
        'Transform lecture transcripts, lesson outlines, or teaching notes into structured multi-chapter textbooks and guided student workbooks.',
    },
    {
      title: 'Authors & Storytellers',
      category: 'Novels & Children’s Books',
      initial: 'A',
      avatarBg: 'bg-[#8C5F2E]',
      content:
        'Build character consistency bibles, develop rich narrative arcs, and generate matching illustrations without coordinating multiple freelance artists.',
    },
    {
      title: 'Solopreneurs & Publishers',
      category: 'Guides & Cookbooks',
      initial: 'S',
      avatarBg: 'bg-[#A47A45]',
      content:
        'Package practical how-to guides, recipe collections, and lead magnets into production-ready PDFs and reflowable EPUB3 files ready for sale.',
    },
  ];

  const stats = [
    {
      label: 'Multi-Tier Intelligence',
      value: 'Cost-Optimized',
      icon: <Sparkles className="w-4 h-4 text-[#A47A45]" />,
    },
    {
      label: 'Publishing Standards',
      value: 'PDF + EPUB3',
      icon: <BookOpen className="w-4 h-4 text-[#A47A45]" />,
    },
    {
      label: 'Visual Generation',
      value: 'Cohesive Art Engine',
      icon: <Palette className="w-4 h-4 text-[#A47A45]" />,
    },
    {
      label: 'Security & RLS',
      value: '100% Private',
      icon: <Lock className="w-4 h-4 text-[#8C5F2E]" />,
    },
  ];

  return (
    <section className="py-20 sm:py-28 border-t border-[rgba(24,21,17,0.08)] bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1ECE2] text-[#8C5F2E] border border-[#E5D5C0] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#A47A45]" /> The Publishing Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#181511] tracking-tight mb-3">
            From idea to publication.
          </h2>
          <p className="text-sm sm:text-base text-[#746B60]">
            A transparent seven-stage digital publishing pipeline built for fidelity, typographic standards, and complete creative ownership.
          </p>
        </div>

        {/* Visual 7-Step Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3.5 mb-16">
          {pipelineSteps.map((step, idx) => (
            <div
              key={step.step}
              className="relative p-4 rounded-2xl bg-white border border-[rgba(24,21,17,0.08)] shadow-2xs hover:border-[#A47A45]/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono text-xs font-bold text-[#A47A45]">
                    {step.step}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-[#F8F4EC] text-[#746B60] font-semibold">
                    {step.badge}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-[#181511] mb-1">
                  {step.title}
                </h3>
                <p className="text-[11px] text-[#746B60] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < pipelineSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                  <ChevronRight className="w-3.5 h-3.5 text-[#A47A45]" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Creator Use-Case Spotlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-[rgba(24,21,17,0.08)] shadow-xs hover:border-[#A47A45]/40 transition-colors"
            >
              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#A47A45] font-mono">
                  {uc.category}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#181511] mt-1.5 mb-2.5">
                  {uc.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#746B60] leading-relaxed">
                  {uc.content}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[rgba(24,21,17,0.06)]">
                <div
                  className={`w-7 h-7 rounded-full ${uc.avatarBg} text-white flex items-center justify-center font-bold text-xs`}
                >
                  {uc.initial}
                </div>
                <span className="text-xs font-serif font-medium text-[#181511]">
                  Studio Publication Path
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Capability Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 px-6 sm:px-8 rounded-2xl bg-[#F8F4EC] border border-[rgba(24,21,17,0.08)]">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 border border-[rgba(24,21,17,0.08)] shadow-2xs">
                {stat.icon}
              </div>
              <div>
                <div className="text-xs sm:text-sm font-serif font-bold text-[#181511] leading-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] text-[#9E968E] leading-tight">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}


