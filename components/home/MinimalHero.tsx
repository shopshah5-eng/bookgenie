'use client';

import React from 'react';
import Image from 'next/image';
import { Feather, Image as ImageIcon, FileText, Download } from 'lucide-react';

export function MinimalHero() {
  return (
    <section className="w-full pt-12 pb-6 sm:pt-16 sm:pb-8 bg-white">
      <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Copy & Micro-features */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Eyebrow */}
          <div className="mb-4">
            <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#666666] uppercase">
              AUTONOMOUS EBOOK CREATOR
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-bold text-[42px] sm:text-[54px] md:text-[62px] text-[#111111] leading-[1.08] tracking-tight mb-5">
            Turn Your Ideas<br />
            Into <span className="font-semibold text-[#333333]">Beautiful Books</span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-[16px] sm:text-[17px] text-[#666666] leading-relaxed max-w-xl mb-10">
            Just write a prompt, and create a complete,
            professionally designed eBook for you — in minutes.
          </p>

          {/* Compact Feature Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2 border-t border-[#F0F0F0]">
            {/* 1. Well Written */}
            <div className="flex items-start gap-2.5">
              <Feather className="w-4 h-4 text-[#111111] mt-0.5 shrink-0 stroke-[1.8]" />
              <div>
                <h4 className="text-[13px] font-semibold text-[#111111] leading-tight">
                  Well Written
                </h4>
                <p className="text-[11px] text-[#666666] mt-0.5 leading-tight">
                  High-quality content
                </p>
              </div>
            </div>

            {/* 2. Beautiful Illustrations */}
            <div className="flex items-start gap-2.5">
              <ImageIcon className="w-4 h-4 text-[#111111] mt-0.5 shrink-0 stroke-[1.8]" />
              <div>
                <h4 className="text-[13px] font-semibold text-[#111111] leading-tight">
                  Beautiful Illustrations
                </h4>
                <p className="text-[11px] text-[#666666] mt-0.5 leading-tight">
                  Beautiful visuals
                </p>
              </div>
            </div>

            {/* 3. Professional Design */}
            <div className="flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-[#111111] mt-0.5 shrink-0 stroke-[1.8]" />
              <div>
                <h4 className="text-[13px] font-semibold text-[#111111] leading-tight">
                  Professional Design
                </h4>
                <p className="text-[11px] text-[#666666] mt-0.5 leading-tight">
                  Clean and modern layouts
                </p>
              </div>
            </div>

            {/* 4. PDF & EPUB */}
            <div className="flex items-start gap-2.5">
              <Download className="w-4 h-4 text-[#111111] mt-0.5 shrink-0 stroke-[1.8]" />
              <div>
                <h4 className="text-[13px] font-semibold text-[#111111] leading-tight">
                  PDF &amp; EPUB
                </h4>
                <p className="text-[11px] text-[#666666] mt-0.5 leading-tight">
                  Download
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Book Photographic Still Life */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end select-none">
          <div className="relative w-full max-w-[460px] aspect-[4/3] sm:aspect-[4/3] overflow-visible">
            <Image
              src="/images/hero-calmer-you.jpg"
              alt="A Calmer You - Hardcover eBook publication with stacked books and ceramic vase"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
