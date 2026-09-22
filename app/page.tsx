'use client';

import React from 'react';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { WhatCanYouCreate } from '@/components/landing/WhatCanYouCreate';
import { PromptToPageShowcase } from '@/components/landing/PromptToPageShowcase';
import { ExportShareSection } from '@/components/landing/ExportShareSection';
import { BookShowcase } from '@/components/landing/BookShowcase';
import { Testimonials } from '@/components/landing/Testimonials';
import { MyEbookShelf } from '@/components/landing/MyEbookShelf';
import { CallToActionBanner } from '@/components/landing/CallToActionBanner';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#12100E] text-[#181511] dark:text-[#F8F5EE]">
        {/* 01 Seamless Luxury Studio Header */}
        <Header />

        {/* Main Publishing Studio Flow */}
        <main className="flex-1">
          {/* 02 Cinematic Hero: Manuscript Card + Standing Book Still Life + Metrics */}
          <HeroSection />

          {/* 03 Create Anything Worth Reading: Realistic Standing Hardcover Shelf */}
          <div id="what-can-you-create">
            <WhatCanYouCreate />
          </div>

          {/* 04 From Prompt to Pages: Visual 6-Step Studio Workflow */}
          <PromptToPageShowcase />

          {/* 05 Export, Share, Inspire: Open Spread & 3 Action Pills */}
          <ExportShareSection />

          {/* 06 The BookGenie Library: Curated Digital Bookstore */}
          <BookShowcase />

          {/* 07 From Idea to Publication: Spotlights & Testimonials */}
          <Testimonials />

          {/* 08 Authentic User Library Shelf */}
          <MyEbookShelf />

          {/* 09 Final Studio Invitation CTA */}
          <CallToActionBanner />
        </main>

        {/* 10 Editorial Footer */}
        <Footer />

        {/* Centered Backdrop-Blur Authentication Modal */}
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
