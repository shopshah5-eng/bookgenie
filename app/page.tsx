'use client';

import React from 'react';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { LaunchTeaserStrip } from '@/components/home/LaunchTeaserStrip';
import { MinimalHero } from '@/components/home/MinimalHero';
import { BookCreatorCard } from '@/components/home/BookCreatorCard';
import { MinimalFeatureStrip } from '@/components/home/MinimalFeatureStrip';
import { MinimalHowItWorks } from '@/components/home/MinimalHowItWorks';
import { MinimalPricing } from '@/components/home/MinimalPricing';
import { MinimalFAQ } from '@/components/home/MinimalFAQ';
import { MinimalFooter } from '@/components/home/MinimalFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans selection:bg-[#111111] selection:text-white">
      {/* 0. Launch Countdown Teaser Banner (In Starting) */}
      <LaunchTeaserStrip />

      {/* Fixed transparent minimal header */}
      <MinimalHeader />

      {/* Main Content Flow */}
      <main className="flex-1 w-full flex flex-col">
        {/* 1. Hero Section (Turn Your Ideas Into Beautiful Books + Still Life) */}
        <MinimalHero />

        {/* 2. Main Book Creation Card with Prompt & Synchronized Page Count Slider */}
        <BookCreatorCard />

        {/* 3. 4-Column Feature Strip (Autonomous Writing, Unique Illustrations, etc.) */}
        <MinimalFeatureStrip />

        {/* 4. How It Works (Create Your eBook in 3 Simple Steps: 1, 2, 3) */}
        <MinimalHowItWorks />

        {/* 6. Pricing Plans (Free, Pro, Creator) */}
        <MinimalPricing />

        {/* 7. Frequently Asked Questions (2-Column Accordion + View All) */}
        <MinimalFAQ />
      </main>

      {/* Minimal Pure White Footer */}
      <MinimalFooter />
    </div>
  );
}
