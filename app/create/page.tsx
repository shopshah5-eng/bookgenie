'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { GenerationProgressModal } from '@/components/create/GenerationProgressModal';
import {
  BookOpen,
  Sparkles,
  UploadCloud,
  Lock,
  ArrowRight,
  Globe2,
  Palette,
  FileText,
  X,
  CheckCircle,
} from 'lucide-react';

function SearchParamsSync({
  onSync,
}: {
  onSync: (data: { prompt?: string; type?: string; lang?: string; style?: string }) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const initialPrompt = searchParams.get('prompt') || (typeof window !== 'undefined' ? sessionStorage.getItem('bg_pending_prompt') : null);
    const initialType = searchParams.get('type') || (typeof window !== 'undefined' ? sessionStorage.getItem('bg_pending_type') : null);
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

  const [prompt, setPrompt] = useState('');
  const [bookType, setBookType] = useState('auto');
  const [language, setLanguage] = useState('english');
  const [style, setStyle] = useState('modern');
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
      if (data.prompt) setPrompt(data.prompt);
      if (data.type) setBookType(data.type);
      if (data.lang) setLanguage(data.lang);
      if (data.style) setStyle(data.style);
    },
    []
  );

  const bookTypeOptions = [
    { label: 'Auto detect', value: 'auto' },
    { label: "Children's Book", value: 'children' },
    { label: 'Coloring Book', value: 'coloring' },
    { label: 'Novel / Fiction', value: 'novel' },
    { label: 'Course Book', value: 'course' },
    { label: 'Guide / How-to', value: 'guide' },
    { label: 'Workbook', value: 'workbook' },
    { label: 'Recipe Book', value: 'recipe' },
    { label: 'History Book', value: 'history' },
    { label: 'Journal', value: 'journal' },
  ];

  const languageOptions = [
    { label: 'English', value: 'english' },
    { label: 'Hindi', value: 'hindi' },
    { label: 'Spanish', value: 'spanish' },
    { label: 'French', value: 'french' },
    { label: 'German', value: 'german' },
    { label: 'Japanese', value: 'japanese' },
  ];

  const styleOptions = [
    { label: 'Modern', value: 'modern' },
    { label: 'Editorial Luxury', value: 'editorial' },
    { label: 'Playful Storybook', value: 'playful' },
    { label: 'Academic & Formal', value: 'academic' },
    { label: 'Minimalist Clean', value: 'minimal' },
    { label: 'Vintage Classic', value: 'vintage' },
  ];

  const promptSuggestions = [
    "Create a 30-page illustrated children's book about a little fox learning kindness.",
    "A 50-page beginner guide to modern architecture with floorplans and style timelines.",
    "A 25-page relaxing mindfulness journal with daily reflection questions.",
    "An illustrated recipe book of 15 authentic Italian pasta dishes from scratch.",
  ];

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
    if (!prompt.trim()) {
      setError('Please describe the book you would like to create.');
      return;
    }

    // Auth gate: if unauthenticated, save prompt & trigger AuthModal
    if (!user) {
      sessionStorage.setItem('bg_pending_prompt', prompt);
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
          prompt,
          bookType,
          language,
          style,
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
      {/* Minimalist Publishing Studio Header */}
      <header className="w-full bg-[#FDFBF7] border-b border-[#EFECE6] px-4 sm:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 select-none group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F8F3EA] text-[#8C5F2E] border border-[#E8DCCB] shadow-2xs">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-serif font-bold text-[#1A1612] tracking-tight leading-none">
              BookGenie
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#9E968E] font-medium mt-0.5">
              Publishing Studio
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs sm:text-sm font-medium text-[#6B635B] hover:text-[#1A1612] transition-colors"
          >
            ← Back to Home
          </Link>
          {user && (
            <div className="flex items-center gap-2 pl-3 border-l border-[#EFECE6]">
              <div className="w-7 h-7 rounded-full bg-[#F8F3EA] text-[#8C5F2E] flex items-center justify-center font-bold text-xs">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-xs font-medium text-[#1A1612] hidden sm:inline">
                {user.user_metadata?.full_name || 'Creator'}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Creation Space */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F3EA] text-[#8C5F2E] border border-[#E8DCCB] text-[11px] font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Page 1 — Create
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A1612] tracking-tight mb-3">
            What do you want to create?
          </h1>
          <p className="text-sm sm:text-base text-[#6B635B] max-w-xl mx-auto">
            Describe your idea or attach reference notes. BookGenie generates the blueprint, chapters, illustrations, and downloadable files.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 text-left">
            {error}
          </div>
        )}

        {/* The Master Creation Form */}
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Large Prompt Textarea */}
          <div className="bg-white rounded-3xl border border-[#EFECE6] p-5 sm:p-7 shadow-[0_12px_40px_rgba(45,38,32,0.04)] focus-within:border-[#9A6F3C] focus-within:ring-4 focus-within:ring-[#9A6F3C]/10 transition-all">
            <div className="flex items-center justify-between mb-3 text-xs text-[#9E968E]">
              <span className="font-semibold uppercase tracking-wider text-[#6B635B] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#9A6F3C]" /> Book Prompt
              </span>
              <span>{prompt.length} characters</span>
            </div>

            <textarea
              id="book-prompt-input"
              aria-label="Describe the book you want to create"
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tell BookGenie what to create... e.g. Create a 60-page premium history book about the Mughal Empire for beginners. Include timelines, maps, important people, illustrations and chapter summaries."
              className="w-full resize-none text-base sm:text-lg text-[#1A1612] placeholder:text-[#9E968E] bg-transparent focus:outline-none leading-relaxed"
            />

            {/* Quick Inspiration Pills */}
            <div className="pt-4 border-t border-[#F4F1EA]">
              <span className="text-[11px] font-semibold text-[#9E968E] block mb-2">
                Need inspiration? Click any example:
              </span>
              <div className="flex flex-wrap gap-2">
                {promptSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPrompt(sug)}
                    className="text-left text-xs bg-[#FDFBF7] hover:bg-[#F6EFE3] text-[#6B635B] hover:text-[#1A1612] px-3 py-1.5 rounded-xl border border-[#EFECE6] transition-colors line-clamp-1"
                  >
                    “{sug}”
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Controls Bar: Book Type, Language, Style */}
          <div className="bg-white rounded-2xl border border-[#EFECE6] p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Dropdown
                label="Book type"
                options={bookTypeOptions}
                value={bookType}
                onChange={setBookType}
                icon={<BookOpen className="w-3.5 h-3.5" />}
              />
              <Dropdown
                label="Language"
                options={languageOptions}
                value={language}
                onChange={setLanguage}
                icon={<Globe2 className="w-3.5 h-3.5" />}
              />
              <Dropdown
                label="Style"
                options={styleOptions}
                value={style}
                onChange={setStyle}
                icon={<Palette className="w-3.5 h-3.5" />}
              />
            </div>

            {/* File Upload Trigger */}
            <label
              htmlFor="source-file-upload"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#EFECE6] bg-[#FDFBF7] hover:bg-[#F4EFE6] text-xs font-semibold text-[#6B635B] hover:text-[#1A1612] cursor-pointer transition-colors shadow-2xs"
            >
              <UploadCloud className="w-4 h-4 text-[#9A6F3C]" />
              <span>Attach notes or text drafts (.txt, .md)</span>
              <input
                id="source-file-upload"
                aria-label="Attach source notes or draft document (.txt, .md)"
                type="file"
                multiple
                accept=".txt,.md,.text"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Uploaded Files Tag List */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#EFECE6] p-4 flex flex-wrap gap-2.5">
              <span className="w-full text-xs font-bold text-[#1A1612] mb-1">
                Attached Source Materials ({uploadedFiles.length})
              </span>
              {uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#F8F4EC] border border-[#EADFCB] text-xs text-[#6B635B]"
                >
                  <FileText className="w-3.5 h-3.5 text-[#9A6F3C]" />
                  <span className="font-medium text-[#1A1612]">{file.name}</span>
                  <span className="text-[10px] text-[#9E968E]">({file.size})</span>
                  <button
                    type="button"
                    onClick={() =>
                      setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="text-[#9E968E] hover:text-red-600 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Big CTA Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-2 text-xs text-[#9E968E]">
              <Lock className="w-4 h-4 text-[#9A6F3C]" />
              <span>
                Deterministic layout & page count. Multi-tier cost-controlled AI.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold shadow-md"
            >
              Generate My Book <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </form>
      </main>

      <Suspense fallback={null}>
        <SearchParamsSync onSync={handleSyncParams} />
      </Suspense>

      {/* Realtime Generation Studio Progress Modal */}
      <GenerationProgressModal
        isOpen={isGenerating}
        bookId={activeBookId}
        jobId={activeJobId}
        onClose={() => setIsGenerating(false)}
      />

      <AuthModal />
    </div>
  );
}

export default function CreatePage() {
  return (
    <AuthProvider>
      <CreatePageContent />
    </AuthProvider>
  );
}
