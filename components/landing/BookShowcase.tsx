'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Sparkles, ExternalLink } from 'lucide-react';

interface LibraryBook {
  id: string;
  slug: string;
  title: string;
  authorSubtitle: string;
  genre: string;
  pages: number;
  coverBg: string;
  spineBg: string;
  tagline: string;
  featured?: boolean;
  isDemo?: boolean;
}

export function BookShowcase() {
  const router = useRouter();

  const libraryBooks: LibraryBook[] = [
    {
      id: 'demo-ocean-wonders',
      slug: 'ocean-wonders',
      title: 'Ocean Wonders',
      authorSubtitle: 'Secrets of the Coral Reef',
      genre: "Children's Book",
      pages: 28,
      coverBg: 'from-[#0B2545] via-[#103766] to-[#08182B]',
      spineBg: 'bg-[#061220]',
      tagline: 'An underwater picture book exploring vibrant coral canyons & friendly sea turtles.',
      featured: true,
      isDemo: true,
    },
    {
      id: 'showcase-kinder-world',
      slug: 'a-kinder-world',
      title: 'A Kinder World',
      authorSubtitle: 'Fables for Young Minds',
      genre: 'Illustrated Story',
      pages: 32,
      coverBg: 'from-[#4D3319] via-[#35210E] to-[#1E1106]',
      spineBg: 'bg-[#150B03]',
      tagline: 'A heartwarming literary fable of a young elephant discovering quiet compassion.',
    },
    {
      id: 'showcase-productivity',
      slug: 'the-productivity-playbook',
      title: 'The Productivity Playbook',
      authorSubtitle: 'Deep Work & Systems',
      genre: 'Non-Fiction Guide',
      pages: 64,
      coverBg: 'from-[#1C2630] via-[#121B24] to-[#0B1015]',
      spineBg: 'bg-[#070B0E]',
      tagline: 'Field-tested daily routines to multiply deep focus without creative burnout.',
    },
    {
      id: 'showcase-delicious',
      slug: 'delicious-every-day',
      title: 'Delicious Every Day',
      authorSubtitle: 'The Tuscan Herb Table',
      genre: 'Cookbook & Recipes',
      pages: 48,
      coverBg: 'from-[#5C2317] via-[#3B140D] to-[#220A05]',
      spineBg: 'bg-[#170503]',
      tagline: 'Wholesome Mediterranean recipes crafted with five fresh seasonal ingredients.',
    },
    {
      id: 'showcase-night-sky',
      slug: 'the-night-sky',
      title: 'The Night Sky',
      authorSubtitle: 'Constellation Chronicles',
      genre: 'Science & Cosmos',
      pages: 56,
      coverBg: 'from-[#161D36] via-[#0E1324] to-[#070912]',
      spineBg: 'bg-[#04050A]',
      tagline: 'An illustrated astronomical field guide to ancient constellations and galaxies.',
    },
    {
      id: 'showcase-financial',
      slug: 'financial-freedom',
      title: 'Smart Capital',
      authorSubtitle: 'Principles of Modern Wealth',
      genre: 'Finance & Strategy',
      pages: 72,
      coverBg: 'from-[#233327] via-[#16221A] to-[#0D140F]',
      spineBg: 'bg-[#080D0A]',
      tagline: 'A practical roadmap to passive asset building and intentional financial freedom.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 border-t border-[rgba(24,21,17,0.08)] bg-[#F8F4EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1ECE2] border border-[#E5D5C0] text-[10px] sm:text-[11px] font-semibold text-[#8C5F2E] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#A47A45]" /> Curated Digital Bookstore
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#181511] tracking-tight mb-3">
              The BookGenie Library
            </h2>
            <p className="text-sm sm:text-base text-[#746B60] max-w-xl">
              Browse actual volumes planned, written, illustrated, and typeset through our studio pipeline. Inspect live reader samples or read the full excerpt.
            </p>
          </div>

          <Link
            href="/examples"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#A47A45] hover:text-[#8C5F2E] transition-colors self-start sm:self-auto"
          >
            <span>View all library volumes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Digital Bookstore Bookshelf Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6">
          {libraryBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => {
                if (book.isDemo) {
                  router.push(`/examples/${book.slug}`);
                } else {
                  router.push(`/create?prompt=${encodeURIComponent(book.tagline)}&type=${encodeURIComponent(book.genre)}`);
                }
              }}
              className="group cursor-pointer flex flex-col justify-between"
            >
              {/* Hardcover Book Object */}
              <div
                className={`relative w-full aspect-[3/4.4] rounded-sm bg-gradient-to-b ${book.coverBg} p-4 sm:p-5 flex flex-col justify-between text-white book-shadow transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden border border-white/10`}
              >
                {/* Book Spine Simulation Accent */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-2.5 sm:w-3 ${book.spineBg} book-spine-shadow border-r border-white/10`}
                />

                {/* Top Badge */}
                <div className="pl-2 flex items-center justify-between z-10">
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-semibold text-white/70">
                    {book.genre}
                  </span>
                  {book.isDemo && (
                    <span className="text-[8px] uppercase tracking-wider font-bold text-[#D4AF37] bg-white/10 px-1.5 py-0.5 rounded-xs">
                      DEMO
                    </span>
                  )}
                </div>

                {/* Center Title */}
                <div className="pl-2 my-auto text-center z-10">
                  <h3 className="font-serif font-bold text-sm sm:text-base tracking-tight leading-tight mb-1 text-white group-hover:text-amber-200 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-white/70 font-light italic">
                    {book.authorSubtitle}
                  </p>
                </div>

                {/* Bottom Spine Label */}
                <div className="pl-2 pt-2 border-t border-white/15 flex items-center justify-between text-[8px] sm:text-[9px] text-white/60 z-10">
                  <span>{book.pages} Pages</span>
                  <span className="font-serif italic text-amber-100/80">Studio Ed.</span>
                </div>

                {/* Hover Reveal Subtle Overlay */}
                <div className="absolute inset-0 bg-[#181511]/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center z-20">
                  <BookOpen className="w-5 h-5 text-amber-200 mb-1.5" />
                  <span className="text-[11px] font-semibold text-white">
                    {book.isDemo ? 'Read Showcase Excerpt →' : 'Create Similar Book →'}
                  </span>
                </div>
              </div>

              {/* External Shelf Label Below */}
              <div className="mt-3 px-1">
                <span className="block text-xs font-serif font-bold text-[#181511] truncate group-hover:text-[#A47A45] transition-colors">
                  {book.title}
                </span>
                <span className="block text-[11px] text-[#746B60] truncate">
                  {book.tagline}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
