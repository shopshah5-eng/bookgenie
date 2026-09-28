'use client';

import React from 'react';
import { Sparkles, Image as ImageIcon, FileText, Download } from 'lucide-react';

export function MinimalFeatureStrip() {
  const features = [
    {
      icon: Sparkles,
      title: 'Autonomous Writing',
      desc: 'High-quality content',
    },
    {
      icon: ImageIcon,
      title: 'Unique Illustrations',
      desc: 'Beautiful visuals',
    },
    {
      icon: FileText,
      title: 'Professional Design',
      desc: 'Clean and modern layouts',
    },
    {
      icon: Download,
      title: 'Multiple Formats',
      desc: 'Download as PDF & EPUB',
    },
  ];

  return (
    <section className="w-full py-8 bg-white">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-[#EAEAEA] border-y border-[#EAEAEA] py-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 px-0 lg:px-6 first:pl-0 last:pr-0"
              >
                <div className="w-9 h-9 rounded-lg bg-[#F7F7F7] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#111111] stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-[#111111] leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-[#666666] mt-0.5 leading-tight">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
