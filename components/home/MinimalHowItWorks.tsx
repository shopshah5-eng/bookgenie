'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export function MinimalHowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Write Your Idea',
      desc: 'Describe what you want to create in a prompt.',
    },
    {
      num: '2',
      title: 'Choose Page Count',
      desc: 'Select the number of pages for your eBook.',
    },
    {
      num: '3',
      title: 'Generate & Download',
      desc: 'Compile your complete eBook and download it in PDF or EPUB.',
    },
  ];

  return (
    <section className="w-full py-20 bg-white" id="how-it-works">
      <div className="max-w-[1240px] mx-auto px-6 text-center">
        {/* Header */}
        <div className="mb-16">
          <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#666666] uppercase block mb-3">
            HOW IT WORKS
          </span>
          <h2 className="font-bold text-[34px] sm:text-[42px] text-[#111111] leading-tight tracking-tight">
            Create Your eBook in 3 Simple Steps
          </h2>
        </div>

        {/* 3 Steps Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 max-w-4xl mx-auto">
          {steps.map((step, idx) => (
            <React.Fragment key={step.num}>
              {/* Step Card */}
              <div className="flex items-center gap-4 text-left flex-1">
                {/* Circle Number */}
                <div className="w-12 h-12 rounded-full border border-[#EAEAEA] bg-white flex items-center justify-center text-[18px] font-bold text-[#111111] shrink-0 shadow-2xs">
                  {step.num}
                </div>
                {/* Text */}
                <div>
                  <h3 className="text-[14px] font-semibold text-[#111111] mb-0.5">
                    {step.title}
                  </h3>
                  <p className="text-[12px] sm:text-[13px] text-[#666666] leading-snug">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Arrow divider (only between steps) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex text-[#CCCCCC] px-2 shrink-0">
                  <ArrowRight className="w-4 h-4 stroke-[1.5]" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
