'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Lock, ArrowRight } from 'lucide-react';

export function BookCreatorCard() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [prompt, setPrompt] = useState('');
  const [pages, setPages] = useState<number>(30);
  const [maxPages, setMaxPages] = useState<number>(300);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check user tier limits if logged in
  useEffect(() => {
    if (user) {
      const tier = (user.user_metadata?.tier || 'free').toLowerCase();
      if (tier === 'pro' || tier === 'boutique-press') {
        setMaxPages(300);
      } else if (tier === 'creator' || tier === 'studio-atelier') {
        setMaxPages(64);
        if (pages > 64) setPages(64);
      } else {
        // Free plan default
        setMaxPages(16);
        if (pages > 16) setPages(16);
      }
    } else {
      setMaxPages(300);
    }
  }, [user]);

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

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrompt = prompt.trim() || 'A story of discovery, resilience, and wonder.';

    if (!user) {
      try {
        sessionStorage.setItem('bg_pending_prompt', cleanPrompt);
        sessionStorage.setItem('bg_pending_pages', pages.toString());
      } catch (_) {}
      openAuthModal('signup', `/create?prompt=${encodeURIComponent(cleanPrompt)}&pages=${pages}`);
      return;
    }

    setIsSubmitting(true);
    router.push(`/create?prompt=${encodeURIComponent(cleanPrompt)}&pages=${pages}`);
  };

  return (
    <section className="w-full py-6 bg-white">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="w-full bg-white rounded-2xl border border-[#EAEAEA] p-6 sm:p-9 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
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
                    className="underline hover:text-[#111111]"
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
                  <span>{isSubmitting ? 'Opening Studio...' : 'Generate Your eBook →'}</span>
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}
