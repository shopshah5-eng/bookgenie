'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function ExamplesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterCategories = [
    { label: 'All Genres', value: 'all' },
    { label: 'Hard Sci-Fi & Fantasy', value: 'scifi' },
    { label: "Children's Illustrated", value: 'children' },
    { label: 'Business & Leadership', value: 'business' },
    { label: 'Culinary & Travel', value: 'culinary' },
    { label: 'Poetry & Monograph', value: 'arts' },
  ];

  const books = [
    {
      slug: 'silent-path',
      title: 'The Silent Cartographer',
      genre: 'scifi',
      genreLabel: 'Sci-Fi Novella',
      pages: 142,
      trim: '5.5 × 8.5 in',
      model: 'Claude 3.5 Sonnet + Midjourney v6',
      rating: '4.9',
      desc: 'A solitary star-mapper navigates the deep dark of derelict jump gates, decoding dying pulsar frequencies through recursive neural networks.',
      image: '/images/cover-silent-path.jpg',
      demoUrl: '/examples/ocean-wonders',
      prompt: 'A sci-fi novella about a solitary star-mapper navigating derelict jump gates and decoding pulsar frequencies.',
    },
    {
      slug: 'ocean-wonders',
      title: 'Ocean Wonders & The Coral Reef',
      genre: 'children',
      genreLabel: "Children's Book",
      pages: 28,
      trim: '8.5 × 8.5 in',
      model: 'GPT-4o + Gemini Imagen 3',
      rating: '5.0',
      desc: 'An enchanting underwater exploration following Barnaby the sea turtle through bioluminescent coral kingdoms.',
      image: '/images/the-little-explorer-cover.jpg',
      demoUrl: '/examples/ocean-wonders',
      prompt: "A children's picture book about an enchanting sea turtle exploring bioluminescent coral kingdoms.",
    },
    {
      slug: 'zero-to-ipo',
      title: 'Zero to IPO: The Playbook',
      genre: 'business',
      genreLabel: 'Executive Field Manual',
      pages: 288,
      trim: '6 × 9 in',
      model: 'Claude 3.5 Sonnet + Data Visualizer',
      rating: '4.8',
      desc: 'Algorithmic synthesis of 40 venture transcripts turned into an actionable field manual with algorithmic data schematics.',
      image: '/images/cover-mindful-morning.jpg',
      demoUrl: '/examples/ocean-wonders',
      prompt: 'A comprehensive field manual for technology startup founders from inception to public offering.',
    },
    {
      slug: 'flavours-home',
      title: 'Flavours of the Mediterranean',
      genre: 'culinary',
      genreLabel: 'Artisan Culinary Collection',
      pages: 72,
      trim: '7 × 10 in',
      model: 'Gemini Pro + Imagen 3 Ultra',
      rating: '4.9',
      desc: 'Heritage Mediterranean recipes, rustic olive orchard photography, and authentic sourdough secrets.',
      image: '/images/cover-flavours-home.jpg',
      demoUrl: '/examples/ocean-wonders',
      prompt: 'An illustrated artisan cookbook featuring 20 rustic heritage recipes from the Mediterranean.',
    },
    {
      slug: 'botanica-obscura',
      title: 'Botanica Obscura',
      genre: 'arts',
      genreLabel: 'Fine Art Monograph',
      pages: 210,
      trim: '7.5 × 10 in',
      model: 'Claude 3.5 Sonnet + Flux Pro',
      rating: '5.0',
      desc: 'Taxonomy of bioluminescent and subterranean flora. Printed on French uncoated 170 GSM stock with dual-toned lithography.',
      image: '/images/cover-star-explorer.jpg',
      demoUrl: '/examples/ocean-wonders',
      prompt: 'A fine art monograph and botanical taxonomy of bioluminescent and subterranean flora.',
    },
  ];

  const filteredBooks = books.filter((b) => {
    const matchesFilter = filter === 'all' || b.genre === filter;
    const matchesQuery =
      searchQuery === '' ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-surface-container-lowest dark:bg-[#121217] text-on-surface dark:text-[#f1effa] transition-colors">
        <Header />

        <main className="flex-1 w-full pt-8 pb-20">
          {/* Top Ambient Banner Section */}
          <section className="relative w-full pt-10 pb-8 px-4 sm:px-6 lg:px-12 overflow-hidden">
            <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full bg-secondary/10 dark:bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
              {/* Monogram Tag & Subtitle Metric */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary dark:text-[#fcba64] bg-surface-container dark:bg-white/10 px-2.5 py-0.5 rounded">
                  Atelier Archive // Vol. IV
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#fcba64]" />
                <span className="font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400">
                  1,842 Curated Blueprints
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-10">
                <div className="lg:col-span-8">
                  <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-primary dark:text-[#f1effa] tracking-tight leading-none mb-3">
                    The BookGenie <span className="italic font-title-editorial text-secondary dark:text-[#fcba64]">Showcase</span>
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-neutral-400 max-w-2xl leading-relaxed">
                    Discover books written, illustrated, and typeset completely by autonomous artificial intelligence. Inspect open double-page spreads, examine generation blueprints, or fork as your own atelier template.
                  </p>
                </div>
                <div className="lg:col-span-4 flex items-center lg:justify-end">
                  <div className="flex items-center gap-2 font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400 bg-surface-container dark:bg-white/5 border border-surface-container-highest dark:border-white/10 px-3 py-1.5 rounded">
                    <span className="material-symbols-outlined text-[16px] text-secondary dark:text-[#fcba64]">verified</span>
                    <span>Algorithmic Kern &amp; Grid Verified</span>
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-surface-container-low dark:bg-[#1a1b22] p-3 rounded-xl border border-surface-container-highest dark:border-white/10 shadow-xs flex flex-col gap-3">
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, genre, prompt premise, or visual style..."
                    className="w-full bg-surface-container-lowest dark:bg-black/30 border border-surface-container-highest dark:border-white/10 text-on-surface dark:text-[#f1effa] pl-11 pr-4 py-2.5 rounded-lg font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-white transition-all placeholder:text-outline"
                  />
                </div>

                {/* Filter Pill Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-nowrap">
                  {filterCategories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setFilter(cat.value)}
                      className={`px-3.5 py-1.5 rounded font-label-ui text-label-ui transition-colors cursor-pointer ${
                        filter === cat.value
                          ? 'bg-primary dark:bg-white text-on-primary dark:text-black font-semibold shadow-xs'
                          : 'bg-surface-container-lowest dark:bg-white/5 border border-surface-container-highest dark:border-white/10 hover:bg-surface-container text-on-surface-variant dark:text-neutral-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Showcase Library Grid */}
          <section className="w-full px-4 sm:px-6 lg:px-12 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBooks.map((book) => (
                  <article
                    key={book.slug}
                    className="group flex flex-col bg-surface-container-lowest dark:bg-[#181820] border border-surface-container-highest dark:border-white/10 rounded-xl p-5 shadow-xs hover:shadow-xl transition-all duration-300"
                  >
                    {/* 3:4 Optical Hardcover Mockup */}
                    <div className="relative w-full aspect-[3/4] bg-surface-container-high dark:bg-[#1f1f28] rounded-lg overflow-hidden mb-5 shadow-inner select-none">
                      <Image
                        src={book.image}
                        alt={book.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Spine shadow */}
                      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span className="font-label-caps text-[10px] uppercase bg-primary dark:bg-white text-on-primary dark:text-black px-2 py-0.5 rounded shadow-xs font-semibold">
                          Staff Pick
                        </span>
                        <span className="font-label-caps text-[10px] uppercase bg-surface-container-lowest/90 dark:bg-black/80 text-on-surface dark:text-white px-2 py-0.5 rounded shadow-xs">
                          Print CMYK Ready
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 bg-surface-container-lowest/90 dark:bg-black/80 backdrop-blur-xs px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                        <span className="material-symbols-outlined text-[14px] text-secondary dark:text-[#fcba64]">star</span>
                        <span className="font-code-spec text-code-spec text-on-surface dark:text-white font-semibold">
                          {book.rating}
                        </span>
                      </div>

                      {/* Hover Model Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="font-code-spec text-[11px] text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded">
                          {book.model}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex items-center justify-between text-outline text-label-caps font-label-caps uppercase tracking-wider mb-1">
                          <span className="text-secondary dark:text-[#fcba64]">{book.genreLabel}</span>
                          <span className="font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400">
                            {book.pages} Folios
                          </span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-primary dark:text-[#f1effa] group-hover:text-secondary dark:group-hover:text-[#fcba64] transition-colors mb-2">
                          {book.title}
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-300 line-clamp-2 mb-4 leading-relaxed">
                          {book.desc}
                        </p>
                        <div className="flex items-center gap-2 mb-5">
                          <span className="font-code-spec text-[11px] text-on-surface-variant dark:text-neutral-400 bg-surface-container dark:bg-white/5 px-2 py-0.5 rounded border border-surface-container-highest dark:border-white/10">
                            Trim: {book.trim}
                          </span>
                        </div>
                      </div>

                      {/* Dual Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-surface-container-highest dark:border-white/10">
                        <button
                          onClick={() => router.push(book.demoUrl)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-surface-container-low dark:bg-white/5 hover:bg-surface-container dark:hover:bg-white/10 text-on-surface dark:text-[#f1effa] px-3 py-2 rounded font-label-ui text-label-ui transition-colors cursor-pointer border border-surface-container-highest dark:border-white/10"
                        >
                          <span className="material-symbols-outlined text-[16px]">menu_book</span>
                          <span>Read Spread</span>
                        </button>
                        <Link
                          href={`/create?prompt=${encodeURIComponent(book.prompt)}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary dark:bg-white text-on-primary dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 px-3 py-2 rounded font-label-ui text-label-ui transition-colors shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">fork_right</span>
                          <span>Create Similar</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
