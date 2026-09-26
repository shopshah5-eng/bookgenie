'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { GenerationProgressModal } from '@/components/create/GenerationProgressModal';
import { MonogramLogo } from '@/components/brand/MonogramLogo';

function SearchParamsSync({
  onSync,
}: {
  onSync: (data: { prompt?: string; type?: string; lang?: string; style?: string }) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const initialPrompt =
      searchParams.get('prompt') ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('bg_pending_prompt') : null);
    const initialType =
      searchParams.get('type') ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('bg_pending_type') : null);
    const initialLang = searchParams.get('lang');
    const initialStyle = searchParams.get('style');

    onSync({
      prompt: initialPrompt ? decodeURIComponent(initialPrompt) : undefined,
      type: initialType || undefined,
      lang: initialLang || undefined,
      style: initialStyle || undefined,
    });

    if (typeof window !== 'undefined') {
      if (initialPrompt) sessionStorage.removeItem('bg_pending_prompt');
      if (initialType) sessionStorage.removeItem('bg_pending_type');
    }
  }, [searchParams, onSync]);

  return null;
}

function CreatePageContent() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [bookType, setBookType] = useState('novel');
  const [language, setLanguage] = useState('English (UK / Oxford Style)');
  const [voiceTone, setVoiceTone] = useState('mccarthy');
  const [chapterScale, setChapterScale] = useState(2); // 1 = 5, 2 = 12, 3 = 24
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; size: string; content?: string }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generation Modal state
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const handleSyncParams = React.useCallback(
    (data: { prompt?: string; type?: string; lang?: string; style?: string }) => {
      if (data.prompt) {
        setPrompt(data.prompt);
        // generate a concise title idea from first words
        const words = data.prompt.split(' ').slice(0, 4).join(' ');
        if (!title && words) {
          setTitle(words.replace(/[^\w\s]/gi, ''));
        }
      }
      if (data.type) {
        let t = data.type.toLowerCase().trim();
        if (t === 'cookbook') t = 'recipe';
        if (t === 'other') t = 'auto';
        setBookType(t);
      }
      if (data.lang) setLanguage(data.lang);
    },
    [title]
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const parsedFiles = await Promise.all(
      files.map(async (f) => {
        let textContent = '';
        try {
          if (f.name.endsWith('.txt') || f.name.endsWith('.md') || f.type.startsWith('text/')) {
            textContent = await f.text();
          } else {
            textContent = `[Attached Document: ${f.name}, Size: ${(f.size / 1024).toFixed(1)} KB]`;
          }
        } catch {
          textContent = `[Attached Document: ${f.name}]`;
        }
        return {
          name: f.name,
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
          content: textContent.slice(0, 10000),
        };
      })
    );
    setUploadedFiles((prev) => [...prev, ...parsedFiles]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrompt = title ? `${title}: ${prompt}` : prompt;
    if (!finalPrompt.trim()) {
      setError('Please provide a title or describe the premise for your book.');
      return;
    }

    // Auth gate: if unauthenticated, save prompt & trigger AuthModal
    if (!user) {
      sessionStorage.setItem('bg_pending_prompt', finalPrompt);
      sessionStorage.setItem('bg_pending_type', bookType);
      openAuthModal('signup', '/create');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const uploadedContextString =
        uploadedFiles.length > 0
          ? uploadedFiles
              .map((f) => `### Source Material: ${f.name}\n${f.content || ''}`)
              .join('\n\n')
          : undefined;

      const response = await fetch('/api/books/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          bookType,
          language,
          style: voiceTone === 'mccarthy' ? 'editorial' : voiceTone === 'academic' ? 'academic' : 'modern',
          uploadedContext: uploadedContextString,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to initialize book generation.');
      }

      const data = await response.json();
      setActiveBookId(data.bookId);
      setActiveJobId(data.jobId);
      setIsGenerating(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const chaptersEstimate = chapterScale === 1 ? '5 Chapters' : chapterScale === 2 ? '12 Chapters' : '24 Chapters';
  const wordsEstimate = chapterScale === 1 ? '~18,000 Words' : chapterScale === 2 ? '~42,000 Words' : '~85,000 Words';

  return (
    <div className="min-h-screen bg-surface-container-lowest dark:bg-[#121217] font-body-md text-on-surface dark:text-[#f1effa] antialiased">
      {/* 01: Left Architectural Spine Index Navigation (Desktop Fixed w-72) */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-surface-container-low dark:bg-[#181820] border-r border-surface-container-highest dark:border-white/10 z-50 flex-col justify-between pt-6 pb-6 select-none">
        <div className="flex flex-col">
          <div className="px-6 mb-8">
            <Link href="/">
              <MonogramLogo />
            </Link>
          </div>

          <div className="px-6 mb-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-neutral-400 uppercase tracking-wider">
              Spine &amp; Folio Index
            </span>
          </div>

          <nav className="space-y-1 px-4">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded bg-surface-container-highest dark:bg-white/10 text-primary dark:text-[#fcba64] font-semibold text-sm">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              <span>Manuscript Studio</span>
            </div>
            <Link
              href="/examples/ocean-wonders"
              className="flex items-center gap-3 px-4 py-2.5 rounded font-label-ui text-label-ui text-on-surface-variant dark:text-neutral-400 hover:bg-surface-container dark:hover:bg-white/5 hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>Reader Folio</span>
            </Link>
            <Link
              href="/how-it-works"
              className="flex items-center gap-3 px-4 py-2.5 rounded font-label-ui text-label-ui text-on-surface-variant dark:text-neutral-400 hover:bg-surface-container dark:hover:bg-white/5 hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">format_shapes</span>
              <span>Typeset Metrics</span>
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-3 px-4 py-2.5 rounded font-label-ui text-label-ui text-on-surface-variant dark:text-neutral-400 hover:bg-surface-container dark:hover:bg-white/5 hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Galley &amp; Exports</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Folio Status Card */}
        <div className="px-4">
          <div className="p-4 bg-surface-container dark:bg-white/5 rounded border border-surface-container-highest dark:border-white/10">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-neutral-400 uppercase">
                Folio Status
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary dark:bg-[#fcba64] animate-pulse" />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface dark:text-[#f1effa] mb-1 font-medium truncate">
              {title ? title : 'Vol. I — Master Proof'}
            </p>
            <p className="font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400">
              {chaptersEstimate} • {wordsEstimate}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Studio Workbench Area (with left margin on desktop) */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Studio Header */}
        <header className="sticky top-0 z-40 h-16 bg-surface-container-lowest/90 dark:bg-[#121217]/90 backdrop-blur-md border-b border-surface-container-highest dark:border-white/10 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="lg:hidden">
              <MonogramLogo showStudioBadge={false} />
            </Link>
            <span className="hidden sm:inline font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400 uppercase tracking-widest">
              Workspace / Genesis Workbench
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/examples/ocean-wonders"
              className="font-label-ui text-label-ui text-on-surface-variant dark:text-neutral-400 hover:text-on-surface dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Proof Preview</span>
            </Link>
            <button
              onClick={handleGenerate}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-primary dark:bg-white text-on-primary dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors px-4 py-2 rounded font-label-ui text-label-ui cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary dark:text-amber-600">
                {isSubmitting ? 'sync' : 'magic_button'}
              </span>
              <span>{isSubmitting ? 'Synthesizing...' : 'Synthesize Book'}</span>
            </button>
          </div>
        </header>

        {/* Top Subtle Atelier Status Bar */}
        <div className="w-full bg-surface-container-low dark:bg-[#181820] px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-surface-container-highest dark:border-white/10 select-none">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-secondary dark:bg-[#fcba64] animate-pulse" />
            <span className="font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400 uppercase tracking-wider text-[11px]">
              Session Node: 08-ALPHA // Algorithmic Folio Assembler
            </span>
            <span className="bg-surface-container-highest dark:bg-white/10 text-on-surface-variant dark:text-neutral-400 px-2 py-0.5 rounded font-code-spec text-[10px]">
              ACTIVE READY
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-neutral-400 uppercase">
                Engine:
              </span>
              <span className="font-code-spec text-code-spec text-primary dark:text-[#f1effa] font-medium">
                Claude-3.5 + Imagen-3 Ultra
              </span>
            </div>
            <div className="flex items-center gap-1 text-secondary dark:text-[#fcba64] text-xs">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span className="font-label-ui text-label-ui">Cohesion Matrix Active</span>
            </div>
          </div>
        </div>

        {/* Primary Workspace Layout: Split Studio (Left Configuration 5 Cols, Right Live Galley 7 Cols) */}
        <main className="flex-1 p-4 sm:p-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* LEFT CONFIGURATION COLUMN (5 Cols) */}
            <div className="xl:col-span-6 flex flex-col gap-6">
              {/* Studio Header */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-label-caps text-label-caps text-secondary dark:text-[#fcba64] uppercase tracking-widest">
                    Genesis Configuration
                  </span>
                  <span className="h-px flex-1 bg-surface-container-highest dark:border-white/10" />
                  <span className="font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400">
                    Step 01 / 04
                  </span>
                </div>
                <h1 className="font-headline-md text-headline-md text-on-surface dark:text-[#f1effa] tracking-tight">
                  Manuscript Blueprint Forge
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-400 mt-1">
                  Calibrate tone vectors, aesthetic matrices, and algorithmic structural bounds before synthesis.
                </p>
              </div>

              {error && (
                <div className="p-4 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs sm:text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              {/* Core Project Metadata Card */}
              <div className="bg-surface-container-lowest dark:bg-[#181820] p-6 rounded-lg border border-surface-container-highest dark:border-white/10 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface dark:text-[#f1effa] uppercase tracking-wider font-semibold">
                    Manuscript Foundation
                  </span>
                  <span className="font-code-spec text-code-spec text-secondary dark:text-[#fcba64]">
                    ID: MS-9042
                  </span>
                </div>

                {/* Title */}
                <div className="relative">
                  <input
                    type="text"
                    id="projectTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. The Obsidian Horizon"
                    className="w-full bg-surface-container-low dark:bg-black/30 border border-surface-container-highest dark:border-white/10 px-4 pt-5 pb-2 text-on-surface dark:text-[#f1effa] font-headline-sm text-headline-sm rounded outline-none focus:ring-1 focus:ring-primary dark:focus:ring-white transition-all"
                  />
                  <label
                    htmlFor="projectTitle"
                    className="absolute left-4 top-1.5 font-label-caps text-[10px] text-on-surface-variant dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Volume / Book Title
                  </label>
                </div>

                {/* Narrative Premise */}
                <div className="relative">
                  <textarea
                    id="projectSynopsis"
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A surveyor stationed at the continental edge discovers an abandoned relay station emitting mechanical pulses calibrated to the resonant frequency of brittle glass..."
                    className="w-full bg-surface-container-low dark:bg-black/30 border border-surface-container-highest dark:border-white/10 px-4 pt-6 pb-2 text-on-surface dark:text-[#f1effa] font-body-md text-body-md rounded outline-none focus:ring-1 focus:ring-primary dark:focus:ring-white transition-all resize-none"
                  />
                  <label
                    htmlFor="projectSynopsis"
                    className="absolute left-4 top-1.5 font-label-caps text-[10px] text-on-surface-variant dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Narrative Premise &amp; Core Arc
                  </label>
                </div>

                {/* Language & Genre */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-neutral-400 uppercase">
                      Target Language
                    </span>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-surface-container-low dark:bg-black/30 border border-surface-container-highest dark:border-white/10 px-3 py-2 rounded text-on-surface dark:text-[#f1effa] font-label-ui text-label-ui outline-none"
                    >
                      <option value="English (UK / Oxford Style)">English (UK / Oxford Style)</option>
                      <option value="English (US Contemporary)">English (US Contemporary)</option>
                      <option value="French (Gallimard Trad.)">French (Gallimard Trad.)</option>
                      <option value="German (Suhrkamp Arch.)">German (Suhrkamp Arch.)</option>
                      <option value="Spanish (Editorial Cast.)">Spanish (Editorial Cast.)</option>
                      <option value="Japanese (Vertical Rubric)">Japanese (Vertical Rubric)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-neutral-400 uppercase">
                      Folio Taxonomy
                    </span>
                    <select
                      value={bookType}
                      onChange={(e) => setBookType(e.target.value)}
                      className="w-full bg-surface-container-low dark:bg-black/30 border border-surface-container-highest dark:border-white/10 px-3 py-2 rounded text-on-surface dark:text-[#f1effa] font-label-ui text-label-ui outline-none"
                    >
                      <option value="novel">Literary Speculative Fiction</option>
                      <option value="guide">Non-Fiction / Treatise</option>
                      <option value="children">Children&apos;s Picture Folio</option>
                      <option value="coloring">Coloring &amp; Line Engravings</option>
                      <option value="journal">Poetry &amp; Micro-Anthology</option>
                      <option value="recipe">Artisan Culinary Collection</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tone & Prose Architecture */}
              <div className="bg-surface-container-lowest dark:bg-[#181820] p-6 rounded-lg border border-surface-container-highest dark:border-white/10 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-[18px]">
                      psychology
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface dark:text-[#f1effa] uppercase tracking-wider font-semibold">
                      Voice &amp; Prose Architecture
                    </span>
                  </div>
                  <span className="font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400">
                    Entropy: 0.72
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1 */}
                  <div
                    onClick={() => setVoiceTone('mccarthy')}
                    className={`cursor-pointer p-4 rounded border transition-all ${
                      voiceTone === 'mccarthy'
                        ? 'bg-primary dark:bg-white text-on-primary dark:text-black border-transparent shadow-xs'
                        : 'bg-surface-container-low dark:bg-black/20 text-on-surface dark:text-[#f1effa] border-surface-container-highest dark:border-white/10 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-ui text-label-ui font-semibold">McCarthy Noir</span>
                      <span className="material-symbols-outlined text-[16px] text-secondary dark:text-amber-500">
                        {voiceTone === 'mccarthy' ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <p className="font-body-sm text-[12px] opacity-80 leading-snug">
                      Sparse, biblical cadences. Stripped punctuation and heavy physical weight.
                    </p>
                  </div>

                  {/* Option 2 */}
                  <div
                    onClick={() => setVoiceTone('academic')}
                    className={`cursor-pointer p-4 rounded border transition-all ${
                      voiceTone === 'academic'
                        ? 'bg-primary dark:bg-white text-on-primary dark:text-black border-transparent shadow-xs'
                        : 'bg-surface-container-low dark:bg-black/20 text-on-surface dark:text-[#f1effa] border-surface-container-highest dark:border-white/10 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-ui text-label-ui font-semibold">Subtle Academic</span>
                      <span className="material-symbols-outlined text-[16px] text-secondary dark:text-amber-500">
                        {voiceTone === 'academic' ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <p className="font-body-sm text-[12px] opacity-80 leading-snug">
                      Analytical density, layered clause structures, and precise terminology.
                    </p>
                  </div>

                  {/* Option 3 */}
                  <div
                    onClick={() => setVoiceTone('lyrical')}
                    className={`cursor-pointer p-4 rounded border transition-all ${
                      voiceTone === 'lyrical'
                        ? 'bg-primary dark:bg-white text-on-primary dark:text-black border-transparent shadow-xs'
                        : 'bg-surface-container-low dark:bg-black/20 text-on-surface dark:text-[#f1effa] border-surface-container-highest dark:border-white/10 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-ui text-label-ui font-semibold">Playful &amp; Lyrical</span>
                      <span className="material-symbols-outlined text-[16px] text-secondary dark:text-amber-500">
                        {voiceTone === 'lyrical' ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <p className="font-body-sm text-[12px] opacity-80 leading-snug">
                      Rich acoustic cadence, musical alliteration, and imaginative imagery.
                    </p>
                  </div>

                  {/* Option 4 */}
                  <div
                    onClick={() => setVoiceTone('executive')}
                    className={`cursor-pointer p-4 rounded border transition-all ${
                      voiceTone === 'executive'
                        ? 'bg-primary dark:bg-white text-on-primary dark:text-black border-transparent shadow-xs'
                        : 'bg-surface-container-low dark:bg-black/20 text-on-surface dark:text-[#f1effa] border-surface-container-highest dark:border-white/10 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-ui text-label-ui font-semibold">Crisp Executive</span>
                      <span className="material-symbols-outlined text-[16px] text-secondary dark:text-amber-500">
                        {voiceTone === 'executive' ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <p className="font-body-sm text-[12px] opacity-80 leading-snug">
                      Direct syntactical thrust, decisive verbiage, zero rhetorical padding.
                    </p>
                  </div>
                </div>
              </div>

              {/* Folio Scale & Chapter Quotas Slider */}
              <div className="bg-surface-container-lowest dark:bg-[#181820] p-6 rounded-lg border border-surface-container-highest dark:border-white/10 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary dark:text-[#fcba64] text-[18px]">
                      linear_scale
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface dark:text-[#f1effa] uppercase tracking-wider font-semibold">
                      Folio Scale &amp; Chapter Quotas
                    </span>
                  </div>
                  <span className="font-code-spec text-code-spec text-primary dark:text-[#fcba64] font-semibold">
                    {chaptersEstimate} // {wordsEstimate}
                  </span>
                </div>
                <div className="pt-2">
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={chapterScale}
                    onChange={(e) => setChapterScale(Number(e.target.value))}
                    className="w-full accent-primary dark:accent-white h-1.5 bg-surface-container-high dark:bg-white/20 rounded cursor-pointer"
                  />
                  <div className="flex justify-between font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400 mt-2">
                    <span>Novella (5 Ch)</span>
                    <span className="text-center font-semibold text-primary dark:text-[#f1effa]">
                      Standard Book (12 Ch)
                    </span>
                    <span>Epic Volume (24 Ch)</span>
                  </div>
                </div>
              </div>

              {/* Source Document Attachment */}
              <div className="bg-surface-container-lowest dark:bg-[#181820] p-5 rounded-lg border border-dashed border-surface-container-highest dark:border-white/20 flex flex-col items-center justify-center text-center">
                <input
                  type="file"
                  id="studio-file-upload"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="studio-file-upload"
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-3xl text-secondary dark:text-[#fcba64] group-hover:scale-110 transition-transform mb-2">
                    cloud_upload
                  </span>
                  <span className="font-label-ui text-label-ui text-on-surface dark:text-[#f1effa] font-medium">
                    Upload Research Notes, Outlines, or Manuscript (.txt, .md, .pdf)
                  </span>
                  <span className="font-body-sm text-[12px] text-on-surface-variant dark:text-neutral-400 mt-1">
                    AI synthesizes and structures your attached knowledge deterministically.
                  </span>
                </label>
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {uploadedFiles.map((file, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-surface-container dark:bg-white/10 font-code-spec text-xs text-on-surface dark:text-[#f1effa]"
                      >
                        {file.name} ({file.size})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Launch Synthesis Button */}
              <button
                onClick={handleGenerate}
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-primary dark:bg-white text-on-primary dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-label-ui text-label-ui tracking-wide shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary dark:text-amber-600">
                  auto_stories
                </span>
                <span className="text-base font-semibold">
                  {isSubmitting ? 'Synthesizing Architecture...' : 'Initiate Autonomous Synthesis'}
                </span>
              </button>
            </div>

            {/* RIGHT COLUMN: Live Galley Proof Preview (6 Cols) */}
            <div className="xl:col-span-6 sticky top-24">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary dark:text-[#fcba64]">
                  Live Galley Preview
                </span>
                <span className="font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400">
                  Paper Trim: 6 × 9″ Royal Octavo
                </span>
              </div>

              {/* Physical Paper Galley Sheet */}
              <div className="bg-[#FAF7F0] dark:bg-[#1a1a24] text-[#1a1b22] dark:text-[#f1effa] p-8 sm:p-12 rounded-xl border border-surface-container-highest dark:border-white/10 shadow-2xl relative min-h-[580px] flex flex-col justify-between select-none">
                {/* Folio Header Guide */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-8 text-neutral-500 dark:text-neutral-400 font-code-spec text-[11px] uppercase tracking-widest">
                    <span>{title || 'Untitled Volume'}</span>
                    <span>Folio 1</span>
                  </div>

                  {/* Chapter Overline */}
                  <div className="text-center mb-6">
                    <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary dark:text-[#fcba64] block mb-1">
                      Chapter One
                    </span>
                    <h2 className="font-headline-sm text-headline-sm text-primary dark:text-white tracking-tight">
                      {title ? `The Opening of ${title}` : 'The First Principle'}
                    </h2>
                  </div>

                  {/* Drop-cap Typesetting Preview */}
                  <div className="font-serif text-[16px] leading-[28px] text-justify">
                    <span className="float-left text-[50px] leading-[44px] pt-1 pr-3 font-medium text-primary dark:text-[#fcba64]">
                      {prompt.trim() ? prompt.trim().charAt(0).toUpperCase() : 'T'}
                    </span>
                    <span>
                      {prompt.trim()
                        ? prompt.trim().slice(1)
                        : 'he journey began before the architecture of the valley was fully charted. What had remained quiet for generations now stirred in the cold light of the morning.'}
                    </span>
                  </div>
                </div>

                {/* Folio Bottom Guide */}
                <div className="pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-neutral-500 dark:text-neutral-400 font-code-spec text-xs">
                  <span>Knuth-Plass Balanced</span>
                  <span>Sheet 01 • Signature A</span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Real Generation Progress Modal */}
      {isGenerating && activeBookId && activeJobId && (
        <GenerationProgressModal
          isOpen={isGenerating}
          bookId={activeBookId}
          jobId={activeJobId}
          onClose={() => {
            setIsGenerating(false);
          }}
        />
      )}
    </div>
  );
}

export default function CreatePage() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="p-8 text-center">Loading Studio...</div>}>
        <SearchParamsSync onSync={() => {}} />
        <CreatePageContent />
        <AuthModal />
      </Suspense>
    </AuthProvider>
  );
}
