'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ArrowRight, Eye, Sparkles } from 'lucide-react';

interface ShowcaseBook {
  id: string;
  slug: string;
  title: string;
  genre: string;
  pages: number;
  gradient: string;
  tagline: string;
  isDemo?: boolean;
}

export function BookShowcase() {
  const router = useRouter();
  const [scrollIndex, setScrollIndex] = useState(0);

  const books: ShowcaseBook[] = [
    {
      id: 'demo-ocean-wonders',
      slug: 'ocean-wonders',
      title: 'Ocean Wonders',
      genre: "Children's Book",
      pages: 28,
      gradient: 'from-[#0D3B66] via-[#05668D] to-[#028090]',
      tagline: 'An underwater adventure exploring coral reefs & friendly sea turtles.',
      isDemo: true,
    },
    {
      id: 'showcase-kinder-world',
      slug: 'a-kinder-world',
      title: 'A Kinder World',
      genre: 'Storybook',
      pages: 32,
      gradient: 'from-[#C4A484] via-[#AA8A68] to-[#8C6D4F]',
      tagline: 'A heartwarming tale of a young elephant discovering compassion.',
    },
    {
      id: 'showcase-productivity',
      slug: 'the-productivity-playbook',
      title: 'The Productivity Playbook',
      genre: 'Business & Focus',
      pages: 64,
      gradient: 'from-[#EDE6D6] via-[#E0D5C1] to-[#C9B99E]',
      tagline: 'Science-backed daily routines to multiply your focus without burnout.',
    },
    {
      id: 'showcase-delicious',
      slug: 'delicious-every-day',
      title: 'Delicious Every Day',
      genre: 'Cookbook',
      pages: 48,
      gradient: 'from-[#D9822B] via-[#C36319] to-[#994700]',
      tagline: 'Wholesome Mediterranean recipes made with five fresh ingredients.',
    },
    {
      id: 'showcase-night-sky',
      slug: 'the-night-sky',
      title: 'The Night Sky',
      genre: 'Science & Cosmos',
      pages: 56,
      gradient: 'from-[#0B132B] via-[#1C2541] to-[#3A506B]',
      tagline: 'A stargazers illustrated guide to constellations and galaxies.',
    },
    {
      id: 'showcase-financial',
      slug: 'financial-freedom',
      title: 'Financial Freedom',
      genre: 'Practical Guide',
      pages: 72,
      gradient: 'from-[#2D5A27] via-[#1E4D2B] to-[#123519]',
      tagline: 'The beginner roadmap to passive investing and wealth generation.',
    },
  ];

  const handleNext = () => {
    setScrollIndex((prev) => (prev < books.length - 3 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setScrollIndex((prev) => (prev > 0 ? prev - 1 : books.length - 3));
  };

  return (
    <section className="py-14 sm:py-20 border-t border-[#EFECE6] bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1612] tracking-tight mb-2">
              Beautiful books. Real possibilities.
            </h2>
            <p className="text-sm sm:text-base text-[#6B635B]">
              See what others are creating with BookGenie.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/examples"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#9A6F3C] hover:text-[#845D30] transition-colors mr-2"
            >
              Explore more examples <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handlePrev}
              className="p-2 rounded-full border border-[#EFECE6] bg-white hover:bg-[#F9F7F2] text-[#6B635B] hover:text-[#1A1612] transition-colors shadow-2xs"
              aria-label="Previous showcase book"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full border border-[#EFECE6] bg-white hover:bg-[#F9F7F2] text-[#6B635B] hover:text-[#1A1612] transition-colors shadow-2xs"
              aria-label="Next showcase book"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Book Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => {
                if (book.isDemo) {
                  router.push(`/examples/${book.slug}`);
                } else {
                  router.push(`/create?prompt=${encodeURIComponent(book.tagline)}&type=${encodeURIComponent(book.genre)}`);
                }
              }}
              className="group relative flex flex-col aspect-[3/4.2] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5"
            >
              {/* Cover Artwork Canvas */}
              <div
                className={`w-full h-full bg-gradient-to-b ${book.gradient} p-4 sm:p-5 flex flex-col justify-between text-white relative`}
              >
                {/* Texture overlay */}
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold opacity-85 px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-xs">
                    {book.genre}
                  </span>
                  {book.isDemo && (
                    <span className="text-[9px] uppercase tracking-widest font-bold text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> DEMO
                    </span>
                  )}
                </div>

                {/* Center Title */}
                <div className="relative z-10 my-auto text-center">
                  <h3 className="font-serif font-bold text-base sm:text-lg tracking-tight leading-snug drop-shadow-sm mb-1">
                    {book.title}
                  </h3>
                  <p className="text-[11px] opacity-80 line-clamp-2 font-light">
                    {book.tagline}
                  </p>
                </div>

                {/* Bottom Bar */}
                <div className="relative z-10 flex items-center justify-between text-[10px] opacity-75 font-medium">
                  <span>{book.pages} pages</span>
                  <span className="italic font-serif">BookGenie</span>
                </div>

                {/* Hover Reveal Action Bar */}
                <div className="absolute inset-0 bg-[#1A1612]/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center z-20">
                  <Eye className="w-6 h-6 text-[#E8DCCB] mb-2" />
                  <span className="text-xs font-semibold text-white mb-1">
                    {book.isDemo ? 'Read Demo Book →' : 'Create This Book →'}
                  </span>
                  <span className="text-[10px] text-[#D9CEBA]">
                    {book.isDemo ? 'Interactive Full Preview' : 'Use as inspiration'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
