'use client';

import React from 'react';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { PromptToPageShowcase } from '@/components/landing/PromptToPageShowcase';
import { WhatCanYouCreate } from '@/components/landing/WhatCanYouCreate';
import { BookShowcase } from '@/components/landing/BookShowcase';
import { Testimonials } from '@/components/landing/Testimonials';
import { MyEbookShelf } from '@/components/landing/MyEbookShelf';
import { CallToActionBanner } from '@/components/landing/CallToActionBanner';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col paper-atmosphere text-[#181511]">
        {/* 01 Floating Editorial Studio Header */}
        <Header />

        {/* Main Publishing Studio Flow */}
        <main className="flex-1">
          {/* 02 Cinematic Hero: Manuscript Card + Floating Book Spread */}
          <HeroSection />

          {/* 03 From Prompt to Pages: Visual Transformation */}
          <PromptToPageShowcase />

          {/* 04 Create Anything Worth Reading: Large Editorial Cards */}
          <div id="what-can-you-create">
            <WhatCanYouCreate />
          </div>

          {/* 05 The BookGenie Library: Curated Digital Bookstore */}
          <BookShowcase />

          {/* 06 From Idea to Publication: 7-Step Pipeline & Creator Spotlights */}
          <Testimonials />

          {/* 07 Authentic User Library Shelf */}
          <MyEbookShelf />

          {/* 08 Final Studio Invitation CTA */}
          <CallToActionBanner />
        </main>

        {/* 09 Minimal Dignified Editorial Footer */}
        <Footer />

        {/* Centered Backdrop-Blur Authentication Modal */}
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
