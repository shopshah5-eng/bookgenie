'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function CategoriesBentoSection() {
  const categories = [
    {
      title: 'Novels & Fiction',
      desc: 'Literary fiction, thrillers, romance & memoirs',
      specs: 'Standard 5.5" × 8.5" or 6" × 9"',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
      typeParam: 'novel',
    },
    {
      title: "Children's Illustrated",
      desc: 'Full-bleed storybooks, picture books & fables',
      specs: 'Square 8.5" × 8.5" Full Color',
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80',
      typeParam: 'children',
    },
    {
      title: 'Non-Fiction & Guides',
      desc: 'Field manuals, business guides & self-help',
      specs: 'Executive 6" × 9" Typeset',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80',
      typeParam: 'guide',
    },
    {
      title: 'Artisan Cookbooks',
      desc: 'Recipe collections with photo plates & ingredients',
      specs: 'Coffee Table 8" × 10" CMYK',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
      typeParam: 'cookbook',
    },
    {
      title: 'Workbooks & Planners',
      desc: 'Structured habit logs, exercises & prompts',
      specs: 'Letter 8.5" × 11" Wire/Bound',
      image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=400&q=80',
      typeParam: 'workbook',
    },
    {
      title: 'Journals & Reflection',
      desc: 'Mindfulness prompts & guided morning pages',
      specs: 'Pocket 5" × 8" Journaling',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
      typeParam: 'journal',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-[#0A0A0A] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F3F3F1] dark:bg-[#1E1E1E] text-[#666666] dark:text-[#A0A0A0] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mb-3 border border-[#E5E5E5] dark:border-[#2C2C2C]">
              GENRES &amp; FORMATS
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
              One studio. Every kind of book.
            </h2>
            <p className="text-sm sm:text-base text-[#666666] dark:text-[#999999] mt-2 font-sans">
              Each format applies tailored typographic scale, margin geometry, and image resolution standards.
            </p>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#111111] dark:text-white hover:text-[#9A6F3C] dark:hover:text-[#E8C28A] transition-colors group shrink-0"
          >
            <span>Explore all templates</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6 Category Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={`/create?type=${cat.typeParam}`}
              className="group rounded-3xl border border-[#EAEAEA] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#141414] p-5 sm:p-6 flex flex-col justify-between hover:border-[#111111] dark:hover:border-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#111111] dark:text-[#F5F5F5]">
                    {cat.title}
                  </h3>
                  <span className="text-[10px] font-mono text-[#888888] dark:text-[#777777]">
                    {cat.specs.split(' ')[0]}
                  </span>
                </div>
                <p className="text-xs text-[#666666] dark:text-[#999999] mb-4">
                  {cat.desc}
                </p>
              </div>

              {/* Photographic Card Preview */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-[#EEEEEE] dark:border-[#2C2C2C]">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-semibold inline-flex items-center gap-1">
                    Create {cat.title} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              <div className="pt-3 mt-3 flex items-center justify-between text-[11px] text-[#888888] border-t border-[#EFEFEF] dark:border-[#222222]">
                <span>{cat.specs}</span>
                <span className="text-[#111111] dark:text-white font-semibold group-hover:translate-x-1 transition-transform">
                  Launch →
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
