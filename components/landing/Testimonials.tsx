'use client';

import React from 'react';
import { BookOpen, Sparkles, Lock, Palette, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function Testimonials() {
  const useCases = [
    {
      title: 'Educators & Course Creators',
      category: 'Workbooks & Textbooks',
      initial: 'E',
      avatarBg: 'bg-[#C27351]',
      content:
        'Turn lecture transcripts, curriculum syllabi, or teaching notes into structured multi-chapter textbooks and guided student workbooks.',
    },
    {
      title: 'Authors & Storytellers',
      category: 'Novels & Children’s Books',
      initial: 'A',
      avatarBg: 'bg-[#8C5F2E]',
      content:
        'Build character consistency bibles, develop narrative arcs, and generate matching illustrations without coordinating multiple freelance artists.',
    },
    {
      title: 'Solopreneurs & Publishers',
      category: 'Guides & Cookbooks',
      initial: 'S',
      avatarBg: 'bg-[#A87B45]',
      content:
        'Package how-to guides, recipe collections, and lead magnets into production-ready PDFs and reflowable EPUB3 files ready for download.',
    },
  ];

  const stats = [
    {
      label: 'Multi-Tier Intelligence',
      value: 'Cost-Optimized',
      icon: <Sparkles className="w-5 h-5 text-[#9A6F3C]" />,
    },
    {
      label: 'Publishing Standards',
      value: 'PDF + EPUB3',
      icon: <BookOpen className="w-5 h-5 text-[#9A6F3C]" />,
    },
    {
      label: 'Visual Generation',
      value: 'FLUX & Gemini',
      icon: <Palette className="w-5 h-5 text-[#9A6F3C]" />,
    },
    {
      label: 'Security & RLS',
      value: '100% Private',
      icon: <Lock className="w-5 h-5 text-[#C27351]" />,
    },
  ];

  return (
    <section className="py-14 sm:py-20 border-t border-[#EFECE6] bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1612] tracking-tight mb-2">
              Engineered for Modern Publishing
            </h2>
            <p className="text-sm sm:text-base text-[#6B635B]">
              Purpose-built for authors, educators, and independent creators who value quality, control, and efficiency.
            </p>
          </div>

          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#9A6F3C] hover:text-[#845D30] transition-colors self-start sm:self-auto"
          >
            How the engine works <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Use-Cases Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-[#EFECE6] shadow-xs hover:border-[#DDD3C2] transition-colors"
            >
              <div className="mb-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9A6F3C]">
                  {uc.category}
                </span>
                <h3 className="text-lg font-serif font-bold text-[#1A1612] mt-1 mb-3">
                  {uc.title}
                </h3>
                <p className="text-sm text-[#5A5046] leading-relaxed">
                  {uc.content}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#F4F1EA]">
                <div
                  className={`w-8 h-8 rounded-full ${uc.avatarBg} text-white flex items-center justify-center font-bold text-xs`}
                >
                  {uc.initial}
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#1A1612]">
                    Tailored Publishing Pipeline
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Capability Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 px-8 rounded-2xl bg-white/70 border border-[#EFECE6]">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F8F3EA] flex items-center justify-center shrink-0 border border-[#E8DCCB]">
                {stat.icon}
              </div>
              <div>
                <div className="text-base sm:text-lg font-serif font-bold text-[#1A1612] leading-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-[#9E968E] leading-tight">
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

