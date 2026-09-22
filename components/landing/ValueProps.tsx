'use client';

import React from 'react';
import { PenTool, Clock, Heart } from 'lucide-react';

export function ValueProps() {
  const props = [
    {
      title: 'AI Writes & Designs',
      description:
        'Get complete, high-quality content with beautiful visuals and layouts.',
      icon: <PenTool className="w-5 h-5 text-[#8C5F2E]" />,
      bg: 'bg-[#F9F4EC]',
    },
    {
      title: 'Done in Minutes',
      description:
        'From idea to a ready-to-download book — in just a few minutes.',
      icon: <Clock className="w-5 h-5 text-[#8C5F2E]" />,
      bg: 'bg-[#F9F4EC]',
    },
    {
      title: 'For Everyone',
      description:
        'Perfect for creators, educators, students, entrepreneurs and more.',
      icon: <Heart className="w-5 h-5 text-[#8C5F2E]" />,
      bg: 'bg-[#F9F4EC]',
    },
  ];

  return (
    <section className="py-12 border-t border-[#EFECE6] bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {props.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white/60 border border-[#EFECE6]/80 hover:bg-white hover:border-[#E8DFD0] transition-colors"
            >
              <div
                className={`w-11 h-11 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 border border-[#EBE3D5] shadow-2xs`}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#1A1612] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
