'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface BookItem {
  id: string;
  title: string;
  category: string;
  specs: string;
  image: string;
  demoUrl: string;
  typeParam: string;
}

export function BookShowcase() {
  const books: BookItem[] = [
    {
      id: 'ocean-wonders',
      title: 'Ocean Wonders',
      category: "Children's Storybook",
      specs: '28 pages • Full Color • CMYK',
      image: '/images/cover-star-explorer.jpg',
      demoUrl: '/examples/ocean-wonders',
      typeParam: 'children',
    },
    {
      id: 'silent-path',
      title: 'The Silent Path',
      category: 'Contemporary Fiction',
      specs: '320 pages • Literary Typeset',
      image: '/images/cover-silent-path.jpg',
      demoUrl: '/examples/silent-path',
      typeParam: 'novel',
    },
    {
      id: 'flavours-home',
      title: 'Flavours of Home',
      category: 'Artisan Culinary Collection',
      specs: '72 pages • High-Res Photos',
      image: '/images/cover-flavours-home.jpg',
      demoUrl: '/examples/flavours-home',
      typeParam: 'cookbook',
    },
    {
      id: 'mindful-morning',
      title: 'The Mindful Morning',
      category: 'Self-Help & Personal Growth',
      specs: '64 pages • Editorial Typography',
      image: '/images/cover-mindful-morning.jpg',
      demoUrl: '/examples/mindful-morning',
      typeParam: 'guide',
    },
  ];

  const [startIndex, setStartIndex] = useState(0);

  const prev = () => setStartIndex((curr) => (curr > 0 ? curr - 1 : books.length - 1));
  const next = () => setStartIndex((curr) => (curr < books.length - 1 ? curr + 1 : 0));

  // Circular view for carousel wrapping
  const displayedBooks = [
    ...books.slice(startIndex),
    ...books.slice(0, startIndex),
  ];

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-[#0A0A0A] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-row items-baseline justify-between mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#F3F3F1] dark:bg-[#1E1E1E] text-[#666666] dark:text-[#A0A0A0] text-[10px] font-semibold tracking-wider uppercase mb-2 border border-[#E5E5E5] dark:border-[#2C2C2C]">
              SHOWCASE LIBRARY
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
              Explore the BookGenie Library
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] dark:text-[#999999] mt-0.5">
              Production blueprints, typography layouts, and complete working editions.
            </p>
          </div>

          <Link
            href="/examples"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#111111] dark:text-[#F5F5F5] hover:text-[#9A6F3C] dark:hover:text-[#E8C28A] transition-colors group shrink-0"
          >
            <span>View full library</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Carousel Container with Left/Right Chevrons */}
        <div className="relative group/carousel">
          
          {/* Left Arrow Button */}
          <button
            onClick={prev}
            aria-label="Previous book"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border border-[#E5E5E5] dark:border-[#2C2C2C] bg-white dark:bg-[#181818] hover:bg-[#F5F5F3] dark:hover:bg-[#222222] shadow-xs flex items-center justify-center text-[#444444] dark:text-[#CCCCCC] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* 4 Books Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 items-center">
            {displayedBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-3 sm:gap-4 p-3 rounded-2xl border border-transparent hover:border-[#EAEAEA] dark:hover:border-[#262626] hover:bg-[#FAFAFA] dark:hover:bg-[#141414] group hover:-translate-y-1 transition-all duration-300"
              >
                {/* 3D Hardcover Book Mockup */}
                <Link
                  href={book.demoUrl}
                  className="relative w-[110px] sm:w-[125px] aspect-[1/1.4] shrink-0 rounded-r-md rounded-l-xs overflow-hidden shadow-[4px_6px_16px_rgba(0,0,0,0.18)] dark:shadow-[4px_6px_20px_rgba(0,0,0,0.6)] border-l-2 border-l-white/60 dark:border-l-white/20 transition-all group-hover:shadow-[6px_10px_24px_rgba(0,0,0,0.22)]"
                >
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 110px, 125px"
                    className="object-cover object-center"
                  />
                  {/* Subtle Spine Crease Highlight */}
                  <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/25 via-white/20 to-transparent pointer-events-none" />
                </Link>

                {/* Metadata Column next to book */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#111111] dark:text-[#F5F5F5] leading-snug line-clamp-2">
                    {book.title}
                  </h3>
                  <div className="text-[11px] font-medium text-[#9A6F3C] dark:text-[#D4AF37] mt-0.5">
                    {book.category}
                  </div>
                  <div className="text-[10px] text-[#888888] dark:text-[#777777] mt-0.5">
                    {book.specs}
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2.5">
                    <Link
                      href={book.demoUrl}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#111111] dark:text-white hover:text-[#9A6F3C] dark:hover:text-[#E8C28A] transition-colors cursor-pointer"
                    >
                      <span>Read preview</span>
                      <ArrowRight className="w-3 h-3 stroke-[2]" />
                    </Link>

                    <Link
                      href={`/create?type=${book.typeParam}`}
                      className="inline-flex items-center gap-1 text-[10px] text-[#666666] dark:text-[#A0A0A0] hover:text-[#111111] dark:hover:text-white transition-colors"
                    >
                      <span>Create similar →</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={next}
            aria-label="Next book"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border border-[#E5E5E5] dark:border-[#2C2C2C] bg-white dark:bg-[#181818] hover:bg-[#F5F5F3] dark:hover:bg-[#222222] shadow-xs flex items-center justify-center text-[#444444] dark:text-[#CCCCCC] transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </section>
  );
}

