'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import {
  ArrowRight,
  BookOpen,
  FileText,
  Utensils,
  LayoutGrid,
  Edit3,
  MoreHorizontal,
} from 'lucide-react';

interface CategoryPreset {
  id: string;
  name: string;
  icon: string | React.ReactNode;
  samplePrompt: string;
}

export function PromptBarSection() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const categories: CategoryPreset[] = [
    {
      id: 'children',
      name: "Children's Book",
      icon: '🐻',
      samplePrompt: "A children's story about a little fox who discovers a magical forest...",
    },
    {
      id: 'novel',
      name: 'Novel',
      icon: '📖',
      samplePrompt: 'A literary novel following an antique clockmaker who finds hidden letters in a 19th-century grandfather clock...',
    },
    {
      id: 'guide',
      name: 'Guide',
      icon: '📑',
      samplePrompt: 'A step-by-step field guide to sustainable urban gardening and balcony herbs for beginners...',
    },
    {
      id: 'cookbook',
      name: 'Cookbook',
      icon: '🍳',
      samplePrompt: 'An artisanal cookbook with 25 wholesome Mediterranean dinners made in under 30 minutes...',
    },
    {
      id: 'workbook',
      name: 'Workbook',
      icon: '⊞',
      samplePrompt: 'A 90-day structured goal-setting and deep-work execution workbook with daily habit logs...',
    },
    {
      id: 'journal',
      name: 'Journal',
      icon: '✏️',
      samplePrompt: 'A guided mindfulness and evening reflection journal with calm intentional prompts...',
    },
    {
      id: 'other',
      name: 'Other',
      icon: '💬',
      samplePrompt: 'An illustrated botanical field guide exploring native mountain wildflowers and their folklore...',
    },
  ];

  const [activeCategory, setActiveCategory] = useState<string>('children');
  const [prompt, setPrompt] = useState<string>(
    "A children's story about a little fox who discovers a magical forest..."
  );

  const handleSelectCategory = (cat: CategoryPreset) => {
    setActiveCategory(cat.id);
    setPrompt(cat.samplePrompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrompt = prompt.trim() || "A children's story about a little fox who discovers a magical forest...";
    const targetUrl = `/create?prompt=${encodeURIComponent(finalPrompt)}&type=${activeCategory}`;

    if (!user) {
      sessionStorage.setItem('bg_pending_prompt', finalPrompt);
      sessionStorage.setItem('bg_pending_type', activeCategory);
      openAuthModal('signup', targetUrl);
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <section className="py-6 sm:py-10 bg-white dark:bg-[#0A0A0A] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Crisp Card Container matching reference */}
        <div className="bg-[#FAFAFA] dark:bg-[#141414] rounded-3xl border border-[#EAEAEA] dark:border-[#242424] p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] text-center">
          
          {/* Header */}
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight mb-2">
            What do you want to create today?
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] dark:text-[#9E9E9E] mb-7 max-w-lg mx-auto">
            Just describe your idea in one sentence. BookGenie will take care of the rest.
          </p>

          {/* Form with input bar & circular submit button */}
          <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto mb-6">
            <div className="relative flex items-center">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A children's story about a little fox who discovers a magical forest..."
                className="w-full pl-5 pr-14 py-3.5 sm:py-4 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2E2E2E] text-xs sm:text-sm text-[#111111] dark:text-[#F5F5F5] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] dark:focus:border-white shadow-2xs transition-all font-sans"
              />
              <button
                type="submit"
                aria-label="Submit book prompt"
                className="absolute right-2 sm:right-2.5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111111] hover:bg-black dark:bg-white dark:hover:bg-[#EAEAEA] text-white dark:text-black flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
              >
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </form>

          {/* Category Pill Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-3xl mx-auto">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-[#252525] text-[#111111] dark:text-white border border-[#222222] dark:border-white shadow-2xs scale-[1.02]'
                      : 'bg-white dark:bg-[#1A1A1A] text-[#555555] dark:text-[#A0A0A0] border border-[#E5E5E5] dark:border-[#2C2C2C] hover:border-[#CCCCCC] dark:hover:border-[#444444] hover:text-[#111111] dark:hover:text-white'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
