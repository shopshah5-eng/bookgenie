'use client';

import React from 'react';
import { Star, ArrowRight, Users, BookOpen, Sparkles, Heart } from 'lucide-react';

export function Testimonials() {
  const reviews = [
    {
      name: 'Priya S.',
      role: 'Teacher',
      initial: 'P',
      avatarBg: 'bg-[#C27351]',
      content:
        '“I created a children’s book in minutes and it looks professionally designed. Amazing!”',
    },
    {
      name: 'Rahul K.',
      role: 'Entrepreneur',
      initial: 'R',
      avatarBg: 'bg-[#8C5F2E]',
      content:
        '“This saved me so much time. I turned my notes into a beautiful ebook effortlessly.”',
    },
    {
      name: 'Ananya M.',
      role: 'Content Creator',
      initial: 'A',
      avatarBg: 'bg-[#A87B45]',
      content:
        '“The designs and images are stunning. Highly recommend BookGenie!”',
    },
  ];

  const stats = [
    {
      label: 'Happy Creators',
      value: '10,000+',
      icon: <Users className="w-5 h-5 text-[#9A6F3C]" />,
    },
    {
      label: 'Books Generated',
      value: '250,000+',
      icon: <BookOpen className="w-5 h-5 text-[#9A6F3C]" />,
    },
    {
      label: 'Average Rating',
      value: '4.9/5',
      icon: <Star className="w-5 h-5 text-amber-500 fill-amber-500" />,
    },
    {
      label: 'Without Limits',
      value: 'Creativity',
      icon: <Heart className="w-5 h-5 text-[#C27351]" />,
    },
  ];

  return (
    <section className="py-14 sm:py-20 border-t border-[#EFECE6] bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1612] tracking-tight mb-2">
              Loved by creators everywhere.
            </h2>
            <p className="text-sm sm:text-base text-[#6B635B]">
              Real feedback from authors, educators, and makers using BookGenie.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#9A6F3C] hover:text-[#845D30] transition-colors self-start sm:self-auto"
          >
            See more reviews <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-[#EFECE6] shadow-xs hover:border-[#DDD3C2] transition-colors"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              {/* Quote Content */}
              <p className="text-sm sm:text-base text-[#1A1612] leading-relaxed mb-6 font-medium">
                {rev.content}
              </p>

              {/* Author Details */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#F4F1EA]">
                <div
                  className={`w-9 h-9 rounded-full ${rev.avatarBg} text-white flex items-center justify-center font-bold text-sm`}
                >
                  {rev.initial}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1612] leading-none mb-1">
                    {rev.name}
                  </h4>
                  <span className="text-xs text-[#9E968E] leading-none">
                    {rev.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 px-8 rounded-2xl bg-white/70 border border-[#EFECE6]">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F8F3EA] flex items-center justify-center shrink-0 border border-[#E8DCCB]">
                {stat.icon}
              </div>
              <div>
                <div className="text-lg sm:text-xl font-serif font-bold text-[#1A1612] leading-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-[#9E968E] leading-tight">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
