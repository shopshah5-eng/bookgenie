'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { MinimalFooter } from '@/components/home/MinimalFooter';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { ArrowRight, BookOpen } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Writing',
  'Book Design',
  'Publishing',
  'Storytelling',
  'Creative Ideas',
];

const ARTICLES = [
  {
    slug: 'how-to-turn-an-idea-into-a-book',
    category: 'Writing',
    title: 'How to Turn an Idea Into a Book',
    description:
      'Learn how to expand a single creative premise into a structured narrative arc with captivating chapters and memorable themes.',
    readTime: '4 min read',
  },
  {
    slug: 'how-to-structure-a-short-ebook',
    category: 'Book Design',
    title: 'How to Structure a Short eBook',
    description:
      'A practical guide to chapter pacing, heading hierarchy, and keeping readers engaged throughout concise, high-impact publications.',
    readTime: '5 min read',
  },
  {
    slug: 'how-many-pages-should-your-ebook-have',
    category: 'Publishing',
    title: 'How Many Pages Should Your eBook Have?',
    description:
      'Understanding optimal page targets across children’s books, recipe collections, travel diaries, and self-help manuals.',
    readTime: '3 min read',
  },
  {
    slug: 'how-to-design-a-beautiful-book-cover',
    category: 'Book Design',
    title: 'How to Design a Beautiful Book Cover',
    description:
      'The key principles of publishing-grade cover design: typography balance, visual focal points, and cohesive color palettes.',
    readTime: '6 min read',
  },
  {
    slug: 'pdf-vs-epub-understanding-the-difference',
    category: 'Publishing',
    title: 'PDF vs EPUB: Understanding the Difference',
    description:
      'Fixed-layout precision versus reflowable e-reader flexibility: when to use each format for your digital publications.',
    readTime: '4 min read',
  },
  {
    slug: 'how-to-write-a-better-book-prompt',
    category: 'Storytelling',
    title: 'How to Write a Better Book Prompt',
    description:
      'Practical tips on phrasing your ideas, tone instructions, and stylistic details to get the exact publication you envision.',
    readTime: '5 min read',
  },
  {
    slug: 'how-to-create-a-childrens-book',
    category: 'Creative Ideas',
    title: "How to Create a Children's Book",
    description:
      'From whimsical character development to coordinating full-page illustrations and age-appropriate vocabulary.',
    readTime: '6 min read',
  },
  {
    slug: 'how-to-prepare-an-ebook-for-publishing',
    category: 'Publishing',
    title: 'How to Prepare an eBook for Publishing',
    description:
      'Essential pre-flight checklists for digital distribution, copyright formatting, metadata setup, and proofreading.',
    readTime: '5 min read',
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredArticles =
    selectedCategory === 'All'
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans antialiased">
      <MinimalHeader />

        <main className="flex-1 max-w-[1240px] w-full mx-auto px-6 pt-12 sm:pt-16 pb-24">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] leading-tight text-[#111111] font-normal tracking-tight mb-3">
              Ideas for better books.
            </h1>
            <p className="text-sm sm:text-base text-[#666666]">
              Guides, inspiration and practical advice for creating, designing and publishing beautiful eBooks.
            </p>
          </div>

          {/* Categories Filter Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white border border-[#EAEAEA] text-[#666666] hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.slug}
                className="bg-white rounded-2xl border border-[#EAEAEA] hover:border-[#CCCCCC] p-7 flex flex-col justify-between transition-all shadow-[0_2px_12px_rgba(0,0,0,0.02)] group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888888]">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-[#AAAAAA]">
                      {article.readTime}
                    </span>
                  </div>

                  <h2 className="font-serif text-xl font-normal text-[#111111] group-hover:underline mb-2.5 leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-[13px] text-[#666666] leading-relaxed mb-6">
                    {article.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F5F5F5] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#111111] flex items-center gap-1.5 group-hover:gap-2 transition-all">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </main>

        <MinimalFooter />
      </div>
  );
}
