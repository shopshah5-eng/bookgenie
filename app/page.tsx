'use client';

import React from 'react';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { PromptBarSection } from '@/components/landing/PromptBarSection';
import { PromptToPageShowcase } from '@/components/landing/PromptToPageShowcase';
import { BookShowcase } from '@/components/landing/BookShowcase';
import { StudioAndCategoriesSection } from '@/components/landing/StudioAndCategoriesSection';
import { Testimonials } from '@/components/landing/Testimonials';
import { CallToActionBanner } from '@/components/landing/CallToActionBanner';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#000000] text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
        {/* 01 Sticky Editorial Glass Header with Theme Switcher */}
        <Header />

        {/* Main Landing Page Flow */}
        <main className="flex-1">
          {/* 02 Editorial Hero: AI Publishing Studio + Standing Book Mockup */}
          <HeroSection />

          {/* 03 What do you want to create today? Standalone Prompt & Category Pills */}
          <PromptBarSection />

          {/* 04 From blank page to bound book: 6-Step Workflow */}
          <div id="workflow">
            <PromptToPageShowcase />
          </div>

          {/* 05 Made with BookGenie: 4-Book Showcase */}
          <div id="examples">
            <BookShowcase />
          </div>

          {/* 06 Meet your publishing studio + One studio. Every kind of book. */}
          <div id="studio">
            <StudioAndCategoriesSection />
          </div>

          {/* 07 Your work stays yours: 5 Trust Badges + Priya S. Testimonial */}
          <Testimonials />

          {/* 08 Pre-Footer Call to Action Banner + Book Spine Still Life */}
          <CallToActionBanner />
        </main>

        {/* 09 Minimalist Footer */}
        <Footer />

        {/* Centered Backdrop-Blur Authentication Modal */}
        <AuthModal />
      </div>
    </AuthProvider>
  );
}

