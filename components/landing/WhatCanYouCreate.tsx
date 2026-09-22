'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import {
  BookOpen,
  Palette,
  GraduationCap,
  Lightbulb,
  FileSpreadsheet,
  Utensils,
  Globe2,
  Sparkles,
  MoreHorizontal,
  ArrowRight,
  Heart,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  promptExample: string;
  icon: React.ReactNode;
}

export function WhatCanYouCreate() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const categories: CategoryItem[] = [
    {
      id: 'novel',
      name: 'Novel',
      promptExample: 'A captivating mystery novel set in a misty coastal town in 1920.',
      icon: <BookOpen className="w-6 h-6 text-[#9A6F3C]" />,
    },
    {
      id: 'children',
      name: "Children's Book",
      promptExample: "An illustrated children's story about a little owl learning to fly.",
      icon: <Heart className="w-6 h-6 text-[#C27351]" />,
    },
    {
      id: 'coloring',
      name: 'Coloring Book',
      promptExample: 'A 30-page relaxing botanical coloring book with intricate floral patterns.',
      icon: <Palette className="w-6 h-6 text-[#8B7355]" />,
    },
    {
      id: 'course',
      name: 'Course Book',
      promptExample: 'A comprehensive fundamentals course book on modern product management.',
      icon: <GraduationCap className="w-6 h-6 text-[#5B6D7A]" />,
    },
    {
      id: 'guide',
      name: 'Guide / How-to',
      promptExample: 'A step-by-step practical guide to mastering personal finance in your 20s.',
      icon: <Lightbulb className="w-6 h-6 text-[#A87B45]" />,
    },
    {
      id: 'workbook',
      name: 'Workbook',
      promptExample: 'A 4-week structured mindfulness and habit-building workbook with exercises.',
      icon: <FileSpreadsheet className="w-6 h-6 text-[#6B705C]" />,
    },
    {
      id: 'recipe',
      name: 'Recipe Book',
      promptExample: 'A collection of 25 nourishing plant-based dinner recipes with step-by-step guides.',
      icon: <Utensils className="w-6 h-6 text-[#B56547]" />,
    },
    {
      id: 'history',
      name: 'History Book',
      promptExample: 'An illustrated beginner-friendly history of the ancient Silk Road civilizations.',
      icon: <Globe2 className="w-6 h-6 text-[#7F675B]" />,
    },
    {
      id: 'journal',
      name: 'Journal',
      promptExample: 'A daily guided reflection journal with provocative prompts and inspirational quotes.',
      icon: <Sparkles className="w-6 h-6 text-[#6B8E23]" />,
    },
    {
      id: 'lifestyle',
      name: 'And More',
      promptExample: 'A personalized travel guide to the secret spots of Kyoto.',
      icon: <MoreHorizontal className="w-6 h-6 text-[#8C7A6B]" />,
    },
  ];

  const handleSelectCategory = (cat: CategoryItem) => {
    const targetUrl = `/create?type=${cat.id}&prompt=${encodeURIComponent(cat.promptExample)}`;
    if (!user) {
      openAuthModal('signup', targetUrl);
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <section className="py-14 sm:py-20 border-t border-[#EFECE6] bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1612] tracking-tight mb-2">
              What can you create?
            </h2>
            <p className="text-sm sm:text-base text-[#6B635B]">
              From stories to study guides — create any kind of book.
            </p>
          </div>
          <button
            onClick={() => {
              if (!user) openAuthModal('signup', '/create');
              else router.push('/create');
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#9A6F3C] hover:text-[#845D30] transition-colors self-start sm:self-auto"
          >
            View all categories <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 10 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              className="group flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-white border border-[#EFECE6] hover:border-[#9A6F3C]/40 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F9F6F0] group-hover:bg-[#F4ECE0] flex items-center justify-center mb-3 transition-colors">
                {cat.icon}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#1A1612] group-hover:text-[#9A6F3C] transition-colors leading-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
