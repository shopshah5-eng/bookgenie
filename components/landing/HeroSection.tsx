'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Sparkles,
  UploadCloud,
  Lock,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState('children');
  const [selectedPages, setSelectedPages] = useState('28');
  const [selectedStyle, setSelectedStyle] = useState('whimsical');

  const presetSuggestions = [
    {
      label: "Children's Book",
      type: 'children',
      pages: '28',
      style: 'whimsical',
      prompt: 'A 28-page illustrated children’s story about a curious fox who discovers a hidden garden.',
    },
    {
      label: 'Literary Fiction',
      type: 'novel',
      pages: '64',
      style: 'editorial',
      prompt: 'A misty coastal mystery novel set in an abandoned 1920s lighthouse town.',
    },
    {
      label: 'Botanical Coloring',
      type: 'coloring',
      pages: '36',
      style: 'minimal',
      prompt: 'A 36-page relaxing botanical coloring book with intricate floral outlines.',
    },
    {
      label: 'Study Guide',
      type: 'course',
      pages: '48',
      style: 'academic',
      prompt: 'A step-by-step comprehensive guide to mastering modern product design.',
    },
  ];

  const handlePresetSelect = (preset: typeof presetSuggestions[0]) => {
    setPrompt(preset.prompt);
    setSelectedType(preset.type);
    setSelectedPages(preset.pages);
    setSelectedStyle(preset.style);
  };

  const handleGenerateClick = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrompt =
      prompt.trim() ||
      'A 28-page illustrated children’s story about a curious fox who discovers a hidden garden.';
    const targetUrl = `/create?prompt=${encodeURIComponent(
      finalPrompt
    )}&type=${selectedType}&pages=${selectedPages}&style=${selectedStyle}`;

    if (!user) {
      sessionStorage.setItem('bg_pending_prompt', finalPrompt);
      sessionStorage.setItem('bg_pending_type', selectedType);
      openAuthModal('signup', targetUrl);
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <section className="relative overflow-hidden pt-4 sm:pt-8 pb-16 lg:pt-10 lg:pb-24">
      {/* Warm Photographic Studio Background Atmosphere (faded gently on right side) */}
      <div className="absolute top-0 right-0 w-full lg:w-3/5 h-full opacity-20 lg:opacity-30 pointer-events-none -z-10 mix-blend-multiply select-none">
        <Image
          src="/images/hero-publishing-studio.jpg"
          alt="BookGenie Editorial Publishing Desk"
          fill
          priority
          className="object-cover object-right-top mask-radial-fade"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F4EC] via-[#F8F4EC]/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Negative space typography & manuscript card */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            
            {/* Studio Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1ECE2] text-[#8C5F2E] border border-[#E5D5C0] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#A47A45]" />
              <span>A Luxury Digital Publishing Studio</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-bold text-[#181511] tracking-tight leading-[1.1] mb-5">
              Your idea deserves <br />
              a{' '}
              <span className="italic font-normal text-[#A47A45] font-serif">
                beautiful
              </span>{' '}
              book.
            </h1>

            {/* Editorial Subheading */}
            <p className="text-base sm:text-lg text-[#746B60] leading-relaxed max-w-xl mb-7 font-sans">
              Turn a thought, story, lesson, or manuscript into a professionally designed and illustrated book with AI.
            </p>

            {/* Author's Manuscript Card (Not a SaaS form) */}
            <form
              onSubmit={handleGenerateClick}
              className="w-full bg-[#FFFFFF] rounded-2xl border border-[rgba(24,21,17,0.1)] p-5 sm:p-6 shadow-[0_12px_36px_-6px_rgba(24,21,17,0.07)] transition-all hover:border-[#A47A45]/40 relative"
            >
              {/* Manuscript Header Tag */}
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(24,21,17,0.06)] mb-3 text-xs">
                <span className="font-sans font-bold text-[10px] tracking-widest uppercase text-[#8C5F2E]">
                  WHAT WILL YOU CREATE?
                </span>
                <span className="text-[11px] text-[#9E968E] font-serif italic">
                  Manuscript Studio
                </span>
              </div>

              {/* Textarea Input resembling writer's desk sheet */}
              <div className="relative mb-3">
                <textarea
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A 28-page illustrated children's story about a curious fox who discovers a hidden garden..."
                  className="w-full text-sm sm:text-base text-[#181511] placeholder:text-[#A8A199] bg-transparent focus:outline-none resize-none leading-relaxed font-sans"
                />
              </div>

              {/* Quick Editorial Preset Chips */}
              <div className="flex flex-wrap gap-1.5 pb-4 mb-4 border-b border-[rgba(24,21,17,0.06)]">
                {presetSuggestions.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F8F4EC] hover:bg-[#F1ECE2] text-[#746B60] hover:text-[#181511] border border-[rgba(24,21,17,0.06)] transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Controls Bar: Source Attachment + Attributes + Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => router.push('/create')}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#746B60] hover:text-[#181511] py-1.5 px-3 rounded-xl border border-[rgba(24,21,17,0.08)] bg-[#FDFBF7] hover:bg-[#F8F4EC] transition-colors self-start"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-[#A47A45]" />
                  <span>Attach notes / PDF</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#9E968E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Instant Blueprint</span>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white gold-gradient-bg shadow-md hover:shadow-lg transition-all active:scale-[0.98] w-full sm:w-auto"
                  >
                    <span>Create My Book</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Editorial Reassurance */}
            <div className="flex items-center gap-2 mt-4 text-xs text-[#746B60]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5F2E]" />
              <span>Full commercial rights. Print-ready PDF & reflowable EPUB included.</span>
            </div>
          </div>

          {/* Right Column: Signature Floating Book Ensemble */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end select-none">
            
            {/* Visual Ensemble Container */}
            <div className="relative w-full max-w-[440px] aspect-[4/5] flex items-center justify-center">
              
              {/* Background Layer: Real Open Illustrated Book Spread (Slightly rotated behind) */}
              <div className="absolute top-4 right-0 sm:right-2 w-72 sm:w-80 h-96 sm:h-[400px] rounded-2xl overflow-hidden book-shadow transform rotate-3 animate-book-float-delayed z-10 border border-[#E5D5C0]">
                <Image
                  src="/images/editorial-book-spread.jpg"
                  alt="Open illustrated book spread"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 right-4 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-serif italic">
                  Curated Interior Spread
                </div>
              </div>

              {/* Front Layer: Luxury Hardcover Jacket (Floating slightly above with spine depth) */}
              <div className="absolute top-12 left-2 sm:left-4 w-64 sm:w-72 h-88 sm:h-96 rounded-sm bg-gradient-to-b from-[#0B2545] via-[#103766] to-[#08182B] border border-[#2E5077] book-shadow p-5 flex flex-col justify-between text-white transform -rotate-4 animate-book-float z-20 transition-transform">
                
                {/* Book Spine Shadow Simulation */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#061220] book-spine-shadow border-r border-white/10" />

                {/* Cover Top Header */}
                <div className="pl-3 flex items-center justify-between text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                  <span>Children's Volume</span>
                  <span>Studio Edition</span>
                </div>

                {/* Cover Title Typography */}
                <div className="pl-3 my-auto text-center">
                  <div className="w-9 h-9 mx-auto rounded-full bg-white/10 border border-[#D4AF37]/40 flex items-center justify-center mb-2.5 shadow-inner">
                    <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl tracking-tight leading-tight mb-1 text-white">
                    Ocean Wonders
                  </h3>
                  <p className="text-[10px] text-sky-200/90 font-light max-w-[180px] mx-auto leading-relaxed">
                    Secrets of the Coral Reef & Deep Blue Mysteries
                  </p>
                </div>

                {/* Cover Bottom Meta */}
                <div className="pl-3 pt-2 border-t border-white/15 flex items-center justify-between text-[9px] text-sky-200/80">
                  <span>28 Pages • Full Color</span>
                  <span className="font-serif italic text-amber-200">BookGenie</span>
                </div>
              </div>

              {/* Floating Quality Badge */}
              <div className="absolute -bottom-2 right-2 sm:right-6 bg-white/95 backdrop-blur-md border border-[#E5D5C0] rounded-full px-4 py-1.5 text-xs font-serif text-[#181511] book-shadow z-30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#A47A45] animate-pulse" />
                <span className="italic font-medium text-[#8C5F2E]">Generated in 90 seconds</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
