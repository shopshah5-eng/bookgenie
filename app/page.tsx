'use client';

import React from 'react';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { PromptBarSection } from '@/components/landing/PromptBarSection';
import { PromptToPageShowcase } from '@/components/landing/PromptToPageShowcase';
import { BookShowcase } from '@/components/landing/BookShowcase';
import { StudioWorkflowSection } from '@/components/landing/StudioWorkflowSection';
import { ExportFormatsSection } from '@/components/landing/ExportFormatsSection';
import { Testimonials } from '@/components/landing/Testimonials';
import { PricingTeaserSection } from '@/components/landing/PricingTeaserSection';
import { FAQSection } from '@/components/landing/FAQSection';
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
          {/* 01 Editorial Hero: AI Publishing Studio + Standing Book Mockup */}
          <HeroSection />

          {/* 02 What do you want to create today? Real Controls: Upload, Category, Lang, Style */}
          <PromptBarSection />

          {/* 03 From blank page to bound book: 7-Stage Publishing Architecture */}
          <div id="workflow">
            <PromptToPageShowcase />
          </div>

          {/* 04 Explore the BookGenie Library: Real Showcase with Preview & Create Similar */}
          <div id="examples">
            <BookShowcase />
          </div>

          {/* 05 Meet your publishing studio: 6-Stage Studio Workspace & Typeset Canvas */}
          <StudioWorkflowSection />

          {/* 06 One book. Every format: 300 DPI CMYK PDF, Reflowable EPUB3, Private Web Reader */}
          <ExportFormatsSection />

          {/* 07 Your work stays yours: Supabase Row-Level Security & 100% Commercial Rights */}
          <Testimonials />

          {/* 08 Transparent Pricing Teaser: Free Creator Studio vs Pro Edition */}
          <PricingTeaserSection />

          {/* 09 Frequently Asked Questions */}
          <FAQSection />

          {/* 10 Final Call to Action Banner + Book Spine Still Life */}
          <CallToActionBanner />
        </main>

        {/* 16 Comprehensive 4-Column Footer */}
        <Footer />

        {/* Centered Backdrop-Blur Authentication Modal */}
        <AuthModal />
      </div>
    </AuthProvider>
  );
}

