'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import {
  ArrowRight,
  Upload,
  Globe,
  Palette,
  Layers,
  FileCheck,
  X,
} from 'lucide-react';

interface CategoryPreset {
  id: string;
  name: string;
  icon: string;
  samplePrompt: string;
}

export function PromptBarSection() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: CategoryPreset[] = [
    {
      id: 'children',
      name: "Children's Book",
      icon: '🐻',
      samplePrompt: "A children's story about a little fox who discovers a magical forest...",
    },
    {
      id: 'novel',
      name: 'Novel',
      icon: '📖',
      samplePrompt: 'A literary novel following an antique clockmaker who finds hidden letters in a 19th-century grandfather clock...',
    },
    {
      id: 'guide',
      name: 'Guide',
      icon: '📑',
      samplePrompt: 'A step-by-step field guide to sustainable urban gardening and balcony herbs for beginners...',
    },
    {
      id: 'recipe',
      name: 'Cookbook',
      icon: '🍳',
      samplePrompt: 'An artisanal cookbook with 25 wholesome Mediterranean dinners made in under 30 minutes...',
    },
    {
      id: 'workbook',
      name: 'Workbook',
      icon: '⊞',
      samplePrompt: 'A 90-day structured goal-setting and deep-work execution workbook with daily habit logs...',
    },
    {
      id: 'journal',
      name: 'Journal',
      icon: '✏️',
      samplePrompt: 'A guided mindfulness and evening reflection journal with calm intentional prompts...',
    },
    {
      id: 'auto',
      name: 'Other',
      icon: '💬',
      samplePrompt: 'An illustrated botanical field guide exploring native mountain wildflowers and their folklore...',
    },
  ];

  const languages = [
    { id: 'english', label: 'English' },
    { id: 'spanish', label: 'Spanish' },
    { id: 'french', label: 'French' },
    { id: 'german', label: 'German' },
    { id: 'hindi', label: 'Hindi' },
    { id: 'japanese', label: 'Japanese' },
  ];

  const visualStyles = [
    { id: 'editorial', label: 'Editorial' },
    { id: 'watercolor', label: 'Watercolor' },
    { id: 'minimal', label: 'Minimalist' },
    { id: 'photographic', label: 'Photographic' },
    { id: 'vintage', label: 'Vintage' },
  ];

  const [activeCategory, setActiveCategory] = useState<string>('children');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english');
  const [selectedStyle, setSelectedStyle] = useState<string>('editorial');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(
    "A children's story about a little fox who discovers a magical forest..."
  );

  const handleSelectCategory = (cat: CategoryPreset) => {
    setActiveCategory(cat.id);
    if (!uploadedFileName) {
      setPrompt(cat.samplePrompt);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text && text.length > 0) {
          const excerpt = text.slice(0, 300).trim();
          setPrompt(`[Manuscript: ${file.name}] ${excerpt}...`);
        } else {
          setPrompt(`[Manuscript Attached: ${file.name}] Transform into a finished, typeset publication.`);
        }
      };
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        reader.readAsText(file);
      } else {
        setPrompt(`[Manuscript Attached: ${file.name}] Transform into a finished, typeset publication.`);
      }
    }
  };

  const removeUploadedFile = () => {
    setUploadedFileName(null);
    const cat = categories.find((c) => c.id === activeCategory);
    setPrompt(cat ? cat.samplePrompt : '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrompt = prompt.trim() || "A children's story about a little fox who discovers a magical forest...";
    const targetUrl = `/create?prompt=${encodeURIComponent(finalPrompt)}&type=${activeCategory}&lang=${selectedLanguage}&style=${selectedStyle}`;

    try {
      sessionStorage.setItem('bg_pending_prompt', finalPrompt);
      sessionStorage.setItem('bg_pending_type', activeCategory);
      sessionStorage.setItem('bg_pending_lang', selectedLanguage);
      sessionStorage.setItem('bg_pending_style', selectedStyle);
    } catch (_) {}

    router.push(targetUrl);
  };

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-[#0A0A0A] transition-colors border-b border-[#F0F0EE] dark:border-[#1E1E1E]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Crisp Card Container */}
        <div className="bg-[#FAFAFA] dark:bg-[#141414] rounded-3xl border border-[#EAEAEA] dark:border-[#242424] p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] text-center">
          
          {/* Header */}
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#F5F5F5] tracking-tight mb-2">
            What do you want to create today?
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] dark:text-[#9E9E9E] mb-7 max-w-lg mx-auto">
            Describe your idea, or start directly with an existing manuscript.
          </p>

          {/* Form with input bar & circular submit button */}
          <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto mb-4">
            <div className="relative flex items-center">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A children's story about a little fox who discovers a magical forest..."
                className="w-full pl-5 pr-14 py-3.5 sm:py-4 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2E2E2E] text-xs sm:text-sm text-[#111111] dark:text-[#F5F5F5] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] dark:focus:border-white shadow-2xs transition-all font-sans"
              />
              <button
                type="submit"
                aria-label="Submit book prompt"
                className="absolute right-2 sm:right-2.5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111111] hover:bg-black dark:bg-white dark:hover:bg-[#EAEAEA] text-white dark:text-black flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
              >
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </form>

          {/* Direct Product Controls Strip: Upload + Category + Language + Visual Style */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto mb-5">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.doc,.docx,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Upload Button */}
            {uploadedFileName ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <FileCheck className="w-3.5 h-3.5" />
                <span className="max-w-[140px] truncate">{uploadedFileName}</span>
                <button
                  type="button"
                  onClick={removeUploadedFile}
                  className="hover:text-emerald-950 dark:hover:text-white p-0.5"
                  aria-label="Remove uploaded manuscript"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-[#1C1C1C] text-[#333333] dark:text-[#E0E0E0] border border-[#E5E5E5] dark:border-[#2C2C2C] hover:border-[#111111] dark:hover:border-white transition-all cursor-pointer shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-[#666666] dark:text-[#A0A0A0]" />
                <span>Upload manuscript</span>
              </button>
            )}

            {/* Category Select Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2C2C2C] text-xs text-[#444444] dark:text-[#CCCCCC] shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-[#888888]" />
              <span className="text-[11px] text-[#888888]">Category:</span>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#111111] dark:text-white focus:outline-none cursor-pointer pr-1"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="dark:bg-[#1E1E1E]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Select Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2C2C2C] text-xs text-[#444444] dark:text-[#CCCCCC] shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-[#888888]" />
              <span className="text-[11px] text-[#888888]">Lang:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#111111] dark:text-white focus:outline-none cursor-pointer pr-1"
              >
                {languages.map((l) => (
                  <option key={l.id} value={l.id} className="dark:bg-[#1E1E1E]">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Visual Style Select Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2C2C2C] text-xs text-[#444444] dark:text-[#CCCCCC] shadow-2xs">
              <Palette className="w-3.5 h-3.5 text-[#888888]" />
              <span className="text-[11px] text-[#888888]">Style:</span>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#111111] dark:text-white focus:outline-none cursor-pointer pr-1"
              >
                {visualStyles.map((s) => (
                  <option key={s.id} value={s.id} className="dark:bg-[#1E1E1E]">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pill Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-3xl mx-auto pt-2 border-t border-[#F0F0EE] dark:border-[#222222]">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-[#252525] text-[#111111] dark:text-white border border-[#222222] dark:border-white shadow-2xs scale-[1.02]'
                      : 'bg-white dark:bg-[#1A1A1A] text-[#555555] dark:text-[#A0A0A0] border border-[#E5E5E5] dark:border-[#2C2C2C] hover:border-[#CCCCCC] dark:hover:border-[#444444] hover:text-[#111111] dark:hover:text-white'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
