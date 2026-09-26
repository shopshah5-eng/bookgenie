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
    <section className="py-12 border-t border-outline-variant/30 bg-surface dark:bg-[#0f1015] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {props.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/30 hover:border-secondary/30 transition-all shadow-xs"
            >
              <div
                className="w-12 h-12 rounded-2xl bg-secondary-container/20 dark:bg-white/5 flex items-center justify-center shrink-0 border border-secondary/20 shadow-2xs"
              >
                {item.icon}
              </div>
              <div>
                <h3 className="font-title-editorial text-base text-on-surface dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant dark:text-[#c4c7c5] leading-relaxed">
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
