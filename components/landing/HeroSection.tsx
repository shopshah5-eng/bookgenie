'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Sparkles,
  Upload,
  ArrowRight,
  Check,
  ChevronDown,
} from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [prompt, setPrompt] = useState(
    "A whimsical children's book about a little fox named Barnaby who discovers an ancient clockwork tree that controls the forest seasons..."
  );
  const [selectedType, setSelectedType] = useState('children');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedStyle, setSelectedStyle] = useState('whimsical');

  const handleGenerateClick = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrompt = prompt.trim() || "A whimsical children's book about a little fox named Barnaby who discovers an ancient clockwork tree that controls the forest seasons...";
    const targetUrl = `/create?prompt=${encodeURIComponent(finalPrompt)}&type=${selectedType}&style=${selectedStyle}`;

    if (!user) {
      sessionStorage.setItem('bg_pending_prompt', finalPrompt);
      sessionStorage.setItem('bg_pending_type', selectedType);
      openAuthModal('signup', targetUrl);
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 sm:pt-10 pb-16 lg:pt-12 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & Creation Card */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left z-10">
            
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3ECE0] dark:bg-[#231E18] text-[#8C5F2E] dark:text-[#C49B66] border border-[#E5D7C3] dark:border-[#382F24] text-[11px] font-semibold tracking-wider uppercase mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#A87B45]" />
              <span>AI Powered Publishing</span>
            </div>

            {/* Main Headline with Serif Italic Emphasis */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-[#181511] dark:text-[#F8F5EE] tracking-tight leading-[1.12] mb-5">
              Your Ideas Deserve a{' '}
              <span className="italic font-normal font-serif text-[#8C5F2E] dark:text-[#C49B66]">
                Beautiful Book.
              </span>
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-base sm:text-[17px] text-[#6B635B] dark:text-[#A8A199] leading-relaxed max-w-xl mb-8 font-sans">
              Transform your ideas, memories, or expertise into a professionally written, designed, and bound book. Powered by intelligent generation.
            </p>

            {/* Crisp White Prompt Card (Exact match to reference) */}
            <form
              onSubmit={handleGenerateClick}
              className="w-full bg-white dark:bg-[#1A1816] rounded-2xl border border-[#EDE6DC] dark:border-[#2C2721] p-5 sm:p-6 shadow-[0_12px_40px_-8px_rgba(24,21,17,0.08)] transition-all hover:border-[#8C5F2E]/40"
            >
              <div className="flex items-center justify-between pb-2.5 mb-2 text-xs text-[#8C5F2E] font-medium tracking-wide uppercase">
                <span className="text-[10px] font-bold">Describe Your Book</span>
                <span className="text-[11px] text-[#A8A199] lowercase italic font-serif">or paste a synopsis</span>
              </div>

              {/* Text Input Area */}
              <div className="relative mb-4">
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A whimsical children's book about a little fox named Barnaby who discovers an ancient clockwork tree that controls the forest seasons..."
                  className="w-full text-sm sm:text-[15px] text-[#181511] dark:text-[#F5F2EB] placeholder:text-[#A8A199] bg-[#FDFBF7]/60 dark:bg-[#201D1A] rounded-xl p-3 border border-[#EFEBE3] dark:border-[#2C2721] focus:outline-none focus:border-[#8C5F2E] resize-none leading-relaxed font-sans"
                />
              </div>

              {/* Selection Badges Row (Exact from reference) */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => router.push('/create')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5DFD5] dark:border-[#2C2721] bg-[#FAF8F5] dark:bg-[#23201C] text-xs font-medium text-[#5A5249] dark:text-[#B3AAA0] hover:bg-white transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-[#8C5F2E]" />
                  <span>Upload</span>
                </button>

                {/* Category selector */}
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="appearance-none inline-flex items-center gap-1 px-3 py-1.5 pr-6 rounded-lg border border-[#E5DFD5] dark:border-[#2C2721] bg-[#FAF8F5] dark:bg-[#23201C] text-xs font-medium text-[#5A5249] dark:text-[#B3AAA0] cursor-pointer focus:outline-none"
                  >
                    <option value="children">Children's Book</option>
                    <option value="novel">Literary Fiction</option>
                    <option value="coloring">Coloring Book</option>
                    <option value="course">Study Guide</option>
                    <option value="recipe">Cookbook</option>
                    <option value="journal">Personal Journal</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-[#746B60] absolute right-2 top-2.5 pointer-events-none" />
                </div>

                {/* Language selector */}
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="appearance-none inline-flex items-center gap-1 px-3 py-1.5 pr-6 rounded-lg border border-[#E5DFD5] dark:border-[#2C2721] bg-[#FAF8F5] dark:bg-[#23201C] text-xs font-medium text-[#5A5249] dark:text-[#B3AAA0] cursor-pointer focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-[#746B60] absolute right-2 top-2.5 pointer-events-none" />
                </div>

                {/* Style selector */}
                <div className="relative">
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="appearance-none inline-flex items-center gap-1 px-3 py-1.5 pr-6 rounded-lg border border-[#E5DFD5] dark:border-[#2C2721] bg-[#FAF8F5] dark:bg-[#23201C] text-xs font-medium text-[#5A5249] dark:text-[#B3AAA0] cursor-pointer focus:outline-none"
                  >
                    <option value="whimsical">Whimsical</option>
                    <option value="editorial">Editorial</option>
                    <option value="minimal">Minimalist</option>
                    <option value="vintage">Vintage</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-[#746B60] absolute right-2 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Full-width warm bronze action button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#A87B45] via-[#9A6F3C] to-[#8C5F2E] hover:from-[#B5854C] hover:to-[#966733] shadow-[0_4px_16px_rgba(140,95,46,0.3)] hover:shadow-[0_6px_20px_rgba(140,95,46,0.4)] transition-all active:scale-[0.99]"
              >
                <span>Create My Book</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* 4 Micro Feature Checks (Exact match from reference) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-5 text-[11px] font-medium text-[#5A5249] dark:text-[#A8A199]">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8C5F2E] shrink-0" />
                <span>Print-Ready PDF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8C5F2E] shrink-0" />
                <span>Reflowable EPUB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8C5F2E] shrink-0" />
                <span>Custom Artwork</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8C5F2E] shrink-0" />
                <span>Commercial Rights</span>
              </div>
            </div>

          </div>

          {/* Right Column: Physical Hardcover Volume & Open Spread Studio Still-Life */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex flex-col items-center justify-center select-none">
            
            {/* Visual Still Life Composition */}
            <div className="relative w-full max-w-[560px] aspect-[16/11] sm:aspect-[16/10] flex items-center justify-center">
              
              {/* Back Layer: Open Book Spread (Small Steps Big Adventures) */}
              <div className="absolute right-0 sm:right-4 top-2 sm:top-4 w-[76%] sm:w-[72%] aspect-[4/3] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(24,21,17,0.18)] border border-[#E5DFD5] transform rotate-1 transition-transform hover:rotate-0">
                <Image
                  src="/images/small-steps-open-spread.jpg"
                  alt="Open book spread - Small Steps Big Adventures"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                  className="object-cover"
                />
              </div>

              {/* Front Layer: Leaning Hardcover Book (The Little Explorer) */}
              <div className="absolute left-2 sm:left-4 -bottom-4 sm:-bottom-2 w-[54%] sm:w-[50%] aspect-[3/4] rounded-lg overflow-hidden shadow-[0_24px_60px_-10px_rgba(24,21,17,0.32)] border border-[#E5DFD5] transform -rotate-3 transition-transform hover:-rotate-1 z-20">
                <Image
                  src="/images/the-little-explorer-cover.jpg"
                  alt="The Little Explorer hardcover book"
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  priority
                  className="object-cover"
                />
                {/* Physical Hardcover Spine & Hinge Shadow overlay */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-white/25 pointer-events-none" />
              </div>

              {/* Handwritten Cursive Callout (From the reference image) */}
              <div className="absolute -bottom-8 right-2 sm:right-8 z-30 transform rotate-[-2deg] hidden sm:block">
                <p className="font-serif italic text-sm sm:text-base text-[#8C5F2E] dark:text-[#C49B66] drop-shadow-xs font-normal">
                  "From your imagination to a beautiful book — in minutes."
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Metrics Bar with Hairline Dividers (From the reference mockup) */}
        <div className="mt-16 pt-8 border-t border-[#EDE6DC] dark:border-[#26221D]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#181511] dark:text-[#F8F5EE]">
                10K+
              </span>
              <span className="text-xs text-[#746B60] dark:text-[#A8A199] mt-1">
                Books Created
              </span>
            </div>

            <div className="flex flex-col items-center border-l border-[#EDE6DC] dark:border-[#26221D]">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#181511] dark:text-[#F8F5EE]">
                98%
              </span>
              <span className="text-xs text-[#746B60] dark:text-[#A8A199] mt-1">
                User Satisfaction
              </span>
            </div>

            <div className="flex flex-col items-center border-l-0 md:border-l border-[#EDE6DC] dark:border-[#26221D]">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#181511] dark:text-[#F8F5EE]">
                190+
              </span>
              <span className="text-xs text-[#746B60] dark:text-[#A8A199] mt-1">
                Countries
              </span>
            </div>

            <div className="flex flex-col items-center border-l border-[#EDE6DC] dark:border-[#26221D]">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#8C5F2E] dark:text-[#C49B66]">
                ∞
              </span>
              <span className="text-xs text-[#746B60] dark:text-[#A8A199] mt-1">
                Stories Yet to Tell
              </span>
            </div>
          </div>

          {/* Publishing Studio Center Rule */}
          <div className="relative flex items-center justify-center my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EDE6DC] dark:border-[#26221D]" />
            </div>
            <span className="relative bg-[#FDFBF7] dark:bg-[#12100E] px-4 text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C5F2E] dark:text-[#C49B66]">
              More than a platform — a publishing studio
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

