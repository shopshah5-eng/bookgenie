'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';

import { GenerationProgressModal } from '@/components/create/GenerationProgressModal';

export function HeroSection() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSynthesize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (!user) {
      sessionStorage.setItem('bg_pending_prompt', prompt.trim());
      openAuthModal('signup', '/');
      return;
    }

    setIsSynthesizing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/books/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          bookType: 'auto',
          language: 'english',
          style: 'modern',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to start book generation.');
      }

      const data = await response.json();
      setActiveBookId(data.bookId);
      setActiveJobId(data.jobId);
      setIsGenerating(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error initiating synthesis.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleOpenStudio = () => {
    if (!user) {
      openAuthModal('signup', '/create');
    } else {
      router.push('/create');
    }
  };

  return (
    <section className="relative w-full pt-12 pb-20 overflow-hidden bg-surface-container-lowest dark:bg-[#121217]">
      {/* Subtle architectural ambient gradient aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[880px] h-[420px] bg-gradient-to-b from-surface-container-low dark:from-white/5 via-surface/40 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Pill announcement tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-low dark:bg-white/5 border border-surface-container-highest dark:border-white/10 shadow-xs mb-8 transition-transform hover:-translate-y-0.5 cursor-default">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#fcba64] animate-pulse" />
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant dark:text-neutral-400">
            BookGenie Atelier • The art of autonomous bookmaking
          </span>
        </div>

        {/* Confident Minimalist Display Headline */}
        <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-primary dark:text-[#f1effa] max-w-4xl tracking-tight leading-[1.08] mb-6">
          Books of enduring beauty, written and typeset in minutes.
        </h1>

        {/* Calibrated Editorial Subtitle */}
        <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-neutral-400 max-w-2xl mb-10 leading-relaxed font-normal">
          Turn raw manuscripts, essays, or premises into collector-grade hardcovers, validated EPUB3s, and tactile digital folios with deterministic algorithmic typography.
        </p>

        {/* Primary Action Cluster */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full max-w-md">
          <button
            onClick={handleOpenStudio}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary dark:bg-white text-on-primary dark:text-black px-7 py-3.5 rounded-full font-label-ui text-label-ui shadow-sm hover:shadow-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>Open Creation Studio</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
          <a
            href="#showcase"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container-low dark:bg-white/5 border border-surface-container-highest dark:border-white/10 text-on-surface dark:text-[#f1effa] px-6 py-3.5 rounded-full font-label-ui text-label-ui shadow-xs hover:bg-surface-container dark:hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary dark:text-[#fcba64]">menu_book</span>
            <span>Explore Sample Editions</span>
          </a>
        </div>

        {/* Quick Folio Prompt Synthesizer Bar */}
        <form
          onSubmit={handleSynthesize}
          className="w-full max-w-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-surface-container-highest dark:border-white/10 p-1.5 rounded-full shadow-md flex items-center gap-2 mb-16 transition-all focus-within:ring-2 focus-within:ring-secondary/40"
        >
          <div className="pl-4 pr-1 text-on-surface-variant dark:text-neutral-400 flex items-center">
            <span className="material-symbols-outlined text-[20px]">auto_stories</span>
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your book idea or drop manuscript fragment..."
            className="flex-1 bg-transparent border-0 outline-none text-on-surface dark:text-[#f1effa] font-body-md text-body-md placeholder:text-outline/70 dark:placeholder:text-neutral-500 px-2 py-2"
          />
          <button
            type="submit"
            disabled={isSynthesizing}
            className="inline-flex items-center gap-1.5 bg-primary dark:bg-white text-on-primary dark:text-black hover:bg-primary/90 dark:hover:bg-neutral-200 px-5 py-2.5 rounded-full font-label-ui text-label-ui whitespace-nowrap shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary-container dark:text-amber-600">
              {isSynthesizing ? 'sync' : 'magic_button'}
            </span>
            <span>{isSynthesizing ? 'Synthesizing...' : 'Synthesize Folio'}</span>
          </button>
        </form>

        {/* Hero Visual Book Artifact with Ambient Lighting */}
        <div className="relative w-full max-w-5xl group select-none">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-surface-container dark:bg-[#1a1b22] border border-surface-container-highest dark:border-white/10">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[580px]">
              <Image
                src="/images/atelier-studio-hero.png"
                alt="Open folio book on chalk surface with fluttering deckle-edged architectural plates"
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-surface-container-lowest dark:from-[#121217] via-surface-container-lowest/40 to-transparent" />
          </div>

          {/* Whisper Folio Badge Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface-container-lowest/90 dark:bg-[#1a1b22]/90 backdrop-blur-md px-5 py-2 rounded-full border border-surface-container-highest dark:border-white/10 shadow-lg flex items-center gap-3 sm:gap-4 text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary dark:bg-[#fcba64]" />
              <span className="font-code-spec text-code-spec text-on-surface dark:text-[#f1effa] tracking-wider uppercase">
                Folio Spread 64–65
              </span>
            </div>
            <span className="text-surface-variant dark:text-neutral-600">•</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400">
              Archival Paper 140 GSM • French Fold Binding
            </span>
          </div>
        </div>

      </div>

      {/* Real-Time Circular Clockwise Generation Progress Modal */}
      {isGenerating && activeBookId && activeJobId && (
        <GenerationProgressModal
          isOpen={isGenerating}
          bookId={activeBookId}
          jobId={activeJobId}
          onClose={() => setIsGenerating(false)}
        />
      )}

      {errorMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-red-600 text-white shadow-xl text-sm font-label-ui flex items-center gap-2">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="ml-2 font-bold hover:opacity-80">✕</button>
        </div>
      )}
    </section>
  );
}
