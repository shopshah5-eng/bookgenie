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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1A1612] tracking-tight leading-[1.12] mb-6">
              Turn your ideas into{' '}
              <span className="italic font-normal text-[#9A6F3C] font-serif">
                beautiful
              </span>{' '}
              books.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#6B635B] leading-relaxed max-w-2xl mb-8">
              Write a prompt, upload your content, and let AI create the writing, visuals, design, and layout for you — in minutes.
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
                    onClick={() => {
                      if (!user) openAuthModal('signup', '/create');
                      else router.push('/create');
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#EFECE6] bg-[#FDFBF7] hover:bg-[#F4EFE6] text-xs font-medium text-[#6B635B] transition-colors"
                  >
                    <UploadCloud className="w-4 h-4 text-[#9A6F3C]" />
                    <span>Upload files</span>
                    <span className="hidden md:inline text-[10px] text-[#9E968E]">(PDF, DOCX, TXT)</span>
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

          {/* Right Column: Editorial Visual Showcase with 3D Books & Coffee Mug */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            {/* Handwritten style quote bubble */}
            <div className="absolute -top-6 left-4 sm:left-12 lg:-left-6 bg-white/90 backdrop-blur-sm border border-[#EAE3D5] rounded-2xl px-4 py-2 text-xs font-serif italic text-[#8C5F2E] shadow-sm transform -rotate-3 z-20">
              A single idea can create a thousand new worlds. ♡
            </div>

            {/* Book Stack Presentation Mockup */}
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] bg-gradient-to-b from-[#F7F3EB] to-[#EFE8DC] rounded-3xl p-6 sm:p-8 flex flex-col justify-end items-center border border-[#E8DFC8] shadow-[0_20px_50px_rgba(45,38,32,0.08)] overflow-hidden">
              {/* Background ambient plant / light */}
              <div className="absolute inset-0 bg-[radial-gradient(#CBB89D_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

              {/* Stacked Hardcover Linen Books */}
              <div className="relative z-10 w-full flex flex-col items-center gap-2.5">
                {/* Book 1 (Standing upright tilted) */}
                <div className="w-48 h-64 sm:w-56 sm:h-72 bg-[#FDFCF7] border border-[#DDD4C5] rounded-r-xl rounded-l-xs shadow-xl p-5 flex flex-col justify-between transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center justify-between text-[10px] text-[#9E968E] uppercase tracking-wider font-semibold">
                    <span>BookGenie Edition</span>
                    <span>2026</span>
                  </div>
                  <div className="text-center my-auto">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#F5EFE4] text-[#8C5F2E] flex items-center justify-center mb-3">
                      <BookOpen className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1A1612] leading-tight mb-1">
                      Bigger Ideas Brighter Worlds
                    </h3>
                    <p className="text-[11px] text-[#8C5F2E] font-medium italic">
                      A Guide to a More Creative You
                    </p>
                  </div>
                  <div className="text-[9px] text-center text-[#A39B92]">
                    Created with BookGenie AI
                  </div>
                </div>

                {/* Stack of horizontal books below */}
                <div className="w-64 sm:w-72 h-8 bg-[#EFE9DD] border border-[#DDD3C2] rounded-md shadow-md flex items-center px-4 justify-between text-xs font-serif font-semibold text-[#5A5046]">
                  <span>Good Ideas</span>
                  <span className="text-[10px] font-sans text-[#8C8275]">Vol. I</span>
                </div>
                <div className="w-68 sm:w-76 h-8 bg-[#EAE2D4] border border-[#D5CABC] rounded-md shadow-md flex items-center px-4 justify-between text-xs font-serif font-semibold text-[#4A4036]">
                  <span>Better Habits</span>
                  <span className="text-[10px] font-sans text-[#8C8275]">Vol. II</span>
                </div>
                <div className="w-72 sm:w-80 h-9 bg-[#E2D8C7] border border-[#CDC1B0] rounded-md shadow-lg flex items-center px-4 justify-between text-xs font-serif font-semibold text-[#3A3026]">
                  <span>Brighter Tomorrows</span>
                  <span className="text-[10px] font-sans text-[#7C7265]">Complete Edition</span>
                </div>
              </div>

              {/* Ceramic Coffee Mug */}
              <div className="absolute right-4 bottom-4 w-16 h-20 bg-white/95 rounded-xl border border-[#DDD3C2] shadow-md p-2 flex flex-col justify-between text-[8px] text-[#8C5F2E] font-medium text-center z-20">
                <span className="text-[7px] text-[#A39B92]">Create</span>
                <span className="font-serif font-bold">Explore</span>
                <span>Inspire ♡</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
