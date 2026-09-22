'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Sparkles, UploadCloud, Lock, ArrowRight, BookOpen, Globe2, Palette } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [prompt, setPrompt] = useState('');
  const [bookType, setBookType] = useState('auto');
  const [language, setLanguage] = useState('english');
  const [style, setStyle] = useState('modern');

  const bookTypeOptions = [
    { label: 'Auto detect', value: 'auto' },
    { label: "Children's Book", value: 'children' },
    { label: 'Coloring Book', value: 'coloring' },
    { label: 'Novel / Fiction', value: 'novel' },
    { label: 'Course Book', value: 'course' },
    { label: 'Guide / How-to', value: 'guide' },
    { label: 'Workbook', value: 'workbook' },
    { label: 'Recipe Book', value: 'recipe' },
    { label: 'History Book', value: 'history' },
    { label: 'Journal', value: 'journal' },
  ];

  const languageOptions = [
    { label: 'English', value: 'english' },
    { label: 'Hindi', value: 'hindi' },
    { label: 'Spanish', value: 'spanish' },
    { label: 'French', value: 'french' },
    { label: 'German', value: 'german' },
    { label: 'Japanese', value: 'japanese' },
  ];

  const styleOptions = [
    { label: 'Modern', value: 'modern' },
    { label: 'Editorial Luxury', value: 'editorial' },
    { label: 'Playful Storybook', value: 'playful' },
    { label: 'Academic & Formal', value: 'academic' },
    { label: 'Minimalist Clean', value: 'minimal' },
    { label: 'Vintage Classic', value: 'vintage' },
  ];

  const handleGenerateClick = (e: React.FormEvent) => {
    e.preventDefault();

    const targetUrl = `/create?prompt=${encodeURIComponent(
      prompt || "Create a 40-page children's coloring book about cute jungle animals."
    )}&type=${bookType}&lang=${language}&style=${style}`;

    if (!user) {
      sessionStorage.setItem('bg_pending_prompt', prompt);
      sessionStorage.setItem('bg_pending_type', bookType);
      openAuthModal('signup', targetUrl);
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background warm aesthetic ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#F4EDE0]/60 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Copy & Interactive Prompt Card */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EDE0] text-[#8C5F2E] border border-[#E8DCCB] text-[11px] font-semibold tracking-wider uppercase mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Book Creation
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1A1612] tracking-tight leading-[1.12] mb-5">
              Turn your ideas <br className="hidden sm:inline" />
              into{' '}
              <span className="italic font-normal text-[#9A6F3C] font-serif">
                beautiful
              </span>{' '}
              books.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#6B635B] leading-relaxed max-w-2xl mb-8">
              Write a prompt, upload your content, and let BookGenie handle the writing, visuals, design, and layout.
            </p>

            {/* Interactive Prompt Card */}
            <form
              onSubmit={handleGenerateClick}
              className="w-full bg-white rounded-2xl border border-[#EFECE6] p-4 sm:p-5 shadow-[0_12px_40px_rgba(45,38,32,0.06)] transition-all hover:border-[#DFD9CD]"
            >
              {/* Top Row: Sparkle + Input + File Upload Trigger */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pb-3 border-b border-[#F4F1EA]">
                <div className="w-full flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#9A6F3C] shrink-0" />
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Tell us what you want to create... e.g. Create a 40-page children's coloring book about cute jungle animals."
                    className="w-full text-sm sm:text-base text-[#1A1612] placeholder:text-[#9E968E] bg-transparent focus:outline-none"
                  />
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => router.push('/create')}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#EFECE6] bg-[#FDFBF7] hover:bg-[#F4EFE6] text-xs font-medium text-[#6B635B] transition-colors"
                  >
                    <UploadCloud className="w-4 h-4 text-[#9A6F3C]" />
                    <span>Upload files</span>
                    <span className="hidden md:inline text-[10px] text-[#9E968E]">
                      (PDF, DOCX, TXT)
                    </span>
                  </button>
                </div>
              </div>

              {/* Bottom Controls Row: Dropdowns + CTA */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Dropdown
                    label="Book type"
                    options={bookTypeOptions}
                    value={bookType}
                    onChange={setBookType}
                    icon={<BookOpen className="w-3.5 h-3.5" />}
                  />
                  <Dropdown
                    label="Language"
                    options={languageOptions}
                    value={language}
                    onChange={setLanguage}
                    icon={<Globe2 className="w-3.5 h-3.5" />}
                  />
                  <Dropdown
                    label="Style"
                    options={styleOptions}
                    value={style}
                    onChange={setStyle}
                    icon={<Palette className="w-3.5 h-3.5" />}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-md"
                >
                  Generate My Book <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </form>

            {/* Reassurance Micro-copy */}
            <div className="flex items-center gap-2 mt-3.5 text-xs text-[#9E968E]">
              <Lock className="w-3.5 h-3.5" />
              <span>No writing or design skills needed. Just your idea.</span>
            </div>
          </div>

          {/* Right Column: Editorial Visual Showcase (Real Book Cover + Real Interior Page Spread) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            {/* Editorial Floating Quality Badge */}
            <div className="absolute -top-5 left-2 sm:left-6 lg:-left-4 bg-white/95 backdrop-blur-md border border-[#EAE3D5] rounded-2xl px-4 py-2 text-xs font-serif text-[#1A1612] shadow-sm transform -rotate-2 z-30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9A6F3C] animate-pulse" />
              <span className="italic font-medium text-[#8C5F2E]">Generated in 90 seconds</span>
            </div>

            {/* Book Artifact Presentation Showcase */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl p-5 sm:p-6 flex flex-col justify-center items-center">
              {/* Back Card: Luxury Book Cover */}
              <div className="w-64 sm:w-72 h-88 sm:h-96 rounded-2xl bg-gradient-to-b from-[#0B2545] via-[#134074] to-[#001D3D] border border-[#2E5077] shadow-[0_20px_50px_rgba(11,37,69,0.25)] p-5 flex flex-col justify-between text-white transform -rotate-6 transition-transform duration-300 hover:-rotate-3 z-10">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-[#E0E1DD] opacity-80">
                  <span>Children's Book</span>
                  <span>BookGenie</span>
                </div>

                <div className="my-auto text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5 text-amber-300" />
                  </div>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl tracking-tight leading-tight mb-1 text-white">
                    Ocean Wonders
                  </h3>
                  <p className="text-[10px] text-sky-200 font-light max-w-[180px] mx-auto leading-relaxed">
                    An Underwater Journey Through Coral Reefs & Deep Mysteries
                  </p>
                </div>

                <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[9px] text-sky-300/80">
                  <span>28 Pages • Illustrated</span>
                  <span>Hardcover Edition</span>
                </div>
              </div>

              {/* Overlapping Front Card: Open Interior Book Page */}
              <div className="absolute top-12 left-8 sm:left-14 w-64 sm:w-72 h-88 sm:h-96 rounded-2xl bg-[#FFFFFF] border border-[#E8DFC8] shadow-[0_25px_60px_rgba(45,38,32,0.14)] p-5 flex flex-col justify-between text-[#1A1612] transform rotate-3 transition-transform duration-300 hover:rotate-1 z-20">
                {/* Book Header Bar */}
                <div className="flex items-center justify-between text-[9px] text-[#9E968E] border-b border-[#F4F1EA] pb-2">
                  <span className="font-serif italic text-[#8C5F2E]">Ocean Wonders</span>
                  <span className="font-mono">Page 3</span>
                </div>

                {/* Page Content with Drop Cap & Illustration Container */}
                <div className="space-y-2.5 my-auto text-left">
                  <h4 className="font-serif font-bold text-sm text-[#1A1612]">
                    Chapter 1: The Sunlit Shallows
                  </h4>
                  <p className="text-[11px] text-[#4A4036] leading-relaxed">
                    <span className="float-left text-2xl font-serif font-bold text-[#9A6F3C] leading-none pr-1 pt-0.5">J</span>
                    ust beneath the gentle waves of Sapphire Bay, morning sun poured through the turquoise water like ribbons of gold.
                  </p>

                  {/* Illustrated Scene Block */}
                  <div className="w-full h-24 rounded-xl bg-gradient-to-tr from-[#0077B6] to-[#90E0EF] p-2 flex flex-col justify-end text-white overflow-hidden shadow-inner">
                    <span className="text-[9px] font-medium bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-md inline-block self-start">
                      Barnaby the Turtle
                    </span>
                  </div>

                  <p className="text-[10px] text-[#6B635B] leading-relaxed line-clamp-2">
                    Here lived Barnaby, an ancient sea turtle who had navigated these warm coral canyons for seventy summers.
                  </p>
                </div>

                {/* Book Footer Bar */}
                <div className="flex items-center justify-between text-[9px] text-[#9E968E] border-t border-[#F4F1EA] pt-2">
                  <span>Editorial Layout</span>
                  <span className="font-serif text-[#8C5F2E] font-medium">BookGenie Publishing</span>
                </div>
              </div>

              {/* Floating Format Pill */}
              <div className="absolute -bottom-3 right-4 sm:right-10 bg-white/95 backdrop-blur-md border border-[#EAE3D5] rounded-full px-3.5 py-1 text-[11px] font-semibold text-[#8C5F2E] shadow-sm z-30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#9A6F3C]" />
                <span>PDF + EPUB3 Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
