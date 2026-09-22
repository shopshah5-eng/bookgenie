'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

interface EditorialCard {
  id: string;
  genre: string;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  coverAspect: string;
  sampleQuote: string;
  promptExample: string;
}

export function WhatCanYouCreate() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const primaryCards: EditorialCard[] = [
    {
      id: 'novel',
      genre: 'Novels & Fiction',
      title: 'The Lost Coast',
      tagline: 'Build worlds, characters and stories.',
      description: 'Atmospheric narrative prose with chapter structures, dialogue pacing, and evocative scene setting.',
      badge: 'LITERARY FICTION',
      bgGradient: 'from-[#141F2B] via-[#0E1620] to-[#080D13]',
      textColor: 'text-amber-100',
      accentColor: 'text-[#D4AF37]',
      coverAspect: 'aspect-[3/4]',
      sampleQuote: '“The tide had swept away the footsteps, but the lighthouse still remembered the lantern in the fog.”',
      promptExample: 'A captivating mystery novel set in a misty coastal town in 1920 with deep character arcs.',
    },
    {
      id: 'children',
      genre: "Children's Books",
      title: 'Barnaby’s Sky',
      tagline: 'Turn imagination into storybooks.',
      description: 'Lush full-page color illustrations with playful rhyming cadence or gentle bedtime rhythms.',
      badge: 'ILLUSTRATED STORYBOOK',
      bgGradient: 'from-[#6E3C18] via-[#4A240C] to-[#2E1404]',
      textColor: 'text-amber-50',
      accentColor: 'text-amber-300',
      coverAspect: 'aspect-[3/4]',
      sampleQuote: '“With one brave leap from the maple branch, Barnaby discovered that the wind was made for flying.”',
      promptExample: "An illustrated children's picture book about a little owl who dreams of dancing among the stars.",
    },
    {
      id: 'guide',
      genre: 'Guides & How-To',
      title: 'Smart Wealth',
      tagline: 'Transform knowledge into useful books.',
      description: 'Structured methodologies, actionable takeaways, framework callouts, and clean reading typography.',
      badge: 'PRACTICAL GUIDE',
      bgGradient: 'from-[#2A231A] via-[#1B1610] to-[#120E0A]',
      textColor: 'text-stone-100',
      accentColor: 'text-amber-400',
      coverAspect: 'aspect-[3/4]',
      sampleQuote: '“True financial freedom is not about accumulating assets, but designing an unhurried life.”',
      promptExample: 'A step-by-step comprehensive guide to mastering personal finance and passive investing in your 20s.',
    },
    {
      id: 'recipe',
      genre: 'Recipe Books',
      title: 'Nourish & Herb',
      tagline: 'Turn your recipes into a collection.',
      description: 'Mouthwatering culinary spreads with ingredient measurements, chef’s notes, and food styling prompts.',
      badge: 'CULINARY ARTS',
      bgGradient: 'from-[#421B14] via-[#2A0E09] to-[#180603]',
      textColor: 'text-rose-100',
      accentColor: 'text-amber-300',
      coverAspect: 'aspect-[3/4]',
      sampleQuote: '“Slow-roasted heirloom tomatoes with hand-torn basil and cold-pressed Tuscan olive oil.”',
      promptExample: 'A collection of 25 nourishing plant-based dinner recipes with photography and step-by-step guides.',
    },
  ];

  const secondaryCategories = [
    {
      id: 'coloring',
      name: 'Coloring Books',
      prompt: 'A 30-page relaxing botanical coloring book with intricate floral patterns.',
      tag: 'Fine Linework Art',
    },
    {
      id: 'course',
      name: 'Course Books',
      prompt: 'A comprehensive fundamentals course book on modern product management.',
      tag: 'Curriculum & Modules',
    },
    {
      id: 'workbook',
      name: 'Workbooks',
      prompt: 'A 4-week structured mindfulness and habit-building workbook with exercises.',
      tag: 'Interactive Prompts',
    },
    {
      id: 'history',
      name: 'History Books',
      prompt: 'An illustrated beginner-friendly history of the ancient Silk Road civilizations.',
      tag: 'Archival Chronicles',
    },
    {
      id: 'journal',
      name: 'Guided Journals',
      prompt: 'A daily guided reflection journal with provocative prompts and inspirational quotes.',
      tag: 'Daily Reflections',
    },
    {
      id: 'lifestyle',
      name: 'Bespoke Volumes',
      prompt: 'A personalized travel guide to the secret spots of Kyoto.',
      tag: 'Memoirs & Poetry',
    },
  ];

  const handleSelect = (typeId: string, promptText: string) => {
    const targetUrl = `/create?type=${typeId}&prompt=${encodeURIComponent(promptText)}`;
    if (!user) {
      openAuthModal('signup', targetUrl);
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <section className="py-20 sm:py-28 border-t border-[rgba(24,21,17,0.08)] bg-[#F8F4EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1ECE2] border border-[#E5D5C0] text-[10px] sm:text-[11px] font-semibold text-[#8C5F2E] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#A47A45]" /> 10 Canonical Publishing Formats
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#181511] tracking-tight mb-3">
              Create anything worth reading.
            </h2>
            <p className="text-sm sm:text-base text-[#746B60] max-w-xl">
              From sweeping literary fiction to illustrated children’s picture books and culinary collections — every volume is crafted with bespoke typography, curated spreads, and print-ready elegance.
            </p>
          </div>

          <button
            onClick={() => {
              if (!user) openAuthModal('signup', '/create');
              else router.push('/create');
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#A47A45] hover:text-[#8C5F2E] transition-colors self-start sm:self-auto"
          >
            <span>Open Studio desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Large Featured Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {primaryCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleSelect(card.id, card.promptExample)}
              className="group cursor-pointer rounded-3xl bg-white border border-[rgba(24,21,17,0.09)] p-6 sm:p-8 hover:border-[#A47A45]/50 shadow-[0_10px_30px_-8px_rgba(24,21,17,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4 text-xs">
                  <span className="font-mono text-[10px] text-[#A47A45] font-bold tracking-widest uppercase">
                    {card.badge}
                  </span>
                  <span className="font-serif italic text-[#9E968E] text-[11px]">
                    Studio Format
                  </span>
                </div>

                {/* Genre & Tagline */}
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#181511] mb-1.5 tracking-tight group-hover:text-[#A47A45] transition-colors">
                  {card.genre}
                </h3>
                <p className="font-serif italic text-sm text-[#8C5F2E] mb-3">
                  {card.tagline}
                </p>
                <p className="text-xs sm:text-sm text-[#746B60] leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              {/* Mini Book Artifact Card Representation */}
              <div
                className={`relative w-full rounded-2xl bg-gradient-to-br ${card.bgGradient} p-5 sm:p-6 text-white overflow-hidden shadow-md flex flex-col justify-between min-h-[160px] group-hover:scale-[1.01] transition-transform`}
              >
                {/* Book Spine Simulation Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/40 border-r border-white/10" />

                <div className="pl-3">
                  <span className={`text-[10px] font-bold tracking-widest uppercase opacity-80 ${card.accentColor}`}>
                    {card.title}
                  </span>
                  <p className="font-serif italic text-xs sm:text-sm text-white/90 mt-2 leading-relaxed max-w-sm">
                    {card.sampleQuote}
                  </p>
                </div>

                <div className="pl-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
                  <span>Editorial Layout • Full Spreads</span>
                  <span className="font-semibold text-white/90 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Create this book <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Specialized Formats Row */}
        <div className="pt-6 border-t border-[rgba(24,21,17,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#8C5F2E]">
              Specialized Formats & Editions
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {secondaryCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id, cat.prompt)}
                className="text-left p-4 rounded-xl bg-white border border-[rgba(24,21,17,0.08)] hover:border-[#A47A45]/40 hover:shadow-sm transition-all group"
              >
                <span className="block text-xs font-serif font-bold text-[#181511] group-hover:text-[#A47A45] transition-colors mb-1">
                  {cat.name}
                </span>
                <span className="block text-[10px] text-[#9E968E]">
                  {cat.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
