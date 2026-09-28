'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { MinimalFooter } from '@/components/home/MinimalFooter';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans antialiased">
        <MinimalHeader />

        <main className="flex-1 max-w-[840px] w-full mx-auto px-6 pt-12 sm:pt-16 pb-24">
          {/* Header */}
          <div className="text-center mb-14 sm:mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#888888] block mb-3">
              About Us
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] leading-tight text-[#111111] font-normal tracking-tight mb-4">
              Books should begin with an idea.
            </h1>
            <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-lg mx-auto">
              BookGenie was created to make the process of turning an idea into a beautiful book simpler.
            </p>
          </div>

          {/* Visual Divider / Accent */}
          <div className="w-12 h-[1px] bg-[#EAEAEA] mx-auto mb-14" />

          {/* Editorial Prose Body */}
          <div className="space-y-6 text-[15px] sm:text-[16px] text-[#2A2A2A] leading-relaxed font-sans">
            <p>
              Writing a book can feel overwhelming. There are ideas to organize, chapters to structure, pages to design, illustrations to create and files to prepare.
            </p>

            <p>
              BookGenie brings those steps together in one simple experience.
            </p>

            <p>
              You start with an idea. BookGenie helps turn it into a complete book. You can then preview it, refine it and download it in the format you need.
            </p>

            <div className="my-10 p-8 rounded-2xl bg-[#FAF9F6] border border-[#EAEAEA] text-center">
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-[#888888] mb-2">
                Our Mission
              </span>
              <p className="font-serif text-xl sm:text-2xl text-[#111111] font-normal leading-snug">
                Make creating beautiful books accessible to more people.
              </p>
            </div>

            <p>
              Whether you are an aspiring author composing a whimsical children's tale, a culinary expert preserving family heritage recipes, or an independent creator publishing practical guides, BookGenie provides the craft, structure, and polish of an editorial publishing house.
            </p>
          </div>

          {/* End Section */}
          <div className="mt-16 pt-10 border-t border-[#F0F0F0] text-center">
            <span className="font-serif italic text-2xl text-[#111111] block mb-6">
              Made for storytellers.
            </span>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <span>Start Your First Book</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>

        <MinimalFooter />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
