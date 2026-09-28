'use client';

import React from 'react';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { MinimalHero } from '@/components/home/MinimalHero';
import { BookCreatorCard } from '@/components/home/BookCreatorCard';
import { MinimalFeatureStrip } from '@/components/home/MinimalFeatureStrip';
import { MinimalExamples } from '@/components/home/MinimalExamples';
import { MinimalHowItWorks } from '@/components/home/MinimalHowItWorks';
import { MinimalFAQ } from '@/components/home/MinimalFAQ';
import { MinimalFooter } from '@/components/home/MinimalFooter';

export default function HomePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans selection:bg-[#111111] selection:text-white">
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

          {/* 4. Examples Section (See What You Can Create: 4 Book Mockups) */}
          <MinimalExamples />

          {/* 5. How It Works (Create Your eBook in 3 Simple Steps: 1, 2, 3) */}
          <MinimalHowItWorks />

          {/* 6. Frequently Asked Questions (2-Column Accordion + View All) */}
          <MinimalFAQ />
        </main>

        {/* Minimal Pure White Footer */}
        <MinimalFooter />

        {/* Global Auth Modal */}
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
