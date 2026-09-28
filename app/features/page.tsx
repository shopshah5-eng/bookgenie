'use client';

import React from 'react';
import Link from 'next/link';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { MinimalFooter } from '@/components/home/MinimalFooter';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  PenTool,
  Image as ImageIcon,
  Layout,
  Download,
  Eye,
  MessageSquare,
  BookOpen,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

const FEATURES_LIST = [
  {
    num: '01',
    title: 'Beautiful Writing',
    description:
      'Create clear, engaging and well-structured book content from a simple idea.',
    icon: PenTool,
  },
  {
    num: '02',
    title: 'Beautiful Illustrations',
    description:
      'Create visuals that match the story, subject and tone of your book.',
    icon: ImageIcon,
  },
  {
    num: '03',
    title: 'Professional Design',
    description:
      'Every page is structured with typography, spacing, hierarchy and visual consistency.',
    icon: Layout,
  },
  {
    num: '04',
    title: 'Multiple Formats',
    description: 'Download your finished book as PDF or EPUB.',
    icon: Download,
  },
  {
    num: '05',
    title: 'Book Preview',
    description: 'Review every page before downloading your final book.',
    icon: Eye,
  },
  {
    num: '06',
    title: 'Easy Editing',
    description:
      'Tell BookGenie what you want to change and refine your book using simple instructions.',
    icon: MessageSquare,
  },
  {
    num: '07',
    title: 'Your Own Bookshelf',
    description: 'Keep all of your created books together in My eBooks.',
    icon: BookOpen,
  },
  {
    num: '08',
    title: 'Revision & Refinement',
    description:
      'Make changes without rebuilding the entire book from scratch.',
    icon: RotateCcw,
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans antialiased">
      <MinimalHeader />

        <main className="flex-1 max-w-[1240px] w-full mx-auto px-6 pt-12 sm:pt-16 pb-24">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] leading-tight text-[#111111] font-normal tracking-tight mb-4">
              Everything you need to create a beautiful book.
            </h1>
            <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-lg mx-auto">
              BookGenie handles the writing, visual creation and publishing details so you can focus on your idea.
            </p>
          </div>

          {/* Features Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {FEATURES_LIST.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.num}
                  className="bg-white rounded-2xl border border-[#EAEAEA] hover:border-[#CCCCCC] p-7 flex flex-col justify-between transition-all shadow-[0_2px_12px_rgba(0,0,0,0.02)] group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-serif text-xl sm:text-2xl font-normal text-[#888888] group-hover:text-[#111111] transition-colors">
                        {feat.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#EAEAEA] flex items-center justify-center text-[#111111]">
                        <Icon className="w-5 h-5 stroke-[1.8]" />
                      </div>
                    </div>

                    <h3 className="text-[17px] font-semibold text-[#111111] mb-2 font-sans">
                      {feat.title}
                    </h3>

                    <p className="text-[13px] text-[#666666] leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-[#FAF9F6] border border-[#EAEAEA] text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#111111] font-normal mb-3">
              Ready to start your book?
            </h2>
            <p className="text-sm text-[#666666] mb-6 max-w-md mx-auto">
              Enter a prompt on the homepage and watch your eBook being created in minutes.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-sm font-semibold transition-all shadow-xs"
            >
              <span>Create Your eBook</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>

        <MinimalFooter />
      </div>
  );
}
