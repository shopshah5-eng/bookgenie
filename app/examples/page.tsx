'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { BookOpen, ArrowRight, Eye } from 'lucide-react';

export default function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', "Children's Book", 'Self-Help Guide', 'Cookbook', 'Travel Journal', 'Lifestyle Guide', 'Short Fiction'];

  const examples = [
    {
      title: 'The Little Explorer',
      category: "Children's Book",
      description: 'An enchanting bedtime adventure following a curious young voyager across hidden forest pathways and starlit glades.',
      image: '/images/mockup-little-explorer.jpg',
      previewUrl: '/examples/ocean-wonders',
    },
    {
      title: 'Mindful Living',
      category: 'Self-Help Guide',
      description: 'Practical daily rituals, calming contemplation frameworks, and intentional habits for peace in a hurried world.',
      image: '/images/mockup-mindful-living.jpg',
      previewUrl: '/examples/mindful-morning',
    },
    {
      title: 'Flavours of Home',
      category: 'Cookbook',
      description: 'A celebration of heritage family recipes, warm kitchen memories, and time-honored artisanal culinary techniques.',
      image: '/images/mockup-flavours-home.jpg',
      previewUrl: '/examples/flavours-home',
    },
    {
      title: 'A Journey Within',
      category: 'Travel Journal',
      description: 'Reflective dispatches and serene vignettes from solitary mountain passages, secluded coasts, and sacred horizons.',
      image: '/images/mockup-journey-within.jpg',
      previewUrl: '/examples/silent-path',
    },
    {
      title: 'The Art of Simple Living',
      category: 'Lifestyle Guide',
      description: 'A gentle philosophy for decluttering your mind, curating your spaces, and discovering richness in everyday stillness.',
      image: '/images/cover-quiet-journal.jpg',
      previewUrl: '/examples/mindful-morning',
    },
    {
      title: 'Stories Under the Stars',
      category: 'Short Fiction',
      description: 'Lyrical tales of quiet wonders, celestial mysteries, and nocturnal journeys woven for dreamers of all ages.',
      image: '/images/cover-star-explorer.jpg',
      previewUrl: '/examples/ocean-wonders',
    },
  ];

  const filtered = selectedCategory === 'All'
    ? examples
    : examples.filter((ex) => ex.category === selectedCategory);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#111111] antialiased selection:bg-[#F2EFE9]">
        <Header />

        <main className="flex-1 max-w-[1240px] mx-auto w-full px-6 py-14 sm:py-20">
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[12px] font-semibold uppercase tracking-widest text-[#777777] mb-3 block">
              Book Showcase
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#111111] font-normal tracking-tight mb-4">
              See what you can create.
            </h1>
            <p className="text-base sm:text-lg text-[#666666] font-light leading-relaxed">
              Explore different kinds of books you can create with BookGenie.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-[#F7F7F6] text-[#666666] hover:text-[#111111] hover:bg-[#EFEFEA]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((book) => (
              <div
                key={book.title}
                className="bg-white rounded-2xl border border-[#EAEAEA] hover:border-[#D0D0CE] transition-all p-5 flex flex-col justify-between group shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              >
                <div>
                  {/* Cover */}
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#F7F7F6] mb-5 border border-black/5">
                    <Image
                      src={book.image}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                    />
                  </div>

                  {/* Metadata */}
                  <div className="mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888]">
                      {book.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-normal text-[#111111] mb-2 tracking-tight">
                    {book.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed line-clamp-3 mb-6 font-light">
                    {book.description}
                  </p>
                </div>

                {/* Preview CTA */}
                <div className="pt-4 border-t border-[#F0F0F0] flex items-center justify-between">
                  <Link
                    href={book.previewUrl}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#111111] hover:bg-[#222222] text-white text-xs sm:text-sm font-medium transition-all shadow-xs group/btn"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Callout */}
          <div className="mt-20 text-center py-12 px-6 rounded-3xl bg-[#FAF9F6] border border-[#EFECE6] max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#111111] font-normal mb-3">
              Ready to write your own story?
            </h3>
            <p className="text-sm sm:text-base text-[#666666] mb-6 font-light">
              Write a simple idea, choose your page count, and create a beautifully written and designed eBook.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] hover:bg-[#222222] text-white text-sm font-medium transition-all shadow-xs"
            >
              <span>Start Creating</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>

        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
