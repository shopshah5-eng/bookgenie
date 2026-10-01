import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { Footer } from '@/components/landing/Footer';
import { BLOG_ARTICLES } from '@/lib/blog/articles';
import { ArrowLeft, Clock, Calendar, User, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(BLOG_ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = BLOG_ARTICLES[slug];
  if (!article) return { title: 'Article Not Found — BookGenie' };

  return {
    title: `${article.title} — BookGenie Blog`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = BLOG_ARTICLES[slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] antialiased font-sans selection:bg-[#111111] selection:text-white">
      <MinimalHeader />

      <main className="flex-1 max-w-[840px] w-full mx-auto px-5 sm:px-6 pt-12 sm:pt-16 pb-24">
        {/* Navigation Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#6B635B] hover:text-[#1A1612] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Articles</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-10 sm:mb-14">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-[11px] font-bold tracking-wider uppercase mb-4">
            {article.category}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1612] tracking-tight leading-[1.18] mb-6">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-[#6B635B] font-light leading-relaxed mb-6">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#8A8077] pt-4 border-t border-[#EAEAEA]">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#9A6F3C]" />
              {article.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#9A6F3C]" />
              {article.publishedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#9A6F3C]" />
              {article.readTime}
            </span>
          </div>
        </header>

        {/* Article Body */}
        <article className="prose prose-neutral max-w-none space-y-6 text-[#2D2721] text-base sm:text-lg font-light leading-relaxed mb-16">
          {article.content.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </article>

        {/* CTA Box */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] text-center mb-12">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#9A6F3C] mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1612] font-normal mb-3">
            Ready to Publish Your Own Book?
          </h2>
          <p className="text-xs sm:text-sm text-[#6B635B] font-light max-w-md mx-auto mb-6">
            Turn your concept into an illustrated, professionally formatted publication in minutes.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 py-3.5 px-7 rounded-full bg-[#1A1612] hover:bg-[#2D2721] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Open BookGenie Atelier</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
