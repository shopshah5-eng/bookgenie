'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function MinimalExamples() {
  const examples = [
    {
      title: 'The Little Explorer',
      genre: "Children's Book",
      image: '/images/mockup-little-explorer.jpg',
      slug: 'star-explorer',
      prompt: "A children's illustrated story about a brave little explorer discovering a magical forest...",
    },
    {
      title: 'Mindful Living',
      genre: 'Self-Help Guide',
      image: '/images/mockup-mindful-living.jpg',
      slug: 'mindful-morning',
      prompt: 'A calm, inspiring self-help guide with daily mindful habits and morning reflections for clarity...',
    },
    {
      title: 'Flavours of Home',
      genre: 'Cookbook',
      image: '/images/mockup-flavours-home.jpg',
      slug: 'flavours-home',
      prompt: 'An artisanal Mediterranean cookbook with traditional wholesome heritage recipes...',
    },
    {
      title: 'A Journey Within',
      genre: 'Travel Journal',
      image: '/images/mockup-journey-within.jpg',
      slug: 'silent-path',
      prompt: 'A reflective travel journal exploring solitary alpine pathways, mountain journeys, and personal discovery...',
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 bg-white" id="examples">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Header */}
        <div className="text-left mb-12">
          <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#666666] uppercase block mb-3">
            EXAMPLES
          </span>
          <h2 className="font-serif text-[34px] sm:text-[42px] text-[#111111] leading-tight tracking-tight mb-3">
            See What You Can Create
          </h2>
          <p className="font-sans text-[15px] sm:text-[16px] text-[#666666] max-w-3xl">
            From children's stories to self-help guides, cookbooks to travel journals — the possibilities are endless.
          </p>
        </div>

        {/* 4 Book Covers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {examples.map((book) => (
            <Link
              key={book.title}
              href={`/examples/${book.slug}`}
              className="group flex flex-col items-center select-none"
            >
              {/* Book Mockup Container */}
              <div className="relative w-full aspect-[3/4] overflow-visible mb-4 transition-transform duration-300 group-hover:-translate-y-1.5">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain"
                />
              </div>

              {/* Centered Genre Caption */}
              <span className="text-[13px] font-medium text-[#444444] group-hover:text-[#111111] transition-colors text-center">
                {book.genre}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
