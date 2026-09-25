'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Printer,
  Compass,
  PenTool,
  Palette,
  LayoutTemplate,
  Download,
} from 'lucide-react';

export function StudioWorkflowSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'blueprint' | 'writing' | 'visuals' | 'design' | 'verify' | 'export'>('writing');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [refinedText, setRefinedText] = useState(false);

  const chapters = [
    { num: '01', title: 'Arrival at the Reef', words: '420 words', status: 'Verified', text: 'The coral reef was glowing beneath the turquoise swell, a quiet kingdom of sunlight and moving shadow. Lina took a deep breath, adjusted her mask, and dived into the warm current...' },
    { num: '02', title: 'The Coral Garden', words: '380 words', status: 'Verified', text: 'Golden anemones swayed like ribbons in the morning tide. A school of shimmering damsel fish parted as Barnaby the sea turtle glided forward with tranquil ancient grace.' },
    { num: '03', title: 'The Indigo Abyss', words: '450 words', status: 'Verified', text: 'Deeper down where sunlight turned to velvet indigo, bioluminescent lanterns began to flicker like submerged constellations guiding them toward the ocean trench.' },
    { num: '04', title: 'Dolphin Welcome', words: '390 words', status: 'Verified', text: 'A young dolphin calf spun three playful loops through the sunbeams, clicking a bright welcome song that echoed through the underwater sanctuary.' },
    { num: '05', title: 'Evening Tide', words: '340 words', status: 'Verified', text: 'As the amber sun touched the open horizon, they surfaced together into the cooling breeze, hearts filled with the living wonders of the deep.' },
  ];

  return (
    <section id="studio" className="py-12 sm:py-16 bg-white dark:bg-[#0A0A0A] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            Meet your publishing studio.
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] dark:text-[#999999] mt-1 font-sans">
            A focused, multi-stage workspace built around the true book production lifecycle.
          </p>
        </div>

        {/* Studio Window Card */}
        <div className="rounded-3xl border border-[#E5E5E5] dark:border-[#2C2C2C] bg-white dark:bg-[#141414] shadow-[0_12px_45px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col select-none">
          
          {/* Studio Window Top Bar */}
          <div className="px-4 sm:px-6 py-3 border-b border-[#EFEFEF] dark:border-[#222222] bg-[#FAFAFA] dark:bg-[#121212] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5] dark:bg-[#333333]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5] dark:bg-[#333333]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5] dark:bg-[#333333]" />
              </div>
              <span className="text-xs font-serif font-semibold text-[#111111] dark:text-white pl-2 border-l border-[#E5E5E5] dark:border-[#2A2A2A]">
                BookGenie Studio — <span className="font-sans font-normal text-[#666666] dark:text-[#999999]">Ocean Wonders (Hardcover Edition)</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#16A34A] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                <span>Deterministic QC Passed</span>
              </span>
              <Link
                href="/examples/ocean-wonders"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-white dark:bg-[#1E1E1E] text-[#111111] dark:text-white border border-[#E0E0E0] dark:border-[#333333] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all shadow-2xs"
              >
                <BookOpen className="w-3 h-3 text-[#9A6F3C]" />
                <span>Inspect in Reader</span>
              </Link>
            </div>
          </div>

          {/* Studio Phase Navigation Tabs */}
          <div className="flex items-center px-4 sm:px-6 border-b border-[#EFEFEF] dark:border-[#222222] overflow-x-auto gap-6 sm:gap-8 bg-white dark:bg-[#161616]">
            {[
              { id: 'blueprint', label: '01 Blueprint', icon: Compass },
              { id: 'writing', label: '02 Writing', icon: PenTool },
              { id: 'visuals', label: '03 Visuals', icon: Palette },
              { id: 'design', label: '04 Design', icon: LayoutTemplate },
              { id: 'verify', label: '05 Verify', icon: CheckCircle2 },
              { id: 'export', label: '06 Export', icon: Download },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'blueprint' | 'writing' | 'visuals' | 'design' | 'verify' | 'export')}
                  className={`flex items-center gap-2 py-3.5 text-xs font-medium transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-[#111111] dark:border-white text-[#111111] dark:text-white font-semibold'
                      : 'border-transparent text-[#777777] dark:text-[#888888] hover:text-[#111111] dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Studio Workspace Body */}
          <div className="grid grid-cols-12 min-h-[380px]">
            
            {/* Left Chapter Hierarchy Drawer */}
            <div className="col-span-12 sm:col-span-4 border-b sm:border-b-0 sm:border-r border-[#EFEFEF] dark:border-[#222222] p-4 bg-[#FAFAFA] dark:bg-[#121212]">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-3 px-1">
                <span>Chapters ({chapters.length})</span>
                <span>Total: 1,980 w</span>
              </div>

              <div className="space-y-1.5">
                {chapters.map((ch, idx) => (
                  <button
                    key={ch.num}
                    onClick={() => {
                      setActiveChapterIndex(idx);
                      setRefinedText(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                      activeChapterIndex === idx
                        ? 'bg-white dark:bg-[#1E1E1E] font-semibold text-[#111111] dark:text-white shadow-2xs border border-[#E5E5E5] dark:border-[#333333]'
                        : 'text-[#666666] dark:text-[#888888] hover:bg-white/60 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="font-mono text-[10px] text-[#888888]">{ch.num}</span>
                      <span className="truncate">{ch.title}</span>
                    </div>
                    <span className="text-[10px] text-[#16A34A] shrink-0 font-medium">
                      ✓ {ch.words}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#EFEFEF] dark:border-[#222222] text-[11px] text-[#777777] px-1 space-y-1 font-mono">
                <div>Format: 8.5&quot; × 11&quot; Full Color</div>
                <div>Typesetting: Cormorant Garamond 11.5pt</div>
                <div>Orphan Suppression: Active</div>
              </div>
            </div>

            {/* Right Interactive Typography Canvas */}
            <div className="col-span-12 sm:col-span-8 p-5 sm:p-7 flex flex-col justify-between bg-white dark:bg-[#141414]">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0F0EE] dark:border-[#222222]">
                  <div>
                    <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">
                      Chapter {chapters[activeChapterIndex].num}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#111111] dark:text-white mt-0.5">
                      {chapters[activeChapterIndex].title}
                    </h3>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAFAFA] dark:bg-[#1E1E1E] border border-[#EAEAEA] dark:border-[#333333] text-[#666666] dark:text-[#AAAAAA]">
                    Page {activeChapterIndex * 4 + 3} / 28
                  </span>
                </div>

                {/* Classical Drop Cap Typeset Body */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#EEEEEE] dark:border-[#282828] min-h-[160px]">
                  <p className="text-sm sm:text-base text-[#222222] dark:text-[#D5D5D5] font-serif leading-relaxed">
                    <span className="float-left text-4xl sm:text-5xl font-serif font-bold leading-none pr-3 pt-1 text-[#111111] dark:text-white">
                      {refinedText ? 'B' : chapters[activeChapterIndex].text.charAt(0)}
                    </span>
                    {refinedText
                      ? 'eneath the calm cerulean tide, living gardens of violet coral glowed in the morning light. Lina held her breath, mesmerized by the silent dance of the deep.'
                      : chapters[activeChapterIndex].text.slice(1)}
                  </p>
                </div>
              </div>

              {/* Studio Bottom Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-[#F0F0EE] dark:border-[#222222]">
                <button
                  onClick={() => setRefinedText(!refinedText)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E5E5E5] dark:border-[#333333] bg-white dark:bg-[#1C1C1C] text-xs font-medium text-[#333333] dark:text-[#E0E0E0] hover:border-[#111111] dark:hover:border-white transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#9A6F3C]" />
                  <span>{refinedText ? 'Reverted' : 'Refine with AI'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/api/books/ocean-wonders/export?format=pdf`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E5E5E5] dark:border-[#333333] bg-white dark:bg-[#1C1C1C] text-xs font-medium text-[#333333] dark:text-[#E0E0E0] hover:border-[#111111] dark:hover:border-white transition-all cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#666666]" />
                    <span>Export PDF</span>
                  </Link>

                  <button
                    onClick={() => router.push('/create')}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black text-xs font-semibold hover:bg-black dark:hover:bg-[#EAEAEA] transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>Launch Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
