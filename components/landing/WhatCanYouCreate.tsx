'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface ShelfBook {
  id: string;
  type: string;
  title: string;
  category: string;
  pages: string;
  coverImage: string;
  prompt: string;
}

export function WhatCanYouCreate() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const books: ShelfBook[] = [
    {
      id: 'brave-fox',
      type: 'children',
      title: 'The Brave Little Fox',
      category: "Children's Storybook",
      pages: '28 pages • Full Color',
      coverImage: '/images/cover-brave-little-fox.jpg',
      prompt: "A whimsical illustrated children's storybook about a brave little fox exploring an enchanted forest.",
    },
    {
      id: 'mindful-you',
      type: 'guide',
      title: 'THE MINDFUL YOU',
      category: 'Self-Help & Clarity',
      pages: '48 pages • Illustrated',
      coverImage: '/images/cover-mindful-you.jpg',
      prompt: 'A mindful living guide with structured reflections, presence techniques, and calm inner peace exercises.',
    },
    {
      id: 'simple-recipes',
      type: 'recipe',
      title: 'SIMPLE RECIPES',
      category: 'Artisanal Cookbook',
      pages: '36 pages • Photography',
      coverImage: '/images/cover-simple-recipes.jpg',
      prompt: 'An effortless cookbook of 25 fresh Mediterranean seasonal recipes with rustic styling and chef tips.',
    },
    {
      id: 'creators-playbook',
      type: 'course',
      title: "The Creator's Playbook",
      category: 'Strategy & Growth',
      pages: '64 pages • Frameworks',
      coverImage: '/images/cover-creators-playbook.jpg',
      prompt: 'A playbook for modern digital creators focusing on building leverage, creative consistency, and audience growth.',
    },
    {
      id: 'kinder-world',
      type: 'novel',
      title: 'A Kinder World',
      category: 'Humanity & Stories',
      pages: '52 pages • Prose',
      coverImage: '/images/cover-kinder-world.jpg',
      prompt: 'A touching narrative exploring empathy, connection, and the quiet kindness that reshapes human lives.',
    },
    {
      id: 'quiet-journal',
      type: 'journal',
      title: 'My Quiet Journal',
      category: 'Guided Reflections',
      pages: '32 pages • Prompts',
      coverImage: '/images/cover-quiet-journal.jpg',
      prompt: 'A daily guided journal with provocative prompts, morning reflections, and serene evening gratitude spaces.',
    },
  ];

  const handleSelectBook = (book: ShelfBook) => {
    const targetUrl = `/create?type=${book.type}&prompt=${encodeURIComponent(book.prompt)}`;
    if (!user) {
      sessionStorage.setItem('bg_pending_prompt', book.prompt);
      sessionStorage.setItem('bg_pending_type', book.type);
      openAuthModal('signup', targetUrl);
    } else {
      router.push(targetUrl);
    }
  };

  const scrollShelf = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-24 border-t border-[#EDE6DC] dark:border-[#26221D] bg-[#FAF8F5] dark:bg-[#151311] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1ECE2] dark:bg-[#231E18] border border-[#E5D7C3] dark:border-[#382F24] text-[10px] sm:text-[11px] font-semibold text-[#8C5F2E] dark:text-[#C49B66] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#A87B45]" />
              <span>Discover Genres</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#181511] dark:text-[#F8F5EE] tracking-tight mb-3">
              Create anything worth reading.
            </h2>
            <p className="text-sm sm:text-base text-[#6B635B] dark:text-[#A8A199] max-w-xl">
              Explore the range of books created by authors, educators, and creators worldwide. Each rendered with authentic binding, tactile cloth, and bespoke interior typesetting.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => scrollShelf('left')}
              className="p-2.5 rounded-full border border-[#EDE6DC] dark:border-[#2C2721] bg-white dark:bg-[#1E1B18] text-[#5A5249] dark:text-[#B3AAA0] hover:bg-[#F3ECE0] dark:hover:bg-[#2A2520] transition-colors shadow-2xs"
              aria-label="Scroll shelf left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollShelf('right')}
              className="p-2.5 rounded-full border border-[#EDE6DC] dark:border-[#2C2721] bg-white dark:bg-[#1E1B18] text-[#5A5249] dark:text-[#B3AAA0] hover:bg-[#F3ECE0] dark:hover:bg-[#2A2520] transition-colors shadow-2xs"
              aria-label="Scroll shelf right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Physical Standing Book Shelf */}
        <div
          ref={scrollContainerRef}
          className="flex items-end gap-6 sm:gap-8 overflow-x-auto pb-10 pt-4 px-2 no-scrollbar scroll-smooth"
        >
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => handleSelectBook(book)}
              className="group cursor-pointer flex-shrink-0 w-[200px] sm:w-[220px] flex flex-col items-center select-none transition-transform duration-300 hover:-translate-y-2"
            >
              {/* Hardcover Volume Graphic with Anatomy */}
              <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden shadow-[0_16px_35px_-8px_rgba(24,21,17,0.3)] group-hover:shadow-[0_24px_45px_-8px_rgba(24,21,17,0.42)] transition-all border border-[#E5DFD5] dark:border-[#382F24] bg-white">
                
                {/* Book Cover Image */}
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  sizes="220px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Realistic Hinge & Spine Depth Overlay */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/45 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-white/30 pointer-events-none" />
                
                {/* Book Bottom Page Block Edge (thickness) */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-t from-[#EDE5D8] to-transparent border-t border-black/15 pointer-events-none" />

                {/* Subtle Foil Sheen on Hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500" />
              </div>

              {/* Book Metadata Below */}
              <div className="mt-4 text-center w-full px-1">
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#181511] dark:text-[#F8F5EE] group-hover:text-[#8C5F2E] dark:group-hover:text-[#C49B66] transition-colors truncate">
                  {book.title}
                </h3>
                <p className="text-xs text-[#8C5F2E] dark:text-[#C49B66] font-medium mt-0.5">
                  {book.category}
                </p>
                <span className="text-[10px] text-[#A8A199] dark:text-[#7A736B] block mt-0.5">
                  {book.pages}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Studio Desk Surface Wooden Shelf Line */}
        <div className="w-full h-2.5 bg-gradient-to-r from-[#D9CEBF] via-[#ECE3D5] to-[#D9CEBF] dark:from-[#2A241E] dark:via-[#362F27] dark:to-[#2A241E] rounded-full shadow-[0_4px_12px_rgba(24,21,17,0.15)] -mt-6 mb-8" />

        {/* Bottom CTA bar */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              if (!user) openAuthModal('signup', '/create');
              else router.push('/create');
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#8C5F2E] dark:text-[#C49B66] hover:text-[#5E3F1D] dark:hover:text-[#E0BA88] transition-colors"
          >
            <span>Have a custom book idea? Open Studio Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}

