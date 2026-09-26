'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface EditionItem {
  id: string;
  title: string;
  genre: string;
  badge: string;
  format: string;
  description: string;
  image: string;
  href: string;
}

export function BookShowcase() {
  const router = useRouter();

  const editions: EditionItem[] = [
    {
      id: 'silent-path',
      title: 'The Silent Path',
      genre: 'Speculative Fiction Novella',
      badge: 'Royal Octavo • 142 pp',
      format: 'Royal Octavo (6 × 9″)',
      description: 'A solitary star-mapper navigates derelict jump gates, decoding dying pulsar frequencies through recursive neural networks.',
      image: '/images/cover-silent-path.jpg',
      href: '/examples/silent-path',
    },
    {
      id: 'mindful-morning',
      title: 'The Mindful Morning: Rituals for Clarity',
      genre: 'Mindfulness & Wellbeing',
      badge: 'Executive Hardcover • 196 pp',
      format: 'Demy Octavo (5.5 × 8.5″)',
      description: 'Morning contemplation frameworks, intentional silence architectures, and restorative journal prompts for focused creative work.',
      image: '/images/cover-mindful-morning.jpg',
      href: '/examples/mindful-morning',
    },
    {
      id: 'star-explorer',
      title: 'The Little Star Explorer',
      genre: "Children's Illustrated Folio",
      badge: 'Bedtime Edition • 32 pp',
      format: 'Crown Quarto (8.5 × 8.5″)',
      description: 'An enchanting bedtime voyage across starlit nebulae and whispering moons with full-page storybook watercolor plates.',
      image: '/images/cover-star-explorer.jpg',
      href: '/examples/star-explorer',
    },
  ];

  return (
    <section className="w-full py-20 bg-surface-container-low dark:bg-[#1a1b22]/50 border-b border-surface-container-highest dark:border-white/10" id="showcase">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-14">
          <div>
            <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary dark:text-[#fcba64] block mb-2">
              Curated Gallery
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary dark:text-[#f1effa] tracking-tight">
              Editions Synthesized in Atelier
            </h2>
          </div>
          <Link
            href="/examples"
            className="mt-4 md:mt-0 font-label-ui text-label-ui text-primary dark:text-[#f1effa] inline-flex items-center gap-1 hover:underline group"
          >
            <span>View complete archive</span>
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              north_east
            </span>
          </Link>
        </div>

        {/* 3 Master Edition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {editions.map((edition) => (
            <div
              key={edition.id}
              className="group bg-surface-container-lowest dark:bg-[#121217] p-6 rounded-xl border border-surface-container-highest dark:border-white/10 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 3:4 Optical Cover with Spine Hinge Shadow */}
                <div className="w-full aspect-[3/4] bg-surface-container-high dark:bg-[#1f1f28] rounded-lg overflow-hidden shadow-md mb-6 relative select-none">
                  <Image
                    src={edition.image}
                    alt={edition.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle Book Spine Shadow */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />
                  
                  {/* Edition Tag */}
                  <div className="absolute top-3 left-3 bg-surface-container-lowest/90 dark:bg-[#1a1b22]/90 backdrop-blur-xs px-2.5 py-0.5 rounded text-[10px] font-label-caps uppercase tracking-wider text-on-surface dark:text-[#f1effa] border border-surface-container-highest/60 dark:border-white/10">
                    {edition.badge}
                  </div>
                </div>

                <span className="font-label-caps text-label-caps text-secondary dark:text-[#fcba64] uppercase tracking-widest block mb-1">
                  {edition.genre}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary dark:text-[#f1effa] mb-2">
                  {edition.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-300 line-clamp-2 mb-4 leading-relaxed">
                  {edition.description}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-surface-container-highest dark:border-white/10">
                <span className="font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400">
                  {edition.format}
                </span>
                <button
                  onClick={() => router.push(edition.href)}
                  className="font-label-ui text-label-ui text-primary dark:text-[#fcba64] hover:text-secondary inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect Spread</span>
                  <span className="material-symbols-outlined text-sm">visibility</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
