'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Home,
  BookMarked,
  LayoutGrid,
  Library,
  Settings,
} from 'lucide-react';

export function StudioAndCategoriesSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'outline' | 'writing' | 'visuals' | 'design' | 'export'>('outline');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [refinedText, setRefinedText] = useState(false);

  const chapters = [
    { num: '01', title: 'Arrival', text: 'The coral reef was glowing beneath the waves, a hidden world of colors, movement, and life. Lina took a deep breath and dived in...' },
    { num: '02', title: 'The Reef', text: 'Anemones danced like golden ribbons in the warm current. A school of silver damsel fish parted as Barnaby glided forward with graceful ease.' },
    { num: '03', title: 'Deep Sea', text: 'Deeper down where sunlight turned indigo, bioluminescent lanterns began to flicker like tiny underwater constellations.' },
    { num: '04', title: 'New Friends', text: 'A playful dolphin calf spun three gentle circles around Lina, chirping a high melody of welcome to the sanctuary.' },
    { num: '05', title: 'Return', text: 'As the evening sun touched the ocean horizon with amber fire, they surfaced together, heart full of marine wonders.' },
  ];

  const categories = [
    {
      title: 'Novels',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
      typeParam: 'novel',
    },
    {
      title: "Children's Books",
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80',
      typeParam: 'children',
    },
    {
      title: 'Guides',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80',
      typeParam: 'guide',
    },
    {
      title: 'Cookbooks',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
      typeParam: 'cookbook',
    },
    {
      title: 'Workbooks',
      image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=400&q=80',
      typeParam: 'workbook',
    },
    {
      title: 'Journals',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
      typeParam: 'journal',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-[#0A0A0A] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Meet your publishing studio */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="mb-5">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
                Meet your publishing studio.
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] dark:text-[#999999] mt-0.5">
                A clean, focused workspace to bring your ideas to life.
              </p>
            </div>

            {/* Studio Software UI Card (Exact match to reference mockup) */}
            <div className="rounded-2xl border border-[#E5E5E5] dark:border-[#2C2C2C] bg-white dark:bg-[#141414] shadow-[0_10px_35px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col select-none">
              
              <div className="grid grid-cols-12 min-h-[360px]">
                
                {/* Left Mini-Sidebar */}
                <div className="col-span-3 sm:col-span-2.5 border-r border-[#EFEFEF] dark:border-[#222222] bg-[#FAFAFA] dark:bg-[#121212] p-2.5 sm:p-3 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Brand in Sidebar */}
                    <div className="flex items-center gap-1.5 px-1 pt-0.5">
                      <span className="text-[#9A6F3C] text-xs">✦</span>
                      <span className="font-serif font-bold text-[11px] sm:text-xs text-[#111111] dark:text-white">
                        BookGenie
                      </span>
                    </div>

                    {/* Nav Items */}
                    <nav className="space-y-1">
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] text-[#666666] dark:text-[#888888] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                        <Home className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Home</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-semibold text-[#111111] dark:text-white bg-white dark:bg-[#1E1E1E] shadow-2xs border border-[#E8E8E8] dark:border-[#333333] cursor-pointer">
                        <BookMarked className="w-3.5 h-3.5 text-[#111111] dark:text-white" />
                        <span className="hidden sm:inline">My Books</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] text-[#666666] dark:text-[#888888] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Templates</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] text-[#666666] dark:text-[#888888] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                        <Library className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Library</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] text-[#666666] dark:text-[#888888] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                        <Settings className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Settings</span>
                      </div>
                    </nav>
                  </div>
                </div>

                {/* Right Main Studio Workspace */}
                <div className="col-span-9 sm:col-span-9.5 flex flex-col justify-between p-3.5 sm:p-5">
                  
                  {/* Top Bar with Breadcrumbs, Title, Saved indicator */}
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F0F0EE] dark:border-[#222222]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#888888] dark:text-[#777777]">
                          + My Books / Ocean Wonders
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#16A34A] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                          <span>Saved</span>
                        </span>
                        {/* Studio Workspace Initial / Glyph */}
                        <div className="w-5 h-5 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center text-[9px] font-bold shadow-2xs">
                          ✦
                        </div>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <h3 className="font-serif font-bold text-base sm:text-lg text-[#111111] dark:text-[#F5F5F5]">
                          Ocean Wonders
                        </h3>
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#F3F3F1] dark:bg-[#1E1E1E] text-[#666666] dark:text-[#A0A0A0] mt-0.5">
                          Children&apos;s Book
                        </span>
                      </div>
                    </div>

                    {/* Subnavigation Tabs */}
                    <div className="flex items-center gap-4 text-xs border-b border-[#EFEFEF] dark:border-[#222222] pb-2 mb-4">
                      {(['outline', 'writing', 'visuals', 'design', 'export'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`capitalize transition-colors cursor-pointer text-[11px] sm:text-xs ${
                            activeTab === tab
                              ? 'text-[#111111] dark:text-white font-semibold border-b-2 border-[#111111] dark:border-white pb-2 -mb-2'
                              : 'text-[#888888] dark:text-[#666666] hover:text-[#111111] dark:hover:text-white'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Studio Body: Outline on Left, Text Canvas on Right */}
                    <div className="grid grid-cols-12 gap-3 sm:gap-4 items-start">
                      {/* Chapter Column */}
                      <div className="col-span-4 space-y-1">
                        {chapters.map((ch, idx) => (
                          <button
                            key={ch.num}
                            onClick={() => {
                              setActiveChapterIndex(idx);
                              setRefinedText(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded-md text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                              activeChapterIndex === idx
                                ? 'bg-[#EEEEEE] dark:bg-[#222222] font-semibold text-[#111111] dark:text-white'
                                : 'text-[#666666] dark:text-[#888888] hover:bg-neutral-100 dark:hover:bg-white/5'
                            }`}
                          >
                            <span className="text-[10px] text-[#888888] font-mono">{ch.num}</span>
                            <span className="truncate">{ch.title}</span>
                          </button>
                        ))}
                      </div>

                      {/* Text Canvas */}
                      <div className="col-span-8 p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#EAEAEA] dark:border-[#2C2C2C] min-h-[140px] flex flex-col justify-between">
                        <p className="text-xs sm:text-[13px] text-[#333333] dark:text-[#CCCCCC] font-serif leading-relaxed">
                          {refinedText
                            ? 'Beneath the calm cerulean tide, living gardens of violet coral glowed in the morning light. Lina held her breath, mesmerized by the silent dance of the deep.'
                            : chapters[activeChapterIndex].text}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Action Pill & Continue Button */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#F0F0EE] dark:border-[#222222]">
                    <button
                      onClick={() => setRefinedText(!refinedText)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E5E5] dark:border-[#333333] bg-white dark:bg-[#1F1F1F] text-[11px] font-medium text-[#444444] dark:text-[#CCCCCC] hover:border-[#111111] dark:hover:border-white transition-all shadow-2xs cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#9A6F3C]" />
                      <span>{refinedText ? 'Reverted' : 'Refine with AI'}</span>
                    </button>

                    <button
                      onClick={() => router.push('/create')}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black text-xs font-semibold hover:bg-black dark:hover:bg-[#EAEAEA] transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* Right Column: One studio. Every kind of book. */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
                One studio. Every kind of book.
              </h2>

              <Link
                href="/create"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#111111] dark:text-[#F5F5F5] hover:text-[#9A6F3C] dark:hover:text-[#E8C28A] transition-colors group shrink-0"
              >
                <span>Explore all</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* 6 Category Bento Cards matching Reference */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.title}
                  href={`/create?type=${cat.typeParam}`}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-[#EAEAEA] dark:border-[#2C2C2C] bg-[#FAFAFA] dark:bg-[#161616] p-3 flex flex-col justify-between hover:shadow-md hover:border-[#CCCCCC] dark:hover:border-[#444444] transition-all"
                >
                  <span className="text-xs font-serif font-bold text-[#111111] dark:text-[#F5F5F5] z-10">
                    {cat.title}
                  </span>

                  {/* Clean Photographic Object in Corner */}
                  <div className="relative w-full h-[65%] mt-auto flex items-end justify-center">
                    <div className="relative w-full h-full rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        sizes="(max-width: 640px) 140px, 160px"
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
