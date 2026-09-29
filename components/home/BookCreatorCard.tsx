'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Lock, ArrowRight } from 'lucide-react';

export function BookCreatorCard() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [prompt, setPrompt] = useState('');
  const [pages, setPages] = useState<number>(16);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTier, setActiveTier] = useState<string>(() => (user?.user_metadata?.tier || 'free').toLowerCase());

  useEffect(() => {
    if (user) {
      fetch('/api/subscription/upgrade')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.tier) setActiveTier(String(data.tier).toLowerCase());
        })
        .catch(() => {});
    }
  }, [user]);

  // Derive max pages dynamically from user tier
  const maxPages = !user
    ? 300
    : activeTier === 'pro' || activeTier === 'boutique-press'
    ? 300
    : activeTier === 'creator' || activeTier === 'studio-atelier'
    ? 64
    : 16;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setPages(val);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setPages(1);
    } else {
      const clamped = Math.min(Math.max(val, 1), maxPages);
      setPages(clamped);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrompt = prompt.trim() || 'A story of discovery, resilience, and wonder.';
    setError(null);

    if (!user) {
      try {
        sessionStorage.setItem('bg_pending_prompt', cleanPrompt);
        sessionStorage.setItem('bg_pending_pages', pages.toString());
      } catch (_) {}
      openAuthModal('signup', '/');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/books/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: cleanPrompt,
          pageTarget: pages,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || data.error || 'Failed to start book creation.');
      }

      const data = await res.json();
      router.push(`/book/${data.bookId}/generating?jobId=${data.jobId || ''}&pages=${pages}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not initiate generation. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full py-6 bg-white">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="w-full bg-white rounded-2xl border border-[#EAEAEA] p-6 sm:p-9 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-600 font-medium">
              {error}
            </div>
          )}
          <form onSubmit={handleGenerate} className="flex flex-col gap-6">
            
            {/* Heading */}
            <div>
              <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#111111] font-sans tracking-tight">
                Describe your eBook
              </h2>
            </div>

            {/* Prompt Textarea */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value.slice(0, 2000))}
                placeholder="Write a detailed prompt for your eBook..."
                rows={4}
                className="w-full border border-[#EAEAEA] rounded-xl p-4 text-[14px] text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] transition-all resize-none font-sans"
              />
              <div className="absolute right-3.5 bottom-3.5 text-[11px] text-[#999999] font-sans select-none pointer-events-none">
                {prompt.length}/2000
              </div>
            </div>

            {/* Number of Pages Control */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111111] mb-3">
                Number of Pages
              </label>

              <div className="flex items-center gap-4">
                <span className="text-[12px] text-[#888888] font-medium w-4">1</span>

                {/* Slider */}
                <div className="flex-1 relative flex items-center">
                  <input
                    type="range"
                    min={1}
                    max={maxPages}
                    value={pages}
                    onChange={handleSliderChange}
                    className="w-full h-1.5 bg-[#EAEAEA] rounded-lg appearance-none cursor-pointer accent-[#111111] focus:outline-none"
                    aria-label="Number of pages slider"
                  />
                </div>

                <span className="text-[12px] text-[#888888] font-medium min-w-[28px] text-right">
                  {maxPages}
                </span>

                {/* Numeric Input Box */}
                <input
                  type="number"
                  min={1}
                  max={maxPages}
                  value={pages}
                  onChange={handleInputChange}
                  className="w-16 h-10 border border-[#EAEAEA] rounded-xl text-center text-[14px] font-semibold text-[#111111] focus:outline-none focus:border-[#111111] transition-all"
                  aria-label="Number of pages input"
                />
              </div>

              {user && maxPages < 300 && (
                <p className="text-[11px] text-[#888888] mt-2">
                  Current plan limit: {maxPages} pages.{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/pricing')}
                    className="underline hover:text-[#111111] cursor-pointer"
                  >
                    Upgrade for up to 300 pages.
                  </button>
                </p>
              )}
            </div>

            {/* Full-Width Generate Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-[#111111] hover:bg-[#222222] active:scale-[0.99] text-white text-[14px] sm:text-[15px] font-medium flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              {!user ? (
                <>
                  <Lock className="w-4 h-4 text-white/80" />
                  <span>Login or Sign Up to Generate Your eBook →</span>
                </>
              ) : (
                <>
                  <span>{isSubmitting ? 'Starting Book Creation...' : 'Generate Your eBook →'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}
