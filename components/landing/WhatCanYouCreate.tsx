'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CategoryBook {
  id: string;
  name: string;
  genre: string;
  excerpt: string;
  promptExample: string;
  coverBg: string;
  spineColor: string;
  textColor: string;
  accentColor: string;
  badge: string;
}

export function WhatCanYouCreate() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const categories: CategoryBook[] = [
    {
      id: 'novel',
      name: 'The Lost Coast',
      genre: 'Novel',
      excerpt: 'Atmospheric fiction & mystery',
      promptExample: 'A captivating mystery novel set in a misty coastal town in 1920.',
      coverBg: 'from-[#1B2838] to-[#0D1622]',
      spineColor: 'bg-[#0A111A]',
      textColor: 'text-amber-100',
      accentColor: 'text-[#D4AF37]',
      badge: 'LITERARY FICTION',
    },
    {
      id: 'children',
      name: 'Barnaby’s Sky',
      genre: "Children's Book",
      excerpt: 'Vibrant illustrated picture books',
      promptExample: "An illustrated children's story about a little owl learning to fly.",
      coverBg: 'from-[#8C5528] to-[#543013]',
      spineColor: 'bg-[#40220A]',
      textColor: 'text-amber-50',
      accentColor: 'text-amber-300',
      badge: 'EARLY READERS',
    },
    {
      id: 'coloring',
      name: 'Botanica Flora',
      genre: 'Coloring Book',
      excerpt: 'Detailed monochrome line art',
      promptExample: 'A 30-page relaxing botanical coloring book with intricate floral patterns.',
      coverBg: 'from-[#2A342B] to-[#161D17]',
      spineColor: 'bg-[#101611]',
      textColor: 'text-emerald-100',
      accentColor: 'text-emerald-300',
      badge: 'ART & MINDFULNESS',
    },
    {
      id: 'course',
      name: 'Product Design',
      genre: 'Course Book',
      excerpt: 'Curriculum & structured modules',
      promptExample: 'A comprehensive fundamentals course book on modern product management.',
      coverBg: 'from-[#1E2E3D] to-[#121B24]',
      spineColor: 'bg-[#0D141B]',
      textColor: 'text-slate-100',
      accentColor: 'text-sky-300',
      badge: 'ACADEMIC STUDY',
    },
    {
      id: 'guide',
      name: 'Smart Wealth',
      genre: 'Guide / How-to',
      excerpt: 'Practical step-by-step strategies',
      promptExample: 'A step-by-step practical guide to mastering personal finance in your 20s.',
      coverBg: 'from-[#3A2D22] to-[#221A12]',
      spineColor: 'bg-[#1A130D]',
      textColor: 'text-amber-100',
      accentColor: 'text-amber-400',
      badge: 'PRACTICAL GUIDE',
    },
    {
      id: 'workbook',
      name: 'Daily Intentions',
      genre: 'Workbook',
      excerpt: 'Structured exercise templates',
      promptExample: 'A 4-week structured mindfulness and habit-building workbook with exercises.',
      coverBg: 'from-[#2D3830] to-[#1B221D]',
      spineColor: 'bg-[#141A16]',
      textColor: 'text-stone-100',
      accentColor: 'text-lime-300',
      badge: 'INTERACTIVE',
    },
    {
      id: 'recipe',
      name: 'Nourish & Herb',
      genre: 'Recipe Book',
      excerpt: 'Culinary collections with styling',
      promptExample: 'A collection of 25 nourishing plant-based dinner recipes with step-by-step guides.',
      coverBg: 'from-[#4D241C] to-[#2B120C]',
      spineColor: 'bg-[#200C07]',
      textColor: 'text-rose-100',
      accentColor: 'text-amber-300',
      badge: 'CULINARY ARTS',
    },
    {
      id: 'history',
      name: 'The Silk Road',
      genre: 'History Book',
      excerpt: 'Chronicles & archival narratives',
      promptExample: 'An illustrated beginner-friendly history of the ancient Silk Road civilizations.',
      coverBg: 'from-[#362722] to-[#1E1410]',
      spineColor: 'bg-[#160E0A]',
      textColor: 'text-stone-100',
      accentColor: 'text-amber-300',
      badge: 'CHRONICLES',
    },
    {
      id: 'journal',
      name: 'Evening Echoes',
      genre: 'Guided Journal',
      excerpt: 'Reflective prompts & quotes',
      promptExample: 'A daily guided reflection journal with provocative prompts and inspirational quotes.',
      coverBg: 'from-[#2E2838] to-[#1A1622]',
      spineColor: 'bg-[#130F19]',
      textColor: 'text-purple-100',
      accentColor: 'text-amber-200',
      badge: 'REFLECTION',
    },
    {
      id: 'lifestyle',
      name: 'Kyoto Hidden',
      genre: 'Custom Editions',
      excerpt: 'Travel, poetry, memoirs & more',
      promptExample: 'A personalized travel guide to the secret spots of Kyoto.',
      coverBg: 'from-[#3A3228] to-[#1E1914]',
      spineColor: 'bg-[#16120E]',
      textColor: 'text-amber-50',
      accentColor: 'text-[#E0B86C]',
      badge: 'BESPOKE VOLUMES',
    },
  ];

  const handleSelectCategory = (cat: CategoryBook) => {
    const targetUrl = `/create?type=${cat.id}&prompt=${encodeURIComponent(cat.promptExample)}`;
    if (!user) {
      openAuthModal('signup', targetUrl);
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <section className="py-16 sm:py-24 border-t border-[#EFECE6] bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EFE6] border border-[#E8DFC8] text-[11px] font-semibold text-[#8C5F2E] uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5" /> 10 Canonical Book Formats
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A1612] tracking-tight mb-2">
              What can you create?
            </h2>
            <p className="text-sm sm:text-base text-[#6B635B] max-w-xl">
              From literary fiction to illustrated children’s picture books — every book is crafted with bespoke typography, curated layouts, and print-ready elegance.
            </p>
          </div>
          <button
            onClick={() => {
              if (!user) openAuthModal('signup', '/create');
              else router.push('/create');
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#9A6F3C] hover:text-[#845D30] transition-colors self-start sm:self-auto"
          >
            Start your book <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 10 Mini Editorial Book Covers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              className="group relative flex flex-col text-left rounded-2xl bg-white border border-[#EFECE6] p-3 hover:border-[#9A6F3C]/60 hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
            >
              {/* Mini Book Cover Aspect Box */}
              <div
                className={`relative aspect-[3/4] w-full rounded-xl bg-gradient-to-br ${cat.coverBg} p-3 sm:p-4 flex flex-col justify-between overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform duration-300`}
              >
                {/* Book Spine Simulation Accent */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-2.5 sm:w-3 ${cat.spineColor} border-r border-white/10 shadow-md`}
                />

                {/* Cover Header / Genre Badge */}
                <div className="pl-2">
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-80 ${cat.accentColor}`}
                  >
                    {cat.badge}
                  </span>
                </div>

                {/* Cover Center Title */}
                <div className="pl-2 my-auto">
                  <h4
                    className={`font-serif font-bold text-sm sm:text-base leading-tight tracking-tight ${cat.textColor}`}
                  >
                    {cat.name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-white/60 font-medium mt-1 line-clamp-2">
                    {cat.excerpt}
                  </p>
                </div>

                {/* Cover Bottom Meta */}
                <div className="pl-2 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] text-white/50">
                  <span className="font-serif italic">BookGenie</span>
                  <span className="font-sans font-medium text-white/70">Studio Ed.</span>
                </div>
              </div>

              {/* Bottom Label on the Card */}
              <div className="mt-3 px-1 flex items-center justify-between">
                <div>
                  <div className="text-xs sm:text-sm font-serif font-bold text-[#1A1612] group-hover:text-[#9A6F3C] transition-colors leading-tight">
                    {cat.genre}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#9E968E] group-hover:text-[#9A6F3C] group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
