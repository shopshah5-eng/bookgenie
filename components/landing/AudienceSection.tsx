'use client';

import React from 'react';
import Link from 'next/link';
import {
  Feather,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Check,
} from 'lucide-react';

export function AudienceSection() {
  const audiences = [
    {
      title: 'Authors & Storytellers',
      badge: 'Fiction & Literature',
      icon: Feather,
      description:
        'Transform creative sparks into complete novels, children’s picture books, and illustrated memoirs with calibrated narrative depth and style consistency.',
      useCases: [
        'Literary & contemporary novels',
        'Illustrated children’s storybooks',
        'Biographies, memoirs & personal journeys',
        'Poetry & curated literary anthologies',
      ],
      ctaText: 'Start writing stories',
      categoryParam: 'novel',
    },
    {
      title: 'Educators & Course Creators',
      badge: 'Academic & Instruction',
      icon: GraduationCap,
      description:
        'Turn course materials, lecture notes, and curriculum frameworks into comprehensive textbooks, structured student workbooks, and guides.',
      useCases: [
        'Curriculum companion workbooks',
        'Step-by-step instructional guides',
        'Training manuals & workshop materials',
        'Academic overviews with structured summaries',
      ],
      ctaText: 'Build educational material',
      categoryParam: 'workbook',
    },
    {
      title: 'Solopreneurs & Publishers',
      badge: 'Commercial & Growth',
      icon: Briefcase,
      description:
        'Produce authority-building lead magnets, artisan cookbooks, and niche non-fiction collections with 100% commercial ownership and instant distribution.',
      useCases: [
        'High-converting authority lead magnets',
        'Artisanal specialty cookbooks',
        'Direct-to-consumer print collections',
        'Amazon KDP automated digital catalog',
      ],
      ctaText: 'Scale publishing catalog',
      categoryParam: 'guide',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-[#0A0A0A] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F3F3F1] dark:bg-[#1E1E1E] text-[#666666] dark:text-[#A0A0A0] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mb-3 border border-[#E5E5E5] dark:border-[#2C2C2C]">
            CREATOR AUDIENCES
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            Built for every kind of creator.
          </h2>
          <p className="text-sm sm:text-base text-[#666666] dark:text-[#999999] mt-2 font-sans leading-relaxed">
            Whether you are writing your debut novel, packaging a university syllabus, or launching an Amazon KDP publishing business, BookGenie provides calibrated publishing scaffolding.
          </p>
        </div>

        {/* 3 Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((aud) => {
            const Icon = aud.icon;
            return (
              <div
                key={aud.title}
                className="p-7 rounded-3xl border border-[#EAEAEA] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#141414] flex flex-col justify-between hover:border-[#111111] dark:hover:border-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2C2C2C] flex items-center justify-center text-[#111111] dark:text-white shadow-2xs">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-white dark:bg-[#1E1E1E] text-[#666666] dark:text-[#A0A0A0] border border-[#E5E5E5] dark:border-[#2C2C2C]">
                      {aud.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#111111] dark:text-white mb-2">
                    {aud.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#555555] dark:text-[#999999] leading-relaxed mb-6 font-sans">
                    {aud.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-[#EFEFEF] dark:border-[#222222]">
                    {aud.useCases.map((uc) => (
                      <div key={uc} className="flex items-start gap-2 text-xs text-[#444444] dark:text-[#CCCCCC]">
                        <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                        <span>{uc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#EFEFEF] dark:border-[#222222]">
                  <Link
                    href={`/create?type=${aud.categoryParam}`}
                    className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-full text-xs font-semibold bg-white dark:bg-[#1E1E1E] text-[#111111] dark:text-white border border-[#E0E0E0] dark:border-[#333333] hover:border-[#111111] dark:hover:border-white transition-all shadow-2xs"
                  >
                    <span>{aud.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
