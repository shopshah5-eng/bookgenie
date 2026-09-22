'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/Button';
import { BookOpen, Sparkles, ArrowRight, Eye } from 'lucide-react';

export default function ExamplesPage() {
  const [filter, setFilter] = useState('all');

  const categories = [
    { label: 'All Examples', value: 'all' },
    { label: "Children's", value: 'children' },
    { label: 'Coloring', value: 'coloring' },
    { label: 'Guide & How-to', value: 'guide' },
    { label: 'Cookbook', value: 'recipe' },
    { label: 'History', value: 'history' },
    { label: 'Fiction', value: 'novel' },
  ];

  const books = [
    {
      slug: 'ocean-wonders',
      title: 'Ocean Wonders',
      category: 'children',
      categoryLabel: "Children's Book",
      pages: 28,
      gradient: 'from-[#0D3B66] via-[#05668D] to-[#028090]',
      desc: 'Explore the living coral kingdoms and meet Barnaby the wise sea turtle.',
      isDemo: true,
    },
    {
      slug: 'a-kinder-world',
      title: 'A Kinder World',
      category: 'children',
      categoryLabel: 'Storybook',
      pages: 32,
      gradient: 'from-[#C4A484] to-[#8C6D4F]',
      desc: 'A heartwarming journey of empathy and friendship in the African savannah.',
    },
    {
      slug: 'the-productivity-playbook',
      title: 'The Productivity Playbook',
      category: 'guide',
      categoryLabel: 'Practical Guide',
      pages: 64,
      gradient: 'from-[#EDE6D6] to-[#C9B99E]',
      desc: 'Daily routines and cognitive ergonomics to multiply your creative output.',
    },
    {
      slug: 'delicious-every-day',
      title: 'Delicious Every Day',
      category: 'recipe',
      categoryLabel: 'Cookbook',
      pages: 48,
      gradient: 'from-[#D9822B] to-[#994700]',
      desc: '25 vibrant Mediterranean recipes using fresh seasonal ingredients.',
    },
    {
      slug: 'the-night-sky',
      title: 'The Night Sky',
      category: 'history',
      categoryLabel: 'Science & Cosmos',
      pages: 56,
      gradient: 'from-[#0B132B] to-[#3A506B]',
      desc: 'An illustrated beginner guide to deep space, nebulae, and stellar life.',
    },
    {
      slug: 'cute-animals',
      title: 'Cute Animals Coloring Book',
      category: 'coloring',
      categoryLabel: 'Coloring Book',
      pages: 36,
      gradient: 'from-[#F7EDE2] to-[#E5C9AF]',
      desc: 'Relaxing line-art illustrations of forest animals and floral crowns.',
    },
  ];

  const filteredBooks =
    filter === 'all' ? books : books.filter((b) => b.category === filter);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F3EA] text-[#8C5F2E] border border-[#E8DCCB] text-[11px] font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Book Gallery
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A1612] tracking-tight mb-3">
              Books Created with BookGenie
            </h1>
            <p className="text-sm sm:text-base text-[#6B635B]">
              Discover what creators are generating across children’s stories, guides, novels, and cookbooks.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilter(c.value)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  filter === c.value
                    ? 'bg-[#9A6F3C] text-white shadow-xs'
                    : 'bg-white border border-[#EFECE6] text-[#6B635B] hover:text-[#1A1612] hover:bg-[#F9F7F2]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBooks.map((b) => (
              <div
                key={b.slug}
                className="bg-white rounded-3xl border border-[#EFECE6] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Book Cover Area */}
                <div
                  className={`h-56 bg-gradient-to-b ${b.gradient} p-6 flex flex-col justify-between text-white relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-xs">
                      {b.categoryLabel}
                    </span>
                    {b.isDemo && (
                      <span className="text-[10px] uppercase font-bold text-amber-300 bg-black/25 px-2 py-0.5 rounded-md">
                        ★ Live Demo
                      </span>
                    )}
                  </div>

                  <div className="my-auto text-center relative z-10">
                    <h3 className="font-serif font-bold text-xl drop-shadow-sm mb-1">
                      {b.title}
                    </h3>
                    <span className="text-xs opacity-80">{b.pages} pages</span>
                  </div>

                  <div className="text-[10px] opacity-75 text-center font-serif italic relative z-10">
                    BookGenie Edition
                  </div>
                </div>

                {/* Body details & action */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed mb-6">
                    {b.desc}
                  </p>

                  <div className="pt-4 border-t border-[#F4F1EA] flex items-center justify-between">
                    {b.isDemo ? (
                      <Link href={`/examples/${b.slug}`} className="w-full">
                        <Button variant="primary" size="sm" className="w-full">
                          <Eye className="w-3.5 h-3.5 mr-1" /> Read Demo Book →
                        </Button>
                      </Link>
                    ) : (
                      <Link
                        href={`/create?prompt=${encodeURIComponent(b.desc)}&type=${b.category}`}
                        className="w-full"
                      >
                        <Button variant="secondary" size="sm" className="w-full">
                          Create Something Like This →
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
